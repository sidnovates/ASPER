import React, { useState } from "react";
import Navbar from "./navbar";

function AudioUploader() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file first");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }

    setLoading("transcribe");
    const formData = new FormData();
    formData.append("userfile", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/transcribe/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      setErrorMessage("Error: " + error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(null);
    }
  };

  const handleUpload_adv = async () => {
    if (!file) {
      setErrorMessage("Please select a file first");
      setTimeout(() => setErrorMessage(""), 1500);
      return;
    }

    setLoading("diarize");
    const formData = new FormData();
    formData.append("userfile", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/diarize/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log(data.diarize);

      const diarizeData = JSON.parse(data.diarize); // parse JSON string into array

      const formattedDiarization = diarizeData.map(speakerBlock => {
        const speaker = speakerBlock.speaker;
        const words = speakerBlock.words.map(wordObj => wordObj.word).join(" ");
        const startTime = speakerBlock.words[0]?.start.toFixed(2);
        const endTime = speakerBlock.words[speakerBlock.words.length - 1]?.end.toFixed(2);
        return `${speaker} : ${words} [${startTime}s - ${endTime}s]`;
      }).join("\n\n");
      setTranscript(formattedDiarization);

    } catch (error) {
      setErrorMessage("Error: " + error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(null);
    }
  };

  const handleSummarize = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcript }),
      });

      if (!response.ok) {
        throw new Error("Summary generation failed");
      }

      const data = await response.json();
      setSummary(data.summary || "No summary received.");
    } catch (error) {
      setErrorMessage("Error: " + error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "auto", padding: 30, fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Convert Audio into Text</h2>

        {errorMessage && (
          <div
            style={{
              backgroundColor: "#ffcccc",
              color: "#800000",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{
              border: "1px solid #ccc",
              padding: "6px",
              borderRadius: "5px",
              flex: 1,
            }}
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            title="Convert the audio file into text transcript."
            style={{
              backgroundColor: "#1e1e2f",
              color: "#fff",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
        {loading === "transcribe" ? "Transcribing..." : "Transcribe"}
          </button>

          <button
            onClick={handleUpload_adv}
            disabled={loading}
            title="Identify and label different speakers in the audio file."
            style={{
              backgroundColor: "#FF9800",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading === "diarize" ? "Diarizing..." : "Diarize Speakers"}
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            minHeight: "150px",
            backgroundColor: "#f9f9f9",
            whiteSpace: "pre-wrap",
          }}
        >
          {loading ? "Processing..." : transcript ? transcript : "Transcript will appear here..."}
        </div>

        {/* Summary section */}
        {transcript && (
          <>
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontWeight: "bold" }}>Give Summary of Converted Text</label>
              <button
                onClick={handleSummarize}
                title="Click to generate a concise summary of the converted text"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Get Summary
              </button>
            </div>

            {summary && (
              <div
                style={{
                  marginTop: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#f0f8ff",
                  whiteSpace: "pre-wrap",
                }}
              >
                {summary}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AudioUploader;
