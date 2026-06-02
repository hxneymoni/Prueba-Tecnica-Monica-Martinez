import { useState } from "react";

function Table({ data, onSelect }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filtered = data.filter((launch) => {
    const matchName = launch.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDate = dateFilter
      ? launch.date_utc.startsWith(dateFilter)
      : true;

    const matchStatus =
      statusFilter === "todos"
        ? true
        : statusFilter === "exitoso"
        ? launch.success === true
        : launch.success === false;

    return matchName && matchDate && matchStatus;
  });

  return (
    <div className="table-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filtrar por año (ej: 2022)"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          min="2000"
          max="2030"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-select"
        >
          <option value="todos">Todos los estados</option>
          <option value="exitoso">✅ Exitosos</option>
          <option value="fallido">❌ Fallidos</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((launch) => (
            <tr
              key={launch.id}
              onClick={() => onSelect(launch)}
              className="clickable-row"
            >
              <td>{launch.name}</td>
              <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
              <td>
                <span className={launch.success ? "badge success" : "badge fail"}>
                  {launch.success ? "Exitoso" : "Fallido"}
                </span>
              </td>
              <td>{launch.launchpad_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className="no-results">No se encontraron resultados.</p>
      )}
    </div>
  );
}

export default Table;