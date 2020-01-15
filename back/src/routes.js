const express = require('express');
const UsuarioController = require('./controllers/UsuarioController');
const LoginController = require('./controllers/LoginController');
const PerguntaController = require('./controllers/PerguntasController');
const PublicacaoController = require('./controllers/PublicacaoController');
const ConversaController = require('./controllers/ConversaController');
const DenunciaController = require('./controllers/DenunciaController');
const EsqueciMinhaSenhaController = require('./controllers/EsqueciMinhaSenhaController');
const LogController = require('./controllers/LogController');
const LuisIA = require('./controllers/LUISIA');
const ChatController = require('./controllers/ChatController');
const PerguntasFrequentesController = require('./controllers/PerguntasFrequentesController');
const Categorias = require('./controllers/CategoriaController');
const Notificacao = require('./controllers/NotificacaoController');

const routes = express.Router();

routes.get('/usuario', UsuarioController.get);
routes.post('/usuario', UsuarioController.store);
routes.put('/usuario', UsuarioController.update);
routes.delete('/usuario', UsuarioController.delete);
routes.post('/usuario/removeBlock', UsuarioController.RemoveBlock);
routes.post('/usuario/editNickName', UsuarioController.editNickName);
routes.post('/usuario/editSenha', UsuarioController.editSenha);
routes.get('/usuario/:userId', UsuarioController.getBlock);

routes.post('/publicacao', PublicacaoController.post);
routes.get('/publicacao', PublicacaoController.get);
routes.delete('/publicacao', PublicacaoController.delete);
routes.put('/publicacao', PublicacaoController.update);

routes.post('/conversa', ConversaController.post);
routes.get('/conversa', ConversaController.get);
routes.post('/conversa/feed', ConversaController.getPosts);

routes.post('/ajuda', PerguntasFrequentesController.post);
routes.get('/ajuda', PerguntasFrequentesController.get);
routes.delete('/ajuda', PerguntasFrequentesController.delete);
routes.post('/ajuda/:idPergunta', PerguntasFrequentesController.postPerguntas);

routes.post('/categoria', Categorias.post);
routes.get('/categoria', Categorias.get);
routes.delete('/categoria', Categorias.delete);
routes.get('/categoria/:idCategoria', Categorias.getPerguntas);

routes.post('/notificacao', Notificacao.post);
routes.get('/notificacao', Notificacao.get);

routes.get('/pergunta', PerguntaController.get);
routes.post('/pergunta', PerguntaController.post);

routes.post('/chat', ChatController.post);
routes.get('/chat', ChatController.get);

routes.post('/publicacao/:userId/denuncia', DenunciaController.post);

routes.post('/esqueciMinhaSenha', EsqueciMinhaSenhaController.post);

routes.get('/denuncia', DenunciaController.get);

routes.post('/log', LogController.post);

routes.post('/luisia', LuisIA.post);

routes.post('/login', LoginController.post);

module.exports = routes;
