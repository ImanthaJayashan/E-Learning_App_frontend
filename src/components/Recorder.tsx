import React, { useCallback, useEffect, useRef, useState } from "react";

type AnalysisResult = {
  transcription?: string;
  fluency_score?: number;
  errors?: unknown;
  [key: string]: unknown;
};

const DEFAULT_ENDPOINT = "http://localhost:3001/api/analyze";

const Recorder: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [recording, setRecording] = useState(false);
  const [targetWord, setTargetWord] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || DEFAULT_ENDPOINT;

  const initStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        try {
          setSending(true);
          setError(null);
          setResult(null);
          const form = new FormData();
          form.append("audio", blob, "recording.webm");
          if (targetWord.trim()) form.append("target_word", targetWord.trim());

          const res = await fetch(gatewayUrl, {
            method: "POST",
            body: form,
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Gateway error: ${res.status} ${text}`);
          }
          const json = (await res.json()) as AnalysisResult;
          setResult(json);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setSending(false);
        }
      };
    } catch (err) {
      setError(`Microphone init failed: ${(err as Error).message}`);
    }
  }, [gatewayUrl, targetWord]);

  useEffect(() => {
    initStream();
    return () => {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
      streamRef.current = null;
    };
  }, [initStream]);

  const startRecording = () => {
    setResult(null);
    setError(null);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "recording") {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <section
      style={{
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fafafa",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Dyslexia — Reading & Speech Analysis</h2>
      <p style={{ color: "#555" }}>
        Press record, read the target word or sentence, then stop. The audio will be analyzed by the service.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Target word (optional)"
          value={targetWord}
          onChange={(e) => setTargetWord(e.target.value)}
          style={{ flex: 1, padding: "0.5rem 0.75rem", border: "1px solid #ddd", borderRadius: 8 }}
          aria-label="Target word"
        />
        <button
          type="button"
          onClick={startRecording}
          disabled={recording || sending}
          aria-label="Start recording"
          style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #0ea5e9", background: "#0ea5e9", color: "white" }}
        >
          {recording ? "Recording…" : "Record"}
        </button>
        <button
          type="button"
          onClick={stopRecording}
          disabled={!recording}
          aria-label="Stop recording"
          style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #ef4444", background: "#ef4444", color: "white" }}
        >
          Stop
        </button>
      </div>

      {sending && <div style={{ color: "#555" }}>Uploading and analyzing…</div>}
      {error && (
        <div role="alert" style={{ color: "#b91c1c", marginTop: 8 }}>
          {error}
        </div>
      )}
      {result && (
        <div style={{ marginTop: 12 }}>
          <h3 style={{ margin: "8px 0" }}>Result</h3>
          <pre
            style={{
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fff",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        Endpoint: {gatewayUrl}
      </div>
    </section>
  );
};

export default Recorder;
