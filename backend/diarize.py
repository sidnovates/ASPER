import whisperx #Works only on python<=3.11 versions
import pandas as pa
# import torch
import os
from dotenv import load_dotenv
import json


#Loading envirnment variables from .env file
load_dotenv()

hf_token=os.getenv("HUGGINGFACE_KEY")

#If there is no GPU, use CPU
#GPU is Graphic Processing Unit which is better for processing ML Models as it uses Parallel Processing
# my_device = "cuda" if torch.cuda.is_available() else "cpu"
my_device = "cpu"

#Load the Whisper Model
model = whisperx.load_model("base",compute_type="float32", device=my_device)

#For sending the text to main.py in proper format
def format_transcription(final_transcription):
    speaker_dict = {}

    # Group words by speaker
    for segment in final_transcription['segments']:
        speaker = segment['speaker']
        if speaker not in speaker_dict:
            speaker_dict[speaker] = []

        for word in segment['words']:
            speaker_dict[speaker].append({
                'word': word['word'],
                'start': float(word['start']),
                'end': float(word['end'])
            })

    # Convert into a list format (for JSON)
    formatted_list = []
    for speaker, words in speaker_dict.items():
        formatted_list.append({
            'speaker': speaker,
            'words': words
        })
    return formatted_list

def diarize_audio(filepath: str):
    #Transcribe the audio using whisper
    transcription= model.transcribe(filepath)
    #Here the transcription gives phrase-level timestamps

    #Now we have to diarize the audio,i.e, differentiate between speakers
    #First we have to find word-level timestamps for diarization
    language_code = transcription["language"]
    model_a,metadata = whisperx.load_align_model(language_code=language_code, device=my_device)

    segments_list = transcription["segments"]

    #Here the aligned_transcription gives word-level timestamps
    #LIKE : Hello , start-time, end-time
    aligned_transcription = whisperx.align(segments_list, model_a, metadata, filepath, my_device)

    #Diarization Model from Hugging Face (For Speaker Separation)
    diarize_model= whisperx.diarize.DiarizationPipeline(use_auth_token=hf_token,device=my_device)#type:ignore
    diarize_transcription = diarize_model(filepath)

    #diarize_transcription gives how much time a speaker spoke
    #LIKE: Speaker 1, start-time, end-time
    #      Speaker 2, start-time, end-time
    #      Speaker 1, start-time, end-time

    #Now we have to combine the diarization transcription with the aligned transcription 
    #to get the final transcription

    final_transcription= whisperx.assign_word_speakers(diarize_transcription, aligned_transcription)
    json_ready_transcription= format_transcription(final_transcription)

    #Convert to json string
    json_string = json.dumps(json_ready_transcription,indent=2)

    return json_string
    
    



