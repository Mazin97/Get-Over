const { ObjectId } = require('mongoose').Types.ObjectId;
const log4js = require('log4js');
const Perguntas = require('../models/Perguntas');
const Categoria = require('../models/CategoriaPerguntas');

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
      titulo,
      subTitulo,
      corpo,
      categoria,
    } = req.body;

    const error = [];

    if (!titulo) {
      error.push('Erro: Titulo não informado.');
    }

    if (!subTitulo) {
      error.push('Erro: Sub-Titulo não informado.');
    }

    if (!corpo) {
      error.push('Erro: Mensagem não informada.');
    }

    if (!categoria) {
      error.push('Erro: Categoria não informada.');
    }

    if (error.length > 0) {
      logger.error(`Perguntas Frequentes Post: ${error}`);
      return res.status(400).json(error);
    }

    const newPergunta = await Perguntas.create({
      titulo,
      subTitulo,
      corpo,
      categoria,
    });

    return res.json(newPergunta);
  },

  async get(req, res) {
    return res.json(await Perguntas.find());
  },

  async delete(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const { id } = req.body;

    // #region Validações
    const erros = [];

    if (!id) {
      erros.push('Parâmetros insuficientes (id).');
    }

    if (erros.length > 0) {
      logger.error(`Perguntas Frequentes Delete: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const perguntas = await Perguntas.findByIdAndRemove(id);
    return res.json(perguntas);
  },

  async postPerguntas(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const idPergunta = req.get('idPergunta');
    const idCategoria = req.get('idCategoria');

    const erros = [];

    // #region Validações
    if (!idPergunta) {
      erros.push('Erro: Parâmetro invalido. (idPergunta)');
    }

    if (!idCategoria) {
      erros.push('Erro: Parâmetro invalido. (idCategoria)');
    }

    if (erros.length > 0) {
      logger.error(`Perguntas Frequentes Get: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const pergunta = await Perguntas.findById(ObjectId(idPergunta));
    const categoria = await Categoria.findById(ObjectId(idCategoria));

    if (!pergunta) {
      erros.push('Pergunta não encontrada com parâmetro informado.');
    }

    if (!categoria) {
      erros.push('Categoria não encontrada com parâmetro informado.');
    }

    if (erros.length > 0) {
      logger.error(`Perguntas Frequentes Get: ${erros}`);
      return res.status(400).json(erros);
    }

    if (pergunta.categoria.id !== categoria.id && !categoria.perguntas.includes(pergunta.id)) {
      categoria.push(ObjectId(pergunta.id));
      await categoria.save();

      return res.json(categoria);
    }

    return res.status(400).json(['Pergunta pertencente á outra categoria e/ou já adicionada.']);
  },
};
