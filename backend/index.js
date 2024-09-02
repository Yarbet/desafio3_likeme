//servidor Express que maneja las rutas y las operaciones con los posts

// Importaciones
const express = require('express'); // Importa el framework Express para crear el servidor y manejar rutas
const cors = require('cors');// Importa el middleware para habilitar CORS, permite que el servidor acepte solicitudes de diferentes dominios
const app = express();//Crea una instancia de la aplicación Express

// Middleware
app.use(cors()); // Usa cors después de inicializar app
app.use(express.json());


const { agregarPosts, obtenerPosts, darLike,borrarPost } = require('./consultas');

// Ruta GET para obtener los posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await obtenerPosts();
        console.log("Enviando los posts:", posts);
        res.json(posts); // Envía los posts en formato JSON como respuesta
    } catch (error) {
        console.error("Error al obtener los posts:", error);
        res.status(500).send('Error al obtener los posts');
    }
});

// Ruta POST para agregar un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion, likes } = req.body;

    try {
        // Llamar a la función para agregar el post
        await agregarPosts(titulo, img, descripcion, likes);
        res.status(201).json({ message: "Post agregado exitosamente" });
    } catch (error) {
        console.error("Error al agregar el post:", error);
        res.status(500).json({ message: "Error al agregar el post" });
    }
});

// Ruta PUT para dar like a un post
app.put('/posts/like/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const result = await darLike(id);
      if (result.rowCount === 0) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res.status(200).json({ message: "Like added" });
      }
    } catch (error) {
      console.error("Error al dar like al post:", error);
      res.status(500).json({ message: 'Error al dar like al post' });
    }
  });


// Ruta DELETE para eliminar un post específico
app.delete('/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await borrarPost(id);
        if (result.rowCount === 0) {
            res.status(404).json({ message: "Post not found" });
        } else {
            res.status(200).json({ message: "Post eliminado exitosamente" });
        }
    } catch (error) {
        console.error("Error al eliminar el post:", error);
        res.status(500).json({ message: "Error al eliminar el post" });
    }
});


// Iniciar el servidor en el puerto 3000
app.listen(3002, () => {
    console.log('Servidor iniciado en http://localhost:3002');
});

// Función principal para ejecutar las consultas en la terminal
const main = async () => {
    try {
        // Agregar un post opcional
        // await agregarPosts('Nuevo Título', 'imagen_url', 'Descripción del post', 10);

        // Borrar todos los posts
        // await borrarPosts();

        // Obtener todos los posts y mostrar en la terminal
        const posts = await obtenerPosts();
        console.log('Posts obtenidos:', posts); // Mostrar los posts en la terminal
    } catch (error) {
        console.error('Error en la consulta:', error);
    }
};

// Llamar a la función principal (opcional)
main();
