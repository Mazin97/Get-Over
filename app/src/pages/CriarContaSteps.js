import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, StyleSheet, View, TextInput, Alert, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import DateTimePicker from "react-native-modal-datetime-picker";
import api from '../services/api';
import Cores from '../assets/cores';

export default function CriarContaSteps({ navigation }) {
  // #region Constantes Perfil
  const [apelido, setApelido] = useState('');
  const [genero, setGenero] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('Data de Nascimento');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [indexPacient, setIndexPacient] = useState(0);
  // #endregion

  // #region Constantes Triagem
  const [perguntas, setPerguntas] = useState([]);
  const [respostasPerguntas, setRespostasPerguntas] = useState([]);
  // #endregion

  // #region Outras Constantes
  const [errosDados, setErrosDados] = useState(false);
  const [tamanhoTriagem, setTamanhoTriagem] = useState(0);
  const altura = Dimensions.get('window').height;
  const largura = Dimensions.get('window').width;

  const buttonTextStyle = {
    color: Cores.Branco,
    borderRadius: 4,
    backgroundColor: Cores.Amarelo,
    paddingHorizontal: 15,
    lineHeight: 32,
  };
  // #endregion

  // #region Métodos
  useEffect(() => {
    loadPerguntas();
  }, []);

  async function handleCriar() {
    const response = await api.post('/usuario',
      {
        name: nome,
        secondName: sobrenome,
        email: email,
        password: senha,
        isAnonimous: apelido.length > 0 ? true : false,
        indexPacient: indexPacient,
        gender: genero,
        nickName: apelido,
        birthDate: dataNascimento
      })
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

    console.log(response);

    if (response !== undefined) {
      const { _id, indexPacient, indexVolunteer, name, secondName, nickName } = response.data;

      AsyncStorage.setItem('id', _id);
      AsyncStorage.setItem('name', name);
      AsyncStorage.setItem('secondName', secondName);
      AsyncStorage.setItem('nickName', nickName);

      if (indexPacient) {
        await AsyncStorage.setItem('indexPacient', indexPacient.toString());
      }

      navigation.navigate('Home', { id: _id });
    }
  };

  toggleDateTimePicker = () => {
    setIsDateTimePickerVisible(!isDateTimePickerVisible);
  };

  handleDatePicked = today => {
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
    setDataNascimento(today);
    toggleDateTimePicker();
  };

  onBackButtonPressAndroid = () => {
    navigation.navigate('Login');
    return true;
  };

  async function loadPerguntas() {
    const response = await api.get('/pergunta', { headers: { isTriagemPaciente: true } });

    if (response) {
      setPerguntas(response.data);
      setTamanhoTriagem(response.data.length);
    }
  };

  HandleSubmitSteps = () => {
    if (perguntas.length !== 0) {
      Alert.alert(
        'Aviso!',
        'Se finalizar agora, você terá que realizar a triagem futuramente.',
        [
          {
            text: 'OK',
            onPress: () => handleCriar(),
          },
          {
            text: 'Voltar',
            style: 'cancel'
          }
        ],
        { cancelable: true },
      );
    } else {
      handleCriar();
    }
  };

  handlePergunta = (idAlternativa) => {
    setRespostasPerguntas([...respostasPerguntas, idAlternativa]);

    const [pergunta, ...resto] = perguntas;
    setPerguntas(resto);

    if (resto.length === 0) {
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

      setIndexPacient((mediaGeral / tamanhoTriagem) * 10);
      //#endregion
    }
  };

  handleNextDados = () => {
    let erros = [];

    if (!nome) {
      erros.push('o campo Nome é obrigatório.');
    }

    if (!sobrenome) {
      erros.push('o campo Sobrenome é obrigatório.');
    }

    if (!email) {
      erros.push('o campo E-mail é obrigatório.');
    }

    if (!confirmarEmail) {
      erros.push('o campo Confirmação de e-mail é obrigatório.');
    }

    if (email && confirmarEmail && email.localeCompare(confirmarEmail) !== 0) {
      erros.push('Os campos de e-mail e confirmação devem ser idênticos.');
    }

    if (!senha) {
      erros.push('o campo Senha é obrigatório.');
    }

    if (!confirmarSenha) {
      erros.push('o campo Confirmação de senha é obrigatório.');
    }

    if (senha && confirmarSenha && senha.localeCompare(confirmarSenha) !== 0) {
      erros.push('Os campos de senha e confirmação devem ser idênticos.');
    }

    if (!dataNascimento) {
      erros.push('o campo Data de Nascimento é obrigatório.');
    }

    if (erros.length) {
      setErrosDados(true);

      mensagemErro = "";

      erros.map(function (el, i) {
        mensagemErro += `${el} \n`;
      });

      Alert.alert('Aviso!', mensagemErro,
        [
          { text: 'OK' },
        ],
        { cancelable: false },
      );
    } else {
      setErrosDados(false);
    }
  };
  // #endregion

  return (
    <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
      <View style={{ flex: 1, backgroundColor: Cores.FundoPadrao }}>
        <ProgressSteps
          activeStepIconBorderColor={Cores.Amarelo}
          completedStepIconColor={Cores.Amarelo}
          completedProgressBarColor={Cores.Amarelo}
          activeLabelColor={Cores.Amarelo}
        >
          <ProgressStep
            label='Dados'
            nextBtnTextStyle={buttonTextStyle}
            nextBtnText={'Próximo'}
            onNext={() => handleNextDados()}
            errors={errosDados}
          >
            <View style={styles.ContainerDoisCampos}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Apelido"
                placeholderTextColor={Cores.Cinza}
                style={[styles.TextInput, { marginLeft: 20, marginRight: 5, }]}
                value={apelido}
                onChangeText={setApelido}
              />

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Gênero"
                placeholderTextColor={Cores.Cinza}
                style={[styles.TextInput, { marginLeft: 5, marginRight: 20, }]}
                value={genero}
                onChangeText={setGenero}
              />
            </View>

            <View style={styles.ContainerDoisCampos}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Nome"
                placeholderTextColor={Cores.Cinza}
                style={[styles.TextInput, { marginLeft: 20, marginRight: 5, }]}
                value={nome}
                onChangeText={setNome}
              />

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Sobrenome"
                placeholderTextColor={Cores.Cinza}
                style={[styles.TextInput, { marginLeft: 5, marginRight: 20, }]}
                value={sobrenome}
                onChangeText={setSobrenome}
              />
            </View>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="E-mail"
              placeholderTextColor={Cores.Cinza}
              style={styles.TextInputLongo}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Confirmação de e-mail"
              placeholderTextColor={Cores.Cinza}
              style={styles.TextInputLongo}
              value={confirmarEmail}
              onChangeText={setConfirmarEmail}
            />

            <TextInput
              autoCapitalize="none"
              secureTextEntry={true}
              autoCorrect={false}
              placeholder="Senha"
              placeholderTextColor={Cores.Cinza}
              style={styles.TextInputLongo}
              value={senha}
              onChangeText={setSenha}
            />

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              placeholder="Confirmação de senha"
              placeholderTextColor={Cores.Cinza}
              style={styles.TextInputLongo}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <Text
              style={styles.inputDataNascimento}
              onPress={() => toggleDateTimePicker()}
            >
              {dataNascimento}</Text>

            <TouchableOpacity title="Data de Nascimento" />
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={(date) => handleDatePicked(date)}
              onCancel={() => toggleDateTimePicker()}
              datePickerModeAndroid={"spinner"}
              maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            />
          </ProgressStep>

          <ProgressStep
            label="Termos"
            nextBtnTextStyle={buttonTextStyle}
            previousBtnTextStyle={buttonTextStyle}
            nextBtnText={"Aceitar"}
            previousBtnText={"Recusar"}
          >
            <View style={[styles.container, { flex: 1 }]}>
              <Text style={[styles.title, { color: Cores.CinzaEscuro }]}>Recomenda-se ler atentamente antes de aceitar.</Text>

              <ScrollView style={[styles.scrollView, { height: altura * 0.5 }]}>
                <Text style={styles.textoTermo}>
                  1. Dados pessoais e política de uso de dados {"\n"}
                    1.1 Para melhorar a usabilidade do aplicativo e a seriedade, necessitamos recolher informações sobre você. Os tipos de informações que recolhemos são: nome completo, idade, data de nascimento, e-mail e uma senha para acesso ao aplicativo.
                    é importante saber que ao acessar o aplicativo e fornecer estes dados, você está concordando com a nossa política de uso de dados, ou seja, nos comprometemos em manter os dados em nosso banco de dados para uso exclusivo do aplicativo. Nos comprometemos
                    também em não divulgar e/ou negociar estes dados para terceiros, a não ser em casos com finalidades legais. {"\n"}{"\n"}
                  
                    1.2 Dentro do aplicativo, você poderá e deverá criar conteúdo, conversas e alimentar um perfil. É importante ressaltar que todas as informações geradas pelo usuário no aplicativo são pertencentes ao aplicativo. Sendo assim, temos o controle total
                    destas informações, podendo gerenciá-las de forma conveniente para nós.{"\n"}{"\n"}
                  
                    1.3 Não nos responsabilizamos por divulgação de informações pessoais para terceiros. Recomendamos que não seja feito nenhum tipo de contato externo ao aplicativo, bem como fornecemos a possibilidade da utilização de um apelido para ocultar a sua identidade.{"\n"}{"\n"}
                  
                  2. Comportamento e punições {"\n"}
                    2.1 Ao aceitar estes termos, você se compromete em, acima de tudo, respeitar o próximo e compartilhar da visão do aplicativo de prezarmos pela saúde mental dos demais usuários.{"\n"}{"\n"}
                  
                    2.2 Não são toleradas ofensas e denegrições aos outros. Em caso de descumprimento, serão aplicadas punições severas, podendo até ocorrer o bloqueio da conta.{"\n"}{"\n"}
                  
                    2.3 A nossa missão é fazer a ponte entre pessoas que estão precisando de ajuda emocional e pessoas que estão dispostas a ajudar, se você não se sente confortável ou capaz em ajudar alguém, não se sinta obrigado a tal.{"\n"}{"\n"}
                  
                    2.4 Não é aceito nenhum tipo de preconceito de raça, cor, credo e sexualidade perante leis contidas na constituição brasileira. Os usuários que se sentirem ofendidos, deverão realizar uma denúncia, e nos comprometemos em respaldá-los.{"\n"}{"\n"}
                  
                    2.5 Não são aceitos dados cadastrais ofensivos, maliciosos ou mentirosos, sujeito a punições e bloqueio de conta.{"\n"}{"\n"}
                  
                  3. Isenções{"\n"}
                    3.1 O intuito do aplicativo não é substituir tratamento clínico/médico, muito pelo contrário, nosso objetivo é desmistificar as crenças sobre doenças como depressão e ansiedade, bem como ser uma forma demonstrativa de que pessoas com distúrbios podem se sentir
                    melhor procurando ajuda.{"\n"}{"\n"}
                  
                    3.2 Não nos responsabilizamos e não possuímos nenhum profissional da área de saúde. E ressaltamos que todos os voluntários, assim como diz o nome, ajudam por livre e espontânea vontade. Sem poder cobrar.{"\n"}{"\n"}
                  
                    3.3 Os voluntários não são necessariamente médicos ou profissionais de saúde, porém são submetidos a uma triagem para qualificá-los.{"\n"}{"\n"}
                  
                    3.4 O uso do aplicativo é exclusivo para maiores de idade, sendo assim, é expressamente proibido o uso por pessoas menores de 18 anos de idade.{"\n"}{"\n"}
                  
                    3.5 Não nos responsabilizamos pela divulgação de dados pessoais durante as interações no aplicativo.{"\n"}{"\n"}

                    3.6 Não possuímos nenhuma ligação ou afiliação com sites de terceiros, portanto não recomendamos que você clique em links de terceiros que apareçam no aplicativo.{"\n"}{"\n"}

                    3.7 A equipe do Get Over não discrimina e não compactua com discriminações com base em raça, cor, credo, gênero, expressão de gênero, idade, origem nacional, deficiência, estado civil, orientação sexual, status militar ou qualquer uma de suas atividades ou operações.{"\n"}{"\n"}
                    
                    3.8 Você reconhece e concorda que os Voluntários não são funcionários, agentes e nem representantes da equipe Get Over, portanto a equipe não assume nenhuma responsabilidade pois quaisquer atos ou omissões de tal voluntário.{"\n"}{"\n"}
                    
                    3.9 A sua interação com o voluntário é estritamente responsabilidade sua, não estamos envolvidos de forma alguma com substância real deste relacionamento ou com qualquer parte do serviço de ajuda.{"\n"}{"\n"}
                  
                    4. Sobre o aplicativo{"\n"}
                      4.1 O uso do aplicativo é 100% gratuito, sendo assim, o aplicativo não é voltado para uso comercial e nem possui nenhum tipo de monetização incluso.{"\n"}{"\n"}
                    
                      4.2 A equipe administrativa não interage com os usuários e nem nunca irá solicitar qualquer tipo de informação.{"\n"}{"\n"}
                  
                      4.3 Os termos de uso e políticas de privacidade do aplicativo poderão ser modificados a qualquer hora, sujeito a comunicação via e-mail aos usuários.{"\n"}{"\n"}
                      
                      SE VOCÊ ESTÁ PENSANDO EM SUICÍDIO, CASO SINTA-SE EM PERIGO OU ESTÁ ENFRENTANDO QUALQUER EMERGÊNCIA MÉDICA, PROCURE IMEDIATAMENTE SERVIÇOS DE SEGURANÇA PÚBLICA (190 POLÍCIA MILITAR) (181 DISQUE DENÚNCIA) (192 AMBULÂNCIA)
                </Text>
              </ScrollView>
            </View>
          </ProgressStep>

          <ProgressStep
            label="Triagem"
            nextBtnTextStyle={buttonTextStyle}
            previousBtnTextStyle={buttonTextStyle}
            finishBtnText={"Finalizar"}
            previousBtnText={"Anterior"}
            onSubmit={() => HandleSubmitSteps()}
          >
            <View style={[styles.container, { minHeight: 0.6 * altura, }]}>
              <Text style={{ textAlign: 'center', fontSize: 14, color: Cores.CinzaEscuro }}>Conte-nos mais sobre você. {"\n"} Responda as perguntas abaixo de acordo com o que sente:</Text>

              {perguntas.length === 0
                ? <Text style={styles.empty}>Obrigado por responder a triagem! Clique em Finalizar para continuar.</Text>
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
          </ProgressStep>
        </ProgressSteps>
      </View>
    </AndroidBackHandler>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    margin: 20,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: Cores.Branco,
    borderColor: Cores.FundoSecundario,
  },

  textoTermo: {
    paddingHorizontal: 10,
    fontSize: 14,
  },

  title: {
    flex: 1,
    alignItems: 'center',
    fontSize: 14,
    paddingHorizontal: 10,
  },

  buttonText: {
    color: Cores.Branco,
    fontWeight: 'bold',
    fontSize: 16,
  },

  inputDataNascimento: {
    fontSize: 14,
    backgroundColor: Cores.Branco,
    color: Cores.Cinza,
    borderColor: Cores.FundoSecundario,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingTop: 13,
    height: 46,
    marginHorizontal: 20,
  },

  container: {
    alignItems: 'center',
  },

  ContainerDoisCampos: {
    flex: 1,
    flexDirection: 'row',
  },

  TextInput: {
    borderWidth: 1,
    borderRadius: 4,
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: Cores.Branco,
    borderColor: Cores.FundoSecundario,
  },

  TextInputLongo: {
    borderWidth: 1,
    borderRadius: 4,
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 15,
    backgroundColor: Cores.Branco,
    borderColor: Cores.FundoSecundario,
  },

  button: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    height: 46,
    borderRadius: 4,
    marginTop: 10,
    marginLeft: 20,
    paddingHorizontal: 10,
    backgroundColor: Cores.Amarelo,
  },

  input: {
    alignSelf: 'stretch',
    backgroundColor: Cores.Branco,
    borderWidth: 1,
    borderColor: Cores.FundoSecundario,
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  botaoVoltar: {
    color: Cores.Amarelo,
    fontSize: 18,
    flex: 1,
    paddingLeft: 50,
    paddingTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },

  titleTriagem: {
    flex: 1,
    alignItems: 'center',
    color: Cores.CinzaEscuro,
    fontSize: 16,
    paddingHorizontal: 10,
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