const { Schema, model } = require('mongoose');

const NotificacaoSchema = new Schema({
  Usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  conteudo: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('Notificacao', NotificacaoSchema);
