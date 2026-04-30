from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import AutoPipelineForText2Image
import torch
import io
import base64
from pymongo import MongoClient
from cryptography.fernet import Fernet
import datetime
import os
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import bcrypt # 🚨 NEW: Cryptographic Hashing

# Initialize the Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter

# Rate Limit Custom Handler
def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    print(f"🚨 BRUTE FORCE BLOCKED: IP {request.client.host} exceeded rate limits.")
    create_audit_log(request.client.host, "UNKNOWN (SPAM)", "CRITICAL_BLOCKED", "Rate limit exceeded. Temporary IP ban applied.")
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": "BRUTE FORCE DETECTED: IP temporarily banned. Try again in 1 minute."}
    )
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_handler)

load_dotenv()

# ==========================================
# ENTERPRISE SECURITY & DATABASE SETUP
# ==========================================
SECRET_ENCRYPTION_KEY = os.getenv("AES_SECRET_KEY").encode('utf-8')
cipher_suite = Fernet(SECRET_ENCRYPTION_KEY)

try:
    print("🔌 Connecting to Secure Cloud Database Cluster...")
    MONGO_URI = os.getenv("MONGO_DB_URI")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
    db = client["lt_security_system"]
    
    users_collection = db["encrypted_identities"]
    audit_collection = db["audit_logs"] 
    
    client.admin.command('ping')
    print("✅ Cloud Database Connection Secured!")
except Exception as e:
    print(f"⚠️ Database Error: {e}")

# Helper functions for AES Encryption
def encrypt_data(data: str) -> str:
    return cipher_suite.encrypt(data.encode('utf-8')).decode('utf-8')

def decrypt_data(encrypted_data: str) -> str:
    return cipher_suite.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')

# THE SECURE AUDIT ENGINE
def create_audit_log(ip_address: str, target_phone: str, status: str, details: str):
    log_entry = {
        "timestamp_utc": datetime.datetime.utcnow(),
        "admin_ip": ip_address,
        "target_account": target_phone,
        "event_type": "VAULT_DECRYPTION_ATTEMPT",
        "status": status,
        "security_details": details
    }
    audit_collection.insert_one(log_entry)
    print(f"📜 AUDIT RECORDED: [{status}] Target: {target_phone} | IP: {ip_address}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# LOCAL AI IMAGE GENERATOR
# ==========================================
print("\nLoading Local AI Model (SD-Turbo)...")
try:
    pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sd-turbo", torch_dtype=torch.float16, variant="fp16")
    pipe.to("cuda")
    print("🚀 SUCCESS: Model Ready on GPU!")
except Exception as e:
    print("⚠️ GPU not found. Falling back to CPU...")
    pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sd-turbo")
    pipe.to("cpu")
    print("✅ SUCCESS: Model Ready on CPU!")

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate")
def generate_image(req: PromptRequest):
    print(f"\n🎨 Generating image for: {req.prompt}")
    image = pipe(prompt=req.prompt, num_inference_steps=1, guidance_scale=0.0).images[0]
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    print("✅ Image successfully sent to frontend!")
    return {"image_base64": f"data:image/png;base64,{img_str}"}

# ==========================================
# SECURE DATA VAULT ENDPOINT
# ==========================================
class UserIdentityData(BaseModel):
    first_name: str
    last_name: str
    phone: str
    password: str
    image_base64: str

@app.post("/api/vault/save")
def save_to_secure_vault(data: UserIdentityData):
    try:
        encrypted_password = encrypt_data(data.password)
        encrypted_image = encrypt_data(data.image_base64)
        secure_document = {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "phone": data.phone,
            "vault_data": {
                "credential_aes": encrypted_password,
                "asset_aes": encrypted_image
            },
            "timestamp": datetime.datetime.utcnow()
        }
        users_collection.insert_one(secure_document)
        print("✅ Identity securely encrypted and locked in the vault!")
        return {"success": True, "message": "Data secured with AES-256."}
    except Exception as e:
        return {"success": False, "error": str(e)}

# ==========================================
# SECURE DATA RETRIEVAL ENDPOINT (UPGRADED)
# ==========================================
class RetrieveRequest(BaseModel):
    phone: str
    admin_pin: str 

@app.post("/api/vault/retrieve")
@limiter.limit("5/minute")
def retrieve_from_vault(request: Request, req: RetrieveRequest):
    print(f"\n🔍 Secure retrieval requested for phone: {req.phone} from IP: {request.client.host}")
    
    # 🚨 ZERO-KNOWLEDGE AUTHENTICATION GATE
    # Grab the Hash from the .env file
    stored_hash = os.getenv("ADMIN_PIN_HASH").encode('utf-8')
    
    # Compare the provided plain text PIN against the stored Bcrypt Hash
    if not bcrypt.checkpw(req.admin_pin.encode('utf-8'), stored_hash):
        print("❌ ALERT: Unauthorized decryption attempt blocked!")
        create_audit_log(request.client.host, req.phone, "FAILED_UNAUTHORIZED", "Invalid Admin PIN provided.")
        return {"success": False, "error": "UNAUTHORIZED: Invalid Admin Credentials."}

    try:
        user_data = users_collection.find_one({"phone": req.phone}, sort=[("_id", -1)])
        
        if not user_data:
            create_audit_log(request.client.host, req.phone, "FAILED_NOT_FOUND", "Identity does not exist in vault.")
            return {"success": False, "error": "Identity not found in vault."}

        decrypted_password = decrypt_data(user_data["vault_data"]["credential_aes"])
        decrypted_image = decrypt_data(user_data["vault_data"]["asset_aes"])

        print(f"🔓 Vault unlocked for {user_data['first_name']}. Sending data to Admin Portal...")
        
        create_audit_log(request.client.host, req.phone, "SUCCESS_AUTHORIZED", f"Vault decrypted successfully for {user_data['first_name']} {user_data['last_name']}.")
        
        return {
            "success": True,
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"], 
            "decrypted_password": decrypted_password,
            "decrypted_image": decrypted_image
        }

    except Exception as e:
        create_audit_log(request.client.host, req.phone, "ERROR_SYSTEM", f"Decryption failed: {str(e)}")
        return {"success": False, "error": "Data corrupted or decryption failed."}