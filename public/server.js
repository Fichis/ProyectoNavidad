const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3131;

const API_KEY = 'TU_API_KEY';

app.use(express.json());

// Endpoint para obtener datos del jugador
app.get('/api/player/:playerTag', async (req, res) => {
  const playerTag = req.params.playerTag;
  try {
    const response = await axios.get(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || 'Error interno del servidor');
  }
});

// Endpoint para obtener datos del club
app.get('/api/club/:clubTag', async (req, res) => {
  const clubTag = req.params.clubTag;
  try {
    const response = await axios.get(`https://api.brawlstars.com/v1/clubs/%23${clubTag}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || 'Error interno del servidor');
  }
});

// **Nuevo endpoint para obtener rankings**
app.get('/api/rankings/:countryCode/', async (req, res) => {
  const countryCode = req.params.countryCode;
  try {
    const response = await axios.get(`https://api.brawlstars.com/v1/rankings/${countryCode}/players`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data || 'Error interno del servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
