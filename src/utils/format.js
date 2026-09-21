export const timeAgo = (isoDate) => {
  if (!isoDate) return "Unknown date";
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "Unknown date";
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const fallbackImage = (seed) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed || "newsmonkey")}/800/450`;
