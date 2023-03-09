import "./styles/loading-spinner.css";

export const LoadingSpinner = (): JSX.Element => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner">
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
        <div className="spinner-dot"></div>
      </div>
    </div>
  );
};
