# Frontend Migration Playbook: Dyslexia Screening UI (Vite + React)

This document instructs a GitHub Copilot coding agent to move the existing Vite + React frontend into the destination "full Research project" repository, integrate it with the Node.js gateway and Python NLP service, and validate end-to-end functionality.

---

## Summary

- UI stack: Vite 5 + React 18 (client-ui)
- Dev port: 3000 (Vite), Gateway: 3001 (Express), Python NLP: 5000 (`/analyze`)
- Primary entry: client/index.html → client/src/main.jsx → client/src/App.jsx → client/src/Recorder.jsx
- Frontend expects `VITE_GATEWAY_URL` pointing to the gateway endpoint (`http://localhost:3001/api/analyze` by default).
- Gateway forwards audio + metadata to Python service; optionally persists to MongoDB if `MONGODB_URI` is set.

---

## Desired Destination Layout

If the destination repo does not already have a web client, create a new top-level package:

```
<repo-root>/client/
  index.html
  package.json
  vite.config.js
  src/
    App.jsx
    main.jsx
    Recorder.jsx
```

If an existing client exists, either:
- Merge the above files into the existing client (preserving existing routes/components), or
- Create a dedicated sub-app (e.g., `apps/client-ui`) and link in workspace tooling.

---

## Files To Add/Update

Add or update the following files exactly as shown from the source workspace:

- client/package.json
- client/vite.config.js
- client/index.html
- client/src/main.jsx
- client/src/App.jsx
- client/src/Recorder.jsx

If the repo already contains a client folder, reconcile dependencies and scripts rather than overwriting.

---

## Dependencies & Scripts

From client/package.json:

- Dependencies: `react`, `react-dom`
- Dev dependencies: `vite`, `@vitejs/plugin-react`
- Scripts: `dev: vite`

Optionally add:

```
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

Install:

```bash
npm install
```

---

## Vite Config & Dev Server

From client/vite.config.js:

- Port: 3000
- Plugins: `@vitejs/plugin-react`

Proxy is not required because the server enables CORS, but may be added for convenience:

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  }
});
```

If you enable the proxy, set `VITE_GATEWAY_URL` to `/api/analyze`.

---

## Environment Variables

Frontend:

- `VITE_GATEWAY_URL` (optional): endpoint to POST audio, defaults to `http://localhost:3001/api/analyze`.

Create client `.env.local` in the destination repo:

```env
VITE_GATEWAY_URL=http://localhost:3001/api/analyze
```

Gateway (Node.js):

- `PORT`: defaults to 3001
- `PY_SERVICE_URL`: defaults to `http://localhost:5000/analyze`
- `MONGODB_URI`: optional, enables persistence

Python service:

- Exposes `POST /analyze` on port 5000

---

## Backend Expectations (for Integration)

The gateway defines:

- `GET /health` → `{ status: "ok" }`
- `POST /api/analyze` → forwards multipart form (`audio`, `target_word`) to Python `/analyze` and returns JSON result

The Python service must accept the same form fields and return JSON with keys used by the gateway (e.g., `transcription`, `fluency_score`, `errors`).

---

## Step-by-Step Migration

1. Create or select the destination client folder
   - If none exists, create `<repo-root>/client/` and add files listed above.
   - If an existing client exists, add `Recorder.jsx` and integrate it into the host app’s main route or page.

2. Copy source files
   - Preserve imports and relative paths as-is.

3. Merge package.json dependencies
   - Add `react`, `react-dom`, `vite`, `@vitejs/plugin-react` if missing.
   - Avoid downgrading versions; align with repo standards as needed.

4. Configure environment
   - Add `.env.local` with `VITE_GATEWAY_URL` pointing to the gateway.
   - Ensure gateway `.env` includes `PORT`, `PY_SERVICE_URL`, and (optionally) `MONGODB_URI`.

5. Validate dev run
   - Start Python service on port 5000.
   - Start gateway on port 3001.
   - Start client on port 3000.

6. Integrate UI into existing app shell (if applicable)
   - Render `<Recorder />` within the host app’s layout.
   - Ensure microphone permissions are handled via browser prompt.

7. Optional: add Vite proxy
   - If added, set `VITE_GATEWAY_URL=/api/analyze` and confirm requests route correctly.

8. Build & Preview
   - Add `build` and `preview` scripts if needed.
   - Run `npm run build` and `npm run preview`.

---

## Run Commands (Local)

Start Python NLP service:

```bash
# From nlp-engine
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

Start Gateway:

```bash
# From server
npm install
# optional: set envs in .env
# PORT=3001
# PY_SERVICE_URL=http://localhost:5000/analyze
# MONGODB_URI=mongodb+srv://...
npm run dev
```

Start Client:

```bash
# From client
npm install
# optional: set VITE_GATEWAY_URL in .env.local
npm run dev
```

---

## Acceptance Checklist

- Client boots on port 3000 without console errors
- Microphone prompt appears, recording starts/stops reliably
- `POST VITE_GATEWAY_URL` receives audio and returns JSON
- UI displays returned JSON (transcription, fluency, errors) in `<pre>`
- With MongoDB configured, attempts are persisted (verify via logs)
- `GET /health` returns `{ status: "ok" }`
- Build completes (`npm run build`), and preview serves the static build

---

## Pull Request Guidance

- Create branch `feature/frontend-dyslexia-screening`
- Commit copied files and config updates with clear messages
- Include this playbook in the repo (e.g., `MIGRATION_FRONTEND.md`)
- In PR description, include the Acceptance Checklist above
- Link to any environment setup changes

---

## Notes & Contingencies

- If the existing frontend uses a different framework (Next.js, CRA), port the `Recorder` logic and API integration while retaining the framework’s structure.
- If the destination repo is a monorepo, add `client` as a workspace and wire scripts in the root package.
- If CORS becomes an issue, prefer Vite `server.proxy` as shown above.
- Audio format: current UI uses `MediaRecorder` producing `audio/webm`; ensure gateway and Python accept this or convert in the gateway.
