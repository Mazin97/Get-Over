import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAvoidingView, Platform, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';

import api from '../services/api';
import logo from '../assets/logo.png';
import styles from '../assets/styles.js';
import Cores from '../assets/cores';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const tamanho = Dimensions.get('window').width;

  useEffect(() => {
    console.log('realizando login');

    AsyncStorage.getItem('id').then((id) => {
      if (id) {
        navigation.navigate('Home', { id });
      }
    });
  }, []);

  useEffect(() => {
    console.log(email);
  }, [email]);

  function handleLogin() {
    api.post('/login', { email: email, password: senha })
      .then((response) => {
        const { _id, indexPacient, indexVolunteer, name, secondName, nickName } = response.data;

        AsyncStorage.setItem('id', _id);
        AsyncStorage.setItem('name', name);
        AsyncStorage.setItem('secondName', secondName);
        AsyncStorage.setItem('nickName', nickName);
  
        if (indexPacient) {
          AsyncStorage.setItem('indexPacient', indexPacient.toString());
        }
        
        if (indexVolunteer) {
          AsyncStorage.setItem('indexVolunteer', indexVolunteer.toString());
        }
  
        navigation.navigate('Home', { id: _id, name: name });
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
  }

  async function handleCriarConta() {
    navigation.navigate('CriarConta');
  }

  async function handleEsqueciMinhaSenha() {
    navigation.navigate('EsqueciMinhaSenha');
  }

  return (
    <KeyboardAvoidingView behavior='padding' enabled={Platform.OS === 'ios'} style={styles.container}>
      <Image source={logo} style={stylesInterno.logo}></Image>

      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='email'
        placeholder='Digite seu e-mail'
        placeholderTextColor={Cores.Cinza}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      >
      </TextInput>

      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}
        placeholder='Digite sua senha'
        placeholderTextColor={Cores.Cinza}
        style={[styles.input, { marginTop: 10 }]}
        value={senha}
        onChangeText={setSenha}
      >
      </TextInput>

      <View style={stylesInterno.containerBotoes}>
        <TouchableOpacity onPress={handleEsqueciMinhaSenha} style={[stylesInterno.button, styles.Amarelo]}>
          <Text style={[styles.buttonText, { fontSize: 0.04 * tamanho }]}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={[stylesInterno.button, styles.Amarelo, { marginLeft: 10 }]}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleCriarConta} style={[styles.button, { backgroundColor: Cores.AmareloSecundario }]}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const stylesInterno = StyleSheet.create({
  containerBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    marginBottom: 50
  },

  button: {
    flex: 1,
    height: 46,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});