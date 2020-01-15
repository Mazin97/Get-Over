import React, { useEffect, useState } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';
import { Card, IconButton } from 'react-native-paper';
import api from '../services/api';
import { FlatList } from 'react-native-gesture-handler';

export default function PerguntasFrequentes({ navigation }) {
  //#region Constantes
  const [categorias, setCategorias] = useState([]);
  //#endregion

  //#region Metodos
  useEffect(() => {
    loadCategorias();
  }, []);


  function loadCategorias() {
    api.get('/categoria', {})
      .then(response => {
        setCategorias(response.data);
      });
  };

  function handlePerguntas(idCategoria, nomeCategoria) {
    navigation.navigate('Novidades', { idCategoria: idCategoria, nomeCategoria: nomeCategoria });
  };

  onBackButtonPressAndroid = () => {
    navigation.navigate('Perfil');
    return true;
  };
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
          <Text style={styles.textName}>Perguntas Frequentes</Text>
        </View>
        <View>
          <FlatList
            style={{ marginTop: 10 }}
            data={categorias}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => handlePerguntas(item._id, item.nome)}>
                <Card.Title
                  style={styles.categoria}
                  title={item.nome}
                  subtitle={item.descricao}
                  right={(props) => <IconButton {...props} icon="arrow-forward" onPress={() => handlePerguntas(item._id, item.nome)} />}
                />
              </TouchableOpacity>
            )}
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
  },

  categorias: {
    backgroundColor: Cores.FundoPadrao,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
  },

  categoria: {
    borderBottomWidth: 1,
    borderColor: Cores.Cinza,
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

});