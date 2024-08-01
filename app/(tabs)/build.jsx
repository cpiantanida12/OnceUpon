import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const BuildScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSend = () => {
    setMessages([...messages, { text: input, user: true }, { text: 'Not done yet dammit', user: false }]);
    setInput('');
  };

  const handleStartReading = () => {
    router.push('/story?from=build');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={[styles.message, message.user ? styles.userMessage : styles.botMessage]}>
            <Text>{message.text}</Text>
            {!message.user && (
              <TouchableOpacity onPress={handleStartReading} style={styles.startReadingButton}>
                <Text style={styles.startReadingText}>Start Reading</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#ececec',
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
  },
});

export default BuildScreen;