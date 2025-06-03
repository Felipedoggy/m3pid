const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const eventosRoutes = require('./routes/eventosRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/eventos', eventosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});