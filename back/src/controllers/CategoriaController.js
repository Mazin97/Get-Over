const log4js = require('log4js');
const Perguntas = require('../models/Perguntas');
const Categoria = require('../models/CategoriaPerguntas');

module.exports = {
  async post(req, res) {
    const { nome, descricao } = req.body;

    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');

    const error = [];

    if (!nome) {
      error.push('Erro: Nome não informado.');
    }

    if (!descricao) {
      error.push('Erro: Descrição não informada.');
    }

    if (error.length > 0) {
      logger.error(`Categoria Post: ${error}`);
      return res.status(400).json(error);
    }

    const newCategoria = await Categoria.create({
      nome,
      descricao,
    });

    return res.json(newCategoria);
  },

  async get(req, res) {
    return res.json(await Categoria.find());
  },

  async delete(req, res) {
    const { id } = req.body;

    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');

    // #region Validações
    const erros = [];

    if (!id) {
      erros.push('Parâmetros insuficientes (id).');
    }

    if (erros.length > 0) {
      logger.error(`Categoria Delete: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const categorias = await Categoria.findByIdAndRemove(id);
    return res.json(categorias);
  },

  async getPerguntas(req, res) {
    const id = req.params.idCategoria;

    if (!id) {
      return res.status(400).json('Erro: Parâmetros insuficientes.');
    }

    const categorias = await Categoria.findById(id);

    if (!categorias) {
      res.status(400);
      return res.json('Erro: Categoria não encontrada.');
    }

    return res.json(await Perguntas.find({ categoria: id }));
  },
};
