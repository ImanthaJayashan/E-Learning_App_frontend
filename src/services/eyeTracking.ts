type EyeTrackingState = {
  isTracking: boolean;
  status: string;
  error: string | null;
  latestResult: any | null;
};

type EyeTrackingListener = (state: EyeTrackingState) => void;

const listeners = new Set<EyeTrackingListener>();

let state: EyeTrackingState = {
  isTracking: false,
  status: "Idle",
  error: null,
  latestResult: null,
};

let stream: MediaStream | null = null;
let intervalId: number | null = null;
let videoEl: HTMLVideoElement | null = null;
let canvasEl: HTMLCanvasElement | null = null;

const apiBase = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
const predictUrl = apiBase ? `${apiBase}/predict` : "/api/predict";

const notify = () => {
  listeners.forEach((listener) => listener({ ...state }));
};

const setState = (partial: Partial<EyeTrackingState>) => {
  state = { ...state, ...partial };
  notify();
};

export const subscribeEyeTracking = (listener: EyeTrackingListener) => {
  listeners.add(listener);
  listener({ ...state });
  return () => listeners.delete(listener);
};

export const attachVideoElement = (el: HTMLVideoElement | null) => {
  videoEl = el;
  if (videoEl && stream) {
    videoEl.srcObject = stream;
    videoEl.play().catch(() => undefined);
  }
};

const ensureCanvas = () => {
  if (!canvasEl) {
    canvasEl = document.createElement("canvas");
  }
  return canvasEl;
};

const ensureVideo = () => {
  if (videoEl) return videoEl;
  const created = document.createElement("video");
  created.muted = true;
  created.playsInline = true;
  videoEl = created;
  return created;
};

const captureAndSend = async () => {
  if (!stream) return;
  const video = ensureVideo();
  const canvas = ensureCanvas();
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(video, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
  );
  if (!blob) return;

  const formData = new FormData();
  formData.append("image", blob, "frame.jpg");

  try {
    const res = await fetch(predictUrl, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const data = await res.json();
    const withTimestamp = { ...data, timestamp: data.timestamp || new Date().toISOString() };
    setState({ latestResult: withTimestamp, status: "Tracking", error: null });
    localStorage.setItem("latestEyeDetection", JSON.stringify(withTimestamp));
  } catch (err: any) {
    setState({ error: err?.message || "Failed to send frame", status: "Error" });
  }
};

export const startEyeTracking = async () => {
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "child") {
    setState({ status: "Disabled for parents", error: null });
    return;
  }

  if (state.isTracking) return;
  if (!navigator?.mediaDevices?.getUserMedia) {
    setState({ status: "Error", error: "Camera not supported" });
    return;
  }

  setState({ status: "Starting camera...", error: null });
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    const video = ensureVideo();
    video.srcObject = stream;
    await video.play();

    setState({ isTracking: true, status: "Tracking", error: null });
    intervalId = window.setInterval(captureAndSend, 2000);
  } catch (err: any) {
    setState({ status: "Error", error: err?.message || "Camera permission denied" });
  }
};

export const stopEyeTracking = () => {
  if (intervalId) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  if (videoEl) {
    videoEl.srcObject = null;
  }
  setState({ isTracking: false, status: "Stopped" });
};

export const getEyeTrackingState = () => ({ ...state });
