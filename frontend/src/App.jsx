import { useState, useEffect } from "react";
import Table from "./components/Table";
import Modal from "./components/Modal";
import Stats from "./components/Stats";
import "./App.css";

function App() {
  const [launches, setLaunches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/launches")
      .then((res) => res.json())
      .then((data) => {
        setLaunches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar lanzamientos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app">
        <h1>🚀 SpaceX Launches Dashboard</h1>
        <p style={{ color: "#4fc3f7", textAlign: "center", marginTop: "40px" }}>
          Cargando lanzamientos...
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>🚀 SpaceX Launches Dashboard</h1>
      <Stats />
      <Table data={launches} onSelect={setSelected} />
      {selected && (
        <Modal launch={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;