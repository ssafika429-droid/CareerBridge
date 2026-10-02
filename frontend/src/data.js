export const SAMPLE_INPUT = {
  profile: "Informatics student with experience developing web applications.",
  education: "S1 Informatika",
  skills: "HTML, CSS, JavaScript, React, Git, REST API, Figma",
  projects: "Developed a website catalog using React and REST API. Developed an organizational event website using HTML, CSS, and JavaScript. Improved responsive interface based on Figma design.",
  certifications: "Basic JavaScript training and web development training.",
  target_role: "Junior Front-End Developer",
  job_description: "Looking for a Junior Front-End Developer with knowledge of HTML, CSS, JavaScript, React, REST API, Git, responsive design, basic testing, and web accessibility.",
};

export const DEMO_RESULT = {
  analysis: {
    status: "ok",
    target_role: "Junior Front-End Developer",
    career_summary: "Your profile shows evidence of core front-end development skills through web projects, including React, REST API integration, and responsive interface work. The development focus below is based only on the provided role description and profile.",
    detected_skills: ["HTML", "CSS", "JavaScript", "React", "Git", "REST API", "Figma"],
    matched_skills: [
      { skill: "React", evidence: "Developed a website catalog using React and REST API.", source_section: "projects" },
      { skill: "REST API", evidence: "Developed a website catalog using React and REST API.", source_section: "projects" },
      { skill: "Responsive design", evidence: "Improved responsive interface based on Figma design.", source_section: "projects" },
      { skill: "HTML, CSS, JavaScript", evidence: "Developed an organizational event website using HTML, CSS, and JavaScript.", source_section: "projects" },
      { skill: "Git", evidence: "Listed in the skills provided.", source_section: "skills" },
    ],
    skill_gaps: [
      { skill: "Basic testing", reason: "The job description requests basic testing, but no testing evidence was provided.", evidence: "insufficient evidence", priority: "High" },
      { skill: "Web accessibility", reason: "The job description requests web accessibility, but no accessibility evidence was provided.", evidence: "insufficient evidence", priority: "High" },
    ],
    recommendations: [
      "Create a small React component test and record the behavior it validates.",
      "Review one existing project for semantic structure, keyboard use, and alternative text, then document the changes.",
    ],
    validation_questions: [
      "Have you written tests for any front-end component or feature? If so, add the project and evidence.",
      "Have you applied accessibility practices in a project? If so, describe the specific changes.",
    ],
    uncertainty_note: "Testing and accessibility are shown as development focus because the supplied profile contains insufficient evidence for them.",
    responsible_ai_note: "This analysis is career development guidance based on the information you supplied. It does not make hiring decisions.",
  },
  plan: {
    status: "ok",
    target_role: "Junior Front-End Developer",
    training_plan: [
      { week: 1, focus: "Testing basics", goal: "Identify a testable component in an existing React project.", actions: ["Choose one existing component", "Write down its expected behavior"], deliverable: "A documented test scenario", estimated_time: "2-3 hours" },
      { week: 2, focus: "Testing practice", goal: "Practice validating the selected component behavior.", actions: ["Implement one focused component test", "Record the outcome"], deliverable: "One test and a short evidence note", estimated_time: "2-3 hours" },
      { week: 3, focus: "Accessibility review", goal: "Review an existing page for basic accessibility improvements.", actions: ["Check headings and semantic elements", "Check keyboard interaction and image text alternatives"], deliverable: "Accessibility review notes", estimated_time: "2-3 hours" },
      { week: 4, focus: "Portfolio evidence", goal: "Document the improvements made to an existing project.", actions: ["Summarize testing and accessibility changes", "Update project description with verified evidence"], deliverable: "A concise project evidence update", estimated_time: "2-3 hours" },
    ],
    validation_note: "Review and adapt this plan to your actual project context before using it.",
  },
};

export const DEMO_PROGRESS = {
  target_role: "Junior Front-End Developer",
  skills: [
    { skill: "React", status: "Developing" },
    { skill: "JavaScript", status: "Established" },
    { skill: "Basic testing", status: "Planned" },
    { skill: "Web accessibility", status: "Planned" },
  ],
  learning: {
    Completed: ["JavaScript Fundamentals"],
    InProgress: ["React Fundamentals"],
  },
  next_focus: ["Basic testing", "Web accessibility"],
};
