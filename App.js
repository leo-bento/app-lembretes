import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,  SafeAreaViewBase, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // Seção de Estados (useSate) ***************************/
  const [view, setView] = useState('lista');
  const [lembretes, setLembretes] = useState([]);
  const [textoLembrete, setTextoLembrete] = useState("");
  //***************************************************** */

  // Seção de Funções de Ação *****************************/

  // Função para CARREGAR os lembrets do AsyncStorage
  const handleLoadLembretes = async () => {
    try {
      const lembretesSalvos = await AsyncStorage.getItem('@lembretes');
      if (lembretesSalvos !== null) {
        setLembretes(JSON.parse(lembretesSalvos));
        Alert.alert("Sucesso", "Lembretes carregados!");
      }
      else {
        Alert.alert("Aviso", "Nenhum lembrete salvo encontrado.");
      }
    }
    catch (e) {
      console.error("Falha ao carregar lembretes.", e);
      Alert.alert("Erro, não foi possível carregar os lembretes.");
    }
  }

  // Função para ADICIONAR um novo lembrete
  const handleAddLembrete = async () => {
    if (!textoLembrete.trim()) {
      Alert.alert("Erro", "O campo de lembrete não pode estar vazio.");
      return;
    }
    
    const novoLembrete = {
      id: Date.now().toString(),
      texto: textoLembrete
    };

    const listaAtualizada = [... lembretes, novoLembrete];
    setLembretes(listaAtualizada);
    
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
