# 🛡️ Agorax: Zero-Trust Identity Vault & Admin Portal

![L&T Security Project](https://img.shields.io/badge/Project-L%26T_Internship-0284c7?style=for-the-badge&logo=shield)
![Architecture](https://img.shields.io/badge/Architecture-Zero_Trust-black?style=for-the-badge&logo=security)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

An enterprise-grade Identity Setup and Data Vault system designed for high-security environments. This architecture moves beyond standard text-based security by introducing **Cognitive Visual Mnemonics** powered by local AI, and couples it with a **Zero-Knowledge Backend**, AES-256 encryption, and an immutable cryptographic audit trail.

---

## ✨ Enterprise Cybersecurity Features

* **🗄️ Zero-Knowledge Architecture:** The Python backend utilizes `.env` vault isolation and `bcrypt` hashing. The master admin PIN is never stored in plain text, ensuring the system remains secure even if the source code or server is compromised.
* **🔐 Data-at-Rest Encryption (AES-256):** All sensitive user credentials and base64 visual assets are symmetrically encrypted before being pushed to the MongoDB Atlas cloud cluster.
* **🛡️ Brute-Force Rate Limiting:** The API is shielded by `slowapi`. Automated attacks (more than 5 requests/minute per IP) result in an instant connection drop and temporary IP ban.
* **📜 Immutable Audit Logging:** Every interaction with the decryption vault (successful or failed) writes a permanent, non-repudiable log documenting the timestamp, target, status, and the executing IP address.
* **🧠 Targeted Attack Prevention:** Utilizes NLP (`compromise.js`) and `zxcvbn` to evaluate passwords against the user's localized personal data to prevent social-engineering attacks.
* **🎨 Cognitive Visual Mnemonic AI:** Uses a local, GPU-accelerated **Stable Diffusion Turbo** model to generate highly detailed visual memory anchors combining user-selected words and dynamically generated security numbers.

---

## 📸 System Architecture & Previews

### 1. The Setup Dashboard & Threat Intel
*(Insert your original image link here)*
> *The main UI featuring real-time password entropy scoring and the live global threat intelligence marquee.*

### 2. AI Mnemonic Visual Generation
*(Insert your original image link here)*
> *The Python FastAPI backend securely passing prompts to the local Stable Diffusion model to generate a downloadable visual asset.*

### 3. The Zero-Trust Admin Decryption Portal
*(Add a screenshot of your new admin.html interface here)*
> *The restricted admin dashboard. Data is decrypted entirely in-memory and features a 15-second ephemeral auto-lock to prevent "shoulder surfing" data leaks.*

---

## 🛠️ Technology Stack

**Frontend (Client Node):**
* HTML5 / CSS3 (Glassmorphism Cyber Theme)
* Vanilla JavaScript (ES6+)
* `CryptoJS` (Client-side SHA-1 hashing)
* `zxcvbn.js` (Algorithmic password strength estimation)

**Backend & AI Engine (The Vault):**
* Python 3.10+
* FastAPI & Uvicorn (High-performance API routing)
* `cryptography.fernet` (AES-256 Encryption)
* `bcrypt` (Cryptographic Password Hashing)
* `slowapi` (IP-based Rate Limiting)
* `pymongo` (Cloud Database Integration)
* PyTorch & HuggingFace Diffusers (`stabilityai/sd-turbo`)

**Infrastructure:**
* MongoDB Atlas Cloud Cluster

---

## 🚀 How to Run the L&T Vault Architecture

### Step 1: Initialize the Environment
Open your terminal inside the project folder and run these commands to set up the Python environment:
```bash
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn pydantic diffusers transformers torch accelerate pymongo cryptography python-dotenv slowapi bcrypt
```
### Step 2: Configure the Secret Vault
* 1.Create a file named .env in the root directory.
* 2.Ensure you have the required environmental variables configured:

**AES_SECRET_KEY (Symmetric encryption key)**

**MONGO_DB_URI (Atlas Cluster Connection String)**

**ADMIN_PIN_HASH (Bcrypt hash of the master admin password)**