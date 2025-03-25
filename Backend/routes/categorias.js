import { Router } from "express";
import { conectarDB } from "../db.js"; 

const router = Router();

// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const db = await conectarDB();
    const [categorias] = await db.query("SELECT * FROM categorias");
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// Obtener una categoría por ID
router.get("/:id", async (req, res) => {
  try {
    const db = await conectarDB();
    const [categoria] = await db.query("SELECT * FROM categorias WHERE id = ?", [req.params.id]);

    if (categoria.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(categoria[0]);
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
});

// Agregar una nueva categoría
router.post("/", async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "Falta el nombre de la categoría" });
  
    try {
      const db = await conectarDB();
      const [result] = await db.query(
        "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
        [nombre, descripcion || null]
      );
      res.json({ id: result.insertId, nombre, descripcion });
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      res.status(500).json({ error: "Error al agregar la categoría" });
    }
  });
  
  // Editar una categoría
router.put("/:id", async (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: "Falta el nombre de la categoría" });
  
    try {
      const db = await conectarDB();
      const [result] = await db.query(
        "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
        [nombre, descripcion || null, req.params.id]
      );
  
      if (result.affectedRows === 0) return res.status(404).json({ error: "Categoría no encontrada" });
  
      res.json({ message: "Categoría actualizada" });
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      res.status(500).json({ error: "Error al actualizar la categoría" });
    }
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const db = await conectarDB(); // ← Aquí aseguramos que la conexión esté disponible
        
        // Reasignar productos a la categoría por defecto antes de eliminar
        await db.query("UPDATE productos SET categoria_id = 1 WHERE categoria_id = ?", [id]);
        
        // Eliminar la categoría
        const [result] = await db.query("DELETE FROM categorias WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "Categoría no encontrada" });

        res.json({ message: "Categoría eliminada y productos reasignados" });
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({ error: "Error al eliminar la categoría" });
    }
});

export default router;
