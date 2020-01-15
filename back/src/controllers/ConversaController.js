const objectId = require('mongoose').Types.ObjectId;

const log4js = require('log4js');
const ModelConversa = require('../models/Conversa');
const ModelUsuario = require('../models/Usuario');
const ModelFeed = require('../models/Publicacao');

module.exports = {
  async post(req, res) {
    const { Voluntario, Paciente, Publicacao } = req.body;

    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');

    //  #region Validações
    const error = [];

    if (!Voluntario || !objectId.isValid(Voluntario)) {
      error.push('Parâmetros insuficientes e/ou inválidos (idVoluntario).');
    }

    if (!Paciente || !objectId.isValid(Paciente)) {
      error.push('Parâmetros insuficientes e/ou inválidos (idPaciente).');
    }

    if (!Publicacao || !objectId.isValid(Publicacao)) {
      error.push('Parâmetros insuficientes e/ou inválidos (idPublicacao).');
    }

    if (error && error.length) {
      logger.error(`Conversa Post: ${error}`);
      return res.status(400).json(error);
    }

    const paciente = await ModelUsuario.findById(Paciente);
    if (!paciente) {
      error.push('Paciente informado inexistente.');
    }

    const voluntario = await ModelUsuario.findById(Voluntario);
    if (!voluntario) {
      error.push('Voluntário informado inexistente.');
    }

    const feed = await ModelFeed.findById(Publicacao);
    if (!feed) {
      error.push('Publicação informada inexistente.');
    }

    const conversa = await ModelConversa.findOne({
      $and: [
        { Voluntario },
        { Paciente },
        { Publicacao },
      ],
    });

    if (conversa) {
      error.push('Conversa entre este paciente e voluntário já inicializada para esta publicação.');
    }

    if (error && error.length) {
      logger.error(`Conversa Post: ${error}`);
      return res.status(400).json(error);
    }
    //  #endregion

    const newConversa = await ModelConversa.create({
      Voluntario,
      Paciente,
      Publicacao,
      isExcluido: false,
    });

    return res.json(newConversa);
  },

  async get(req, res) {
    const idUsuarioVoluntario = req.get('Voluntario');
    const idPublicacao = req.get('Publicacao');
    const idUsuarioPaciente = req.get('Paciente');
    const isExcluido = req.get('isExcluido');

    // #region Gera Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const error = [];

    if (!idUsuarioVoluntario && !idPublicacao && !idUsuarioPaciente) {
      error.push('Erro: nenhum parâmetro informado.');
    }

    if (idPublicacao) {
      return res.json(await ModelConversa.find({
        $and: [
          { Publicacao: idPublicacao },
        ],
      })
        .slice('mensagens', [-1, 1])
        .select('id createdAt updatedAt')
        .populate('Voluntario', 'name')
        .populate('Paciente', 'name'));
    }

    if (idUsuarioVoluntario) {
      return res.json(await ModelConversa.find({
        $and: [
          { Voluntario: idUsuarioVoluntario },
        ],
      }));
    }

    if (idUsuarioPaciente) {
      return res.json(await ModelConversa.find({
        $and: [
          { Paciente: idUsuarioPaciente },
        ],
      }).populate('Voluntario', 'name'));
    }

    if (isExcluido) {
      return res.json(await ModelConversa.find({
        $and: [
          { isExcluido: true },
        ],
      }));
    }

    if (error && error.length) {
      logger.error(`Conversa Get: ${error}`);
      return res.status(400).json(error);
    }

    return res.status(400).json('Erro interno. Tente novamente mais tarde.');
  },

  async getPosts(req, res) {
    const {
      idUsuario,
      pagina,
      tamanhoPagina,
      isExcluido,
    } = req.body;

    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');

    const error = [];


    if (!idUsuario || !objectId.isValid(idUsuario)) {
      error.push('Erro: parâmetro inválido (idUsuario)');
    }

    if (error && error.length) {
      logger.error(`Conversa Get: ${error}`);
      return res.status(400).json(error);
    }

    const retorno = {
      pagina,
      tamanhoPagina,
      total: 0,
    };

    const qtd = await ModelConversa.countDocuments({
      $or: [
        { Voluntario: idUsuario },
        { Paciente: idUsuario },
      ],
    });

    retorno.total = Math.round(qtd / tamanhoPagina);

    if (isExcluido) {
      retorno.feed = await ModelConversa
        .find()
        .select('_id isExcluido')
        .skip(tamanhoPagina * pagina)
        .limit(Number(tamanhoPagina))
        .populate({
          path: 'Publicacao',
          select: 'categoria createdAt texto',
          populate: {
            path: 'usuario',
            select: 'name',
          },
        });

      return res.json(retorno);
    }

    retorno.feed = await ModelConversa
      // eslint-disable-next-line max-len
      .find({ isExcluido: { $nin: true }, $or: [{ Voluntario: idUsuario }, { Paciente: idUsuario }] })
      .skip(tamanhoPagina * pagina)
      .limit(Number(tamanhoPagina))
      .populate({
        path: 'Publicacao',
        select: 'categoria createdAt texto',
        populate: {
          path: 'usuario',
          select: 'name',
        },
      });

    return res.json(retorno);
  },
};
