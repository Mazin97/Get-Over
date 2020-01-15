const { Schema, model } = require('mongoose');

const PerguntasTriagemSchema = new Schema({
  corpse: {
    type: String,
    required: true,
  },
  alternatives: {
    type: Array,
    required: true,
  },
  weigth: {
    type: Number,
    required: true,
  },
  isTriagePacient: {
    type: Boolean,
    required: true,
  },
});

module.exports = model('PerguntasTriagem', PerguntasTriagemSchema);
