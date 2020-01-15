import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { CardImage } from 'react-native-cards';
import ViewMoreText from 'react-native-view-more-text';
import api from '../services/api';
import { YellowBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'
import styled from 'styled-components/native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

YellowBox.ignoreWarnings([
  'componentWillMount'
])

export default function Conversas({ navigation }) {
  // #region Variáveis
  const [publicacoesUsuario, setPublicacoesUsuario] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  // #endregion

  useEffect(() => {
    setTimeout(function () {
      loadConversas();

      this.focusListener = navigation.addListener('didFocus', () => {
        if (publicacoesUsuario.length > 0) {
          try {
            this.flatList_Ref.scrollToIndex({ animated: true, index: 0 });
          } catch (error) { }
        }

        loadConversas();
      });
    }, 2000);
  }, []);

  useEffect(() => {
    if (page && page > total) {
      setPage(total);
    }
  }, [page]);

  // #region Métodos
  async function loadConversas() {
    setLoading(true);

    if (publicacoesUsuario.length && total <= page) {
      setLoading(false);
      return;
    }

    if (!id) {
      await AsyncStorage.getItem('id').then(response => {
        setId(response);

        api.post('/Conversa/feed', { idUsuario: response })
          .then(res => {
            setPage(page + 1);
            setLoading(false);
            setPublicacoesUsuario([...publicacoesUsuario, ...res.data.feed]);
            setTotal(res.data.total);
          });
      });
    } else {
      api.post('/Conversa/feed', { idUsuario: id })
        .then(res => {
          setPage(page + 1);
          setLoading(false);
          setPublicacoesUsuario([...publicacoesUsuario, ...res.data.feed]);
          setTotal(res.data.total);
        });
    }
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

  function formatDate(data) {
    var datePart = data.match(/\d+/g),
      year = datePart[0].substring(0, 10),
      month = datePart[1], day = datePart[2];
    hour = datePart[3], min = datePart[4];

    return day + '/' + month + '/' + year;
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

  function handleExpandirConversas(idFeed, isPublicacaoUsuario) {
    navigation.navigate('ConversasInterno', { idPublicacao: idFeed, isPublicacaoUsuario });
  }
  // #endregion

  return (
    <SafeAreaView style={styles.container} >
      <View style={{ backgroundColor: Cores.CinzaEscuro }}>
        <Image source={getover} style={styles.header}></Image>
      </View>
      <View>
        <Text style={{ backgroundColor: Cores.Amarelo, height: 6 }}></Text>
      </View>
      <View style={styles.name}>
        <Text style={styles.textName}>Conversas</Text>
      </View>

      {publicacoesUsuario.length === 0
        ? <Text style={styles.empty}>Você ainda não possui nenhuma conversa.</Text>
        : <FlatList
          ref={ref => { this.flatList_Ref = ref; }}
          extraData={publicacoesUsuario}
          data={publicacoesUsuario}
          onEndReached={() => loadConversas()}
          onEndReachedThreshold={0.1}
          refreshing={true}
          ListFooterComponent={loading && <Loading />}
          keyExtractor={item => item._id}
          renderItem={(el) => (
            <View style={styles.card}>
              <CardImage style={[styles.circuloCategoria, { backgroundColor: getCorCirculo(el.item.Publicacao.categoria) }]} title={el.item.Publicacao.categoria} />
              <View style={styles.category}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <Text style={styles.nome}>{el.item.Publicacao.usuario.name}</Text>
                      {id === el.item.Publicacao.usuario._id ? (
                        <View>
                          <Text style={styles.txtMeuPost}>Meu Post</Text>
                        </View>
                      ) : (<View></View>)}
                    </View>
                    <Text style={styles.data}>Post: {formatDate(el.item.Publicacao.createdAt)}</Text>
                  </View>
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      onPress={() => handleExpandirConversas(el.item.Publicacao._id, id === el.item.Publicacao.usuario._id)}
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
              <View>
                <ViewMoreText
                  numberOfLines={4}
                  renderViewMore={handleViewMore}
                  renderViewLess={handleViewLess}
                >
                  <Text style={styles.text}>
                    {el.item.Publicacao.texto}
                  </Text>
                </ViewMoreText>
              </View>
            </View>
          )}
        />
      }
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.FundoSecundario,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
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

  circuloCategoria: {
    position: 'absolute',
    top: -16,
    left: -10,
    width: 24,
    height: 24,
    borderRadius: 50,
    marginTop: 8,
  },

  data: {
    color: Cores.Amarelo,
    alignItems: 'flex-start',
    fontSize: 14,
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

  txtMeuPost: {
    marginLeft: 20,
    fontSize: 12,
    color: Cores.Cinza,
  },

  name: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Cores.Cinza,
    marginBottom: 5
  },

  textName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export const Loading = styled.ActivityIndicator.attrs({ size: 'small', color: Cores.Cinza })`margin: 30px 0;`;
