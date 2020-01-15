const log4js = require('log4js');
const User = require('../models/Usuario');
const cripto = require('./CryptoController');

// Thread remoção bloqueio
setInterval(() => {
  User.find({ isBloqueado: true }).exec((err, result) => {
    if (result && result.length) {
      result.map((el) => {
        // eslint-disable-next-line max-len
        User.findByIdAndUpdate(el.id.trim(), { isBloqueado: false, tentativasLogin: 0 }).exec((erro) => {
          if (erro) {
            log4js.configure({
              appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
              categories: { default: { appenders: ['cheese'], level: 'error' } },
            });

            const logger = log4js.getLogger('cheese');
            logger.fatal(`Erro thread Feed: ${erro}`);
          }
        });
        return true;
      });
    }
  });
}, 1000 * 60 * 60);

module.exports = {
  async post(req, res) {
    const { email, password } = req.body;

    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    //  #region Validações
    const error = [];

    if (!email) {
      error.push('E-mail não informado.');
    }

    if (!password) {
      error.push('Senha não informada.');
    }

    if (error && error.length) {
      logger.error(`Login Post: ${error}`);
      return res.status(400).json(error);
    }
    //  #endregion

    const passCripto = cripto.encrypt(password);

    const user = await User.findOne({ email });

    if (user) {
      if (user.isBloqueado) {
        return res.status(400).json(['Usuário bloqueado, Tente novamente após uma hora.']);
      }

      user.tentativasLogin += 1;
      user.save();

      if (user.tentativasLogin >= 3) {
        user.isBloqueado = true;
      }

      if (user.password === passCripto) {
        user.tentativasLogin = 0;
        user.save();

        return res.json(user);
      }

      return res.status(400).json(['e-mail ou senha inválidos. você possui apenas 3 tentativas de login.']);
    }

    return res.status(400).json(['Usuário não encontrado.']);
  },
};
