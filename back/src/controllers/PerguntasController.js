const log4js = require('log4js');
const Question = require('../models/PerguntasTriagem');

module.exports = {
  async post(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const {
      corpse,
      alternatives,
      weigth,
      isTriagePacient,
    } = req.body;

    const questionBody = {
      corpse,
      alternatives,
      isTriagePacient,
      weigth,
    };

    const error = [];

    if (!questionBody.corpse) {
      error.push('Erro: Pergunta não informada.');
    }

    if (!questionBody.alternatives) {
      error.push('Erro: Nenhuma alternativa informada. ');
    }

    if (!questionBody.isTriagePacient) {
      error.push('Erro: Flag de triagem não informada.');
    }

    if (!questionBody.weigth) {
      error.push('Erro: Pêso da pergunta não informado.');
    }

    if (error.length > 0) {
      logger.error(`Perguntas Triagem: ${error}`);
      return res.status(400).json(error);
    }

    const newQuestion = await Question.create({
      corpse,
      alternatives,
      weigth,
      isTriagePacient,
    });

    return res.json(newQuestion);
  },

  async get(req, res) {
    let isTriagemPaciente = req.get('isTriagemPaciente');

    if (!isTriagemPaciente) {
      isTriagemPaciente = false;
    }

    const questions = await Question.find({ isTriagePacient: isTriagemPaciente });
    return res.json(questions);
  },
};
