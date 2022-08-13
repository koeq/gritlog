export const DeletionConfirmation = () => {
  return (
    <div
      style={{
        width: "80%",
        height: "150px",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255,255,255,1)",
        boxShadow: "var(--shadow-smallest)",
      }}
    >
      <span>Delete training?</span>
      <button className="btn-green">yes</button>
      <button className="btn-red">X</button>
    </div>
  );
};
