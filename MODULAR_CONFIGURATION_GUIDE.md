# 🎮 Modular Game Configuration Guide

## 📋 Overview

The frontend has been redesigned with **modular architecture** allowing you to easily switch between three modes:

1. **DATA_COLLECTION** - Record training data only (app.py)
2. **PREDICTION** - Real-time predictions only (prediction_api.py)
3. **BOTH** - Full system with both features

## 🔧 How to Switch Modes

### Step 1: Open Configuration File

```
animal-sound-safari/src/config/gameConfig.ts
```

### Step 2: Change the Mode

Find this line (around line 48):

```typescript
mode: 'DATA_COLLECTION', // 👈 CHANGE THIS!
```

### Step 3: Select Your Mode

#### Option A: Data Collection Mode (Training Phase)

```typescript
mode: 'DATA_COLLECTION',
```

**What happens:**

- ✅ Calls app.py (port 5000) only
- ✅ Records all interactions to CSV/JSON
- ✅ Builds training dataset
- ❌ No predictions
- ❌ Prediction button hidden

**Use when:**

- Collecting initial training data
- Building dataset for model training
- Don't have trained model yet

**Backend requirement:**

```bash
cd backend
py app.py  # Only this needs to run
```

---

#### Option B: Prediction Mode (Production Phase)

```typescript
mode: 'PREDICTION',
```

**What happens:**

- ❌ Does NOT call app.py
- ✅ Calls prediction_api.py (port 5001) only
- ✅ Stores data in RAM (temporary)
- ✅ Shows real-time predictions
- ✅ Prediction button visible

**Use when:**

- Model is already trained
- Want real-time predictions
- Don't need permanent storage
- Production deployment

**Backend requirement:**

```bash
cd backend
py prediction_api.py  # Only this needs to run
```

---

#### Option C: Both Modes (Full System)

```typescript
mode: 'BOTH',
```

**What happens:**

- ✅ Calls app.py (port 5000) - Permanent storage
- ✅ Calls prediction_api.py (port 5001) - Predictions
- ✅ Full feature set
- ✅ Data saved to CSV/JSON
- ✅ Real-time predictions enabled

**Use when:**

- Want both features
- Continuous data collection + predictions
- Testing full system

**Backend requirement:**

```bash
# Terminal 1
cd backend
py app.py

# Terminal 2
cd backend
py prediction_api.py
```

---

## 🚀 Quick Start Examples

### Example 1: Initial Data Collection

**Scenario:** You're starting fresh, need to collect training data.

**Steps:**

1. **Configure mode:**

   ```typescript
   // src/config/gameConfig.ts
   mode: 'DATA_COLLECTION',
   ```

2. **Start backend:**

   ```bash
   cd backend
   py app.py
   ```

3. **Start frontend:**

   ```bash
   cd animal-sound-safari
   npm run dev
   ```

4. **Play game:**

   - No prediction button will show
   - All data saved to `game_analytics.csv`
   - Use for training model later

5. **Train model when ready:**
   ```bash
   cd backend
   py train_model.py
   ```

---

### Example 2: Production with Predictions

**Scenario:** Model is trained, you want real-time predictions only.

**Steps:**

1. **Configure mode:**

   ```typescript
   // src/config/gameConfig.ts
   mode: 'PREDICTION',
   ```

2. **Ensure model exists:**

   ```bash
   # Check these files exist:
   backend/hearing_model.pkl
   backend/model_config.json
   ```

3. **Start prediction backend:**

   ```bash
   cd backend
   py prediction_api.py
   ```

4. **Start frontend:**

   ```bash
   cd animal-sound-safari
   npm run dev
   ```

5. **Play game:**
   - Prediction button shows after 5 attempts
   - No data saved permanently
   - Get instant ML predictions

---

### Example 3: Full System

**Scenario:** Want both data collection and predictions.

**Steps:**

1. **Configure mode:**

   ```typescript
   // src/config/gameConfig.ts
   mode: 'BOTH',
   ```

2. **Start both backends:**

   ```bash
   # Terminal 1
   cd backend
   py app.py

   # Terminal 2
   cd backend
   py prediction_api.py
   ```

3. **Start frontend:**

   ```bash
   # Terminal 3
   cd animal-sound-safari
   npm run dev
   ```

4. **Play game:**
   - Data saved to CSV/JSON (app.py)
   - Predictions available (prediction_api.py)
   - Full feature set enabled

---

## 📁 File Structure

```
animal-sound-safari/
├── src/
│   ├── config/
│   │   └── gameConfig.ts          👈 CHANGE MODE HERE
│   ├── services/
│   │   └── gameService.ts         (Handles API calls)
│   └── pages/
│       └── Index.tsx              (Game component)
└── ...

backend/
├── app.py                         (Port 5000 - Data collection)
├── prediction_api.py              (Port 5001 - ML predictions)
├── hearing_model.pkl              (Trained model)
└── model_config.json              (Model metadata)
```

