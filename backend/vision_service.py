
import os
import google.generativeai as genai
from dotenv import load_dotenv
import typing_extensions as typing
import json
import PIL.Image
import asyncio

load_dotenv()

# Configure the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class MedicationInfo(typing.TypedDict):
    drug_name: str
    strength: str
    frequency: str

async def analyze_medication_image(image_path: str) -> dict:
    """
    Analyzes an image to extract medication information using Gemini 1.5 Pro.
    Async version to prevent blocking the event loop.
    
    Args:
        image_path (str): The path to the image file.
        
    Returns:
        dict: A dictionary containing 'drug_name', 'strength', and 'frequency'.
    """
    
    try:
        print(f"DEBUG: Analyzing image at {image_path}")
        
        # Initialize the model
        model = genai.GenerativeModel(model_name="gemini-2.5-flash-lite")

        # Define the prompt
        prompt = (
            "Analyze this image of a medication container. Extract the following details:\n"
            "- drug_name: The brand or generic name of the drug.\n"
            "- strength: The dosage strength (e.g., 500mg, 10mg/ml).\n"
            "- frequency: The dosage instructions if visible (e.g., 'Take 1 tablet daily'). If not visible, return 'Not stated'.\n\n"
            "If the image is blurry or no text is visible, set drug_name to 'No text detected'."
        )

        # Use context manager to ensure file is closed
        try:
            # We must open the image in a thread if we want to be truly non-blocking during IO, 
            # but PIL open is usually fast. The network call is the blocker.
            # Loading large images can block, but let's assume it's okay for now or optimize later.
            
            with PIL.Image.open(image_path) as img:
                img.load() # Load now
                
                # Resize if image is too large to speed up upload and processing
                # Max dimension 1024
                max_size = 1024
                if img.width > max_size or img.height > max_size:
                    print(f"DEBUG: Resizing image from {img.size}")
                    img.thumbnail((max_size, max_size))
                    print(f"DEBUG: Resized to {img.size}")
                
                # Generate content async
                response = await model.generate_content_async(
                    [img, prompt],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        response_schema=MedicationInfo
                    )
                )
        except Exception as img_error:
            print(f"DEBUG: Error processing image file: {img_error}")
            raise img_error

        print(f"DEBUG: Gemini Response Text: {response.text}")
        
        # Parse and return result
        result = json.loads(response.text)
        return result

    except Exception as e:
        print(f"Error analyzing image: {e}")
        # Return a structured error so the frontend can display it
        return {
            "drug_name": "Error Occurred",
            "strength": "Check Backend Logs",
            "frequency": str(e),
            "raw_error": str(e)
        }
