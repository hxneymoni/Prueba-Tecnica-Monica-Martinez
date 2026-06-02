const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const SPACEX_LAUNCHES = "https://api.spacexdata.com/v5/launches";
const SPACEX_LAUNCHPADS = "https://api.spacexdata.com/v4/launchpads";
const SPACEX_ROCKETS = "https://api.spacexdata.com/v4/rockets";

const fetchData = async (url) => {
  const res = await fetch(url);
  return res.json();
};

app.get("/api/launches", async (req, res) => {
  try {
    const [launches, launchpads, rockets] = await Promise.all([
      fetchData(SPACEX_LAUNCHES),
      fetchData(SPACEX_LAUNCHPADS),
      fetchData(SPACEX_ROCKETS),
    ]);

    const launchpadMap = {};
    launchpads.forEach((lp) => {
      launchpadMap[lp.id] = lp;
    });

    const rocketMap = {};
    rockets.forEach((r) => {
      rocketMap[r.id] = r.name;
    });

    const enriched = launches.map((l) => {
      const launchpad = launchpadMap[l.launchpad];
      return {
        id: l.id,
        name: l.name,
        date_utc: l.date_utc,
        success: l.success,
        rocket_name: rocketMap[l.rocket] || "Desconocido",
        launchpad_name: launchpad?.name || "Desconocida",
        launchpad_location: {
          latitude: launchpad?.latitude || 0,
          longitude: launchpad?.longitude || 0,
        },
        details: l.details || "Sin detalles disponibles.",
        images: l.links?.flickr?.original?.length > 0
          ? l.links.flickr.original
          : l.links?.patch?.large
          ? [l.links.patch.large]
          : [],
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener lanzamientos" });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const launches = await fetchData(SPACEX_LAUNCHES);

    const total = launches.length;
    const exitosos = launches.filter((l) => l.success === true).length;
    const fallidos = launches.filter((l) => l.success === false).length;

    const porAnio = launches.reduce((acc, l) => {
      const anio = new Date(l.date_utc).getFullYear();
      acc[anio] = (acc[anio] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total,
      exitosos,
      fallidos,
      tasaExito: ((exitosos / total) * 100).toFixed(1),
      porAnio,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al calcular estadísticas" });
  }
});

// Endpoint para obtener imagen como base64 (resuelve CORS)
app.get("/api/image-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64 = buffer.toString("base64");
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.json({ base64: `data:${contentType};base64,${base64}` });
  } catch (error) {
    res.status(500).json({ error: "No se pudo cargar la imagen" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});