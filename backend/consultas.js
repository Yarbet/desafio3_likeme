//contiene las funciones que interactúan directamente con la base de datos

const { Pool } = require('pg');
/*La clase Pool nos permite soportar multiconexiones y un mejor rendimiento en las consultas*/
const dotenv = require('dotenv');

dotenv.config();

// Configurar la conexión a la base de datos
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: process.env.PASSWORD,
  database: 'likeme',
  allowExitOnIdle: true,
/*Esta propiedad "allowExitOnIdle: true" le indicará a PostgreSQL que cierre la conexión luego de cada consulta*/
});

// Función dar like a un post
const darLike = async (id) => {
  const consulta = "UPDATE posts SET likes = likes + 1 WHERE id = $1";
  const values = [id];
  try {
      const result = await pool.query(consulta, values);
      console.log("Like agregado al post");
      return result;
  } catch (error) {
      console.error("Error al dar like al post:", error);
      throw error;
  }
};

const agregarPosts = async (titulo, img, descripcion, likes = 0) => {
  const consulta = "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)";
  const values = [titulo, img, descripcion, likes];
  try {
    const result = await pool.query(consulta, values);
    console.log("Post agregado");
    return result; // Devolver el resultado para el uso en `index.js` si es necesario
  } catch (error) {
    console.error("Error al agregar el post:", error);
    throw error; // Propagar el error para manejarlo en el controlador
  }
};

  const obtenerPosts = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM Posts");
        return rows; // Devuelve los resultados obtenidos de la base de datos
    } catch (error) {
        console.error("Error al obtener los posts:", error);
        throw error;
    }
   }

  // Función para eliminar un post específico
const borrarPost = async (id) => {
  const consulta = "DELETE FROM posts WHERE id = $1";
  const values = [id];
  try {
    const result = await pool.query(consulta, values);
    console.log("Post eliminado exitosamente");
    return result;
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    throw error;
  }
};

   
    // const borrarTodosPosts = async () => {
    //   try {
    //     await pool.query("DELETE FROM posts");
    //     console.log("Todos los posts han sido borrados.");
    //   } catch (error) {
    //     console.error("Error al borrar los posts:", error);
    //     throw error;
    //   }
    // };


module.exports = { agregarPosts, obtenerPosts, darLike, borrarPost }