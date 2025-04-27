import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // clicking the backdrop closes the modal
    >
      <div
        style={{
          backgroundColor: "#1f1f1f",
          padding: "2rem",
          borderRadius: "0.5rem",
          minWidth: "300px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()} // clicking inside modal doesn't close it
      >
        {children}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem", borderRadius: "0.25rem" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
