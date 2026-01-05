# Model Integration Phase - TFLite LSTM

## Overview
Second-layer analysis using an LSTM model running on TensorFlow Lite to detect acoustic risk markers from MFCC features.

## Architecture

### 1. Feature Extraction (`audio_processing/features.py`)
- **Function**: `extract_mfcc(file_path)`
- **Process**:
  - Loads audio at 16kHz sample rate
  - Enforces fixed 3-second duration (pads with zeros or truncates)
  - Extracts 13 MFCCs using librosa
  - Returns shape: `(Time, 13)`
- **Purpose**: Consistent input shape for LSTM model

### 2. TFLite Model (`models/risk_model.py`)
- **Class**: `TFLiteRiskPredictor`
- **Model Path**: `models/dyslexia_lstm.tflite`
- **Input**: MFCC features `(1, Time, 13)` as float32
- **Output**: Risk label `["Low", "Medium", "High"]`
- **Error Handling**: Returns `"Model Not Loaded"` if `.tflite` missing

### 3. Flask Integration (`app.py`)
- Runs **in parallel** with existing rule-based analysis
- New response key: `"risk_assessment"`
- Does **not** break existing STT/phonetic/fluency flow
- Gracefully degrades if feature extraction fails

## Response Format
```json
{
  "transcription": "...",
  "words": [...],
  "fluency_score": {...},
  "errors": {...},
  "risk_assessment": "Medium"
}
```

## Training the Model
To train `dyslexia_lstm.tflite`:
1. Collect labeled MFCC features from SpeechSTAR/CHILDES datasets
2. Train LSTM in Keras/TensorFlow
3. Convert to TFLite:
   ```python
   converter = tf.lite.TFLiteConverter.from_keras_model(model)
   tflite_model = converter.convert()
   with open('dyslexia_lstm.tflite', 'wb') as f:
       f.write(tflite_model)
   ```
4. Place in `nlp-engine/models/`

## Testing
```python
from audio_processing.features import extract_mfcc
from models.risk_model import predict_risk

features = extract_mfcc("test_audio.wav")
risk = predict_risk(features)
print(f"Risk: {risk}")  # "Low", "Medium", "High", or "Model Not Loaded"
```
