import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import api from '../services/api';
import logo from '../assets/logo.png';
import Cores from '../assets/cores';

export default function Triagem({ navigation }) {
  const [id, setId] = useState('');
  const [respostasPerguntas, setRespostasPerguntas] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const [textVazio, setTextVazio] = useState("Carregando...");
  const [totalPerguntas, setTotalPerguntas] = useState(0);
  const altura = Dimensions.get('window').height;
  const largura = Dimensions.get('window').width;

  useEffect(() => {
    AsyncStorage.getItem('id').then((id) => {
      setId(id);
    });

    setTextVazio('Aguarde.. carregando as perguntas.');
    
    verificarIndexVolunteer();
  }, []);

  useEffect(() => {
    if (perguntas.length) {
      const [pergunta, ...resto] = perguntas;

      setPerguntas(resto);

      if (resto.length === 0) {
        setTextVazio("Obrigado! você encerrou a triagem, aguarde enquanto te redirecionamos.");
        EnviarPerguntas();
      }
    }
  }, [respostasPerguntas]);

  function verificarIndexVolunteer() {
    AsyncStorage.getItem('indexVolunteer').then((index) => {
      if (index) {
        navigation.navigate('Feed');
        return;
      } else {
        loadPerguntas();
      }
    });
  };
  
  function loadPerguntas() {
    api.get('/pergunta', { isTriagemPaciente: false }).then((response) => {
      setPerguntas(response.data);
      setTotalPerguntas(response.data.length);
    });
  };

  function handlePergunta(idAlternativa) {
    setRespostasPerguntas([...respostasPerguntas, idAlternativa]);
  };

  function EnviarPerguntas() {
    //#region Geração da média geral da triagem
    let mediaGeral = 0;

    respostasPerguntas.map(function (el, i) {
      if (el === 1) {
        mediaGeral += 5;
      }
      else if (el === 2) {
        mediaGeral += 10;
      }
    });

    mediaGeral = (mediaGeral / totalPerguntas) * 10;
    //#endregion

    api.put('/usuario', {
      id: id,
      indexVolunteer: mediaGeral
    }).then((res) => {
      AsyncStorage.setItem('indexVolunteer', res.data.indexVolunteer.toString()).then(() => {
        navigation.navigate('TutorialVoluntario');
      });
    }).catch((error) => {
      console.log(error);
      setTextVazio("Ocorreu um erro interno. Tente novamente mais tarde.");
    });
  };

  onBackButtonPressAndroid = () => {
    navigation.navigate('Feed');
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
      <Image source={logo} style={{alignSelf: 'center', marginVertical: 20}}></Image>

      <View style={{ flex: 1, backgroundColor: Cores.FundoPadrao }}>
        <View style={[styles.container, { minHeight: 0.6 * altura, }]}>
          <Text style={{ textAlign: 'center',  fontSize: 14, color: Cores.CinzaEscuro }}>Conte-nos mais sobre você. {"\n"} Responda as perguntas abaixo de acordo com o seu perfil:</Text>

          {perguntas.length === 0
            ? <Text style={styles.empty}>{textVazio}</Text>
            :
            perguntas.map((pergunta, index) => (
              <View key={pergunta._id} style={[styles.card, { zIndex: (perguntas.length - index) }]}>
                <Text style={styles.name}>{pergunta.corpse}</Text>
                {pergunta.alternatives.map((alternativa, idAlternativa) => (
                  <View key={idAlternativa} style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.opcao} onPress={() => handlePergunta(idAlternativa)}>
                      <Text style={[styles.bio, { minWidth: largura * 0.7, textAlign: 'center', }]}>{alternativa}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))
          }
        </View>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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

  card: {
    borderWidth: 1,
    borderColor: Cores.FundoSecundario,
    borderRadius: 8,
    backgroundColor: Cores.Branco,
    position: 'absolute',
    top: 80,
    bottom: 20,
    left: 20,
    right: 20,
  },

  name: {
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: Cores.CinzaEscuro
  },

  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  opcao: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 20,
  },

  bio: {
    fontSize: 14,
    color: Cores.Branco,
    backgroundColor: Cores.Cinza,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});