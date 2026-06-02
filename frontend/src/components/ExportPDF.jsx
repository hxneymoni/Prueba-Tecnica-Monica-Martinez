import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({ launch }) {
  const handleExport = async () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Lanzamiento SpaceX", 14, 20);
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    // Nombre
    doc.setFontSize(14);
    doc.text(launch.name, 14, 35);

    // Tabla de datos
    autoTable(doc, {
      startY: 42,
      head: [["Campo", "Valor"]],
      body: [
        ["Cohete", launch.rocket_name],
        ["Fecha", new Date(launch.date_utc).toLocaleDateString()],
        ["Estado", launch.success ? "Exitoso" : "Fallido"],
        ["Plataforma", launch.launchpad_name],
        ["Coordenadas", `Lat: ${launch.launchpad_location.latitude}, Lon: ${launch.launchpad_location.longitude}`],
        ["Detalles", launch.details],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [30, 30, 30] },
    });

    // Imagen via proxy del backend
    if (launch.images && launch.images.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/image-proxy?url=${encodeURIComponent(launch.images[0])}`
        );
        const data = await response.json();

        if (data.base64) {
          const finalY = doc.lastAutoTable.finalY + 10;
          doc.setFontSize(12);
          doc.text("Imagen del lanzamiento:", 14, finalY);
          doc.addImage(data.base64, "JPEG", 14, finalY + 6, 180, 100);
        }
      } catch (error) {
        console.log("No se pudo cargar la imagen:", error);
      }
    }

    doc.save(`${launch.name}.pdf`);
  };

  return (
    <button className="export-btn" onClick={handleExport}>
      Exportar a PDF
    </button>
  );
}

export default ExportPDF;