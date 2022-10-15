import "./styles/loading-spinner.css";

export const LoadingSpinner = (): JSX.Element => {
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
