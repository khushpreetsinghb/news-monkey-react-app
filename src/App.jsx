import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import SearchPage from './components/SearchPage';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';
import './App.css';

const CATEGORIES = ["general", "world", "nation", "business", "entertainment", "health", "science", "sports", "technology"];

const getInitialTheme = () => {
  const saved = localStorage.getItem("nm-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const App = () => {
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("nm-theme", theme);
  }, [theme]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar theme={theme} onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
      <LoadingBar height={3} color="#4f7cff" progress={progress} />
      <div className="nm-page">
        <Routes>
          <Route path="/" element={<News setProgress={setProgress} key="general-home" country="us" category="general" />} />
          {CATEGORIES.filter((c) => c !== "general").map((c) => (
            <Route key={c} path={`/${c}`} element={<News setProgress={setProgress} key={c} country="us" category={c} />} />
          ))}
          <Route path="/search" element={<SearchPage setProgress={setProgress} />} />
          <Route path="*" element={<News setProgress={setProgress} key="general-fallback" country="us" category="general" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
