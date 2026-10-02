import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarPlus, Check, ExternalLink, LoaderCircle, Play, ShieldCheck, Sparkles, X } from "lucide-react";
import { useApp } from "./App.jsx";
import { DEMO_PROGRESS, DEMO_RESULT, SAMPLE_INPUT } from "./data.js";
import { analyze, createCalendarEvent } from "./service.js";

const Badge = ({ kind, children }) => <span className={`badge ${kind}`}>{children}</span>;
const priorityClass = (priority) => ({ High: "high", Medium: "mid", Low: "low" }[priority] || "low");
const useResult = () => useApp().result || { ...DEMO_RESULT, mode: "demo" };
const DemoTag = ({ result }) => result.mode === "demo" ? <Badge kind="demo">Demo data</Badge> : <Badge kind="live">Langflow</Badge>;

export function Landing() {
  return <>
    <section className="hero-band">
      <div className="hero-copy">
        <Badge kind="eyebrow"><Sparkles size={14} /> Career development guidance</Badge>
        <h1>CareerBridge AI</h1>
        <p className="hero-title">AI Career Readiness and Skill Gap Navigator</p>
        <p className="lead">Turn your experience into evidence, understand skill gaps for your target role, and focus on a practical development path.</p>
        <div className="hero-actions">
          <Link to="/assessment" className="button primary">Start career analysis <ArrowRight size={18} /></Link>
          <Link to="/progress" className="button secondary">View progress</Link>
        </div>
        <p className="disclaimer"><ShieldCheck size={16} /> CareerBridge provides development guidance and does not make hiring decisions.</p>
      </div>
      <div className="hero-visual" aria-label="Career development workflow">
        <div className="visual-window">
          <div className="visual-dots"><i /><i /><i /></div>
          <div className="visual-content">
            <span className="tiny-label">CAREER DEVELOPMENT</span>
            <div className="skill-line"><b>Profile evidence</b><span>Ready</span></div>
            <div className="skill-line"><b>Skill match</b><span>7 skills</span></div>
            <div className="skill-line focus"><b>Development focus</b><span>2 areas</span></div>
            <div className="roadmap-mini"><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
    </section>
    <section className="section wrap">
      <div className="section-heading"><span className="eyebrow-text">A simple path</span><h2>From profile to next step</h2></div>
      <div className="process-grid">
        {["Share your profile", "Review skill evidence", "Identify development focus", "Build a four-week roadmap"].map((title, index) => <article className="process-item" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{index === 0 ? "Education, skills, project work, and the role you are targeting." : index === 1 ? "CareerBridge shows where each matched skill came from." : index === 2 ? "Gaps use insufficient evidence when your profile does not support a conclusion." : "Convert your focus areas into a practical development plan."}</p></article>)}
      </div>
    </section>
  </>;
}

export function Assessment() {
  const { setResult } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ profile: "", education: "", skills: "", projects: "", certifications: "", target_role: "", job_description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const field = (key, label, placeholder, rows) => <label className="field"><span>{label}</span>{rows ? <textarea rows={rows} value={form[key]} onChange={update(key)} placeholder={placeholder} /> : <input value={form[key]} onChange={update(key)} placeholder={placeholder} />}</label>;
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError("");
    try { setResult(await analyze(form)); navigate("/result"); } catch (reason) { setError(reason.message); } finally { setBusy(false); }
  };
  return <form className="page wrap assessment" onSubmit={submit}>
    <div className="page-title"><span className="eyebrow-text">Level 1</span><h1>Career assessment</h1><p>Only the details you provide are analyzed. Do not include sensitive personal attributes.</p></div>
    <button type="button" className="button secondary sample-button" onClick={() => setForm(SAMPLE_INPUT)}><Play size={16} /> Load sample profile</button>
    <fieldset><legend><span>01</span> Your profile</legend><div className="form-grid">{field("profile", "Profile", "Tell us about your background...", 4)}{field("education", "Education", "Example: S1 Informatika")}{field("skills", "Skills", "Example: HTML, CSS, JavaScript, React, Git", 3)}{field("projects", "Experience and projects", "Describe what you built and your contribution...", 5)}{field("certifications", "Certifications", "List training or certifications, if any", 3)}</div></fieldset>
    <fieldset><legend><span>02</span> Career target</legend>{field("target_role", "Target role", "Example: Junior Front-End Developer")}</fieldset>
    <fieldset><legend><span>03</span> Job description</legend>{field("job_description", "Role requirements", "Paste the relevant job description...", 8)}</fieldset>
    {error && <p className="message error" role="alert">{error}</p>}
    <button className="button primary submit-button" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={18} /> Analyzing profile</> : <>Analyze my career <ArrowRight size={18} /></>}</button>
  </form>;
}

