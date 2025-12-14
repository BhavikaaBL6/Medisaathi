
import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv
import typing_extensions as typing # Use typing_extensions for TypedDict
import urllib.parse
import json

load_dotenv()

# Configure the API key in a standard way if needed, though GenerationModel usually picks it up from env or configure().
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# NOTE: The NIH RxNav Interaction API was discontinued in Jan 2024.
# We receive '404 Not Found' when accessing /interaction/list.json.
# However, we can still use the RxNorm API to standardize drug names ("Gold Standard"),
# and then use those standard names to query OpenFDA for reliable label data.

def get_canonical_name(drug_name: str) -> tuple[str, str]:
    """
    Uses NIH RxNav (RxNorm) API to find the canonical generic name for a drug.
    This handles brand names and typos, providing the 'Gold Standard' name.
    """
    try:
        # Use approximate match to handle typos and brand names
        url = "https://rxnav.nlm.nih.gov/REST/approximateTerm.json"
        params = {"term": drug_name, "maxEntries": "1"}
        response = requests.get(url, params=params)
        data = response.json()
        
        if "approximateGroup" in data and "candidate" in data["approximateGroup"]:
             candidates = data["approximateGroup"]["candidate"]
             if candidates:
                 # Return the RxNorm name of the first match
                 # We prefer the generic name if possible, but the concept name is good.
                 return candidates[0].get("rxcui", ""), candidates[0].get("name", drug_name)
                 
        return None, drug_name
    except Exception as e:
        print(f"RxNorm Resolution Error: {e}")
        return None, drug_name

def get_drug_label_interactions(drug_name: str):
    """
    Retrieves the 'drug_interactions' section from the FDA approved label for a given drug.
    This helps identify contraindications and warnings.
    """
    # First, try to get the canonical name from RxNorm for better accuracy
    rxcui, canonical_name = get_canonical_name(drug_name)
    
    # Use the canonical name for the search if different, or search both
    search_term = canonical_name if canonical_name else drug_name
    encoded_name = search_term.replace('"', '\\"')
    
    # Query OpenFDA
    # searching strictly by generic_name if we have a resolved generic name is often cleaner,
    # but brand_name search is safe backing.
    query = f'openfda.brand_name:"{encoded_name}"+OR+openfda.generic_name:"{encoded_name}"'
    
    # If we have the original name as well, maybe expand search? 
    # For now, let's trust the RxNorm resolution which is usually excellent.
    
    url = f"https://api.fda.gov/drug/label.json"
    params = {
        "search": query,
        "limit": "1"
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if "results" in data and len(data["results"]) > 0:
            result = data["results"][0]
            # Try to find the interactions section
            interactions = result.get("drug_interactions", [])
            warnings = result.get("warnings", [])
            boxed_warning = result.get("boxed_warning", [])
            
            info = []
            if interactions:
                info.append(f"Interactions: {interactions[0]}")
            if warnings:
                info.append(f"Warnings: {warnings[0]}")
            if boxed_warning:
                info.append(f"Boxed Warnings: {boxed_warning[0]}")
                
            if info:
                return "\n".join(info)
            else:
                return "Drug found, but no specific interaction/warning sections available in structured data."
        
        return "No labeling information found for this drug in openFDA."
        
    except Exception as e:
        return f"Error querying openFDA: {str(e)}"

# Define the return schema
class InteractionResult(typing.TypedDict):
    risk_level: str
    explanation: str
    recommendation: str
    source: str

class DrugInteractionChecker:
    def __init__(self, api_key: str = None):
        # Initialize model - NO TOOLS to save tokens/calls. We fetch data in Python.
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-lite"
        )

    def check_interactions(self, drugs: list[str]) -> InteractionResult:
        """
        Checks for interactions between a list of drugs.
        """
        if len(drugs) < 2:
             return {
                "risk_level": "GREEN",
                "explanation": "Need at least two drugs to check for interactions.",
                "recommendation": "Add more medications.",
                "source": "System"
            }

        drug_list_str = ", ".join(drugs)
        
        # OPTIMIZATION:
        # Pre-fetch FDA data in Python to avoid multiple LLM tool-calling turns.
        # This reduces API usage from (N_drugs + 1) calls to exactly 1 call.
        
        gathered_data = []
        for drug in drugs:
            print(f"DEBUG: Fetching constraints for {drug}...")
            # Automatically uses RxNorm + OpenFDA
            info = get_drug_label_interactions(drug)
            gathered_data.append(f"--- DATA FOR {drug} ---\n{info}\n")
            
        context_data = "\n".join(gathered_data)
        
        prompt = f"""
        Analyze the potential interactions between the following drugs: {drug_list_str}.
        
        I have already retrieved the official FDA label information for each drug below. 
        Please use this data as your primary source of truth.
        
        {context_data}
        
        INSTRUCTIONS:
        1. Cross-reference the provided data to see if any drug warns against the others.
        2. If the provided data confirms a risk, invoke the 'OpenFDA + RxNorm' source.
        3. If the provided data is empty or misses a known interaction, use your internal medical knowledge and invoke the 'AI Inferred' source.
        4. Assign a valid RISK LEVEL:
           - RED: Severe/Critical interaction (Stop immediately).
           - YELLOW: Moderate interaction (Proceed with caution/doctor advice).
           - GREEN: No significant interaction known.

        Construct the response with:
        - risk_level: The assigned level (RED, YELLOW, or GREEN).
        - explanation: A detailed description of the interaction. MUST include the biological mechanism or reason (e.g., 'Drug A inhibits CYP3A4, increasing levels of Drug B'). Cite specific warnings from the FDA label if available.
        - recommendation: Actionable advice for the user (e.g., 'Contact your doctor immediately', 'Separate doses by 2 hours', 'Monitor for symptoms X, Y').
        - source: 'OpenFDA' or 'AI Inferred'.

        You must return a valid JSON object matching the schema.
        """
        
        try:
            # Use structured output for reliability
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=InteractionResult
                )
            )
            
            # Parse and return result
            print(f"DEBUG: Interaction Response: {response.text}")
            return json.loads(response.text)
            
        except Exception as e:
            print(f"Error checking interactions: {e}")
            # Fallback for errors
            return {
                "risk_level": "YELLOW",
                "explanation": f"System encountered an error during check: {str(e)}",
                "recommendation": "Please consult a healthcare professional.",
                "source": "System Error"
            }

# Example usage (for testing)
if __name__ == "__main__":
    checker = DrugInteractionChecker()
    # Test with a known interaction
    result = checker.check_interactions(["Aspirin", "Warfarin"])
    print(json.dumps(result, indent=2))
