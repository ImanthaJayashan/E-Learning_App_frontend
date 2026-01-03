# 🎯 MODE SWITCHING - VISUAL GUIDE

## 📍 THE ONLY FILE YOU NEED TO EDIT

```
📁 animal-sound-safari/
  └─ 📁 src/
      └─ 📁 config/
          └─ 📄 gameConfig.ts  👈 OPEN THIS FILE
```

---

## 🎨 WHAT IT LOOKS LIKE

### Line ~48 - THE MAGIC LINE ✨

```typescript
export const gameConfig: GameConfig = {
  // ... documentation ...

  mode: "DATA_COLLECTION", // 👈 CHANGE THIS LINE!

  // ... rest of config ...
};
```

---

## 🔄 YOUR THREE CHOICES

### Option 1️⃣: DATA_COLLECTION (Training Phase)

**Before:**

```typescript
mode: 'PREDICTION', // or 'BOTH'
```

**After:**

```typescript
mode: 'DATA_COLLECTION',
```

**What you need to run:**

```bash
cd backend
py app.py
```

**What happens:**

- ✅ Data saved to CSV/JSON
- ❌ No prediction button
- ❌ No predictions

**Use when:** Collecting training data

---

### Option 2️⃣: PREDICTION (Production Phase)

**Before:**

```typescript
mode: 'DATA_COLLECTION', // or 'BOTH'
```

**After:**

```typescript
mode: 'PREDICTION',
```

**What you need to run:**

```bash
cd backend
py prediction_api.py
```

**What happens:**

- ❌ No CSV/JSON storage
- ✅ Prediction button shows
- ✅ Real-time predictions

**Use when:** Model is trained, want predictions only

---

### Option 3️⃣: BOTH (Full System)

**Before:**

```typescript
mode: 'DATA_COLLECTION', // or 'PREDICTION'
```

**After:**

```typescript
mode: 'BOTH',
```

**What you need to run:**

```bash
# Terminal 1
cd backend
py app.py

# Terminal 2
cd backend
py prediction_api.py
```

**What happens:**

- ✅ Data saved to CSV/JSON
- ✅ Prediction button shows
- ✅ Real-time predictions
- ✅ Everything enabled

**Use when:** Want full features

---

## 🎬 STEP-BY-STEP EXAMPLE

### Scenario: Switch from DATA_COLLECTION to PREDICTION

**Step 1:** Open the file

```
animal-sound-safari/src/config/gameConfig.ts
```

**Step 2:** Find line ~48

```typescript
mode: 'DATA_COLLECTION', // 👈 You'll see this
```

**Step 3:** Change it to

```typescript
mode: 'PREDICTION', // 👈 Change to this
```

**Step 4:** Save the file (Ctrl+S / Cmd+S)

**Step 5:** Frontend auto-reloads (Vite hot reload)

**Step 6:** Stop app.py if running

**Step 7:** Start prediction_api.py

```bash
cd backend
py prediction_api.py
```

**Step 8:** Play the game!

- Prediction button will now appear after 5 attempts
- No data will be saved to CSV

**Done!** ✅

---

## 🎯 VISUAL COMPARISON

### Before (DATA_COLLECTION Mode)

```
┌─────────────────────────────────────┐
│  🎵 Animal Sounds Game 🎵           │
├─────────────────────────────────────┤
│  [Play Sound]  [Reset]  Score: 3    │
│                                     │
│  Session: abc123 | Attempts: 7      │
│                                     │
│  🐶  🐱  🐮  🦁                      │
│                                     │
│  👆 Click animals!                  │
└─────────────────────────────────────┘

NO PREDICTION BUTTON SHOWN ❌
```

### After (PREDICTION Mode)

```
┌─────────────────────────────────────────────┐
│  🎵 Animal Sounds Game 🎵                   │
├─────────────────────────────────────────────┤
│  [Play Sound]  [Reset]  Score: 3            │
│  [Get Assessment] 👈 NEW BUTTON!            │
│                                             │
│  Session: abc123 | Attempts: 7              │
│  ✅ Ready for prediction!                   │
│                                             │
│  🐶  🐱  🐮  🦁                              │
│                                             │
│  👆 Click animals!                          │
└─────────────────────────────────────────────┘

PREDICTION BUTTON APPEARS ✅
```

---

## 🔍 HOW TO VERIFY IT WORKED

### Check Browser Console (F12)

You should see:

```
============================================================
🎮 GAME CONFIGURATION
============================================================
Mode: PREDICTION  👈 Should match what you set
Description: 🔮 Prediction Mode - Real-time ML predictions
Call app.py: false
Call prediction_api.py: true
Show prediction UI: true
============================================================
```

### Check UI

**DATA_COLLECTION Mode:**

- ❌ No "Get Assessment" button

**PREDICTION Mode:**

- ✅ "Get Assessment" button appears (after 5 attempts)

**BOTH Mode:**

- ✅ "Get Assessment" button appears (after 5 attempts)

---

## ⚠️ COMMON MISTAKES

### Mistake 1: Wrong quotes

```typescript
❌ mode: "PREDICTION",  // Wrong: double quotes (works but inconsistent)
✅ mode: 'PREDICTION',  // Right: single quotes
```

### Mistake 2: Typo in mode name

```typescript
❌ mode: 'PREDICTIONS',  // Wrong: extra 'S'
❌ mode: 'Prediction',   // Wrong: wrong case
✅ mode: 'PREDICTION',   // Right: exact match
```

### Mistake 3: Forgetting to save

```typescript
mode: 'PREDICTION', // Changed but not saved
```

**Solution:** Press Ctrl+S (Windows) or Cmd+S (Mac)

### Mistake 4: Wrong backend running

```typescript
mode: 'PREDICTION', // Set to PREDICTION
// But running: py app.py  ❌ Wrong!
// Should run: py prediction_api.py  ✅
```

---

## 🎓 QUICK REFERENCE TABLE

| Mode            | Line to write              | Backend to run         |
| --------------- | -------------------------- | ---------------------- |
| DATA_COLLECTION | `mode: 'DATA_COLLECTION',` | `py app.py`            |
| PREDICTION      | `mode: 'PREDICTION',`      | `py prediction_api.py` |
| BOTH            | `mode: 'BOTH',`            | Both backends          |

---

## 🚀 REMEMBER

**ONE LINE CHANGE = ENTIRE SYSTEM ADAPTS**

✅ UI updates automatically  
✅ API calls route correctly  
✅ Features enable/disable  
✅ No code changes needed elsewhere

**File to edit:**

```
animal-sound-safari/src/config/gameConfig.ts
```

**Line to change:**

```
~48
```

**Possible values:**

```
'DATA_COLLECTION' | 'PREDICTION' | 'BOTH'
```

**That's it!** 🎯

---

## 💡 PRO TIP

Add a comment to remember current mode:

```typescript
// Currently in data collection phase - 2025-12-12
mode: 'DATA_COLLECTION',

// Or when switching:
// Switched to prediction mode - 2025-12-15
mode: 'PREDICTION',
```

This helps you track when and why you switched modes!

---

## ✨ FINAL CHECKLIST

Before running the game:

- [ ] Opened `src/config/gameConfig.ts`
- [ ] Changed `mode` to desired value
- [ ] Saved the file (Ctrl+S / Cmd+S)
- [ ] Started appropriate backend(s)
- [ ] Refreshed browser (or auto-reloaded)
- [ ] Verified mode in console (F12)
- [ ] Started playing!

**Enjoy your modular game system!** 🎮🎉
