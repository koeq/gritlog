import "./styles/loading-spinner.css";

export const LoadingSpinner = () => {
  return (
    <div className="lds-container">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
