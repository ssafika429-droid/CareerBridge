import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "./App.jsx";
import { analyze, createCalendarEvent, MODE } from "./service.js";
import { DEMO_RESULT, DEMO_PROGRESS, SAMPLE_INPUT } from "./data.js";

const Badge = ({ kind, children }) => <span className={`badge ${kind}`}>{children}</span>;
const prio = (p) => (p === "High" ? "high" : p === "Medium" ? "mid" : "low");
const useResult = () => { const { result } = useApp(); return result || { ...DEMO_RESULT, mode: "demo" }; };
const DemoTag = ({ r }) => (r.mode === "demo" ? <Badge kind="demo">Demo data</Badge> : null);

export function Landing() {
  const flow = ["Profile", "Skill Analysis", "Skill Gap", "Learning Roadmap"];
  const steps = [
    ["Build Your Profile", "Share your education, skills, projects, and target role."],
    ["Analyze Your Skills", "Skills are identified only from what you provide, with evidence."],
    ["Discover Skill Gaps", "Each gap explains why it is a gap and how important it is."],
    ["Take Action", "Turn recommendations into a 4-week plan and scheduled sessions."],
  ];
  return (<>
    <section className="hero">
      <div>
        <h1>CareerBridge AI</h1>
        <p className="sub">AI Career Readiness &amp; Skill Gap Navigator</p>
        <p className="lead">Understand your current skills, discover career gaps, and build a personalized path toward your target role.</p>
        <Link to="/assessment" className="btn">Start Career Analysis</Link>
        <p className="note">CareerBridge provides development guidance, not hiring decisions.</p>
      </div>
      <ol className="flow" aria-label="Analysis flow">
        {flow.map((f, i) => <li key={f}><span>{f}</span>{i < flow.length - 1 && <i aria-hidden="true">→</i>}</li>)}
      </ol>
    </section>
    <section>
      <h2>How CareerBridge Works</h2>
      <div className="grid4">{steps.map(([t, d], i) => (
        <div className="card" key={t}><span className="step">{i + 1}</span><h3>{t}</h3><p>{d}</p></div>))}
      </div>
    </section>
  </>);
}

