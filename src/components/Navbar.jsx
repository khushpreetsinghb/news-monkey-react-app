import { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';

const CATEGORIES = [
  { to: "/", label: "Home", end: true },
  { to: "/world", label: "World" },
  { to: "/nation", label: "Nation" },
  { to: "/business", label: "Business" },
  { to: "/entertainment", label: "Entertainment" },
  { to: "/health", label: "Health" },
  { to: "/science", label: "Science" },
  { to: "/sports", label: "Sports" },
  { to: "/technology", label: "Technology" },
];

const Navbar = ({ theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top nm-navbar ${scrolled ? "nm-navbar-scrolled" : ""}`}>
      <div className="container">
        <NavLink className="navbar-brand nm-brand" to="/">
          <span className="nm-brand-mark">NM</span>
          <span className="nm-brand-text">NewsMonkey
            <small>Top headlines, minus the noise</small>
          </span>
        </NavLink>
        <div className="d-flex align-items-center gap-2 order-lg-3">
          <NavLink to="/search" className="btn btn-sm nm-theme-btn" aria-label="Search news" title="Search news">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" /></svg>
          </NavLink>
          <button
            type="button"
            className="btn btn-sm nm-theme-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" /></svg>
            )}
          </button>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse order-lg-2" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 nm-nav">
            {CATEGORIES.map((c) => (
              <li className="nav-item" key={c.to}>
                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} end={c.end} to={c.to}>{c.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default Navbar;
