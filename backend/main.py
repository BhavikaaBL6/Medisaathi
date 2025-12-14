from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pydantic import BaseModel
from interaction_checker import DrugInteractionChecker
from vision_service import analyze_medication_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to MediSaathi API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

class InteractionRequest(BaseModel):
    drugs: list[str]

@app.post("/interactions")
def check_drug_interactions(request: InteractionRequest):
    checker = DrugInteractionChecker()
    result = checker.check_interactions(request.drugs)
    return result

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        

        result = await analyze_medication_image(temp_file)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)
