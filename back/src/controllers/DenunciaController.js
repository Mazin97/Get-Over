const { ObjectId } = require('mongoose').Types.ObjectId;
const log4js = require('log4js');
const Feed = require('../models/Publicacao');
const User = require('../models/Usuario');

module.exports = {
  async post(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const idDenunciante = req.params.userId;
    const {
      motivo, idPublicacao, isBloquear,
    } = req.body;
    let publicacao = {};

    // #region Validações
    const erros = [];

    if (!idDenunciante || !ObjectId.isValid(idDenunciante)) {
      // 'Parâmetro inválido (userId)'
      erros.push('Ocorreu um erro interno, tente novamente mais tarde.');
    }

    if (!motivo || motivo.length <= 0) {
      erros.push('Por favor, informe um motivo.');
    }

    if (!idPublicacao || !ObjectId.isValid(idPublicacao)) {
      // Parâmetro inválido (idPublicacao)
      erros.push('Ocorreu um erro interno, tente novamente mais tarde.');
    } else {
      try {
        publicacao = await Feed.findById(idPublicacao).populate('usuario', 'id');

        if (!publicacao) {
          erros.push('Erro: Publicação não encontrada.');
        }

        if (publicacao && publicacao.isExcluido) {
          erros.push('Erro: publicação exclúida.');
        }
      } catch (error) {
        logger.fatal(`Erro Denuncia: ${error}`);
      }
    }

    try {
      await User.findById(ObjectId(idDenunciante), (err, result) => {
        if (err) {
          erros.push('Erro: denunciante não encontrado.');
        }

        if (!result) {
          erros.push('Erro: Usuário denunciante não encontrado.');
        } else if (isBloquear) {
          if ((publicacao.usuario.id !== result.id)
            && !result.usuariosBloqueados.includes(publicacao.usuario.id)) {
            result.usuariosBloqueados.push(ObjectId(publicacao.usuario.id));
            result.save();
          }
        }
      });
    } catch (error) {
      logger.fatal(`Erro Denuncia: ${error}`);
    }

    if (erros && erros.length) {
      logger.error(`Erro Denuncia: ${erros}`);
      return res.status(400).json(erros);
    }
    // #endregion

    const novaDenuncia = {
      motivo,
      idDenunciante,
    };

    publicacao.denuncias.push(novaDenuncia);
    await publicacao.save();

    return res.json(publicacao);
  },

  // eslint-disable-next-line consistent-return
  async get(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const error = [];

    const idPublicacao = req.get('idPublicacao');

    if (!ObjectId.isValid(idPublicacao)) {
      error.push('Parâmetro idPublicacao inválido.');
    }

    if (error && error.length) {
      logger.error(`Denuncia Get: ${error}`);
      return res.status(400).json(error);
    }

    Feed.findById(idPublicacao).exec((err, result) => {
      if (err) {
        logger.fatal(`Denuncia Get: ${err}`);
        return res.status(400).json(err);
      }

      return res.json(result.denuncias);
    });
  },
};
