import React, { useEffect, useState } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

export default function Noticia({ navigation }) {
  //#region Constantes
  const [perguntas, setPerguntas] = useState([]);
  const [idCategoria, setIdCategoria] = useState('');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [nomeCategoria, setNomeCategoria] = useState('');
  //#endregion

  //#region Metodos
  useEffect(() => {
    setIdCategoria(navigation.getParam('idPergunta'));
    setTitulo(navigation.getParam('titulo'));
    setMensagem(navigation.getParam('corpo'));
    setNomeCategoria(navigation.getParam('nomeCategoria'));
  }, []);

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
          <View>
            <Text style={styles.titulo}>{titulo}</Text>
          </View>
          <View>
            <Text style={styles.corpo}>{mensagem}</Text>
          </View>
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

  titulo: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    color: Cores.Preto,
  },

  corpo: {
    paddingHorizontal: 20,
    color: Cores.CinzaEscuro,
  }
});