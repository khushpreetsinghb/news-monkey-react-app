import { Link } from "react-router-dom";

const CATEGORIES = ["business", "entertainment", "general", "health", "nation", "science", "sports", "technology", "world"];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="nm-footer mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="nm-brand mb-2">
              <span className="nm-brand-mark">NM</span>
              <span className="nm-brand-text">NewsMonkey</span>
            </div>
            <p className="nm-muted mb-0">Fast, skimmable top headlines across business, tech, sports, science and more. Built with React and the GNews API.</p>
          </div>
          <div className="col-md-4">
            <h6 className="nm-footer-heading">Sections</h6>
            <ul className="list-unstyled nm-footer-links">
              {CATEGORIES.map((c) => (
                <li key={c}><Link to={`/${c}`}>{c.charAt(0).toUpperCase() + c.slice(1)}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="nm-footer-heading">About</h6>
            <p className="nm-muted small mb-1">Headlines update throughout the day. Free API quota is limited — stories are cached for 10 minutes.</p>
            <p className="nm-muted small mb-0">Data by <a href="https://gnews.io" target="_blank" rel="noreferrer">GNews</a>.</p>
          </div>
        </div>
        <hr className="nm-hr" />
        <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
          <small className="nm-muted">© {year} NewsMonkey. All rights reserved.</small>
          <small className="nm-muted">Made with React · Bootstrap · Vite</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
