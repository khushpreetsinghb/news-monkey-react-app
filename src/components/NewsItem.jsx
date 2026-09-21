import PropTypes from 'prop-types';
import { timeAgo, fallbackImage } from '../utils/format';

const NewsItem = ({ title, description, imageUrl, newsUrl, author, date, source }) => {
  const img = imageUrl || fallbackImage(newsUrl || title);

  return (
    <article className="card nm-card h-100">
      <div className="nm-card-media">
        <img src={img} className="card-img-top" alt={title || "News story"} loading="lazy" referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.src = fallbackImage(newsUrl || title); }} />
        <span className="badge nm-source-badge">{source}</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title nm-card-title">{title}</h5>
        <p className="card-text nm-card-text">{description}</p>
        <p className="nm-meta mt-auto">
          <span className="nm-author">{!author || author === source ? source : author}</span>
          <span className="nm-dot" aria-hidden="true">·</span>
          <span>{timeAgo(date)}</span>
        </p>
        <a href={newsUrl} target="_blank" rel="noreferrer" className="nm-readmore stretched-link">
          Read full story <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
};

NewsItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  newsUrl: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  source: PropTypes.string,
};

export default NewsItem;
