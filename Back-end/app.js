const express = require('express');
const cors = require('cors');
const eventosRoutes = require('./routes/eventosRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());

// Adicione esta rota
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de Eventos SATA',
    endpoints: {
      eventos: '/api/eventos'
    }
  });
});

app.use('/api/eventos', eventosRoutes);

module.exports = app;