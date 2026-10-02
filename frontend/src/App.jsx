import { createContext, useContext, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { BarChart3, ClipboardCheck, Compass, Home, Sparkles } from "lucide-react";
import { Action, Assessment, Landing, Progress, Result } from "./pages.jsx";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const navItems = [
  ["/", "Home", Home],
  ["/assessment", "Assessment", ClipboardCheck],
  ["/result", "Analysis", Sparkles],
  ["/action", "Development", Compass],
  ["/progress", "Progress", BarChart3],
];

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <AppContext.Provider value={{ result, setResult }}>
      <div className="app-shell">
        <header className="topbar">
          <NavLink to="/" className="brand" aria-label="CareerBridge AI home">
            <span className="brand-mark" aria-hidden="true">CB</span>
            <span>CareerBridge <b>AI</b></span>
          </NavLink>
          <nav aria-label="Primary navigation">
            {navItems.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === "/"} className="nav-link">
                <Icon size={17} strokeWidth={2} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/result" element={<Result />} />
            <Route path="/action" element={<Action />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
        <footer>CareerBridge provides career development guidance and does not make hiring decisions.</footer>
      </div>
    </AppContext.Provider>
  );
}
