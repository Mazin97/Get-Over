const axios = require('axios');
const querystring = require('querystring');
const log4js = require('log4js');

axios.defaults.headers.common['Ocp-Apim-Subscription-Key'] = '<Key>';

module.exports = {
  // eslint-disable-next-line consistent-return
  async post(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion
    const { mensagem } = req.body;

    if (!mensagem) {
      logger.error(`LUISIA Post: Erro: Parâmetro não informado. ${mensagem}`);
      return res.status(400).json(`Erro: Parâmetro não informado. ${mensagem}`);
    }

    try {
      const urlAPI = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';
      const AppID = '<AppId>';
      const queryString = querystring.stringify({
        q: mensagem, timezoneOffset: 0, verbose: false, spellCheck: false, staging: false,
      });
      const response = await axios.get(`${urlAPI}${AppID}?${queryString}`);
      return res.json(Number((response.data.sentimentAnalysis.score * 100).toFixed(2)));
    } catch (error) {
      logger.fatal(`LUISIA Post: ${error}`);
      return res.status(400).json(`LUISIA Post: ${error}`);
    }
  },
};
