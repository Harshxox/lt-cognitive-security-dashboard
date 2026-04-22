# 🛡️ Zero-Trust Cognitive Security & Visual Auth Dashboard

![L&T Security Project](https://img.shields.io/badge/Project-L%26T_Internship-0284c7?style=for-the-badge&logo=shield)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

An enterprise-grade identity setup and password analysis dashboard. This architecture moves beyond standard text-based security by introducing **Cognitive Visual Mnemonics** powered by local AI, **Live Cyber Threat Intelligence**, and zero-trust **k-Anonymity** breach verification.

---

## ✨ Enterprise Features

* **📡 Live Cyber Threat Intelligence:** Integrates a real-time RSS feed (The Hacker News) into the dashboard marquee to display active global threats.
* **🧠 Targeted Attack Prevention:** Utilizes NLP (`compromise.js`) and `zxcvbn` to evaluate passwords against the user's localized personal data, preventing social-engineering attacks.
* **🔒 k-Anonymity Breach Verification:** Cryptographically hashes passwords locally and securely queries the *Have I Been Pwned* database without exposing the raw hash over the network.
* **🎨 Cognitive Visual Mnemonic AI:** Uses a local, GPU-accelerated **Stable Diffusion Turbo** model to generate highly detailed visual memory anchors combining user-selected words and dynamically generated security numbers.
* **💎 Playful Glassmorphism UI:** A fully responsive, modern interface featuring smooth animations and a Dark/Light mode toggle.

---

## 📸 System Architecture & Previews

### 1. The Security Dashboard & Threat Intel Feed
<img width="1763" height="987" alt="image" src="https://github.com/user-attachments/assets/b8140e99-401c-4d5e-8ff8-43673b75be57" />
<img width="1763" height="987" alt="image" src="https://github.com/user-attachments/assets/f4935f18-091f-4944-a66d-9975cf944ae2" />




> *The main UI featuring real-time password entropy scoring and the live global threat intelligence marquee.*

### 2. Live Data Validation & UI Feedback
<img width="1763" height="1464" alt="image" src="https://github.com/user-attachments/assets/285464e6-b511-4dba-b9be-15bf23d219ca" />


> *The system actively warning the user against weak credentials and offering dynamically generated secure alternatives.*

### 3. AI Mnemonic Visual Generation
*(Replace the link below with your actual screenshot)*
![AI Generation Preview](docs/images/ai_generation_preview.png)
> *The Python FastAPI backend securely passing prompts to the local Stable Diffusion model to generate a downloadable visual asset.*

---

## 🛠️ Technology Stack

**Frontend (The Face):**
* HTML5 / CSS3 (Glassmorphism Design System)
* Vanilla JavaScript (ES6+)
* `CryptoJS` (Client-side SHA-1 hashing)
* `zxcvbn.js` (Algorithmic password strength estimation)
* `compromise.js` (Natural Language Processing)

**Backend & AI (The Brain):**
* Python 3.10+
* FastAPI & Uvicorn (High-performance API routing)
* `requests` & `xml.etree` (External threat intel scraping)
* PyTorch & HuggingFace Diffusers
* **AI Model:** `stabilityai/sd-turbo` (Local Execution)

---

## 🚀 Installation & Setup

### Prerequisites
1. Python 3.8 or higher installed on your system.
2. A code editor like VS Code with the **Live Server** extension installed.

### Step 1: Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
