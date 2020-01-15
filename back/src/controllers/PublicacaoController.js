/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { ObjectId } = require('mongoose').Types.ObjectId;
const log4js = require('log4js');
const Feed = require('../models/Publicacao');
const User = require('../models/Usuario');

setInterval(() => {
  const dt = new Date();
  const dia = dt.getDate() - 7 < 0 ? 1 : dt.getDate() - 7;
  const start = new Date(dt.getFullYear(), dt.getMonth(), dia, 1, 0, 0);
  const end = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 1, 0, 0);

  const query = { createdAt: { $gte: start, $lt: end } };

  Feed.find(query).exec((err, result) => {
    if (result && result.length) {
      result.map((el) => {
        Feed.findByIdAndUpdate(el.id.trim(), { isExcluido: true }).exec((erro) => {
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
}, 1000 * 60 * 60 * 24);

module.exports = {
  async post(req, res) {
    const {
      usuario,
      texto,
      categoria,
      index,
    } = req.body;

    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    // #region Validações
    const erros = [];

    if (!usuario) {
      erros.push('Erro: idUsuario não informado.');
    }

    if (!texto) {
      erros.push('Erro: Texto não informado.');
    }

    if (!categoria) {
      erros.push('Erro: Categoria não informada.');
    }

    if (!index) {
      erros.push('Erro: Index não informado.');
    }

    if (erros && erros.length > 0) {
      logger.error(`Feed Post: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const newPublicacao = await Feed.create({
      usuario,
      texto,
      index,
      categoria,
      isExcluido: false,
    });

    return res.json(newPublicacao);
  },

  async update(req, res) {
    const {
      texto,
      categoria,
      idFeed,
    } = req.body;

    // #region Gera Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const feedBody = {};

    if (idFeed) {
      feedBody.idFeed = idFeed;
    }

    if (texto) {
      feedBody.texto = texto;
    }

    if (categoria) {
      feedBody.categoria = categoria;
    }

    const error = [];

    if (!feedBody.idFeed || !ObjectId.isValid(feedBody.idFeed)) {
      logger.error('Erro Feed Update: idFeed não encontrado, valide os parâmetros.');
      return res.status(400).json('Erro: feed não encontrado, valide os parâmetros.');
    }

    if (!feedBody.categoria) {
      logger.error('Erro Feed Update: categoria não informada.');
      return res.status(400).json('Erro: categoria não informada.');
    }

    if (!feedBody.texto) {
      logger.error('Erro Feed Update: texto não informado.');
      return res.status(400).json('Erro: texto não informado.');
    }

    if (error.lenght > 0) {
      logger.error(`Erro Feed Update: ${error}`);
      return res.status(400).json(error);
    }

    return res.json(await Feed.findByIdAndUpdate(feedBody.idFeed, feedBody, { new: true }));
  },

  async get(req, res) {
    const isExcluido = req.get('isExcluido');
    const tamanhoPagina = req.get('tamanhoPagina');
    const pagina = req.get('pagina');
    const idFeed = req.get('idFeed');
    const idUsuario = req.get('idUsuario');
    const usuarioVolunteer = req.get('usuarioVolunteer');

    // #region Gera Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    if (idFeed) {
      if (!ObjectId.isValid(idFeed)) {
        return res.status(400).json('Parâmetro id inválido.');
      }

      return res.json(await Feed.findById(idFeed));
    }

    const retorno = {
      pagina,
      tamanhoPagina,
    };

    const quantidadeTotal = await Feed.countDocuments({ isExcluido: { $nin: true } });
    retorno.total = Math.round(quantidadeTotal / tamanhoPagina); // Total de páginas

    if (retorno.total === 0) {
      retorno.total = 1;
    }

    if (isExcluido) {
      retorno.feed = Feed.find().sort({ index: -1 }).populate('usuario', 'name').exec((err, result) => {
        if (err) {
          // #region Gera Log Erro
          log4js.configure({
            appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
            categories: { default: { appenders: ['cheese'], level: 'error' } },
          });

          logger.fatal(`Erro Feed Get: ${err}`);
          // #endregion
        } else {
          retorno.feed = result.filter((el) => el.usuario !== null);
          return res.json(retorno);
        }
      });
    } else if (idUsuario) {
      Feed.find({ isExcluido: { $nin: true } })
        .sort({ createdAt: -1 })
        .populate({ path: 'usuario', select: 'name', match: { _id: idUsuario } })
        .exec((err, result) => {
          if (err) {
            // #region Gera Log Erro
            log4js.configure({
              appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
              categories: { default: { appenders: ['cheese'], level: 'error' } },
            });

            logger.fatal(`Erro Feed Get: ${err}`);
            // #endregion
          } else {
            retorno.feed = result.filter((el) => el.usuario !== null);
            return res.json(retorno);
          }
        });
    } else if (usuarioVolunteer) {
      const user = await User.findOne({ _id: usuarioVolunteer }).select('indexVolunteer -_id');

      if (!user) {
        retorno.feed = null;
        retorno.erro = 'Erro: nenhum usuário encontrado com o parâmetro informado. (usuarioVolunteer)';
        logger.error(retorno.erro);
        return res.status(400).json(retorno);
      }

      const query = await Feed
        .find({ isExcluido: { $nin: true } })
        .populate('usuario', 'name')
        .sort({ createdAt: -1 });

      retorno.feed = [];

      const promises = query.map(async (el) => {
        // eslint-disable-next-line eqeqeq
        if (el.usuario._id == usuarioVolunteer) {
          await retorno.feed.push(el);
        } else if (user.indexVolunteer >= el.index) {
          await retorno.feed.push(el);
        }
      });
      await Promise.all(promises);

      const pule = pagina * tamanhoPagina;
      const pegueAte = pule + 10;

      retorno.feed.slice(pule, pegueAte);

      return res.json(retorno);
    } else {
      Feed.find({ isExcluido: { $nin: true } })
        .skip(tamanhoPagina * pagina)
        .limit(Number(tamanhoPagina))
        .populate('usuario', 'name')
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            // #region Gera Log Erro
            log4js.configure({
              appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
              categories: { default: { appenders: ['cheese'], level: 'error' } },
            });

            logger.fatal(`Erro Feed Get: ${err}`);
            // #endregion
          } else {
            retorno.feed = result;
            return res.json(retorno);
          }
        });
    }
  },

  async delete(req, res) {
    const {
      id,
      isExcluido,
    } = req.body;

    // #region Gera Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    // #region Validações
    const erros = [];

    if (!id) {
      erros.push('Parâmetros insuficientes (id).');
    }

    if (!isExcluido) {
      erros.push('Parâmetros insuficientes (isExcluido).');
    }

    if (erros.length > 0) {
      logger.error(`Erro Feed Delete: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const feedBody = {
      id,
      isExcluido,
    };

    Feed.findByIdAndUpdate(feedBody.id, feedBody, { new: true },
      (err, feed) => {
        if (err) {
          logger.fatal(`Erro Feed Delete: ${err}`);
          res.status(500);
        }

        return res.json(feed);
      });
  },
};
