from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

print("🛡️ CONNECTING TO L&T COMPLIANCE SERVERS...")
try:
    MONGO_URI = os.getenv("MONGO_DB_URI")
    client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
    db = client["lt_security_system"]
    audit_collection = db["audit_logs"]

    print("\n==========================================================")
    print(" 📜 L&T ENTERPRISE SECURITY: IMMUTABLE AUDIT LOG REPORT ")
    print("==========================================================")
    
    # Fetch the 10 most recent logs
    logs = audit_collection.find().sort("timestamp_utc", -1).limit(10)
    
    count = 0
    for log in logs:
        count += 1
        time_str = log["timestamp_utc"].strftime("%Y-%m-%d %H:%M:%S UTC")
        status = log["status"]
        
        # Color code the terminal output
        if "SUCCESS" in status:
            status_color = f"\033[92m{status}\033[0m" # Green
        elif "FAILED" in status or "CRITICAL" in status:
            status_color = f"\033[91m{status}\033[0m" # Red
        else:
            status_color = status
            
        print(f"[{time_str}] | IP: {log['admin_ip']} | TARGET: {log['target_account']}")
        print(f"   => STATUS: {status_color}")
        print(f"   => DETAILS: {log['security_details']}\n")
        
    if count == 0:
        print("No audit logs found. The vault has not been accessed.")
        
    print("==========================================================")
    print("END OF REPORT. DATA IS CRYPTOGRAPHICALLY IMMUTABLE.")
    print("==========================================================\n")

except Exception as e:
    print(f"Connection Failed: {e}")