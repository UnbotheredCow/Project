# Quick Start Guide

## Prerequisites
- Python 3.11+
- Node.js 18+
- 4GB RAM minimum

## Setup (5 minutes)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies (first time only - takes 2-3 minutes)
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Start the backend
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

### 2. Frontend Setup

Open a new terminal:

```bash
# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev
```

Frontend runs at: http://localhost:5173

## First Use

1. Open http://localhost:5173 in your browser
2. Drag and drop a PDF file into the upload zone
3. Wait for processing (10-20 seconds on first run as models download)
4. Ask a question about the document
5. View the answer and source citations

## Example Questions

- "What is the main topic of this document?"
- "Summarize the key findings"
- "What does it say about [specific topic]?"
- "List the main conclusions"

## Stopping the Application

Press `Ctrl+C` in both terminal windows.

## Using Docker Instead

```bash
docker-compose up --build
```

Then visit http://localhost:5173

## Need Help?

- API Documentation: http://localhost:8000/docs
- Check the main README.md for troubleshooting
- Ensure both services are running before testing
