# 📚 My Learnings from ASPER Project

## 🧩 FastAPI

FastAPI is a web framework for building APIs in Python. It allows us to define specific routes (URLs) and the corresponding responses using simple `get` and `return` statements. It simplifies API development with automatic validation and documentation.

---

## 🧩 Whisper

Whisper is a Python module used in Automatic Speech Recognition (ASR) systems. It provides different models depending on the trade-off between accuracy and latency.  
- Use `large` or `medium` models for higher accuracy, especially with noisy or complex audio.
- Use `tiny` or `base` models for lower latency.

---

## 🧩 ffmpeg

`ffmpeg` is a command-line tool that handles media files. It converts audio formats (e.g., `.wav` to `.mp3`), compresses, edits, and processes media files. In this project, it's crucial for audio-to-text conversion.

---

## 🧩 Virtual Environment

Think of a virtual environment as a suitcase you pack for a trip.  
On your trip (project), you can only use items from your suitcase (the project's packages), not from your home's closet (global environment). This isolation ensures your project has specific dependencies without conflicts.

---

## 🧩 CORS

CORS (Cross-Origin Resource Sharing) is a middleware used in FastAPI to enable communication between the frontend and backend hosted on different origins.  
Implemented via:
```python
from fastapi.middleware.cors import CORSMiddleware
```

---

## 🧩 API Key Handling

To protect sensitive API keys (like for GPT models) from being exposed in version control:
- Use `.env` files and `dotenv` to load them.
- Example:
```python
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
```
This keeps your API keys safe!

---

## 🧩 Diarization with WhisperX

WhisperX extends OpenAI's Whisper model for speaker diarization and timestamping. It uses:
- Whisper for speech-to-text.
- PyAnnote (from Hugging Face) for speaker differentiation.

---

## 🧩 PyTorch

PyTorch is a deep learning framework used for efficient AI model execution. It can leverage GPU (if available) for faster computation, as GPUs have many cores (thousands) compared to CPUs (a few cores).

---

## 🧩 GPU vs. CPU

- **CPU (Central Processing Unit)**: Handles general-purpose tasks with fewer cores.
- **GPU (Graphics Processing Unit)**: Designed for parallel tasks like graphics rendering and ML model inference. Ideal for large-scale computations.

---

## 🧩 Hugging Face

Hugging Face is like GitHub for ML models. It offers pre-trained models and tools for machine learning tasks, including speech recognition, text processing, and more.

---

## 🧩 Pandas

Pandas is a Python library for data analysis and manipulation. It helps in handling structured data (like Excel/SQL) and represents data in a tabular format via DataFrames.

---

## 🚀 Conclusion

This project has been a deep dive into API development, machine learning, and real-world data processing pipelines. It's amazing how different tools like FastAPI, Whisper, WhisperX, PyTorch, and Hugging Face come together to create impactful solutions.

