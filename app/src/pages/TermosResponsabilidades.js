import React, { useEffect, useState } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';

export default function TermosResponsabilidades({ navigation }) {
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
          <Text style={styles.textName}>Termos de Responsabilidade</Text>
        </View>
        <View style={styles.aviso}>
          <Text style={styles.textAviso}>Recomenda-se ler atentamente.</Text>
        </View>
        <View style={styles.card}>
          <ScrollView style={[styles.scrollView, { height: altura * 0.6 }]}>
            <Text style={styles.cardMessage}>
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

  aviso: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },

  textAviso: {
    fontSize: 14,
    color: Cores.Cinza,
    fontWeight: 'bold'
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

  },
});