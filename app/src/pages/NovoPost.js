import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import styless from '../assets/styles';
import api from '../services/api';
import { TextInput } from 'react-native-gesture-handler';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

export default function NovoPost({ navigation }) {
  //#region Constantes
  const [index, setIndex] = useState(0);
  const [corCirculo, setCorCirculo] = useState(Cores.Cinza);
  const [idPublicacao, setIdPublicacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tamanhoMensagem, setTamanhoMensagem] = useState(0);

  const categorias = [
    { label: 'Trabalho', value: 'Trabalho' },
    { label: 'Depressão', value: 'Depressão' },
    { label: 'Ansiedade', value: 'Ansiedade' },
    { label: 'Família', value: 'Família' },
    { label: 'Sexualidade', value: 'Sexualidade' },
    { label: 'Agressão Física', value: 'Agressão Física' },
    { label: 'Bullying', value: 'Bullying' },
    { label: 'Relacionamento', value: 'Relacionamento' },
  ];
  //#endregion

  //#region Métodos
  useEffect(() => {
    this.focusListener = navigation.addListener('didFocus', (payload) => {
      AsyncStorage.getItem('indexPacient').then((index) => {
        if (!index) {
          navigation.navigate('Triagem');
          return;
        }
      });

      limpaTela();

      if (payload && payload.state && payload.state.params) {
        if (payload.state.params.idPublicacao) {
          setIdPublicacao(payload.state.params.idPublicacao);
          payload.state.params.idPublicacao = null;
        }
  
        if (payload.state.params.categoria) {
          setCategoria(payload.state.params.categoria);
          payload.state.params.categoria = null;
        }
  
        if (payload.state.params.texto) {
          setMensagem(payload.state.params.texto);
          payload.state.params.texto = null;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (mensagem) {
      setTamanhoMensagem(mensagem.length);
    }
  }, [mensagem]);

  function limpaTela() {
    setIdPublicacao('');
    setCategoria('');
    setMensagem('');
    setCorCirculo(Cores.Cinza);
    setTamanhoMensagem(mensagem.length);
  };

  async function handleNovoPost() {
    if (categoria === '') {
      Alert.alert(
        'Aviso!',
        'É obrigatório selecionar uma categoria.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }
    if (mensagem === '') {
      Alert.alert(
        'Aviso!',
        'É obrigatório preencher uma mensagem para criar um post.',
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
      return;
    }

    await AsyncStorage.getItem('id').then((id) => {
      const response = api.post('/publicacao', { usuario: id, categoria: categoria, texto: mensagem, isExcluido: false, index: index })
        .catch(function (error) {
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

      if (response) {
        Alert.alert(
          'Sucesso!',
          'Publicação criada com sucesso!',
          [
            {
              text: 'Ok'
            }
          ],
          { cancelable: false },
        );
        navigation.navigate('Feed', { novo: 1 });
        setCategoria('');
        setMensagem('');
      }
    })
  };

  async function handleEditarPublicacao() {
    api.put('/publicacao', { idFeed: idPublicacao, texto: mensagem, categoria: categoria })
      .then(response => {
        if (response) {
          Alert.alert(
            'Sucesso!',
            'Publicação alterada com sucesso.',
            [
              {
                text: 'Ok',
                onPress: () => limpaTela(),
              },
            ],
            { cancelable: false },
          );
          navigation.navigate('Feed', {});
        }
      })
      .catch((error) => {
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
  };

  async function handlePickCategoria(value) {
    setCategoria(value);

    switch (value) {
      case 'Trabalho':
        setCorCirculo(Cores.circuloAzulEscuro);
        setIndex(10);
        break;
      case 'Depressão':
        setCorCirculo(Cores.circuloVermelho);
        setIndex(70);
        break;
      case 'Ansiedade':
        setCorCirculo(Cores.circuloVerdeClaro);
        setIndex(30);
        break;
      case 'Família':
        setCorCirculo(Cores.circuloAmarelo);
        setIndex(50);
        break;
      case 'Sexualidade':
        setCorCirculo(Cores.circuloVerdeEscuro);
        setIndex(60)
        break;
      case 'Agressão Física':
        setCorCirculo(Cores.circuloRoxo);
        setIndex(40);
        break;
      case 'Bullying':
        setCorCirculo(Cores.circuloAzulClaro);
        setIndex(30)
        break;
      case 'Relacionamento':
        setCorCirculo(Cores.circuloLaranja);
        setIndex(40)
        break;
      default:
      // code block
    }
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

      <View>
        <Text style={styles.texto}>Selecione uma categoria:</Text>
      </View>

      <View style={styles.input}>
        <RNPickerSelect
          placeholder={{ label: 'Selecione...', value: '' }}
          items={categorias}
          onValueChange={(value) => handlePickCategoria(value)}
          value={categoria}
        />
      </View>

      <Text style={[styles.texto, { marginBottom: 15 }]}>Desabafe:</Text>

      <View style={[styles.circuloCategoria, { backgroundColor: corCirculo, top: 205 }]} />
      <TextInput
        label='Mensagem'
        multiline={true}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="O que está acontecendo?"
        placeholderTextColor='#cdcdcd'
        maxLength={250}
        scrollEnabled={true}
        style={[styles.input, { paddingHorizontal: 20 }]}
        value={mensagem}
        onChangeText={setMensagem}
      >
      </TextInput>
      <Text style={styles.txtTamanhoMensagem}>{tamanhoMensagem}/250</Text>
      {
        idPublicacao ?
          (
            <View style={styles.buttons}>
              <TouchableOpacity onPress={handleEditarPublicacao} style={[styless.button, styless.Amarelo]}>
                <Text style={styless.buttonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          )
          :
          (
            <View style={styles.buttons}>
              <TouchableOpacity onPress={handleNovoPost} style={[styless.button, styless.Amarelo]}>
                <Text style={styless.buttonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.FundoPadrao,
  },

  texto: {
    marginTop: 20,
    fontSize: 16,
    paddingHorizontal: 15
  },

  header: {
    margin: 10,
    marginLeft: 15,
    resizeMode: 'contain',
    width: 150,
  },

  input: {
    maxHeight: 150,
    backgroundColor: Cores.Branco,
    borderWidth: 1,
    borderColor: Cores.FundoSecundario,
    borderRadius: 4,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  categoria: {
    margin: 2,
    borderWidth: 1,
    borderColor: Cores.FundoSecundario,
    marginHorizontal: 20,
  },

  tituloCategoria: {
    fontWeight: 'bold',
    fontSize: 12,
    padding: 1,
    margin: 5
  },

  circuloCategoria: {
    position: 'absolute',
    zIndex: 10,
    width: 20,
    height: 20,
    borderRadius: 20,
    left: 7,
  },

  titulo: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 5,
  },

  buttons: {
    paddingHorizontal: 50,
    paddingTop: 20,
  },

  txtTamanhoMensagem: {
    paddingRight: 15,
    alignSelf: 'flex-end',
  }
});