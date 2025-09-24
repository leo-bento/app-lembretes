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

    try {
      await AsyncStorage.setItem('@lembretes', JSON.stringify(listaAtualizada));
    }
    catch (e) {
      console.error("Falha ao salvar o lembrete.", e);
    }

    setTextoLembrete("");
    setView("lista");  
  }

  // Função para DELETAR um lembrete
  const handleDeleteLembrete = async (id) => {
    const listaAtualizada = lembretes.filter(lembrete => lembrete.id !== id);
    setLembretes(listaAtualizada);

    try {
      await AsyncStorage.setItem('@lembretes', JSON.stringify(listaAtualizada));
    }
    catch (e) {
      console.error('Falha ao deletar o lembrete.', e);
    }
  }
  //*******************************************************/

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Meus Lembretes</Text>

        {view === 'lista' ? (
          // SE a variável de estado "view" for "lista", MOSTRE ISTO:
          <View>
            <View style={styles.botoesMenu}>
              {/* Botão para ir para a tela de formulário */}
              <TouchableOpacity style={styles.addButon} onPress={() => setView('formulario')}>
                <Text style={styles.buttonText}>Adicionar Novo Lembrete</Text>
              </TouchableOpacity>

              {/* Botão para carregar os lembretes salvos */}
              <TouchableOpacity style={styles.loadButton} onPress={handleLoadLembretes}>
                <Text style={styles.buttonText}>Carregar Salvos</Text>
              </TouchableOpacity>
            </View>

            {/* Renderização condicional: se a lista estiver vazia, mostra uma mensagem */}
            {lembretes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum lembrete cadastrado.</Text>
            ) : (
              // Se não estiver vazio, usa o .map() para criar um componente para cada lembrete
              lembretes.map((item) => (
                <View key={item.id} style={styles.lembreteItem}>
                  {/* Container para o texto do lembrete */}
                  <View style={styles.lembreteTextContainer}>
                    <Text style={styles.lembreteTitle}>{item.texto}</Text>
                  </View>

                  {/* Botão para deletar o lembrete */}
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteLembrete(item.id)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>  
              ))
            )}
          </View>
        ) : (
          // SENÃO (se a "view" for 'formulario'), MOSTRE ISTO:
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>Adicionar Lembrete</Text>

            {/* Input para o texto do lembrete */}
            <TextInput
            style={styles.input}
            placeholder='O que voce quer lembrar?'
            value={textoLembrete}
            onChangeText={setTextoLembrete}
            multiline={true}></TextInput>

            <View style={styles.formActions}>
              {/* Botão para cancelar e voltar para a lista */}
              <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => setView('lista')}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              {/* Botão para salvar o novo lembrete */}
              <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleAddLembrete}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>   
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
