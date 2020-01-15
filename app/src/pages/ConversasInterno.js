import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { Icon } from 'react-native-elements'

import api from '../services/api';
import Axios from 'axios';

export default function ConversasInterno({ navigation }) {
  // #region Constantes
  const [isMinhaPublicacao, setIsMinhaPublicacao] = useState(false);
  const [idFeed, setIdFeed] = useState('');
  const [conversas, setConversas] = useState([]);

  const source = Axios.CancelToken.source();
  // #endregion

  // #region Métodos
  useEffect(() => {
    setIsMinhaPublicacao(navigation.getParam('isPublicacaoUsuario'));
    setIdFeed(navigation.getParam('idPublicacao'));

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (idFeed) {
      loadConversas();
    }
  }, [idFeed]);

  onBackButtonPressAndroid = () => {
    navigation.navigate('Conversas');
    return true;
  };

  async function loadConversas() {
    try {
      const conversasPaciente = await api.get('/conversa', { headers: { Publicacao: idFeed, isPublicacaoUsuario: isMinhaPublicacao }, cancelToken: source.token });
      setConversas(conversasPaciente.data);
    } catch (error) {
      if (Axios.isCancel(error)) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  }

  function getDataUltimaMensagem(created, updated) {
    if (created === updated) {
      return 'Sem mensagens';
    }
    else {
      return `${formatDate(updated)}`;
    }
  }

  function formatDate(data) {
    var datePart = data.match(/\d+/g),
      year = datePart[0].substring(0, 10),
      month = datePart[1],
      day = datePart[2],
      hour = datePart[3],
      min = datePart[4];

    return `${day}/${month}/${year} - ${hour - 3}:${min}`;
  };

  function getTextoUltimaMensagem(mensagens) {
    if (!mensagens.length) {
      return '';
    } else {
      const index = mensagens.length - 1 !== 0 ? mensagens.length - 1 : 0;
      return mensagens[index].text.substring(0, 10) + '...';
    }
  }

  ListaVazia = () => {
    return (<View>
      <Text style={styles.TextVazio}>
        Você ainda não possui nenhuma conversa para esta publicação.
      </Text>
    </View>)
  }

  function handleAbrirConversa(id, user) {
    navigation.navigate('Chat', { idPublicacao: idFeed, idConversa: id, user, isMinhaPublicacao });
  }
  // #endregion

  return (
    <AndroidBackHandler style={styles.container} onBackPress={this.onBackButtonPressAndroid}>
      <View style={{ backgroundColor: Cores.CinzaEscuro }}>
        <Image source={getover} style={styles.header}></Image>
      </View>
      <View>
        <Text style={{ backgroundColor: Cores.Amarelo, height: 6 }}></Text>
      </View>

      <FlatList
        ref={ref => { this.flatList_Ref = ref; }}
        extraData={conversas}
        data={conversas}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <View style={styles.card}>
            {isMinhaPublicacao === true ? (
              <View style={styles.category}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.nome}>{item.Voluntario.name}</Text>
                    <Text style={styles.data}>{getDataUltimaMensagem(item.createdAt, item.updatedAt)}</Text>
                  </View>
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      onPress={() => handleAbrirConversa(item._id, item.Paciente)}
                      style={{ paddingTop: 50 }}
                    >
                      <Icon
                        name={'arrow-right-bold-circle'}
                        type='material-community'
                        color={Cores.CinzaIcone}
                        size={40}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
              : (
                <View style={styles.category}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      <Text style={styles.nome}>{item.Paciente.name}</Text>
                      <Text style={styles.data}>{getDataUltimaMensagem(item.createdAt, item.updatedAt)}</Text>
                    </View>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={() => handleAbrirConversa(item._id, item.Voluntario)}
                        style={{ paddingTop: 50 }}
                      >
                        <Icon
                          name={'arrow-right-bold-circle'}
                          type='material-community'
                          color={Cores.CinzaIcone}
                          size={40}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            <View>
              <Text style={styles.text}>
                {getTextoUltimaMensagem(item.mensagens)}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={this.ListaVazia}
      />
    </AndroidBackHandler >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.FundoSecundario,
  },

  header: {
    margin: 10,
    marginLeft: 15,
    resizeMode: 'contain',
    width: 150,
  },

  card: {
    flex: 1,
    backgroundColor: Cores.Branco,
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    shadowColor: 'rgba(192, 208, 230, 0.8)',
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  verMais: {
    flex: 1,
    alignSelf: 'flex-end',
    color: Cores.Amarelo,
    paddingTop: 10
  },

  category: {
    flex: 1,
    flexDirection: 'column',
  },

  data: {
    color: Cores.Preto,
    alignItems: 'flex-start',
    fontSize: 12,
    fontStyle: 'italic'
  },

  nome: {
    color: Cores.Amarelo,
    alignItems: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold'
  },

  text: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 5,
    marginTop: 5,
  },

  buttons: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row-reverse',
    width: 24,
    height: 24,
  },

  TextVazio: {
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Cores.Cinza,
  },
});