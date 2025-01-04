const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const JSON_SERVER_URL = 'http://localhost:3000/usuarios'; // Endpoint del JSON Server

app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Obtener usuarios desde JSON Server
    const response = await axios.get(JSON_SERVER_URL);
    const users = response.data;

    // Buscar usuario
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.status(200).json({ message: 'Login exitoso', user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al conectar con JSON Server:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
