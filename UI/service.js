import { DEMO_RESULT } from "./data.js";

const BASE = (import.meta.env.VITE_LANGFLOW_BASE_URL || "").replace(/\/$/, "");
const FLOW = import.meta.env.VITE_LANGFLOW_FLOW_ID || "";
export const MODE = BASE && FLOW ? "langflow" : "demo";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const splitList = (s) => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
const tryJson = (t) => {
  try { return JSON.parse(String(t).trim().replace(/^```(?:json)?|```$/g, "").trim()); } catch { return null; }
};

// Builds the single Chat Input message that level-1-careerbridge-main.json expects (7 keys).
export const buildLevel1Message = (f) =>
  JSON.stringify({
    profile: f.profile, education: f.education, skills: splitList(f.skills),
    projects: f.projects ? [f.projects] : [], certifications: f.certifications ? [f.certifications] : [],
    target_role: f.target_role, job_description: f.job_description,
  });

// Calls Langflow's run endpoint. NOT VERIFIED against a live Langflow yet.
// Flow 1 has two Chat Outputs: analysis JSON and 4-week plan JSON.
export async function analyze(form) {
  if (MODE === "demo") { await wait(1400); return { ...DEMO_RESULT, mode: "demo" }; }
  const res = await fetch(`${BASE}/api/v1/run/${FLOW}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input_value: buildLevel1Message(form), input_type: "chat", output_type: "chat" }),
  });
  if (!res.ok) throw new Error(`Langflow returned HTTP ${res.status}`);
  const data = await res.json();
  const parsed = (data.outputs?.[0]?.outputs || []).map((o) => tryJson(o?.results?.message?.text)).filter(Boolean);
  const analysis = parsed.find((p) => p.skill_gaps);
  const plan = parsed.find((p) => p.training_plan);
  if (!analysis) throw new Error("Langflow response did not contain a Career Analysis JSON.");
  return { analysis, plan: plan || null, mode: "langflow" };
}

// Integration layer for Level 3 (Composio Google Calendar). Nothing is implemented here:
// the Composio node in level-3-action-automation.json is not connected yet.
export async function createCalendarEvent(event) {
  if (MODE === "demo") { await wait(1200); return { demo: true, event }; }
  throw new Error("Google Calendar account is not connected.");
}
