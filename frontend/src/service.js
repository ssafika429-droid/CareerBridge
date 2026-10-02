import { DEMO_RESULT } from "./data.js";

const baseUrl = (import.meta.env.VITE_LANGFLOW_BASE_URL || "").replace(/\/$/, "");
const flowId = import.meta.env.VITE_LANGFLOW_FLOW_ID || "";
export const MODE = baseUrl && flowId ? "langflow" : "demo";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const splitList = (value) => value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);

const parseJson = (value) => {
  try {
    return JSON.parse(String(value).trim().replace(/^```(?:json)?|```$/g, "").trim());
  } catch {
    return null;
  }
};

export const buildLevel1Message = (form) => JSON.stringify({
  profile: form.profile,
  education: form.education,
  skills: splitList(form.skills),
  projects: form.projects ? [form.projects] : [],
  certifications: form.certifications ? [form.certifications] : [],
  target_role: form.target_role,
  job_description: form.job_description,
});

export async function analyze(form) {
  if (MODE === "demo") {
    await delay(650);
    return { ...DEMO_RESULT, mode: "demo" };
  }

  const response = await fetch(`${baseUrl}/api/v1/run/${flowId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input_value: buildLevel1Message(form), input_type: "chat", output_type: "chat" }),
  });
  if (!response.ok) throw new Error(`Langflow returned HTTP ${response.status}.`);

  const payload = await response.json();
  const outputs = (payload.outputs?.[0]?.outputs || [])
    .map((output) => parseJson(output?.results?.message?.text))
    .filter(Boolean);
  const analysis = outputs.find((output) => Array.isArray(output.skill_gaps));
  const plan = outputs.find((output) => Array.isArray(output.training_plan));
  if (!analysis) throw new Error("Langflow response did not contain Career Analysis JSON.");
  return { analysis, plan: plan || null, mode: "langflow" };
}

export async function createCalendarEvent(event) {
  if (MODE === "demo") {
    await delay(500);
    return { demo: true, event };
  }
  throw new Error("Calendar automation is not connected. Level 3 requires configuration in Langflow.");
}
