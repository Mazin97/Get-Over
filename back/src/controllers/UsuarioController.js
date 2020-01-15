const { ObjectId } = require('mongoose').Types.ObjectId;
const log4js = require('log4js');
const User = require('../models/Usuario');
const cripto = require('./CryptoController');

async function ValidateCreate(user) {
  const erro = [];

  if (!user) {
    erro.push('Erro: Parâmetros insuficientes.');
    return erro;
  }

  if (!user.name) {
    erro.push('Erro: Nome não informado.');
  } else if (user.name.length <= 3 || user.name.length > 30) {
    erro.push('Erro: Nome inválido.');
  }

  if (!user.secondName) {
    erro.push('Erro: Sobrenome não informado.');
  } else if (user.secondName.length <= 3 || user.secondName.length > 30) {
    erro.push('Erro: Sobrenome inválido.');
  }

  if (!user.birthDate) {
    erro.push('Erro: Data de nascimento não informada.');
  } else if (user.birthDate.length !== 10) {
    erro.push('Erro: Data de nascimento inválida.');
  }

  if (!user.email) {
    erro.push('Erro: E-mail não informado.');
  } else if (user.email.length <= 3 || user.email.length > 50 || user.email.indexOf('@') < 0) {
    erro.push('Erro: E-mail inválido.');
  }

  if (!user.password) {
    erro.push('Erro: Senha não informada.');
  } else if (user.password.length < 6 || user.password.length > 50) {
    erro.push('Erro: Senha inválida, é obrigatório no mínimo 6 caracteres.');
  }

  if (user.isAnonimous === null || user.isAnonimous === undefined) {
    erro.push('Erro: Flag anonimato não informada.');
  }

  if (user.indexPacient && (user.indexPacient < 0 || user.indexPacient > 100)) {
    erro.push('Erro: índice do paciente está fora do range aceito. (0 - 100)');
  }

  if (user.indexVolunteer && (user.indexVolunteer < 0 || user.indexVolunteer > 100)) {
    erro.push('Erro: índice do voluntário está fora do range aceito. (0 - 100)');
  }

  if (user.nickName && (user.nickName.length <= 3 || user.nickName.length > 30)) {
    erro.push('Erro: Tamanho inválido para o Apelido.');
  }

  if (user.gender && (user.gender.length <= 3 || user.gender.length > 30)) {
    erro.push('Erro: Tamanho inválido para o Gênero.');
  }

  await User.findOne({ email: user.email }, (err, doc) => {
    if (err) {
      erro.push('Erro: erro interno, tente novamente mais tarde.');
    }

    if (doc !== null) {
      erro.push('Erro: E-mail já cadastrado.');
    }
  });

  return erro;
}

async function ValidateUpdate(user) {
  const erro = [];

  if (!user) {
    erro.push('Erro: Parâmetros insuficientes.');
    return erro;
  }

  if (user.name && (user.name.length <= 3 || user.name.length > 30)) {
    erro.push('Erro: Nome inválido.');
  }

  if (user.secondName && (user.secondName.length <= 3 || user.secondName.length > 30)) {
    erro.push('Erro: Sobrenome inválido.');
  }

  if (user.birthDate && user.birthDate.length !== 10) {
    erro.push('Erro: Data de nascimento inválida.');
  }

  if (user.email && (user.email.length <= 3 || user.email.length > 50 || user.email.indexOf('@') < 0)) {
    erro.push('Erro: E-mail inválido.');
  }

  if (user.password && (user.password.length < 6 || user.password.length > 50)) {
    erro.push('Erro: Senha inválida, é obrigatório no mínimo 6 caracteres.');
  }

  if (user.indexPacient && (user.indexPacient < 0 || user.indexPacient > 100)) {
    erro.push('Erro: índice do paciente está fora do range aceito. (0 - 100)');
  }

  if (user.indexVolunteer && (user.indexVolunteer < 0 || user.indexVolunteer > 100)) {
    erro.push('Erro: índice do voluntário está fora do range aceito. (0 - 100)');
  }

  if (user.nickName && (user.nickName.length <= 3 || user.nickName.length > 30)) {
    erro.push('Erro: Tamanho inválido para o Apelido.');
  }

  if (user.gender && (user.gender.length <= 3 || user.gender.length > 30)) {
    erro.push('Erro: Tamanho inválido para o Gênero.');
  }

  return erro;
}

