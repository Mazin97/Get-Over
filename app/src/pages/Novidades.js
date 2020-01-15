import React, { useEffect, useState } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';
import { Card, IconButton } from 'react-native-paper';
import api from '../services/api';
import { FlatList } from 'react-native-gesture-handler';

export default function Novidades({ navigation }) {
  //#region Constantes
  const altura = Dimensions.get('window').height;
  const [perguntas, setPerguntas] = useState([]);
  const [idCategoria, setIdCategoria] = useState('');
  const [nomeCategoria, setNomeCategoria] = useState('');
  //#endregion

  //#region Metodos
  useEffect(() => {
    setIdCategoria(navigation.getParam('idCategoria'));
    setNomeCategoria(navigation.getParam('nomeCategoria'));
  }, []);

  useEffect(() => {
    if (idCategoria) {
      loadPerguntas();
    }
  }, [idCategoria]);

  function loadPerguntas() {
    api.get(`/categoria/${idCategoria}`)
      .then(response => {
        setPerguntas(response.data);
      });
  };

  function handleNoticia(idPergunta, titulo, mensagem) {
    navigation.navigate('Noticia', { idPergunta: idPergunta, titulo: titulo, corpo: mensagem, nomeCategoria: nomeCategoria });
  };

  onBackButtonPressAndroid = () => {
    navigation.navigate('PerguntasFrequentes');
    return true;
  };

  ListaVazia = () => {
    return (<View>
      <Text style={styles.TextVazio}>
        Não há perguntas referentes á esta categoria.
      </Text>
    </View>)
  }
  //#endregion

  return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
      <SafeAreaView style={styles.container}>
        <View style={{ backgroundColor: Cores.CinzaEscuro }}>
          <Image source={getover} style={styles.header}></Image>
        </View>
        <View>
          <Text style={{ backgroundColor: Cores.Amarelo, height: 6 }}></Text>
        </View>
        <View style={styles.name}>
          <Text style={styles.textName}>{nomeCategoria}</Text>
        </View>
        <View>
          <FlatList
            data={perguntas}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => handleNoticia(item._id, item.titulo, item.corpo)}>
                <Card.Title
                  style={styles.categoria}
                  title={item.titulo}
                  subtitle={item.corpo}
                  right={(props) => <IconButton {...props} icon="arrow-forward" onPress={() => handleNoticia(item._id, item.titulo, item.corpo)} />}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={this.ListaVazia}
          />
        </View>
      </SafeAreaView>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.FundoPadrao,
  },

  header: {
    margin: 10,
    marginLeft: 15,
    resizeMode: 'contain',
    width: 150,
  },

  name: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Cores.Cinza,
  },

  textName: {
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'center'
  },

  categoria: {
    borderBottomWidth: 1,
    borderColor: Cores.Cinza,
    paddingHorizontal: 10,
    marginLeft: 5,
    marginRight: 5
  },

  tituloCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 1,
  },

  messageCategoria: {
    fontSize: 16,
    color: Cores.Cinza,
    marginBottom: 13,
  },

  TextVazio: {
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: Cores.Cinza,
  },
});