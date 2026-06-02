import MapView from "./MapView";

function Detail({ launch }) {
  return (
    <div className="detail-card">
      <h2>{launch.name}</h2>

      {/* Imagen del lanzamiento si existe */}
      {launch.images && launch.images.length > 0 && (
        <img
          src={launch.images[0]}
          alt={launch.name}
          className="launch-image"
        />
      )}

      {/* Información general */}
      <div className="detail-info">
        <p><strong>Cohete:</strong> {launch.rocket_name}</p>
        <p><strong>Fecha:</strong> {new Date(launch.date_utc).toLocaleDateString()}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={launch.success ? "badge success" : "badge fail"}>
            {launch.success ? "Exitoso" : "Fallido"}
          </span>
        </p>
        <p><strong>Plataforma:</strong> {launch.launchpad_name}</p>
        <p><strong>Detalles:</strong> {launch.details}</p>
      </div>

      {/* Mapa con la ubicación del lanzamiento */}
      <h3>Ubicación de lanzamiento</h3>
      <MapView location={launch.launchpad_location} name={launch.launchpad_name} />
    </div>
  );
}

export default Detail;