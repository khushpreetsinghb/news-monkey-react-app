import { useCallback, useEffect, useMemo, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import { timeAgo, fallbackImage } from '../utils/format';

const PAGE_SIZE = 10; // 1 hero + 9 grid = full 3x3 rows; GNews free max is 10
const MAX_PAGES = 10; // cap to protect the 100 req/day free quota
const CACHE_TTL = 10 * 60 * 1000;

const CATEGORY_BLURBS = {
  general: "The biggest stories right now, across every desk.",
  business: "Markets, companies and the economy in brief.",
  entertainment: "Film, TV, music and culture headlines.",
  health: "Health, wellness and medical news that matters.",
  science: "Discoveries, research and space, explained fast.",
  sports: "Scores, transfers and match-day talking points.",
  technology: "Gadgets, AI, startups and the future.",
  world: "Global headlines from beyond your borders.",
  nation: "National stories from across the country.",
};

const getHttpError = (status, statusText) => {
  if (status === 429) {
    return "Daily request limit reached (429). The free GNews plan allows 100 requests/day and resets at midnight UTC. Please try again later.";
  }
  if (status === 401 || status === 403) {
    return `Invalid API key (${status}). Check VITE_GNEWS_API_KEY in .env locally and in Vercel environment variables.`;
  }
  return `Could not load headlines (${status} ${statusText}). Please retry.`;
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const SkeletonGrid = ({ count = 9 }) => (
  <div className="row g-4" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div className="col-md-6 col-lg-4" key={i}>
        <div className="card nm-card h-100">
          <div className="nm-skeleton nm-skeleton-img" />
          <div className="card-body">
            <div className="nm-skeleton nm-skeleton-line w-75 mb-2" />
            <div className="nm-skeleton nm-skeleton-line mb-2" />
            <div className="nm-skeleton nm-skeleton-line w-50" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

SkeletonGrid.propTypes = { count: PropTypes.number };

const News = ({ country = 'us', category = 'general', query = null, setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const term = (query || "").trim();
  const isSearch = term.length > 0;

  const gridSize = PAGE_SIZE - 1; // hero takes 1, grid keeps full rows of 3

  const totalPages = useMemo(() => {
    if (!totalResults) return 1;
    return Math.max(1, Math.min(MAX_PAGES, Math.ceil(totalResults / PAGE_SIZE)));
  }, [totalResults]);

  const fetchPage = useCallback(async (pageNum) => {
    const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_GNEWS_API_KEY. Add it to .env locally and in Vercel environment variables.");
    }
    const cacheKey = isSearch
      ? `gnews-q-${term.toLowerCase()}-${country}-${PAGE_SIZE}-p${pageNum}`
      : `gnews-${category}-${country}-${PAGE_SIZE}-p${pageNum}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.time < CACHE_TTL) return parsed;
      } catch { /* ignore bad cache */ }
    }
    const url = isSearch
      ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(term)}&lang=en&country=${country}&max=${PAGE_SIZE}&page=${pageNum}&apikey=${apiKey}`
      : `https://gnews.io/api/v4/top-headlines?category=${category}&country=${country}&lang=en&max=${PAGE_SIZE}&page=${pageNum}&apikey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(getHttpError(res.status, res.statusText));
    const data = await res.json();
    if (data.errors) throw new Error(data.errors.join(", "));
    const payload = { articles: data.articles || [], totalArticles: data.totalArticles || 0, time: Date.now() };
    sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    return payload;
  }, [category, country, isSearch, term]);

  const loadPage = useCallback(async (pageNum) => {
    try {
      setError(null);
      setLoading(true);
      setProgress(10);
      const data = await fetchPage(pageNum);
      setProgress(70);
      setArticles(data.articles);
      setTotalResults(data.totalArticles);
      setPage(pageNum);
      setUpdatedAt(new Date());
      document.title = isSearch ? `Search: ${term} - NewsMonkey` : `${capitalizeFirstLetter(category)} - NewsMonkey`;
    } catch (err) {
      setError(err.message);
      if (pageNum === 1) {
        setArticles([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }, [fetchPage, category, isSearch, term, setProgress]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const goToPage = (next) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    if (clamped === page || loading) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadPage(clamped);
  };

  const rangeStart = totalResults === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalResults);

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const [hero, ...rest] = articles;

  return (
    <main className="nm-main">
      <div className="container">
        <header className="nm-section-head">
          {isSearch ? (
            <div>
              <p className="nm-eyebrow">Search results</p>
              <h1 className="nm-title">{term}</h1>
              <p className="nm-subtitle">Top stories matching your search.</p>
            </div>
          ) : (
            <div>
              <p className="nm-eyebrow">{capitalizeFirstLetter(category)} · Top headlines</p>
              <h1 className="nm-title">{capitalizeFirstLetter(category)} News</h1>
              <p className="nm-subtitle">{CATEGORY_BLURBS[category] || CATEGORY_BLURBS.general}</p>
            </div>
          )}
          <div className="nm-head-meta">
            {updatedAt && !error && <span>Updated {timeAgo(updatedAt.toISOString())}</span>}
            {totalResults > 0 && <span>{totalResults.toLocaleString()} stories</span>}
          </div>
        </header>

        {error && (
          <div className="alert nm-alert d-flex flex-column flex-sm-row align-items-sm-center gap-3" role="alert">
            <div className="flex-grow-1">
              <strong>Something went wrong.</strong>
              <div className="small mt-1">{error}</div>
            </div>
            <button type="button" className="btn btn-primary btn-sm nm-btn" onClick={() => loadPage(page)}>Retry</button>
          </div>
        )}

        {loading ? (
          <>
            <Spinner />
            <div className="nm-skeleton nm-skeleton-hero mb-4" aria-hidden="true" />
            <SkeletonGrid count={gridSize} />
          </>
        ) : articles.length === 0 && !error ? (
          <div className="nm-empty">
            <h5>No stories found</h5>
            <p className="nm-muted mb-3">Try another section or come back in a few minutes.</p>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => loadPage(1)}>Reload</button>
          </div>
        ) : (
          <>
            {hero && (
              <section className="nm-hero mb-4">
                <a href={hero.url} target="_blank" rel="noreferrer" className="nm-hero-link">
                  <img
                    src={hero.image || fallbackImage(hero.url)}
                    alt={hero.title || "Top story"}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = fallbackImage(hero.url); }}
                  />
                  <span className="badge nm-source-badge">{hero.source?.name || "Top story"}</span>
                  <div className="nm-hero-body">
                    <h2>{hero.title}</h2>
                    {hero.description && <p>{hero.description}</p>}
                    <small>By {hero.source?.name || "Unknown"} · {timeAgo(hero.publishedAt)} · Read full story →</small>
                  </div>
                </a>
              </section>
            )}

            <div className="nm-toolbar">
              <span className="nm-muted small">
                {totalResults > 0 ? `Showing ${rangeStart}–${rangeEnd} of ${totalResults.toLocaleString()}` : "Top stories"}
              </span>
            </div>

            <div className="row g-4">
              {rest.map((element) => (
                <div className="col-md-6 col-lg-4" key={element.url}>
                  <NewsItem
                    title={element.title || ""}
                    description={element.description || ""}
                    imageUrl={element.image}
                    newsUrl={element.url}
                    author={element.source?.name}
                    date={element.publishedAt}
                    source={element.source?.name || "Unknown"}
                  />
                </div>
              ))}
            </div>

            <nav className="nm-pagination" aria-label="News pages">
              <button type="button" className="btn btn-outline-secondary btn-sm nm-btn" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)}>← Newer</button>
              <div className="nm-page-numbers">
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToPage(n)}
                    disabled={loading}
                    className={`btn btn-sm ${n === page ? "btn-primary" : "btn-outline-secondary"}`}
                    aria-current={n === page ? "page" : undefined}
                  >{n}</button>
                ))}
              </div>
              <span className="nm-page-info">Page {page} of {totalPages}</span>
              <button type="button" className="btn btn-outline-secondary btn-sm nm-btn" disabled={page >= totalPages || loading} onClick={() => goToPage(page + 1)}>Older →</button>
            </nav>
          </>
        )}
      </div>
    </main>
  );
};

News.propTypes = {
  country: PropTypes.string,
  category: PropTypes.string,
  query: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
