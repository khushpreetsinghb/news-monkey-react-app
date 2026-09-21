const Spinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center py-4" role="status" aria-label="Loading">
      <div className="spinner-border nm-spinner" aria-hidden="true"></div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
