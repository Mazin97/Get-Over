const { Schema, model } = require('mongoose');

const CategoriaSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
});
module.exports = model('Categoria', CategoriaSchema);
