const nodemailer = require('nodemailer');
const log4js = require('log4js');
const User = require('../models/Usuario');
const cripto = require('./CryptoController');

module.exports = {
  async post(req, res) {
    const { email, nome } = req.body;

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

    if (!nome) {
      error.push('Nome não informado.');
    }

    const usuario = await User.findOne({
      $and: [
        { email },
        { name: nome },
      ],
    });

    if (!usuario) {
      error.push('Usuário não encontrado.');
    }

    if (error && error.length) {
      logger.error(`EsqueciMinhaSenha Post: ${error}`);
      return res.status(400).json(error);
    }
    //  #endregion

    const NovaSenha = Math.random().toString(36).slice(-8);
    usuario.password = cripto.encrypt(NovaSenha);
    await usuario.save();

    // Enviar e-mail
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '<email>',
          pass: '<password>',
        },
      });

      const mailOptions = {
        from: '<email>',
        to: usuario.email,
        subject: 'Sua nova senha',
        text: `Sua nova senha de acesso ao Get Over é: ${NovaSenha}`,
      };

      transporter.sendMail(mailOptions);
    } catch (error2) {
      logger.fatal(`EsqueciMinhaSenha Post: ${error2}`);
    }

    return res.json(usuario);
  },
};
