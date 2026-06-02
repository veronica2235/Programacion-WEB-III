const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "tienda_api",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  res.json({
    mensaje: "API funcionando correctamente",
  });
});

// 1. POST /categorias
app.post("/categorias", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio",
      });
    }

    const sql = "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)";
    const [resultado] = await pool.query(sql, [nombre, descripcion]);

    res.status(201).json({
      mensaje: "Categoría registrada correctamente",
      categoria: {
        id: resultado.insertId,
        nombre,
        descripcion,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar la categoría",
    });
  }
});

// 2. GET /categorias
app.get("/categorias", async (req, res) => {
  try {
    const sql = "SELECT * FROM categorias ORDER BY id ASC";
    const [categorias] = await pool.query(sql);

    res.json({
      total: categorias.length,
      categorias,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener las categorías",
    });
  }
});

// 3. GET /categorias/:id con productos
app.get("/categorias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sqlCategoria = "SELECT * FROM categorias WHERE id = ?";
    const [categorias] = await pool.query(sqlCategoria, [id]);

    if (categorias.length === 0) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    const sqlProductos = "SELECT * FROM productos WHERE id_categoria = ?";
    const [productos] = await pool.query(sqlProductos, [id]);

    res.json({
      categoria: {
        ...categorias[0],
        productos,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener la categoría",
    });
  }
});

// 4. PATCH /categorias/:id
app.patch("/categorias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const sql = `
      UPDATE categorias
      SET nombre = ?, descripcion = ?
      WHERE id = ?
    `;

    const [resultado] = await pool.query(sql, [nombre, descripcion, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    res.json({
      mensaje: "Categoría actualizada correctamente",
      categoria: {
        id: Number(id),
        nombre,
        descripcion,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al actualizar la categoría",
    });
  }
});

// 5. DELETE /categorias/:id
app.delete("/categorias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM categorias WHERE id = ?";
    const [resultado] = await pool.query(sql, [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    res.json({
      mensaje: "Categoría eliminada correctamente. Sus productos también fueron eliminados.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar la categoría",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});