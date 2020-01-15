import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import io from 'socket.io-client';
import { YellowBox, Dimensions } from 'react-native';
const KeywordFilter = require('keyword-filter');
import Cores from '../assets/cores';
import { enderecoAPI } from '../assets/ip';
import getover from '../assets/GETOVERFEED.png';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import api from '../services/api';

import "moment";
import "moment/locale/pt-br";

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

const socket = io(enderecoAPI);

socket.on('MensagemRecebida', (data) => {
  setMensagens(data);
});

export default function Chat({ navigation }) {
  //#region Constantes
  const [messages, setMessages] = useState([]);
  const [idFeed, setIdFeed] = useState('');
  const [idConversa, setIdConversa] = useState('');
  const [user, setUser] = useState({});
  const [isMinhaPublicacao, setIsMinhaPublicacao] = useState(false);
  const [isConectadoSocket, setIsConectadoSocket] = useState(false);
  const [arrayScore, setArrayScore] = useState([]);
  const [score, setScore] = useState(0);

  const tamanho = Dimensions.get('window').width;
  //#endregion

  //#region Métodos
  useEffect(() => {
    setIdFeed(navigation.getParam('idPublicacao'));
    setUser(navigation.getParam('user'));
    setIdConversa(navigation.getParam('idConversa'));
    setIsMinhaPublicacao(navigation.getParam('isMinhaPublicacao'));
    setIsConectadoSocket(true);

    return () => {
      socket.emit('SaindoConversa', { room: navigation.getParam('idConversa') });
    }
  }, []);

  useEffect(() => {
    if (idConversa) {
      GetMensagens(idConversa);
    }
  }, [idConversa]);

  useEffect(() => {
    if (isConectadoSocket) {
      socket.emit('EntrandoConversa', { room: idConversa });
    }
  }, [isConectadoSocket]);

  useEffect(() => {
    if (arrayScore.length) {
      let sum = 0;

      arrayScore.map((el) => {
        if (el && el > 0) {
          sum += el;
        }
      });

      const media = Number((sum / arrayScore.length).toFixed(2));

      if (media && media > 0) {
        setScore(media);
      }
    }
  }, [arrayScore]);

  setMensagens = (el) => {
    const msg = {
      _id: Math.random(),
      text: el.text,
      createdAt: el.createdAt,
      user: {
        _id: el.userId,
        name: el.userName
      },
    };

    setArrayScore([...arrayScore, el.score]);
    setMessages(GiftedChat.append(messages, msg));
  }

  async function GetMensagens(idConversa) {
    await api.get('/chat', { headers: { idConversa: idConversa } })
      .then(async function (response) {
        const promises = response.data.map(function (el, i) {
          return {
            _id: el._id,
            text: el.text,
            createdAt: el.createdAt,
            user: {
              _id: el.userId,
              name: el.userName
            }
          };
        });

        const array = [];
        response.data.map(function (el) {
          array.push(el.score);
        });

        if (!isMinhaPublicacao) {
          setArrayScore(array);
        }

        await Promise.all(promises).then(results => {
          results.reverse();
          setMessages(GiftedChat.append(messages, results));
        });
      })
      .catch(function (error) {
        // caso não tenha mensagens, vai cair aqui.
        console.log(error);
      });
  };

  const onSend = (newMessage = []) => {
    newMessage.map(function (el) {
      const novaMensagem = el.text;

      // #region Filtro de linguagem
      if (!isMinhaPublicacao) {
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

        if (filter.hasKeyword(novaMensagem)) {
          el.text = filter.replaceKeywords(novaMensagem, '*');
        }
      }

      setMessages(GiftedChat.append(messages, el));
      // #endregion

      const msg = {
        idConversa: idConversa,
        text: novaMensagem,
        createdAt: el.createdAt,
        userId: el.user._id,
        userName: el.user.name.trim(),
        score: 50,
      };

      api.post('/chat', msg).then((resp) => {
        msg.text = el.text;
        msg.score = resp.data.score;
        socket.emit('NovaMensagem', {
          room: idConversa,
          msg,
        });
      });
    });
  };

  onBackButtonPressAndroid = () => {
    navigation.navigate('ConversasInterno', { idPublicacao: idFeed, isPublicacaoUsuario: isMinhaPublicacao });
    return true;
  };

  renderSend = (props) => {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 10, marginBottom: 10 }}>
          <Text style={styles.textobtnEnviar}>Enviar</Text>
        </View>
      </Send>
    );
  };

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'white',
          },
          right: {
            backgroundColor: Cores.Amarelo,
          }
        }}
      />
    );
  };
  //#endregion

  return (
    <AndroidBackHandler style={styles.container} onBackPress={this.onBackButtonPressAndroid}>
      <View style={{ backgroundColor: Cores.CinzaEscuro }}>
        <Image source={getover} style={styles.header}></Image>
      </View>
      <View>
        <Text style={{ backgroundColor: Cores.Amarelo, height: 6 }}></Text>
      </View>

      {!isMinhaPublicacao ? (
        <View>
          <Text style={styles.barra} />
          <Text style={[styles.conteudoBarra, { width: (tamanho / 100) * score }]} />
        </View>
      ) : (<View></View>)
      }

      <GiftedChat
        messages={messages}
        onSend={newMessage => onSend(newMessage)}
        user={user}
        placeholder={'Escreva sua mensagem...'}
        renderSend={this.renderSend}
        locale={'pt-br'}
        renderBubble={this.renderBubble}
      />
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.FundoSecundario,
  },

  textobtnEnviar: {
    fontSize: 16
  },

  header: {
    margin: 10,
    marginLeft: 15,
    resizeMode: 'contain',
    width: 150,
  },

  barra: {
    backgroundColor: Cores.Branco,
    height: 20,
    borderColor: Cores.CinzaEscuro,
    borderRadius: 99,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
  },

  conteudoBarra: {
    position: "absolute",
    zIndex: 99,
    backgroundColor: Cores.Amarelo,
    height: 18,
    marginLeft: 21,
    borderRadius: 99,
    marginTop: 6,
  },
});