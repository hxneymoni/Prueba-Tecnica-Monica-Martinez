import { useEffect, useState } from "react";

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

// Función que convierte un porcentaje en coordenadas de arco SVG
function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function PieChart({ exitosos, fallidos, total }) {
  const exitososAngle = (exitosos / total) * 360;
  const fallidosAngle = (fallidos / total) * 360;
  const nullAngle = ((total - exitosos - fallidos) / total) * 360;

  return (
    <div className="pie-container">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Exitosos - azul */}
        <path
          d={describeArc(100, 100, 80, 0, exitososAngle)}
          fill="#4fc3f7"
          opacity="0.9"
        />
        {/* Fallidos - rojo */}
        <path
          d={describeArc(100, 100, 80, exitososAngle, exitososAngle + fallidosAngle)}
          fill="#ff5252"
          opacity="0.9"
        />
        {/* Sin datos - gris */}
        {nullAngle > 0 && (
          <path
            d={describeArc(100, 100, 80, exitososAngle + fallidosAngle, 360)}
            fill="#2a2a4a"
            opacity="0.9"
          />
        )}
        {/* Círculo interior para efecto donut */}
        <circle cx="100" cy="100" r="50" fill="#12121a" />
        {/* Texto central */}
        <text x="100" y="95" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">
          {Math.round((exitosos / total) * 100)}%
        </text>
        <text x="100" y="115" textAnchor="middle" fill="#4fc3f7" fontSize="11">
          éxito
        </text>
      </svg>

      {/* Leyenda */}
      <div className="pie-legend">
        <div className="pie-legend-item">
          <span className="pie-dot" style={{ background: "#4fc3f7" }} />
          <span>Exitosos ({exitosos})</span>
        </div>
        <div className="pie-legend-item">
          <span className="pie-dot" style={{ background: "#ff5252" }} />
          <span>Fallidos ({fallidos})</span>
        </div>
        <div className="pie-legend-item">
          <span className="pie-dot" style={{ background: "#2a2a4a" }} />
          <span>Sin datos ({total - exitosos - fallidos})</span>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const total = useCountUp(stats?.total);
  const exitosos = useCountUp(stats?.exitosos);
  const fallidos = useCountUp(stats?.fallidos);
  const tasaExito = useCountUp(parseFloat(stats?.tasaExito));

  if (!stats) return null;

  return (
    <div className="stats-container">
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Total lanzamientos</span>
        </div>
        <div className="stat-card success">
          <span className="stat-number">{exitosos}</span>
          <span className="stat-label">Exitosos</span>
        </div>
        <div className="stat-card fail">
          <span className="stat-number">{fallidos}</span>
          <span className="stat-label">Fallidos</span>
        </div>
        <div className="stat-card rate">
          <span className="stat-number">{tasaExito}%</span>
          <span className="stat-label">Tasa de éxito</span>
        </div>
      </div>

      {/* Gráficas lado a lado */}
      <div className="charts-row">
        {/* Gráfica de barras */}
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
                    <div className="bar" style={{ height: `${height}%` }} />
                    <span className="bar-label">{anio}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Gráfica de pastel */}
        <div className="chart-container pie-chart-container">
          <h3>Éxitos vs Fallidos</h3>
          <PieChart
            exitosos={stats.exitosos}
            fallidos={stats.fallidos}
            total={stats.total}
          />
        </div>
      </div>
    </div>
  );
}

export default Stats;