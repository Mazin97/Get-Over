import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { Icon } from 'react-native-elements'
import getover from '../assets/GETOVERFEED.png';
import api from '../services/api';
import Cores from '../assets/cores';

export default function NovaDenuncia({ navigation }) {
  //#region Constantes
  const [categoria, setCategoria] = useState([]);
  const [bloquear, setBloquear] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [disabled2, setDisabled2] = useState(false);
  const [disabled3, setDisabled3] = useState(false);
  const [disabled4, setDisabled4] = useState(false);
  const [disabled5, setDisabled5] = useState(false);
  const [disabled6, setDisabled6] = useState(false);
  const [disabled7, setDisabled7] = useState(false);
  const [disabled8, setDisabled8] = useState(false);
  const [check, setCheck] = useState(false);

  const largura = Dimensions.get('window').width;
  const idPublicacao = navigation.getParam('idPublicacao');
  const nomeUsuario = navigation.getParam('name');
  const idUsuario = navigation.getParam('idUsuario');
  //#endregion

  //#region Metodos
  function _onPress(item) {
    setCategoria([...categoria, item]);
  };

  async function handleDenunciar() {
    if (check === true) {
      setBloquear(idUsuario);
    }

    await AsyncStorage.getItem('id').then((id) => {
      api.post(`/publicacao/${id}/denuncia`, { motivo: categoria, idPublicacao: idPublicacao, isBloquear: bloquear })
        .then(response => {
          if (response) {
            Alert.alert(
              'Sucesso!',
              'Denuncia realizada com sucesso.',
              [
                {
                  text: 'Ok'
                }
              ],
              { cancelable: false },
            );
            navigation.navigate('Feed', {});
          }
        }).catch(function (error) {
          if (error.response) {
            Alert.alert(
              'Aviso!',
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

  onBackButtonPressAndroid = () => {
    navigation.navigate('Feed');
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

        <Text style={styles.titulo}>Área de Denuncia</Text>

        <View style={styles.corpo}>
          <Icon
            name='message-alert-outline'
            type='material-community'
            iconStyle={styles.icone}
            size={30}
            color={Cores.CinzaIcone}
          />
          <Text style={styles.mensagem}>Tudo bem, esta é uma área segura, aqui você pode nos dizer o que tem de errado
            com este post para analisarmos e tomarmos as devidas medidas.
          </Text>
        </View>
        
        <View style={styles.opcoes}>
          <View style={styles.row}>
            <TouchableOpacity style={disabled ? styles.disable : styles.button} onPress={() => { !disabled ? setDisabled(true) & _onPress('Racismo') : setDisabled(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}>Racismo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={disabled2 ? styles.disable : styles.button} onPress={() => { !disabled2 ? setDisabled2(true) & _onPress('Bullying') : setDisabled2(false) & setCategoria([]); }}>
              <Text
                style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Bullying</Text>
            </TouchableOpacity>
            <TouchableOpacity style={disabled3 ? styles.disable : styles.button} onPress={() => { !disabled3 ? setDisabled3(true) & _onPress('Hate') : setDisabled3(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Hate</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={disabled4 ? styles.disable : styles.button} onPress={() => { !disabled4 ? setDisabled4(true) & _onPress('Fake news') : setDisabled4(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Fake News</Text>
            </TouchableOpacity>
            <TouchableOpacity style={disabled5 ? styles.disable : styles.button} onPress={() => { !disabled5 ? setDisabled5(true) & _onPress('Isso não deveria estar aqui') : setDisabled5(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Isso não deveria estar aqui</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={disabled6 ? styles.disable : styles.button} onPress={() => { !disabled6 ? setDisabled6(true) & _onPress('Menor de 18 anos') : setDisabled6(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Menor de 18 anos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={disabled7 ? styles.disable : styles.button} onPress={() => { !disabled7 ? setDisabled7(true) & _onPress('Terrorismo') : setDisabled7(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Terrorismo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={disabled8 ? styles.disable : styles.button} onPress={() => { !disabled8 ? setDisabled8(true) & _onPress('Spam') : setDisabled8(false) & setCategoria([]); }}>
              <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}
                accessible={true}
              >Spam</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.corpo, { paddingTop: 10 }]}>
          <TouchableOpacity style={styles.icone} onPress={() => !check ? setCheck(true) & setBloquear(idUsuario) : setCheck(false)}>
            <Icon
              name='block-helper'
              type='material-community'
              iconStyle={Cores.AmareloSecundario}
              size={30}
              color={check ? Cores.AmareloSecundario : Cores.CinzaIcone}
            />
          </TouchableOpacity>

          <View style={styles.containerBlock}>
            <Text style={styles.tituloBlock}>Bloquear {nomeUsuario}</Text>
            <Text style={styles.mensagem}>Caso deseje, toque no icone ao lado para bloquear este usuário.</Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.button, { backgroundColor: Cores.AmareloSecundario, marginHorizontal: 50 }]} onPress={() => handleDenunciar()}>
          <Text style={[styles.buttonText, { fontSize: 0.04 * largura }]}>Denunciar</Text>
        </TouchableOpacity>

        <View style={styles.containerInfo}>
          <Text style={styles.mensagemBlock}>Se você se encontra em perigo, entre em contato imediatamente com as autoridades locais. 
            Ou caso necessite falar com alguém á respeito, ligue para o Centro de Valorização da Vida – 188.
          </Text>
        </View>
      </SafeAreaView>
    </AndroidBackHandler >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.FundoSecundario,
  },

  containerBlock: {
    flex: 1,
    flexDirection: 'column',
  },

  header: {
    margin: 10,
    marginLeft: 15,
    resizeMode: 'contain',
    width: 150,
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

  titulo: {
    fontSize: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
  },

  corpo: {
    flexDirection: 'row',
    marginRight: 5,
    marginBottom: 10,
    borderTopWidth: 0.5,
    borderTopColor: Cores.Cinza,
  },

  icone: {
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5
  },

  row: {
    flexDirection: 'row',
  },

  button: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    height: 36,
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
    marginBottom: 20,
    marginLeft: 20,
  },

  tituloBlock: {
    paddingLeft: 7,
    fontWeight: 'bold',
  },

  mensagem: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'justify',
    paddingHorizontal: 7,
    flexShrink: 1,
  },

  containerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  mensagemBlock: {
    marginBottom: 30,
    marginHorizontal: 20,
    paddingTop: 10,
    paddingHorizontal: 7,
    paddingBottom: 5,
    borderColor: Cores.Cinza,
    borderWidth: 0.5,
    borderRadius: 2,
    textAlign: 'justify',
    flexShrink: 1,
  },

  imagemBlock: {
    position: 'absolute',
    width: 25,
    height: 28,
    backgroundColor: Cores.FundoSecundario,
  },
});