# 🛡️ Threat Detector

AI-powered threat detection system for identifying phishing, spam, and other security threats in messages and content.

## Features

- 🤖 AI-powered analysis using Gemini API
- 📊 Risk scoring (0-100)
- 🔗 URL and domain analysis
- 🎨 Modern UI with threat gauge
- 🔐 Secure API management

## Languages:

- 🇦🇱 Albanian

## Tech Stack

- **Backend:** Python, FastAPI, Gemini API
- **Frontend:** React, Tailwind CSS

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
echo "GEMINI_API_KEY_2=your_key" > .env
python3 -m uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Risk Levels

| Score  | Status     | Level |
| ------ | ---------- | ----- |
| 0-29   | Safe       | 🟢    |
| 30-69  | Suspicious | 🟡    |
| 70-100 | High Risk  | 🔴    |

## License

MIT
