import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import styled from 'styled-components/native';

import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

import { Icon } from 'react-native-elements'
import api from '../services/api';

export default function UsuariosBloqueados({ navigation }) {
  //#region Constantes
  const [usuarios, setUsuarios] = useState([]);

  //#endregion

  //#region Metodos
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    await AsyncStorage.getItem('id').then(res => {
      api.get(`/usuario/${res}`)
        .then(response => {
          setUsuarios(response.data);
        }).catch((error) => {
          console.log(error);
        })
    })
  };

  async function handleExcluir(usuarioBlocked, index) {
    await AsyncStorage.getItem('id').then(res => {
      api.post('/usuario/removeBlock', { idUsuario: res, idBlocked: usuarioBlocked })
        .then(response => {
          if (response) {
            Alert.alert(
              'Sucesso!',
              'Usuario desbloqueado com sucesso.',
              [
                {
                  text: 'Ok',
                  onPress: () => removerItem(index),
                },
              ],
              { cancelable: false },
            );
          }
        }).catch(function (error) {
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
    });
  };

  async function removerItem(index) {
    if (index !== -1) {
      let array = [...usuarios];
      array.splice(index, 1);
      setUsuarios(array);
    }
  };

  onBackButtonPressAndroid = () => {
    navigation.navigate('Perfil');
    return true;
  };

  ListaVazia = () => {
    return (<View>
      <Text style={styles.TextVazio}>
        Você não possui usuarios bloqueados.
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
          <Text style={styles.textName}>Usuarios Bloqueados</Text>
        </View>
        <View>
          <FlatList
            ref={ref => { this.flatList_Ref = ref; }}
            extraData={usuarios}
            data={usuarios}
            style={{ marginBottom: 60 }}
            keyExtractor={(item => item.id)}
            renderItem={({ item, index }) => (
              <View style={styles.opcoes}>
                <TouchableOpacity onPress={() => handleExcluir(item.id, index)}>
                  <Icon
                    name='trashcan'
                    type='octicon'
                    iconStyle={styles.icone}
                    size={25}
                    color={Cores.CinzaIcone}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleExcluir(item.id, index)}>
                  <Text style={styles.textOpcoes}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={this.ListaVazia}
          />
        </View>
      </SafeAreaView >
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

  usuarios: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

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

  icone: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    margin: 10
  },

  textUsers: {
    flexDirection: 'column',
    fontSize: 18,
    margin: 5,
    paddingBottom: 5,
    borderBottomColor: Cores.Cinza,
    borderWidth: 0.5
  },

  opcoes: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
  },

  textOpcoes: {
    fontSize: 16,
    alignItems: 'center'
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