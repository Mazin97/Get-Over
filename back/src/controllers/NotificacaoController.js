const log4js = require('log4js');
const ModelNotificacao = require('../models/Notificacao');

module.exports = {
  async post(req, res) {
    const { idUsuario, mensagem, titulo } = req.body;

    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    // #region Validações
    const erros = [];

    if (!idUsuario) {
      erros.push('Parâmetro insuficiente e/ou inválido (idUsuario).');
    }

    if (!mensagem || mensagem.length <= 10) {
      erros.push('Parâmetro insuficiente e/ou inválido (mensagem).');
    }

    if (!titulo || titulo.length < 5) {
      erros.push('Parâmetro insuficiente e/ou inválido (titulo).');
    }

    if (erros && erros.length > 0) {
      logger.error(`Notificação Post: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const novaNotificacao = await ModelNotificacao.create({
      Usuario: idUsuario,
      conteudo: mensagem,
      titulo,
    });

    return res.json(novaNotificacao);
  },

  async get(req, res) {
    const idNotificacao = req.get('idNotificacao');
    const Usuario = req.get('Usuario');

    if (idNotificacao) {
      return res.json(await ModelNotificacao.findById(idNotificacao));
    }

    if (Usuario) {
      return res.json(await ModelNotificacao.find({ Usuario }));
    }

    return res.json(await ModelNotificacao.find());
  },
};
