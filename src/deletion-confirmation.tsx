export const DeletionConfirmation = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          width: "85%",
          height: "28vh",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontSize: "18px", color: "#000" }}>
          Do you want to delete your training?
        </p>
        <br />
        <br />

        <button style={{ width: "240px", padding: "16px" }}>yes</button>
        <br />
        <button style={{ width: "240px", padding: "16px" }}>no</button>
      </div>
    </div>
  );
};
