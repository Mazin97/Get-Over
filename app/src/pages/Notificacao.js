import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import Cores from '../assets/cores';
import getover from '../assets/GETOVERFEED.png';
import { Card, Title, Paragraph } from 'react-native-paper';
import api from '../services/api';
import { FlatList } from 'react-native-gesture-handler';

export default function Notificacao({ navigation }) {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    loadNotificacoes();
    
  }, []);

  function loadNotificacoes() {
    api.get('/notificacao', {})
      .then(response => {
        setNotificacoes(response.data);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: Cores.CinzaEscuro }}>
        <Image source={getover} style={styles.header}></Image>
      </View>
      <View>
        <Text style={{ backgroundColor: Cores.Amarelo, height: 6 }}></Text>
      </View>
      <View style={styles.name}>
        <Text style={styles.textName}>Notificações</Text>
      </View>
      <View>
        <FlatList
          data={notificacoes}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
            >
              <Card.Content>
                <Title>
                  {item.titulo}
                </Title>
                <Paragraph>
                  {item.conteudo}
                </Paragraph>
              </Card.Content>
            </Card>
          )}
        />
      </View>

    </SafeAreaView>
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

  categorias: {
    backgroundColor: Cores.FundoPadrao,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
  },

  categoria: {
    borderBottomWidth: 1,
    borderColor: Cores.Cinza,
  },

  tituloCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 1,
  },

  messageCategoria: {
    fontSize: 16,
    color: Cores.Cinza,
    marginBottom: 13,
  },

  card: {
    borderBottomWidth: 1,
    borderBottomColor: Cores.Cinza,
  },
});