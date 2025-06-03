const Evento = require('../models/evento.js');

function validarEvento(dados) {
  const requiredFields = ['title', 'start', 'end'];
  for (let field of requiredFields) {
    if (!dados[field] || dados[field].toString().trim() === '') {
      return `Campo obrigatório ausente ou inválido: ${field}`;
    }
  }
  if (dados.title.length > 100) return 'Título muito longo (máximo 100 caracteres).';
  if (dados.description && dados.description.length > 500) return 'Descrição muito longa (máximo 500 caracteres).';
  return null;
}

exports.getEventos = (req, res) => {
  const filtro = req.query.filtro || null;
  Evento.getAll(filtro, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar eventos' });
    res.json(results);
  });
};

exports.getEventoById = (req, res) => {
  const { id } = req.params;
  Evento.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar evento' });
    if (results.length === 0) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(results[0]);
  });
};

exports.createEvento = (req, res) => {
  const erroValidacao = validarEvento(req.body);
  if (erroValidacao) return res.status(400).json({ error: erroValidacao });

  Evento.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao inserir evento' });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
};

exports.updateEvento = (req, res) => {
  const { id } = req.params;
  const erroValidacao = validarEvento(req.body);
  if (erroValidacao) return res.status(400).json({ error: erroValidacao });

  Evento.updateById(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar evento' });
    res.json({ id, ...req.body });
  });
};

exports.deleteEvento = (req, res) => {
  const { id } = req.params;
  Evento.deleteById(id, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir evento' });
    res.sendStatus(204);
  });
};