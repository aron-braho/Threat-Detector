# 🛡️ Threat Detector

AI-powered threat detection system for identifying phishing, spam, and other security threats in messages and content.

## Features

- 🤖 AI-powered analysis using Gemini API
- 📊 Risk scoring (0-100)
- 🔗 URL and domain analysis
- 🎨 Modern UI with threat gauge
- 🔐 Secure API management

## Languages

- 🇦🇱 Albanian (Shqip)

## Tech Stack

- **Backend:** Python 3.13, FastAPI, Google Gemini API
- **Frontend:** React 18, Tailwind CSS

## Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
echo "GEMINI_API_KEY_2=your_key_here" > .env
python3 -m uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Risk Levels

| Score  | Status         | Level |
| ------ | -------------- | ----- |
| 0-29   | I Sigurt       | 🟢    |
| 30-69  | I Dyshimtë     | 🟡    |
| 70-100 | Rrezik i Lartë | 🔴    |

## API Endpoints

- `GET /` - Health check
- `POST /analyze` - Analyze message for threats

## Future Threats

- Malware detection
- Social engineering analysis
- Custom threat rules

## License

MIT License - Free for personal and commercial use
