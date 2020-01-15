import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import api from '../services/api';
import Cores from '../assets/cores';
import logo from '../assets/logo.png';

export default function Login({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const tamanho = Dimensions.get('window').width;

  async function handleEnviarNovaSenha() {
    const response = await api.post('/esqueciMinhaSenha', { email: email, nome: nome })
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

    if (response) {
      navigation.navigate('Login');
    }
  }

  onBackButtonPressAndroid = () => {
    navigation.navigate('Login');
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo}/>

        <Text style={styles.titulo}>Instruções:</Text>
        <Text style={styles.texto}>
          1. No caso de ter esquecido a sua senha, insira seus dados nos campos abaixo. {"\n"} {"\n"}
          2. Em alguns minutos, será enviado um e-mail com uma nova senha de acesso ao e-mail informado no campo abaixo. {"\n"} {"\n"}
          3. Para alterar a nova senha, procure pela opção "Alterar Senha" na aba "Perfil", após ter efetuado o login. {"\n"} {"\n"}
          Obs: No campo Nome, preencha apenas o primeiro nome usado no cadastro.
        </Text>

        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          placeholder='Digite sua nome'
          placeholderTextColor={Cores.Cinza}
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        >
        </TextInput>

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

        <TouchableOpacity onPress={handleEnviarNovaSenha} style={styles.button}>
          <Text style={[styles.buttonText, { fontSize: 0.04 * tamanho }]}>Enviar nova senha</Text>
        </TouchableOpacity>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: Cores.Branco,
    borderWidth: 1,
    borderColor: Cores.FundoSecundario,
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
    marginHorizontal: 20,
  },

  logo: {
    marginBottom: 60,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Cores.FundoPadrao,
    alignItems: 'center',
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.Amarelo,
    marginHorizontal: 20,
  },

  buttonText: {
    color: Cores.Branco,
    fontWeight: 'bold',
    fontSize: 16,
  },

  titulo: {
    color: Cores.CinzaEscuro,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: 'center',
  },

  texto: {
    color: Cores.CinzaEscuro,
    fontSize: 16,
    marginHorizontal: 20,
  },
});