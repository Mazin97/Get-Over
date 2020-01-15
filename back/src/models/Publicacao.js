const { Schema, model } = require('mongoose');

const PublicacaoSchema = new Schema({
  texto: {
    type: String,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  isExcluido: {
    type: Boolean,
    required: true,
  },
  denuncias: [{
    idDenunciante: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    motivo: {
      type: Array,
      required: true,
    },
    corpo: String,
    isAprovada: {
      type: Boolean,
    },
  }],
}, {
  timestamps: true,
});

module.exports = model('Publicacao', PublicacaoSchema);
