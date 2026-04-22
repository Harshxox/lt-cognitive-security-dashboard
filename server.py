from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from diffusers import AutoPipelineForText2Image
import torch
import io
import base64
import requests

app = FastAPI()

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
    pipe = AutoPipelineForText2Image.from_pretrained(
        "stabilityai/sd-turbo", 
        torch_dtype=torch.float16, 
        variant="fp16"
    )
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

 