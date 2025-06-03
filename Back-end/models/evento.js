const db = require('../config/db.js');

const Evento = {
  getAll: (filter, callback) => {
    let sql = 'SELECT * FROM eventos';
    const params = [];

    if (filter) {
      sql += ' WHERE title LIKE ? OR description LIKE ? OR type LIKE ?';
      const likeFilter = `%${filter}%`;
      params.push(likeFilter, likeFilter, likeFilter);
    }

    db.query(sql, params, callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM eventos WHERE id = ?', [id], callback);
  },

  create: (evento, callback) => {
    const {
      title, start, end, color, location, description,
      notify, notifyTime, type
    } = evento;

    const sql = `INSERT INTO eventos (title, start, end, color, location, description, notify, notifyTime, type)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      title, start, end, color, location, description,
      notify, notifyTime, type
    ], callback);
  },

  updateById: (id, evento, callback) => {
    const {
      title, start, end, color, location, description,
      notify, notifyTime, type
    } = evento;

    const sql = `UPDATE eventos SET title = ?, start = ?, end = ?, color = ?, location = ?, description = ?, notify = ?, notifyTime = ?, type = ? WHERE id = ?`;

    db.query(sql, [
      title, start, end, color, location, description,
      notify, notifyTime, type, id
    ], callback);
  },

  deleteById: (id, callback) => {
    db.query('DELETE FROM eventos WHERE id = ?', [id], callback);
  }
};

module.exports = Evento;