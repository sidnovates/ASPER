
from fastapi import FastAPI,File, UploadFile
from transcriber import transcribe_audio
from summarize import summarize_text
from pydantic import BaseModel
from diarize import diarize_audio



#This is the middleware which enables communication between frontend and backend
from fastapi.middleware.cors import CORSMiddleware

import shutil #This is used for storing in uploads folder

app = FastAPI() #Initializing the web server


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],#Which url's are allowed to post requests
   allow_credentials=True,
   allow_methods=["*"],#If our site first posts the audio then separately transcribe the audio in backend then we have to include "GET" also
   allow_headers=["*"],
)


@app.post("/transcribe/")
#async: Using async can pause the function and let others run in the meantime while the function is waiting
#file: UploadFile = File(...)
# Here for a file "file"- 
#     It should be of type UploadFile which is like a data type so we can use file.filename() or file.file.read() to read its contents
#     File() This is used when the uploaded file is accepted from a form like when we submit a file, so it doesn't consider a json file or some other parameter
#     (...) a file must be uploaded - User must upload a file
async def upload_file_basic(userfile: UploadFile = File(...)):
    
    filelocation = f"uploads/{userfile.filename}"# FileLocation where the file uploaded by user is to be copied
    with open(filelocation,"wb") as buffer:# Open an empty buffer file in that location using open()
        #Open the file in binary because audio files are in binary not text 
        #with is used as it automatically closes the file when work is done
        shutil.copyfileobj(userfile.file,buffer)#Copy contents of userfile to buffer file


    transcript=transcribe_audio(filelocation)
    if(transcript!=None):
        transcript=transcript.strip() # type: ignore
    return {"transcript": transcript}


#TO get the transcript in the form of a json file
class SummaryRequest(BaseModel):
    text: str

@app.post("/summarize/")
async def summarize(request: SummaryRequest):
    summary = summarize_text(request.text)
    return {"summary": summary}

@app.post("/diarize/")
async def upload_file_adv(userfile: UploadFile= File(...)):
    filelocation = f"uploads/{userfile.filename}"
    with open(filelocation,"wb") as buffer:
        shutil.copyfileobj(userfile.file,buffer)
    
    diarize= diarize_audio(filelocation)

    return {"diarize": diarize}




    

    