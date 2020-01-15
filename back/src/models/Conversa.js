const { Schema, model } = require('mongoose');

const ConversaSchema = new Schema({
  Paciente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  Voluntario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  Publicacao: {
    type: Schema.Types.ObjectId,
    ref: 'Publicacao',
    required: true,
  },
  isExcluido: {
    type: Boolean,
    required: true,
  },
  mensagens: [{
    text: String,
    userId: Schema.Types.ObjectId,
    userName: String,
    createdAt: Date,
    score: { type: Number, default: 50 },
  }],
}, {
  timestamps: true,
});

module.exports = model('Conversa', ConversaSchema);
