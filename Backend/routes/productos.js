import { Router } from "express";
import { conectarDB } from "../db.js"; 

const router = Router();

// Api para llamar a los productos

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const db = await conectarDB(); // Asegurar que la conexión está lista
    const [productos] = await db.query("SELECT * FROM productos");
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const db = await conectarDB();
    const [producto] = await db.query("SELECT * FROM productos WHERE id = ?", [req.params.id]);

    if (producto.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto[0]); // Devuelve solo el objeto del producto encontrado
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});


// Agregar un nuevo producto
router.post("/", async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;
  if (!nombre || !precio || !stock || !categoria_id) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const db = await conectarDB();
    const [result] = await db.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, stock, categoria_id, imagen]
    );

    res.json({
      id: result.insertId,
      nombre,
      descripcion,
      precio,
      stock,
      categoria_id,
      imagen,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});


// Editar un producto
router.put("/:id", async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;
  try {
    const db = await conectarDB();
    const [result] = await db.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, imagen = ? WHERE id = ?",
      [nombre, descripcion, precio, stock, categoria_id, imagen, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const db = await conectarDB();
    const [result] = await db.query("DELETE FROM productos WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
