const { Schema, model } = require('mongoose');

const PerguntasFrequenteSchema = new Schema({
  corpo: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  subTitulo: {
    type: String,
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
},
{
  timestamps: true,
});
module.exports = model('PerguntasFrequentes', PerguntasFrequenteSchema);