module.exports = {
  async get(req, res) {
    const { id, email } = req.headers;

    if (id) {
      return res.json(await User.findById(id));
    }

    if (email) {
      return res.json(await User.findOne({ email }));
    }

    return res.json(await User.find());
  },

  async update(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    //  #region Resgate dos parâmetros
    const {
      id,
      name,
      secondName,
      email,
      password,
      isAnonimous,
      indexPacient,
      indexVolunteer,
      gender,
      nickName,
      birthDate,
    } = req.body;

    const userBody = {};

    if (id) {
      userBody.id = id;
    }
    if (name) {
      userBody.name = name;
    }
    if (secondName) {
      userBody.secondName = secondName;
    }
    if (password) {
      userBody.password = password;
    }
    if (email) {
      userBody.email = email;
    }
    if (isAnonimous) {
      userBody.isAnonimous = isAnonimous;
    }
    if (indexPacient) {
      userBody.indexPacient = indexPacient;
    }
    if (indexVolunteer) {
      userBody.indexVolunteer = indexVolunteer;
    }

    if (gender) {
      userBody.gender = gender;
    }

    if (nickName) {
      userBody.nickName = nickName;
    }

    if (birthDate) {
      userBody.birthDate = birthDate;
    }
    //  #endregion

    if (!userBody.id) {
      logger.error('Usuario Update: Erro: usuário não encontrado, valide os parâmetros.');
      return res.status(400).json('Erro: usuário não encontrado, valide os parâmetros.');
    }

    const error = await ValidateUpdate(userBody);

    if (error.length > 0) {
      logger.error(`Usuario Update: ${error}`);
      return res.status(400).json(error);
    }

    if (userBody.password) {
      userBody.password = await cripto.encrypt(userBody.password);
    }

    if (!userBody.id || !ObjectId.isValid(userBody.id)) {
      return res.status(400).json('Erro: usuário não encontrado, valide os parâmetros.');
    }

    if (birthDate) {
      const dateParts = birthDate.split('/');
      const dtNascimento = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      userBody.birthDate = dtNascimento;
    }

    return res.json(await User.findByIdAndUpdate(userBody.id, userBody, { new: true }));
  },

  async store(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const {
      name,
      secondName,
      email,
      password,
      isAnonimous,
      indexPacient,
      indexVolunteer,
      gender,
      nickName,
      birthDate,
    } = req.body;

    const userBody = {
      name,
      secondName,
      email,
      password,
      isAnonimous,
      indexPacient,
      indexVolunteer,
      gender,
      nickName,
      birthDate,
    };

    const error = await ValidateCreate(userBody);

    if (error.length > 0) {
      res.status(400);
      logger.error(`Usuario Post: ${error}`);
      return res.json(error);
    }

    const passCripto = cripto.encrypt(password);

    const dateParts = birthDate.split('/');
    const dtNascimento = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

    const newUser = await User.create({
      name,
      secondName,
      email,
      password: passCripto,
      isAnonimous,
      indexPacient,
      indexVolunteer,
      gender,
      nickName,
      birthDate: dtNascimento,
    });

    return res.json(newUser);
  },

  async delete(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const { id, email } = req.headers;
    const error = [];

    if (id) {
      await User.findByIdAndRemove(id, (err) => {
        if (err) {
          res.status(400);
          logger.error(`Usuario Delete: ${err}`);
          return res.json('Erro interno, tente novamente mais tarde.');
        }

        return res.json('Sucesso! usuário removido.');
      });
    } else if (email) {
      await User.findOneAndRemove({ email }, (err) => {
        if (err) {
          res.status(400);
          logger.error(`Usuario Delete: ${err}`);
          return res.json('Erro interno, tente novamente mais tarde.');
        }

        return res.json('Sucesso! usuário removido.');
      });
    } else {
      error.push('Parâmetros insuficientes.');
      logger.error(`Usuario Delete: ${error}`);
      res.status(400);
      return res.json('Parâmetros insuficientes.');
    }

    return res.end();
  },

  async getBlock(req, res) {
    const id = req.params.userId;

    if (!id) {
      return res.status(400).json('Erro: Parâmetros insuficientes.');
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(400);
      return res.json('Erro: Usuario não encontrado.');
    }

    const promises = user.usuariosBloqueados.map(async (el) => {
      const usuarioBloqueado = await User.findById(el);

      if (usuarioBloqueado) {
        return {
          id: usuarioBloqueado.id,
          name: usuarioBloqueado.nickName
            ? usuarioBloqueado.nickName
            : `${usuarioBloqueado.name} ${usuarioBloqueado.secondName}`,
        };
      }

      return null;
    });

    return res.json(await Promise.all(promises));
  },

  async RemoveBlock(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const { idUsuario, idBlocked } = req.body;

    const error = [];

    if (!idUsuario || !ObjectId.isValid(idUsuario)) {
      error.push('Parâmetro idUsuario não informado e/ou inválido.');
      logger.error(`Usuario Remove Block: ${error}`);
      return res.status(400).json(error);
    }

    if (!idBlocked || !ObjectId.isValid(idBlocked)) {
      error.push('Parâmetro idBlocked não informado e/ou inválido.');
      logger.error(`Usuario Remove Block: ${error}`);
      return res.status(400).json(error);
    }

    const usuario = await User.findById(idUsuario);

    if (!usuario || !usuario.usuariosBloqueados || usuario.usuariosBloqueados.length === 0) {
      error.push('Usuário não encontrado e/ou nenhum usuário bloqueado.');
      logger.error(`Usuario Remove Block: ${error}`);
      return res.status(400).json(error);
    }

    usuario.usuariosBloqueados.splice(idBlocked, 1);
    await usuario.save();

    return res.json(usuario);
  },

  async editNickName(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const { id, nickName, password } = req.body;

    //  #region Validações
    const error = [];

    if (!id) {
      error.push('usuario não informado.');
    }

    if (!nickName) {
      error.push('Novo Apelido não informado.');
    }

    if (!password) {
      error.push('Senha não informada.');
    }

    if (error && error.length) {
      logger.error(`Usuario EditNick: ${error}`);
      return res.status(400).json(error);
    }

    const user = await User.findById(id);

    if (!user) {
      error.push('Usuário não encontrado.');
    }

    if (cripto.encrypt(password) !== user.password) {
      error.push('Erro: senha incorreta, digite novamente.');
    }

    if (error && error.length) {
      logger.error(`Usuario EditNick: ${error}`);
      return res.status(400).json(error);
    }
    // #endregion

    user.nickName = nickName;
    await user.save();

    return res.json(user);
  },

  async editSenha(req, res) {
    // #region Configuração Log
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'error' } },
    });

    const logger = log4js.getLogger('cheese');
    // #endregion

    const { id, password, newPassword } = req.body;

    //  #region Validações
    const error = [];

    if (!id) {
      error.push('usuario não informado.');
    }

    if (!password) {
      error.push('Senha não informada.');
    }

    if (!newPassword) {
      error.push('Nova senha não informada.');
    }

    if (error && error.length) {
      logger.error(`Usuario EditSenha: ${error}`);
      return res.status(400).json(error);
    }

    const usuario = await User.findById(id);

    if (!usuario) {
      error.push('Usuário não encontrado.');
    }

    if (cripto.encrypt(password) !== usuario.password) {
      error.push('Erro: senha atual incorreta, digite novamente.');
    }

    if (error && error.length) {
      logger.error(`Usuario EditSenha: ${error}`);
      return res.status(400).json(error);
    }
    // #endregion

    usuario.password = cripto.encrypt(newPassword);
    await usuario.save();

    return res.json(usuario);
  },
};
