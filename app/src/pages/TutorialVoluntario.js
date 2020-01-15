import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import logo from '../assets/logo.png';
import Cores from '../assets/cores';

export default function Triagem({ navigation }) {
  const altura = Dimensions.get('window').height;
  const largura = Dimensions.get('window').width;

  onBackButtonPressAndroid = () => {
    navigation.navigate('Feed');
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
      <Image source={logo} style={{ alignSelf: 'center', marginVertical: 20 }}></Image>
      <ScrollView style={[styles.scrollView, { height: altura * 0.5 }]}>
        <View style={{ flex: 1, backgroundColor: Cores.FundoPadrao }}>
          <View style={[styles.container, { minHeight: 0.6 * altura, }]}>
            <Text style={styles.text}>
              Antes de mais nada, é importante revisar alguns recados: {"\n"}

              - Ao usar o aplicativo você terá uma reputação que pode subir ou descer, portanto siga os termos de uso do
              aplicativo e respeite o próximo.
            {"\n"}
              {"\n"}
              - Durante uma conversa como voluntário, você verá uma barra de progresso. Essa barra indica o sentimento do paciente, {"\n"}
              quanto mais preenchida a barra estiver, melhores são os sentimentos. {"\n"}
              quanto menos preenchida a barra estiver, piores são os sentimentos. {"\n"}
              É importante que essa barra esteja o mais cheia possível sempre, indicamento um bom sentimento do paciente
              durante a conversa.
          </Text>

            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => { navigation.navigate('Feed'); }} style={styles.button}>
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  text: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 100,
    paddingHorizontal: 20,
    color: Cores.CinzaEscuro,
  },

  buttons: {
    paddingHorizontal: 50,
    paddingTop: 20,
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.Amarelo,
  },

  buttonText: {
    paddingHorizontal: 20,
    color: Cores.Branco,
    fontWeight: 'bold',
    fontSize: 16,
  },
});