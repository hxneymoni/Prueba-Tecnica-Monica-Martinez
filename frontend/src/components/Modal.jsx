import { useEffect } from "react";
import Detail from "./Detail";
import ExportPDF from "./ExportPDF";

function Modal({ launch, onClose }) {
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Bloquear el scroll del fondo mientras el modal está abierto
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    // Fondo oscuro - clic fuera cierra el modal
    <div className="modal-overlay" onClick={onClose}>
      {/* Contenido - clic adentro no cierra */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <Detail launch={launch} />
        <ExportPDF launch={launch} />
      </div>
    </div>
  );
}

export default Modal;