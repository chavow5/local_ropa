
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectarDB } from "./db.js";  // la función y la DB
import productosRoutes from "./routes/productos.js";

const app = express();
const PORT = process.env.PORT ?? 3000; // si el puerto 3000 esta en uso busca otro puerto

app.use(express.json());
app.use(cors());

// Conectar a la base de datos antes de iniciar el servidor
conectarDB().then(() => {
    console.log("🚀 Base de datos conectada, iniciando servidor...");
  
    // Rutas
    app.use("/api/productos", productosRoutes);
  
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error("❌ No se pudo conectar a la base de datos. Servidor no iniciado.");
  });

/* Inicia el servidor solo si la BD está conectada: Evita que el servidor se levante si hay un error en la conexión a MySQL */