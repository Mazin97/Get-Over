const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  isAnonimous: {
    type: Boolean,
    required: true,
  },
  gender: String,
  nickName: String,
  secondName: String,
  indexPacient: Number,
  indexVolunteer: Number,
  usuariosBloqueados: [{
    type: Schema.Types.ObjectId,
    ref: 'usuarioBloqueado',
  }],
  tentativasLogin: {
    type: Number,
    default: 0,
  },
  isBloqueado: Boolean,
}, {
  timestamps: true,
});

module.exports = model('Usuario', UsuarioSchema);
