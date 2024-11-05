import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios'

const BuildScreen = () => {
const [messages, setMessages] = useState([{text: "Hi there! What would you like to read today?", user: false}]);
const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
const [summary, setSummary] = useState('');
  const router = useRouter();

  const handleSend = async () => {
    setLoading(true)
    const res = await axios.post("http://127.0.0.1:5000/test-gemini", { "userInput": input })
    console.log(res)
    setMessages([...messages, { text: input, user: true }, { text: res.data.text, user: false }]);
    setSummary(res.data.text)
    setInput('');
    setLoading(false)
  };

  const handleStartReading = (summary) => {
    router.push('/story?summary=' + summary);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={[styles.message, message.user ? styles.userMessage : styles.botMessage]}>
            <Text>{message.text}</Text>
            {!message.user && index > 0 && (
              <TouchableOpacity onPress={() => handleStartReading(message.text)} style={styles.startReadingButton}>
                <Text style={styles.startReadingText}>Start Reading</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      {loading && (
        <ActivityIndicator size="large" color="#214b68"/>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: '#CCCCFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#89CFF0',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  startReadingButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6200ea',
    borderRadius: 5,
  },
  startReadingText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '25px'
  },
});

export default BuildScreen;
