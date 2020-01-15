import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import AsyncStorage from '@react-native-community/async-storage';

import Login from './pages/Login';
import Triagem from './pages/Triagem';
import TriagemVoluntario from './pages/TriagemVoluntario';
import CriarConta from './pages/CriarContaSteps';
import Feed from './pages/Feed';
import Perfil from './pages/Perfil';
import Conversas from './pages/Conversas';
import ConversasInterno from './pages/ConversasInterno';
import UsuariosBloqueados from './pages/UsuariosBloqueados';
import Chat from './pages/Chat';
import NovoPost from './pages/NovoPost';
//import Denuncia from './pages/Denuncia';
import NovaDenuncia from './pages/NovaDenuncia';
import Notificacao from './pages/Notificacao';
import EsqueciMinhaSenha from './pages/EsqueciMinhaSenha';
import EditarApelido from './pages/EditarApelido';
import EditarSenha from './pages/EditarSenha';
import TermosResponsabilidades from './pages/TermosResponsabilidades';
import Sobre from './pages/Sobre';
import PerguntasFrequentes from './pages/PerguntasFrequentes';
import Novidades from './pages/Novidades';
import Noticia from './pages/Noticia';
import TutorialVoluntario from './pages/TutorialVoluntario';
import Cores from './assets/cores';
import { scrollTop } from './pages/Feed';

const TabNavigator = createMaterialTopTabNavigator({
  Feed,
  Notificacao,
  "Novo Post": NovoPost,
  Conversas,
  Perfil,
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const feed = focused ? require('./assets/Feed.png') : require('./assets/Feed.png')
        const user = focused ? require('./assets/user.png') : require('./assets/user.png');
        const chat = focused ? require('./assets/chat.png') : require('./assets/chat.png');
        const plus = focused ? require('./assets/plus.png') : require('./assets/plus.png');
        const notification = focused ? require('./assets/notification.png') : require('./assets/notification.png');

        if (routeName === 'Feed') {
          return (
            <Image style={{ flex: 1, width: 50, height: 50, resizeMode: 'center', alignSelf: 'center' }} source={feed}></Image>
          );
        } else if (routeName === 'Notificacao') {
          return (
            <Image style={{ flex: 1, width: 50, height: 50, resizeMode: 'center', alignSelf: 'center' }} source={notification}></Image>
          );
        } else if (routeName === 'Novo Post') {
          return (
            <Image style={{ flex: 1, width: 50, height: 50, resizeMode: 'center', alignSelf: 'center' }} source={plus}></Image>
          );
        } else if (routeName === 'Conversas') {
          return (
            <Image style={{ flex: 1, width: 50, height: 50, resizeMode: 'center', alignSelf: 'center' }} source={chat}></Image>
          );
        } else if (routeName === 'Perfil') {
          return (
            <Image style={{ flex: 1, width: 50, height: 50, resizeMode: 'center', alignSelf: 'center' }} source={user}></Image>
          );
        }
      },
      tabBarOnPress: ({ defaultHandler, navigation }) => {
        if (navigation.state.key === 'Feed') {
          scrollTop();
        }
        else if (navigation.state.key === 'Novo Post') {
          AsyncStorage.getItem('indexPacient').then((index) => {
            if (!index) {
              navigation.navigate('Triagem');
              return;
            }
          });
        }

        defaultHandler();
      },
      tabBarOnLongPress: ({ defaultHandler, navigation }) => {
        if (navigation.state.key === 'Feed') {
          scrollTop();
        }
        else if (navigation.state.key === 'Novo Post') {
          AsyncStorage.getItem('indexPacient').then((index) => {
            if (!index) {
              navigation.navigate('Triagem');
              return;
            }
          });
        }

        defaultHandler();
      },
    }),
    tabBarOptions: {
      activeTintColor: '#ead700',
      inactiveTintColor: '#3a3a3a',
      showLabel: false,
      style: {
        backgroundColor: Cores.FundoSecundario,
        height: 50,
        borderWidth: 1,
        borderColor: Cores.Cinza,
        borderRadius: 1,
        borderTop: 1,
        borderBottom: 1,
      },
      tabStyle: {
        marginBottom: 15,
      },
      showIcon: true
    },
    tabBarPosition: 'bottom',
    swipeEnabled: true
  });

const AppSwitchNavigator = createSwitchNavigator({
  Login,
  CriarConta,
  EsqueciMinhaSenha,
  Triagem,
  TriagemVoluntario,
  Home: TabNavigator,
  //Denuncia,
  ConversasInterno,
  Chat,
  NovaDenuncia,
  ConversasInterno,
  UsuariosBloqueados,
  EditarApelido,
  EditarSenha,
  TermosResponsabilidades,
  Sobre,
  PerguntasFrequentes,
  Novidades,
  Noticia,
  TutorialVoluntario,
});

export default createAppContainer(AppSwitchNavigator);