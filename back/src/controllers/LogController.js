const log4js = require('log4js');

module.exports = {
  async post(req, res) {
    const { tipo, mensagem } = req.body;

    const arrayTipo = ['error', 'fatal'];

    if (!arrayTipo.includes(tipo)) {
      return res.status(400).json('Tipo de log inválido');
    }

    if (!mensagem) {
      return res.status(400).json('Mensagem inválida');
    }

    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');

    if (tipo === 'fatal') {
      logger.fatal(mensagem);
    } else {
      logger.error(mensagem);
    }

    return res.json(true);
  },
};
