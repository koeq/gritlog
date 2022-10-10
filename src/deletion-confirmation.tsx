import { Deletion } from "./authed-app";

interface DeletionConfirmationProps {
  readonly setDeletion: (
    value: Deletion | ((val: Deletion) => Deletion)
  ) => void;
  readonly handleDelete: (id: number) => void;
  readonly id: number | undefined;
}

export const DeletionConfirmation = ({
  setDeletion,
  handleDelete,
  id,
}: DeletionConfirmationProps) => {
  if (!id) {
    return null;
  }

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
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          width: "95%",
          height: "30vh",
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

        <button
          style={{ width: "240px", padding: "16px" }}
          onClick={() => {
            handleDelete(id);
            setDeletion({ deleting: false, id: undefined });
          }}
        >
          yes
        </button>
        <br />
        <button
          style={{ width: "240px", padding: "16px" }}
          onClick={() => setDeletion({ deleting: false, id: undefined })}
        >
          no
        </button>
      </div>
    </div>
  );
};
