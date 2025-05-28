import google.generativeai as genai
import os

#Used to load the environment variables from the .env file
from dotenv import load_dotenv

load_dotenv()

#Loading my API key from the environment variabl    e
genai.configure(api_key=os.getenv("GEMINI_API_KEY")) # type: ignore

# Create a model instance
model = genai.GenerativeModel("models/gemini-1.5-flash") #type: ignore

def summarize_text(text: str):

    try:
        prompt = f"Summarize the following text: {text} in abut 120 words."
        response = model.generate_content(prompt) # type: ignore
        return response.text.strip()
    
    except Exception as e:
            print(f"Error: {e}")
            return "Summary could not be generated"


