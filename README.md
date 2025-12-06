# Finance Manager

This project consists of a FastAPI backend and a Next.js frontend.

## 🚀 Quick Start (Windows)

Simply double-click the **`run_app.bat`** file in this directory. 
It will open two command windows: one for the backend and one for the frontend.

## 🛠️ Manual Setup

If you prefer to run the servers manually or need to debug:

### 1. Backend

Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Run the Server:**
```bash
python -m uvicorn main:app --reload --port 8000
```

> Ensure you have a `.env` file in the `backend` directory with your API keys (e.g., `GEMINI_API_KEY`).

### 2. Frontend

Navigate to the frontend directory.

```bash
cd frontend
npm install
```

**Run the Development Server:**
```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).
