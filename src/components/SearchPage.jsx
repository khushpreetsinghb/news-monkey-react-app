import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import News from './News';
import PropTypes from 'prop-types';

const SearchPage = ({ setProgress }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = (params.get("q") || "").trim();
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
    document.title = q ? `Search: ${q} - NewsMonkey` : "Search - NewsMonkey";
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    const term = value.trim();
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  };

  return (
    <>
      <div className="container">
        <form onSubmit={submit} className="nm-search-hero" role="search">
          <h1>Search the news</h1>
          <p className="nm-muted">Try topics like AI, elections, startups or climate.</p>
          <div className="nm-search-box">
            <input
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search headlines…"
              aria-label="Search headlines"
              autoFocus
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>
      </div>
      {q ? (
        <News key={q} country="us" category="general" query={q} setProgress={setProgress} />
      ) : (
        <div className="container pb-5">
          <div className="nm-empty">
            <h5>Discover anything</h5>
            <p className="nm-muted mb-0">Type a topic above to see the latest stories.</p>
          </div>
        </div>
      )}
    </>
  );
};

SearchPage.propTypes = {
  setProgress: PropTypes.func.isRequired,
};

export default SearchPage;
