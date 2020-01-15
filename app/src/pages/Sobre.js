import React from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

export default function Sobre({ navigation }) {
  //#region Constantes
  const altura = Dimensions.get('window').height;

  //#endregion

  //#region Metodos
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
          <Text style={styles.textName}>Sobre</Text>
        </View>
        <View style={[styles.card, { marginTop: 30 }]}>
          <ScrollView style={[styles.scrollView, { height: altura * 0.6 }]}>
            <Text style={styles.cardMessage}>
              O aplicativo Get Over surgiu de um projeto de TCC. {'\n'}
              Percebendo o crescimento das doenças como depressão e ansiedade na
              sociedade, decidimos unir a oportunidade de realizar um projeto á vontade
              de ajudar o próximo. Por isso, nosso aplicativo é totalmente gratúito. {'\n'}
              O único objetivo aqui é ajudar pessoas, o foco é unir pessoas que estejam passando
              por necessidade de um ombro amigo.
            </Text>
          </ScrollView>
        </View>
        <View style={styles.versao}>
          <Text style={styles.textVersao}>Versão 1.0.0 Beta</Text>
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

  card: {
    margin: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Cores.Cinza,
    backgroundColor: Cores.Branco,
  },

  cardMessage: {
    padding: 5,
    textAlign: 'justify'
  },

  versao: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },

  textVersao: {
    color: Cores.Cinza,
    fontSize: 14,
    fontWeight: 'bold'
  },

});