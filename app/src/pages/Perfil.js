import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';
import { Icon } from 'react-native-elements'

export default function Perfil({ navigation }) {
  //#region Constantes
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [apelido, setApelido] = useState('');
  const [nomeExibicao, setNomeExibicao] = useState('');
  //#endregion

  //#region Metodos
  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (nome && sobrenome && nomeExibicao.length === 0) {
      setNomeExibicao(`${nome} ${sobrenome}`);
    } else if (nomeExibicao.length === 0) {
      setNomeExibicao("Perfil");
    }
  }, [sobrenome]);

  useEffect(() => {
    if (apelido) {
      setNomeExibicao(apelido);
    }
  }, [apelido]);

  async function carregarDados() {
    await AsyncStorage.getItem('name').then(response => { setNome(response) });
    await AsyncStorage.getItem('secondName').then(response => { setSobrenome(response) });
    await AsyncStorage.getItem('nickName').then(response => { setApelido(response) });
  };

  function handleUsuarioBloqueado() {
    navigation.navigate('UsuariosBloqueados', {});
  };

  function handleEditarApelido() {
    navigation.navigate('EditarApelido', { apelido });
  };

  function handleEditarSenha() {
    navigation.navigate('EditarSenha');
  };

  function handleTermos() {
    navigation.navigate('TermosResponsabilidades');
  };

  function handleSobre() {
    navigation.navigate('Sobre');
  };

  function handlePerguntas() {
    navigation.navigate('PerguntasFrequentes');
  };

  async function handleLogOut() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  //#endregion
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: Cores.CinzaEscuro }}>
        <Image source={getover} style={styles.header}></Image>
      </View>
      <View>
        <Text style={{ backgroundColor: Cores.Amarelo, height: 6 }}></Text>
      </View>
      <View style={styles.name}>
        <Text style={styles.textName}>{nomeExibicao}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleUsuarioBloqueado()}>
          <View style={styles.opcoes}>
            <Icon
              name='account-off'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Usuarios Bloqueados</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleEditarApelido()}>
          <View style={styles.opcoes}>
            <Icon
              name='account-edit'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Editar Apelido</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleEditarSenha()}>
          <View style={styles.opcoes}>
            <Icon
              name='lock-question'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Editar Senha</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handlePerguntas()}>
          <View style={styles.opcoes}>
            <Icon
              name='help-box'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Perguntas Frequentes</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleTermos()}>
          <View style={styles.opcoes}>
            <Icon
              name='file-check'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Termos de Responsabilidade</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleSobre()}>
          <View style={styles.opcoes}>
            <Icon
              name='information'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Sobre</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={handleLogOut}>
          <View style={styles.opcoes}>
            <Icon
              name='logout'
              type='material-community'
              iconStyle={styles.icone}
              size={30}
              color={Cores.CinzaIcone}
            />
            <Text style={styles.textOpcoes}>Sair</Text>
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView >
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

  opcoes: {
    alignItems: 'center',
    flexDirection: 'row',

  },

  textOpcoes: {
    fontSize: 16,
    alignItems: 'center'
  },

  icone: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 10
  },
});