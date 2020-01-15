import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import styled from 'styled-components/native';

import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

import { Icon } from 'react-native-elements'
import api from '../services/api';

export default function UsuariosBloqueados({ navigation }) {
  //#region Constantes
  const [senha, setSenha] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const tamanho = Dimensions.get('window').width;

  //#endregion

  //#region Metodos

  async function alterarSenha() {
    if (!senha) {
      Alert.alert(
        'Aviso!',
        'o campo Senha é obrigatório.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }
    if (senha.length < 6) {
      Alert.alert(
        'Aviso!',
        'Senha invalida, a senha deve conter no mínimo 6 digitos',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }

    if (!novaSenha) {
      Alert.alert(
        'Aviso!',
        'o campo nova senha é obrigatório.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert(
        'Aviso!',
        'Senha invalida, a senha deve conter no mínimo 6 digitos',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }

    if (!confirmarNovaSenha) {
      Alert.alert(
        'Aviso!',
        'o campo Confirmação de nova senha é obrigatório.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }

    if (novaSenha && confirmarNovaSenha && novaSenha.localeCompare(confirmarNovaSenha) !== 0) {
      Alert.alert(
        'Aviso!',
        'os campos de nova senha e confirmação de nova senha devem ser idênticos.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }
    await AsyncStorage.getItem('id').then(res => {
      api.post('/usuario/editSenha', { id: res, password: senha, newPassword: novaSenha })
        .then(response => {
          Alert.alert(
            'Sucesso!',
            'Senha alterada com sucesso.',
            [
              {
                text: 'Ok',
              },
            ],
            { cancelable: false },
          );
          navigation.navigate('Perfil');
        }
        ).catch(function (error) {
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
    })
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
          <Text style={styles.textName}>Editar Senha</Text>
        </View>
        <View style={styles.inputs}>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            placeholder='Digite sua senha atual'
            placeholderTextColor={Cores.Cinza}
            style={[styles.input, { marginTop: 10 }]}
            value={senha}
            onChangeText={setSenha}
          >
          </TextInput>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            placeholder='Digite sua nova senha'
            placeholderTextColor={Cores.Cinza}
            style={[styles.input, { marginTop: 10 }]}
            value={novaSenha}
            onChangeText={setNovaSenha}
          >
          </TextInput>
          <TextInput
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            placeholder='Confirme sua nova senha'
            placeholderTextColor={Cores.Cinza}
            style={[styles.input, { marginTop: 10 }]}
            value={confirmarNovaSenha}
            onChangeText={setConfirmarNovaSenha}
          >
          </TextInput>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => alterarSenha()}>
          <Text style={[styles.buttonText, { fontSize: 0.04 * tamanho }]}>Alterar</Text>
        </TouchableOpacity>
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

  textApelido: {
    fontSize: 18,
  },

  inputs: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35
  },

  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginTop: 10
  },

  viewName: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 35,
    marginLeft: 20,
  },

  button: {
    marginHorizontal: 20,
    height: 46,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.AmareloSecundario,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export const Loading = styled.ActivityIndicator.attrs({ size: 'small', color: Cores.Cinza })`margin: 30px 0;`;