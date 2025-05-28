# This file is used for logic for Whisper Transcription


import whisper
model = whisper.load_model("base")

#Converting audio into text using whisper module
def transcribe_audio(filepath: str):
    result = model.transcribe(filepath)
    return result['text']