export function Result() {
  const result = useResult(); const analysis = result.analysis; const plan = result.plan;
  return <div className="page wrap result-page">
    <div className="page-title inline-title"><div><span className="eyebrow-text">Assessment output</span><h1>Career analysis</h1></div><DemoTag result={result} /></div>
    <section className="summary-panel"><div><span className="tiny-label">TARGET ROLE</span><h2>{analysis.target_role}</h2><p>{analysis.career_summary}</p></div><div className="summary-count"><b>{analysis.detected_skills.length}</b><span>Skills identified</span></div></section>
    <Section title="Skills identified"><div className="chips">{analysis.detected_skills.map((skill) => <Badge key={skill} kind="chip">{skill}</Badge>)}</div></Section>
    <Section title="Skill match"><div className="evidence-list">{analysis.matched_skills.map((item) => <div className="evidence-item" key={item.skill}><div><b>{item.skill}</b><span>{item.source_section}</span></div><p>{item.evidence}</p><Badge kind="ok">Matched</Badge></div>)}</div></Section>
    <Section title="Development focus"><div className="gap-grid">{analysis.skill_gaps.map((gap) => <article className="gap-card" key={gap.skill}><div className="card-top"><h3>{gap.skill}</h3><Badge kind={priorityClass(gap.priority)}>{gap.priority} priority</Badge></div><p>{gap.reason}</p><div className="evidence-note"><b>Evidence</b><span>{gap.evidence}</span></div><Badge kind="validation">Needs validation</Badge></article>)}</div></Section>
    <Section title="Recommendations"><div className="recommendations">{analysis.recommendations.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></Section>
    {plan && <Section title="Four-week roadmap"><div className="roadmap">{plan.training_plan.map((week) => <article key={week.week}><span>WEEK {week.week}</span><h3>{week.focus}</h3><p>{week.goal}</p><ul>{week.actions.map((action) => <li key={action}>{action}</li>)}</ul><footer>{week.deliverable}<br />{week.estimated_time}</footer></article>)}</div><p className="section-note">{plan.validation_note}</p></Section>}
    <Section title="Validation questions"><ul className="question-list">{analysis.validation_questions.map((question) => <li key={question}>{question}</li>)}</ul><p className="section-note">{analysis.uncertainty_note}</p></Section>
    <section className="responsible-note"><ShieldCheck size={22} /><div><h2>Responsible AI note</h2><p>{analysis.responsible_ai_note}</p></div></section>
    <Link to="/action" className="button primary">Turn recommendations into action <ArrowRight size={18} /></Link>
  </div>;
}

const Section = ({ title, children }) => <section className="content-section"><h2>{title}</h2>{children}</section>;

export function Action() {
  const result = useResult(); const [planned, setPlanned] = useState({}); const [schedule, setSchedule] = useState(null); const [notice, setNotice] = useState("");
  return <div className="page wrap"><div className="page-title inline-title"><div><span className="eyebrow-text">Development</span><h1>Turn insight into action</h1><p>Plan your next learning step. Calendar automation requires Level 3 configuration in Langflow.</p></div><DemoTag result={result} /></div>
    <div className="action-grid">{result.analysis.skill_gaps.map((gap, index) => <article className="action-card" key={gap.skill}><Badge kind={priorityClass(gap.priority)}>{gap.priority} priority</Badge><h2>Develop {gap.skill}</h2><p>{result.analysis.recommendations[index] || gap.reason}</p><div className="action-buttons"><button className="icon-button" title="Schedule learning" aria-label={`Schedule learning for ${gap.skill}`} onClick={() => setSchedule(gap)}><CalendarPlus size={18} /></button><button className="icon-button" title="View resources" aria-label={`View resources for ${gap.skill}`} onClick={() => setNotice("Resource search is available through Level 3 after its Langflow configuration is verified.")}><ExternalLink size={18} /></button><button className={planned[gap.skill] ? "icon-button selected" : "icon-button"} title="Mark as planned" aria-label={`Mark ${gap.skill} as planned`} onClick={() => setPlanned({ ...planned, [gap.skill]: !planned[gap.skill] })}>{planned[gap.skill] ? <Check size={18} /> : <Sparkles size={18} />}</button></div></article>)}</div>
    {notice && <p className="message neutral">{notice}</p>}
    {schedule && <ScheduleDialog gap={schedule} onClose={() => setSchedule(null)} />}
  </div>;
}

function ScheduleDialog({ gap, onClose }) {
  const [event, setEvent] = useState({ title: `Learn ${gap.skill}`, date: "", start: "", end: "" }); const [state, setState] = useState({ type: "", text: "" });
  const update = (key) => (input) => setEvent({ ...event, [key]: input.target.value });
  const submit = async () => { setState({ type: "", text: "" }); try { const result = await createCalendarEvent(event); setState({ type: "success", text: result.demo ? "Demo event prepared. No Google Calendar event was created." : "Calendar event created." }); } catch (reason) { setState({ type: "error", text: reason.message }); } };
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className="close-button" title="Close dialog" aria-label="Close dialog" onClick={onClose}><X size={18} /></button><h2 id="dialog-title">Schedule learning</h2><p>Schedule a session for {gap.skill}.</p><label className="field"><span>Event title</span><input value={event.title} onChange={update("title")} /></label><div className="time-grid"><label className="field"><span>Date</span><input type="date" value={event.date} onChange={update("date")} /></label><label className="field"><span>Start</span><input type="time" value={event.start} onChange={update("start")} /></label><label className="field"><span>End</span><input type="time" value={event.end} onChange={update("end")} /></label></div>{state.text && <p className={`message ${state.type}`}>{state.text}</p>}<div className="dialog-actions"><button className="button primary" onClick={submit}>Create calendar event</button><button className="button secondary" onClick={onClose}>Close</button></div></section></div>;
}

export function Progress() {
  return <div className="page wrap"><div className="page-title inline-title"><div><span className="eyebrow-text">Personalization preview</span><h1>My career progress</h1><p>Progress data is a demo view. Level 2 data synchronization is not connected.</p></div><Badge kind="demo">Demo data</Badge></div>
    <section className="summary-panel"><div><span className="tiny-label">CAREER GOAL</span><h2>{DEMO_PROGRESS.target_role}</h2></div><div className="summary-count"><b>2</b><span>Learning records</span></div></section>
    <Section title="Skill progress"><div className="progress-grid">{DEMO_PROGRESS.skills.map((item) => <article key={item.skill}><h3>{item.skill}</h3><Badge kind={item.status === "Established" ? "ok" : item.status === "Developing" ? "mid" : "validation"}>{item.status}</Badge></article>)}</div></Section>
    <Section title="Learning progress"><div className="learning-grid">{Object.entries(DEMO_PROGRESS.learning).map(([status, entries]) => <article key={status}><h3>{status === "InProgress" ? "In progress" : status}</h3><ul>{entries.map((entry) => <li key={entry}>{entry}</li>)}</ul></article>)}</div></Section>
    <Section title="Next development focus"><div className="chips">{DEMO_PROGRESS.next_focus.map((item) => <Badge key={item} kind="chip">{item}</Badge>)}</div></Section>
  </div>;
}