export function Assessment() {
  const { setResult } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ profile: "", education: "", skills: "", projects: "", certifications: "", target_role: "", job_description: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { setResult(await analyze(f)); nav("/result"); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  const field = (k, label, ph, rows) => (
    <label className="field"><span>{label}</span>
      {rows ? <textarea rows={rows} value={f[k]} onChange={set(k)} placeholder={ph} /> : <input value={f[k]} onChange={set(k)} placeholder={ph} />}
    </label>);
  return (
    <form className="page" onSubmit={submit}>
      <h1>Career Assessment</h1>
      <p className="muted">Only what you write here is analyzed. Do not include sensitive personal attributes.</p>
      <button type="button" className="btn btn-ghost" onClick={() => setF(SAMPLE_INPUT)}>Load sample profile</button>
      <fieldset className="card"><legend><span className="step">1</span>Profile</legend>
        {field("profile", "Profile", "Tell us about yourself...", 3)}
        {field("education", "Education", "Example: S1 Informatika")}
        {field("skills", "Skills", "Example: HTML, CSS, JavaScript, React, Git", 2)}
        {field("projects", "Experience / Projects", "Describe projects or experience...", 4)}
        {field("certifications", "Certifications", "List certifications if any", 2)}
      </fieldset>
      <fieldset className="card"><legend><span className="step">2</span>Career Target</legend>
        {field("target_role", "Target Role", "Example: Junior Front-End Developer")}
      </fieldset>
      <fieldset className="card"><legend><span className="step">3</span>Job Description</legend>
        {field("job_description", "Job Description", "Paste the job description...", 7)}
      </fieldset>
      {err && <p className="error" role="alert">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Analyzing your career profile..." : "Analyze My Career"}</button>
    </form>);
}

export function Result() {
  const r = useResult(); const a = r.analysis; const plan = r.plan;
  const gaps = new Set(a.skill_gaps.map((g) => g.skill));
  return (
    <div className="page">
      <div className="row"><h1>Career Analysis</h1><DemoTag r={r} /></div>
      <section className="card"><h2>Career Summary</h2><p>{a.career_summary}</p><p className="muted">Target role: {a.target_role}</p></section>
      <section><h2>Skills Identified</h2><div className="chips">{a.detected_skills.map((s) => <Badge key={s} kind="chip">{s}</Badge>)}</div></section>
      <section><h2>Skill Match</h2>
        <div className="table" role="table">
          {a.matched_skills.map((m) => (<div className="tr" role="row" key={m.skill}><b>{m.skill}</b><Badge kind="ok">Matched</Badge><em>“{m.evidence}”</em></div>))}
          {[...gaps].map((g) => (<div className="tr" role="row" key={g}><b>{g}</b><Badge kind="gap">Gap</Badge><em>No evidence provided.</em></div>))}
        </div></section>
      <section><h2>Skill Gaps</h2><div className="grid2">{a.skill_gaps.map((g) => (
        <div className="card" key={g.skill}>
          <div className="row"><h3>{g.skill}</h3><Badge kind={prio(g.priority)}>{g.priority} priority</Badge></div>
          <p><b>Why this is a gap:</b> {g.reason}</p>
          <p className="muted"><b>Evidence:</b> “{g.evidence}”</p>
          <Badge kind="val">Needs Validation</Badge>
        </div>))}</div></section>
      <section><h2>Development Recommendations</h2><div className="grid2">{a.recommendations.map((t) => <div className="card" key={t}>{t}</div>)}</div></section>
      {plan && <section><h2>4-Week Roadmap</h2><div className="grid4">{plan.training_plan.map((w) => (
        <div className="card" key={w.week}><span className="step">W{w.week}</span><h3>{w.focus}</h3><p>{w.goal}</p>
          <ul>{w.actions.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="muted">Deliverable: {w.deliverable}</p><p className="muted">{w.estimated_time}</p></div>))}</div>
        <p className="muted">{plan.validation_note}</p></section>}
      <section><h2>Validation Questions</h2><ul className="card qlist">{a.validation_questions.map((q) => <li key={q}>{q}</li>)}</ul>
        <p className="muted">{a.uncertainty_note}</p></section>
      <section className="card rai"><h2>Responsible AI Note</h2><p>{a.responsible_ai_note}</p></section>
      <Link to="/action" className="btn">Turn Recommendations Into Action</Link>
    </div>);
}

export function Action() {
  const r = useResult();
  const [planned, setPlanned] = useState({});
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState("");
  const cards = r.analysis.skill_gaps.map((g, i) => ({ skill: g.skill, text: r.analysis.recommendations[i] || g.reason }));
  return (
    <div className="page">
      <div className="row"><h1>Turn Recommendations Into Action</h1><DemoTag r={r} /></div>
      <div className="grid2">{cards.map((c) => (
        <div className="card" key={c.skill}><h3>Learn {c.skill}</h3><p>{c.text}</p>
          <div className="actions">
            <button className="btn btn-sm" onClick={() => setModal(c)}>Schedule Learning</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setNote("Resource search belongs to Level 3 and is not connected in this interface.")}>View Resources</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setPlanned({ ...planned, [c.skill]: !planned[c.skill] })}>{planned[c.skill] ? "Planned ✓" : "Mark as Planned"}</button>
          </div></div>))}</div>
      {note && <p className="muted">{note}</p>}
      {modal && <Schedule item={modal} onClose={() => setModal(null)} />}
    </div>);
}

function Schedule({ item, onClose }) {
  const [e, setE] = useState({ title: `Learn ${item.skill}`, date: "", start: "", end: "" });
  const [st, setSt] = useState({ s: "idle", m: "" });
  const go = async () => {
    setSt({ s: "busy", m: "Creating event..." });
    try { const x = await createCalendarEvent(e);
      setSt({ s: "ok", m: x.demo ? "Event successfully added to Google Calendar. (Demo: no real event was created.)" : "Event successfully added to Google Calendar." });
    } catch (x) { setSt({ s: "err", m: x.message }); }
  };
  const inp = (k, label, type = "text") => (<label className="field"><span>{label}</span><input type={type} value={e[k]} onChange={(v) => setE({ ...e, [k]: v.target.value })} /></label>);
  return (
    <div className="overlay" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" onClick={(x) => x.stopPropagation()}>
      <h3>Schedule Learning</h3>{inp("title", "Event title")}{inp("date", "Date", "date")}{inp("start", "Start time", "time")}{inp("end", "End time", "time")}
      {st.m && <p className={st.s === "err" ? "error" : st.s === "ok" ? "okmsg" : "muted"} role="status">{st.m}</p>}
      <div className="actions"><button className="btn" onClick={go} disabled={st.s === "busy"}>Create Google Calendar Event</button><button className="btn btn-ghost" onClick={onClose}>Close</button></div>
    </div></div>);
}

export function Progress() {
  const d = DEMO_PROGRESS;
  const kind = { Established: "ok", Developing: "mid", Planned: "val" };
  return (
    <div className="page">
      <div className="row"><h1>My Career Progress</h1><Badge kind="demo">Demo data</Badge></div>
      <p className="muted">No progress API is connected. The values below are sample data.</p>
      <section className="card"><h2>Career Goal</h2><p>{d.target_role}</p></section>
      <section><h2>Skill Progress</h2><div className="grid3">{d.skills.map((s) => (
        <div className="card" key={s.skill}><h3>{s.skill}</h3><Badge kind={kind[s.status]}>{s.status}</Badge></div>))}</div></section>
      <section><h2>Learning Progress</h2><div className="grid3">{Object.entries(d.learning).map(([k, v]) => (
        <div className="card" key={k}><h3>{k}</h3><ul>{v.map((x) => <li key={x}>{x}</li>)}</ul></div>))}</div></section>
      <section className="card"><h2>Next Development Focus</h2><ul>{d.next_focus.map((x) => <li key={x}>{x}</li>)}</ul></section>
    </div>);
}
