const objectId = require('mongoose').Types.ObjectId;
const querystring = require('querystring');
const axios = require('axios');
const log4js = require('log4js');
const KeywordFilter = require('keyword-filter');

const ModelConversa = require('../models/Conversa');
const ModelUsuario = require('../models/Usuario');

module.exports = {
  async post(req, res) {
    const { idConversa, userId, userName, createdAt } = req.body;

    let { text } = req.body;

    // #region Gera log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');

    // #endregion

    //  #region Validações
    const error = [];

    if (!idConversa || !objectId.isValid(idConversa)) {
      logger.error('Chat Post: Parâmetro idConversa não informado.');
      return res.status(400).json('Parâmetro idConversa não informado.');
    }

    const conversa = await ModelConversa.findById(idConversa);

    if (!conversa) {
      error.push('Conversa inexistente.');
    }

    if (!text) {
      error.push('Parâmetro text não informado.');
    }

    if (!userId) {
      error.push('Parâmetro userId não informado.');
    }

    if (!userName) {
      error.push('Parâmetro userName não informado.');
    }

    if (!createdAt) {
      error.push('Parâmetro createdAt não informado.');
    }

    if (error && error.length) {
      logger.error(`Chat Post: ${error}`);
      return res.status(400).json(error);
    }
    //  #endregion

    let score = 50;

    // #region consumo da IA
    try {
      const urlAPI =
        'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';
      const AppID = process.env.APP_ID; // Remember to create an account and set your AppID
      const queryString = querystring.stringify({
        q: text,
        timezoneOffset: 0,
        verbose: false,
        spellCheck: false,
        staging: false,
      });
      const response = await axios.get(`${urlAPI}${AppID}?${queryString}`);

      if (response) {
        score = Number(
          (response.data.sentimentAnalysis.score * 100).toFixed(2)
        );
      }
    } catch (err) {
      log4js.configure({
        appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
        categories: { default: { appenders: ['cheese'], level: 'error' } },
      });

      logger.fatal(`Chat Post: ${err}`);
    }
    // #endregion

    if (
      userId &&
      conversa &&
      conversa.Voluntario &&
      userId.toString() === conversa.Voluntario.toString()
    ) {
      const array = [
        'Arrombado',
        'Abestado',
        'Acéfalo',
        'Babaca',
        'Baitola',
        'Bosta',
        'Buceta',
        'Bicha',
        'Biba',
        'Burro',
        'Bundão',
        'Boçal',
        'Boqueteiro',
        'Bucetudo',
        'Bucetuda',
        'Besta',
        'Bixa',
        'Boceta',
        'Boiola',
        'Boquete',
        'Bosseta',
        'Burra',
        'Busseta',
        'Cabaço',
        'Cabaco',
        'Cuzão',
        'Cuzao',
        'Cagao',
        'Cagona',
        'Corna',
        'Corno',
        'Cornuda',
        'Cornudo',
        'Cuzuda',
        'Cuzudo',
        'Debil',
        'Desgraçado',
        'Demente',
        'Demônio',
        'Desgraça',
        'Escrota',
        'Escroto',
        'Energúmeno',
        'Filho da Puta',
        'Fudida',
        'Fudido',
        'Imbecil',
        'Iscrota',
        'Leprosa',
        'Leproso',
        'Lazarento',
        'Macaca',
        'Macaco',
        'Otaria',
        'Otario',
        'Otário',
        'Piroca',
        'Prostituta',
        'Prostituto',
        'Puta',
        'Puto',
        'Vagabunda',
        'Vagabundo',
        'Víado',
        'Viadao',
        'Vadia',
        'Viado',
        'Viadinho',
        'Xoxota',
      ];

      // eslint-disable-next-line no-undef
      const filter = new KeywordFilter();
      filter.init(array);

      if (filter.hasKeyword(text)) {
        logger.error(
          `Voluntario: ${userId}, Conversa: ${conversa.id}, Frase inapropriada: ${text}`
        );
        text = await filter.replaceKeywords(text, '*');

        const Voluntario = await ModelUsuario.findById(userId).select(
          'indexVolunteer -_id'
        );
        await ModelUsuario.findByIdAndUpdate(userId, {
          $set: {
            indexVolunteer: Voluntario.indexVolunteer - 1,
          },
        });
      }
    }

    const novaMensagem = {
      text,
      createdAt,
      userId,
      userName,
      score,
    };

    conversa.mensagens.push(novaMensagem);
    await conversa.save();

    return res.json(novaMensagem);
  },

  async get(req, res) {
    const idConversa = req.get('idConversa');

    // #region Gera Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const error = [];

    if (!idConversa) {
      error.push('Erro: nenhum parâmetro informado.');
    }

    if (error && error.length) {
      logger.error(`Chat Get: ${error}`);
      return res.status(400).json(error);
    }

    const conversa = await ModelConversa.findById(idConversa, {
      mensagens: { $slice: -15 },
    });

    if (!conversa || !conversa.mensagens || !conversa.mensagens.length) {
      error.push('Erro: Conversa não encontrada e/ou sem mensagens.');
    }

    if (error && error.length) {
      logger.error(`Chat Get: ${error}`);
      return res.status(400).json(error);
    }

    return res.json(conversa.mensagens);
  },
};
