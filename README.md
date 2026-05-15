# MediSaathi

MediSaathi is a medication safety app designed to help caregivers and patients.

## Features
- Scan pill bottles using Vision AI
- Check for drug interactions using FDA database/Knowledge Graph
- Alert caregivers

## Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Python (FastAPI)
- **AI/Vision**: Gemini 3 Pro

## Getting Started

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Unix: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the app: `npx expo start`

