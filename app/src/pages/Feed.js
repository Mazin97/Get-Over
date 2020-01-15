import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CardImage } from 'react-native-cards';
import ViewMoreText from 'react-native-view-more-text';
import styled from 'styled-components/native';
import api from '../services/api';
import { YellowBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import getover from '../assets/GETOVERFEED.png';
import Cores from '../assets/cores';

YellowBox.ignoreWarnings([
  'componentWillMount'
]);

export default function Feed({ navigation }) {
  //#region Constantes
  const [publicacoes, setPublicacoes] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  //#endregion

  //#region Métodos
  useEffect(() => {
    carregarId();
    loadPage();

    this.focusListener = navigation.addListener('didFocus', () => {
      if (publicacoes.length > 0) {
        try {
          this.flatList_Ref.scrollToIndex({ animated: true, index: 0 });
        } catch (error) { }
      }

      Keyboard.dismiss();
      loadPage();
    });
  }, []);

  useEffect(() => {
    if (pagina > total) {
      setPagina(total);
    }
  }, [pagina]);

  async function carregarId() {
    await AsyncStorage.getItem('id').then(response => { setId(response) });
  };

  async function loadPage() {
    setLoading(true);

    if (publicacoes.length && total <= pagina) {
      setLoading(false);
      return;
    }

    const objHeaders = {
      pagina,
      tamanhoPagina: 10
    };
    
    const usuarioVolunteer = await AsyncStorage.getItem('indexVolunteer');
    if (usuarioVolunteer) {
      objHeaders.usuarioVolunteer = id;
    }

    api.get('/publicacao', { headers: objHeaders })
      .then(response => {
        setLoading(false);
        setPublicacoes([...publicacoes, ...response.data.feed]);
        setTotal(response.data.total);
        setPagina(pagina + 1);
      })
      .catch(() => {
        Alert.alert(
          'Erro!',
          'Ocorreu um erro interno, tente novamente mais tarde.',
          [
            { text: 'OK' },
          ],
          { cancelable: false },
        );
      });
  };

  async function handleConversar(idUsuario, idPublicacao) {
    const indexVoluntario = await AsyncStorage.getItem('indexVolunteer');

    if (!indexVoluntario) {
      navigation.navigate('TriagemVoluntario');
      return;
    }

    const idVoluntario = await AsyncStorage.getItem('id');

    if (!idVoluntario || !idUsuario || !idPublicacao) {
      Alert.alert(
        'Erro!',
        'Ocorreu um erro interno, por favor tente novamente mais tarde.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
    }

    api.post('/Conversa', { Voluntario: idVoluntario, Paciente: idUsuario, Publicacao: idPublicacao })
      .then(res => {
        navigation.navigate('Conversas');
      })
      .catch((err) => {
        Alert.alert(
          'Erro!',
          err.response.data[0],
          [
            { text: 'OK' },
          ],
          { cancelable: false },
        );
      });
  };

  async function handleEditarPublicacao(idPublicacao, mensagem, categoria) {
    navigation.navigate('Novo Post', { idPublicacao: idPublicacao, texto: mensagem, categoria: categoria });
  };

  function handleExcluirPublicacao(idPublicacao, index) {
    Alert.alert(
      'Aviso',
      'Tem certeza que deseja excluir a publicação? você não poderá mais acessar conversas da mesma.',
      [
        {
          text: 'Sim',
          onPress: async () => {
            // #region Método Exclusão
            api.delete('/publicacao', { data: { id: idPublicacao, isExcluido: true } })
            .then(response => {
              if (response) {
                Alert.alert(
                  'Sucesso!',
                  'Publicação excluida com sucesso.',
                  [
                    {
                      text: 'Ok',
                      onPress: () => removerItem(index),
                    },
                  ],
                  { cancelable: false },
                );
              }
            })
            .catch(function (error) {
              if (error.response) {
                Alert.alert(
                  'Erro!',
                  error.response.data[0],
                  [
                    { text: 'OK' },
                  ],
                  { cancelable: false },
                );
              }
            });
            // #endregion
          }
        },
        {
          text: 'Voltar',
          style: 'cancel'
        }
      ],
      { cancelable: true },
    )
  };

  async function removerItem(index) {
    if (index !== -1) {
      let array = [...publicacoes];
      array.splice(index, 1);
      setPublicacoes(array);
    }
  };

  async function handleDenunciarPublicacao(idPublicacao, name, idUsuario) {
    navigation.navigate('NovaDenuncia', { idPublicacao: idPublicacao, name: name, idUsuario: idUsuario });
  };

  function handleViewMore(onPress) {
    return (
      <Text onPress={onPress} style={styles.verMais}>Ver Mais</Text>
    )
  };

  function handleViewLess(onPress) {
    return (
      <Text onPress={onPress} style={styles.verMais}>Ver Menos</Text>
    )
  };

  function formatDate(data) {
    var datePart = data.match(/\d+/g),
      year = datePart[0].substring(0, 10),
      month = datePart[1], day = datePart[2];
    hour = datePart[3], min = datePart[4];

    return day + '/' + month + '/' + year;
  };

  function getCorCirculo(value) {
    switch (value) {
      case 'Trabalho':
        return Cores.circuloAzulEscuro;
      case 'Depressão':
        return Cores.circuloVermelho;
      case 'Ansiedade':
        return Cores.circuloVerdeClaro;
      case 'Família':
        return Cores.circuloAmarelo;
      case 'Sexualidade':
        return Cores.circuloVerdeEscuro;
      case 'Agressão Física':
        return Cores.circuloRoxo;
      case 'Bullying':
        return Cores.circuloAzulClaro;
      case 'Relacionamento':
        return Cores.circuloLaranja;
      default:
      // code block
    }
  };

  ListaVazia = () => {
    return (<View>
      <Text style={styles.TextVazio}>
        Ainda não há publicações postadas.
      </Text>
    </View>)
  };
  //#endregion

  return (
    <SafeAreaView style={styles.container} >
      <View style={{ backgroundColor: Cores.CinzaEscuro }}>
        <Image source={getover} style={styles.header}></Image>
      </View>
      <View>
        <Text style={{ backgroundColor: Cores.Amarelo, height: 6, marginBottom: 5 }}></Text>
      </View>
      <View>
        <FlatList
          ref={ref => { this.flatList_Ref = ref; }}
          extraData={publicacoes}
          data={publicacoes}
          onEndReached={() => loadPage()}
          onEndReachedThreshold={0.1}
          style={{ marginBottom: 60 }}
          refreshing={true}
          ListFooterComponent={loading && <Loading />}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <CardImage style={[styles.circuloCategoria, { backgroundColor: getCorCirculo(item.categoria) }]} title={item.categoria} />
              <View style={styles.category}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.nome}>{item.usuario.name}</Text>
                    <Text style={styles.data}>Post: {formatDate(item.createdAt)}</Text>
                  </View>
                  <View style={styles.buttons}>
                    {id === item.usuario._id ? (
                      <View style={styles.buttons}>
                        <TouchableOpacity onPress={() => handleExcluirPublicacao(item._id, index)}>
                          <View>
                            <Icon
                              name='trashcan'
                              type='octicon'
                              color={Cores.CinzaIcone}
                              size={35}
                              iconStyle={{ marginLeft: 10 }}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEditarPublicacao(item._id, item.texto, item.categoria)}>
                          <View>
                            <Icon
                              name='chat'
                              type='MaterialIcons'
                              color={Cores.CinzaIcone}
                              size={35}
                              iconStyle={{ marginRight: 10 }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : (
                        <View style={styles.buttons}>
                          <View>
                            <TouchableOpacity onPress={() => handleConversar(item.usuario._id, item._id)}>
                              <Ionicons name={'ios-send'} size={35} color={Cores.CinzaIcone} style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity onPress={() => handleDenunciarPublicacao(item._id, item.usuario.name, item.usuario._id)}>
                            <View>
                              <Ionicons name={'ios-warning'} size={35} color={Cores.CinzaIcone} style={{ marginRight: 10 }} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                  </View>
                </View>
              </View>
              <View>
                <ViewMoreText
                  numberOfLines={4}
                  renderViewMore={handleViewMore}
                  renderViewLess={handleViewLess}
                >
                  <Text style={styles.text}>
                    {item.texto}
                  </Text>
                </ViewMoreText>
              </View>
            </View>
          )}
          ListEmptyComponent={this.ListaVazia}
        />
      </View>
    </SafeAreaView>
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

  imagem: {
    position: 'absolute',
    top: -16,
    left: -10,
    width: 24,
    height: 24,
    borderRadius: 50,
    marginTop: 8,
  },

  feed: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  category: {
    flex: 1,
    flexDirection: 'column',
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

  verMais: {
    flex: 1,
    alignSelf: 'flex-end',
    color: Cores.Amarelo,
    paddingTop: 10
  },

  data: {
    color: Cores.Amarelo,
    alignItems: 'flex-start',
    fontSize: 14,
  },

  titulos: {
    color: Cores.Amarelo,
    alignItems: 'flex-start'
  },

  nome: {
    color: Cores.Amarelo,
    alignItems: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold'
  },

  empty: {
    alignSelf: 'center',
    color: Cores.Cinza,
    fontSize: 24,
    fontWeight: 'bold'
  },

  circuloCategoria: {
    position: 'absolute',
    top: -16,
    left: -10,
    width: 24,
    height: 24,
    borderRadius: 50,
    marginTop: 8,
  },

  disable: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    height: 36,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.Cinza,
  },

  modalCard: {
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    shadowColor: 'rgba(192, 208, 230, 0.8)',
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: Cores.FundoPadrao,
  },

  titulo: {
    flexDirection: 'row',
    fontSize: 25,
    height: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 27,
  },

  cardModal: {
    flex: 1,
  },

  corpo: {
    flexDirection: 'row',
    paddingTop: 10,
    marginRight: 10,
    paddingRight: 5,
    marginBottom: 15,
    borderTopWidth: 0.5,
    borderTopColor: Cores.Cinza,
  },

  icone: {
    paddingTop: 5,
    marginRight: 5,
  },

  iconClose: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  row: {
    flexDirection: 'row',
  },

  button: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    height: 36,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.AmareloSecundario,
  },

  buttonText: {
    color: Cores.Preto,
    fontSize: 16,
  },

  opcoes: {
    marginBottom: 10,
  },

  block: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 5,
  },

  tituloBlock: {
    fontWeight: 'bold',
    marginLeft: 5,
    flexDirection: 'column',
  },

  mensagem: {
    marginLeft: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexShrink: 1,
    textAlign: 'justify',
    padding: 5
  },

  mensagemBlock: {
    flexDirection: 'row',
    borderColor: Cores.Cinza,
    borderWidth: 0.5,
    marginTop: 15,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagemBlock: {
    position: 'absolute',
    top: -63,
    left: 134,
    width: 25,
    height: 28,
  },

  checked: {
    paddingTop: 5,
    marginRight: 5,
    tintColor: Cores.AmareloSecundario,
  },

  TextVazio: {
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Cores.Cinza,
  },
});

export const Loading = styled.ActivityIndicator.attrs({ size: 'small', color: Cores.Cinza })`margin: 30px 0;`;

export function scrollTop() {
  try {
    this.flatList_Ref.scrollToIndex({ animated: true, index: 0 });
  } catch (error) {

  }
}