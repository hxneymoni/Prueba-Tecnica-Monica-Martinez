import { useEffect, useState } from "react";

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats) return null;

  return (
    <div className="stats-container">
      {/* Tarjetas de resumen */}
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total lanzamientos</span>
        </div>
        <div className="stat-card success">
          <span className="stat-number">{stats.exitosos}</span>
          <span className="stat-label">Exitosos</span>
        </div>
        <div className="stat-card fail">
          <span className="stat-number">{stats.fallidos}</span>
          <span className="stat-label">Fallidos</span>
        </div>
        <div className="stat-card rate">
          <span className="stat-number">{stats.tasaExito}%</span>
          <span className="stat-label">Tasa de éxito</span>
        </div>
      </div>

      {/* Gráfica de barras por año */}
      <div className="chart-container">
        <h3>Lanzamientos por año</h3>
        <div className="bar-chart">
          {Object.entries(stats.porAnio)
            .sort(([a], [b]) => a - b)
            .map(([anio, cantidad]) => {
              const maxVal = Math.max(...Object.values(stats.porAnio));
              const height = (cantidad / maxVal) * 100;
              return (
                <div key={anio} className="bar-wrapper">
                  <span className="bar-value">{cantidad}</span>
                  <div
                    className="bar"
                    style={{ height: `${height}%` }}
                  />
                  <span className="bar-label">{anio}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Stats;