---

## 🎯 Mode Comparison Table

| Feature                     | DATA_COLLECTION | PREDICTION            | BOTH        |
| --------------------------- | --------------- | --------------------- | ----------- |
| **Calls app.py**            | ✅ Yes          | ❌ No                 | ✅ Yes      |
| **Calls prediction_api.py** | ❌ No           | ✅ Yes                | ✅ Yes      |
| **Saves to CSV/JSON**       | ✅ Yes          | ❌ No                 | ✅ Yes      |
| **Shows predictions**       | ❌ No           | ✅ Yes                | ✅ Yes      |
| **Prediction button**       | Hidden          | Visible               | Visible     |
| **Data storage**            | Permanent       | Temporary (RAM)       | Both        |
| **Backends needed**         | 1 (app.py)      | 1 (prediction_api.py) | 2 (both)    |
| **Use case**                | Training        | Production            | Full system |

---

## 🔍 Verification

### Check Current Mode

Open browser console (F12) and look for:

```
============================================================
🎮 GAME CONFIGURATION
============================================================
Mode: DATA_COLLECTION
Description: 📊 Data Collection Mode - Recording to CSV/JSON
Call app.py: true
Call prediction_api.py: false
Show prediction UI: false
============================================================
```

### Test API Calls

**In DATA_COLLECTION mode:**

- Should see: `📊 Recording to app.py (permanent storage)...`
- Should NOT see: `🔮 Recording to prediction_api.py...`

**In PREDICTION mode:**

- Should see: `🔮 Recording to prediction_api.py (ML analysis)...`
- Should NOT see: `📊 Recording to app.py...`

**In BOTH mode:**

- Should see BOTH messages

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" error

**Cause:** Backend not running for selected mode

**Solution:**

- DATA_COLLECTION mode: Start `app.py`
- PREDICTION mode: Start `prediction_api.py`
- BOTH mode: Start both backends

### Issue: Prediction button doesn't show

**Cause:** Wrong mode selected

**Solution:**

```typescript
// Change to PREDICTION or BOTH
mode: 'PREDICTION',
```

### Issue: Data not saving to CSV

**Cause:** Wrong mode or app.py not running

**Solution:**

```typescript
// Use DATA_COLLECTION or BOTH
mode: 'DATA_COLLECTION',
```

Then start app.py:

```bash
py app.py
```

### Issue: "Session not found" when predicting

**Cause:** prediction_api.py restarted (RAM cleared)

**Solution:**

- Play 5+ attempts again
- Don't restart prediction_api.py during gameplay

---

## 💡 Best Practices

### 1. Data Collection Phase

```typescript
mode: "DATA_COLLECTION";
```

- Use this initially
- Collect 300+ attempts
- Train model when ready
- Switch to PREDICTION mode after

### 2. Production Deployment

```typescript
mode: "PREDICTION";
```

- Faster (only 1 backend)
- Less storage usage
- Real-time predictions only

### 3. Development/Testing

```typescript
mode: "BOTH";
```

- Test full system
- Continuous data collection
- Validate predictions

---

## 📊 Data Flow Diagrams

### DATA_COLLECTION Mode

```
Frontend → app.py (5000) → CSV/JSON files
           [permanent storage]
```

### PREDICTION Mode

```
Frontend → prediction_api.py (5001) → RAM storage
           [temporary, predictions only]
```

### BOTH Mode

```
Frontend → app.py (5000) → CSV/JSON files
        ↓
        → prediction_api.py (5001) → RAM storage + ML predictions
```

---

## 🎓 Example Workflow

### Complete Development Cycle

#### Phase 1: Data Collection (Week 1)

```typescript
mode: "DATA_COLLECTION";
```

- Run app.py only
- Collect 500+ game sessions
- Data saved to game_analytics.csv

#### Phase 2: Model Training (Week 2)

```bash
py train_model.py
# Creates hearing_model.pkl
```

#### Phase 3: Testing (Week 3)

```typescript
mode: "BOTH";
```

- Run both backends
- Test predictions
- Collect more data
- Refine model

#### Phase 4: Production (Week 4+)

```typescript
mode: "PREDICTION";
```

- Run prediction_api.py only
- Deploy to users
- Real-time predictions
- No unnecessary storage

---

## 📝 Summary

**To change modes:**

1. Open `src/config/gameConfig.ts`
2. Change `mode:` value
3. Save file
4. Frontend auto-reloads
5. Start appropriate backend(s)

**No code changes needed elsewhere!** The entire system automatically adapts to your selected mode. 🎯
