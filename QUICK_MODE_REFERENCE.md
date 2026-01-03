# 🚀 Quick Mode Switching Reference

## 📍 File to Edit

```
animal-sound-safari/src/config/gameConfig.ts
```

## 🎯 Line to Change (Line ~48)

```typescript
mode: 'DATA_COLLECTION', // 👈 CHANGE THIS!
```

---

## 🔄 Mode Options

### 1️⃣ DATA_COLLECTION

**Use for:** Collecting training data

```typescript
mode: 'DATA_COLLECTION',
```

**Backend needed:**

```bash
py app.py
```

**Features:**

- ✅ Records to CSV/JSON
- ❌ No predictions
- ❌ No prediction button

---

### 2️⃣ PREDICTION

**Use for:** Real-time predictions (after model trained)

```typescript
mode: 'PREDICTION',
```

**Backend needed:**

```bash
py prediction_api.py
```

**Features:**

- ❌ No permanent storage
- ✅ Real-time predictions
- ✅ Shows prediction button

---

### 3️⃣ BOTH

**Use for:** Full system (data + predictions)

```typescript
mode: 'BOTH',
```

**Backends needed:**

```bash
# Terminal 1
py app.py

# Terminal 2
py prediction_api.py
```

**Features:**

- ✅ Records to CSV/JSON
- ✅ Real-time predictions
- ✅ All features enabled

---

## ✅ Verification

After changing mode, check browser console for:

```
🎮 GAME CONFIGURATION
Mode: [YOUR_MODE]
Description: [Mode description]
```

---

## 🎓 Common Workflows

### Initial Setup (Collecting Data)

1. Set `mode: 'DATA_COLLECTION'`
2. Run `py app.py`
3. Play game to collect data
4. Run `py train_model.py` when ready

### Production (After Training)

1. Set `mode: 'PREDICTION'`
2. Run `py prediction_api.py`
3. Users get real-time predictions

### Testing Full System

1. Set `mode: 'BOTH'`
2. Run both backends
3. Test all features

---

**That's it! One line change switches the entire system behavior.** 🎯
