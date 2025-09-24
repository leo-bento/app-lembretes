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
              <TouchableOpacity style={styles.addButton} onPress={() => setView('formulario')}>
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
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#34495e',
  },
  // Menu da Lista
  botoesMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  loadButton: {
    backgroundColor: '#5bc0de',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  // Formulário
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  // Item da Lista
  lembreteItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lembreteTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  lembreteTitle: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
});
