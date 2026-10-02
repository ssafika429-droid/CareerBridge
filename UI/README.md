# CareerBridge AI — Frontend (demo interface)

React + Vite interface for the CareerBridge AI hackathon demo. It does not change any Langflow flow and has no backend of its own.

## Run

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Modes

- **Demo (default):** leave `VITE_LANGFLOW_BASE_URL` and `VITE_LANGFLOW_FLOW_ID` empty. All results are hand-written sample data (`src/data.js`), labeled "Demo data" in the UI.
- **Langflow:** copy `.env.example` to `.env`, set both variables to your Langflow URL and the Flow 1 ID, then restart `npm run dev`. Never put API keys in `VITE_` variables (they are visible in the browser).

## Status

| Part | Status |
|---|---|
| All 5 pages and forms | Working in demo mode |
| Langflow call for Flow 1 (`src/service.js`, `analyze`) | **Written, NOT tested against a live Langflow.** It sends the 7-key JSON as one Chat Input message and reads the two Chat Output texts |
| Google Calendar | **Mock only.** Demo mode simulates a result; Langflow mode returns "not connected" because no Composio call exists |
| Resource search, Progress page | **Mock only** (sample data) |
| Level 2 and Level 3 flows | Not called from this interface |
