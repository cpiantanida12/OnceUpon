import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://1386-34-136-247-50.ngrok-free.app';

export default function BuildScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasStory, setHasStory] = useState(false);
  const flatListRef = useRef(null);

  // Debug function to log auth data
  const logAuthData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const email = await AsyncStorage.getItem('user_email');

      if (token) {
        // Check token expiration
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expiration = new Date(payload.exp * 1000);
          const now = new Date();
          
          if (now > expiration) {
            // Token is expired, clear storage and redirect to login
            console.log('Token expired, redirecting to login');
            await AsyncStorage.multiRemove(['jwt_token', 'user_email']);
            router.replace('/(auth)/login');
            return false;
          }
        }
      }

      console.log('Auth Data:', {
        token: token ? 'exists' : 'missing',
        email: email,
      });
    } catch (error) {
      console.error('Error logging auth data:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) {
      console.log('Early return due to:', { emptyInput: !inputText.trim(), loading });
      return;
    }
  
    setLoading(true);
    console.log('Starting handleSend...');
  
    try {
      // Get auth data
      const token = await AsyncStorage.getItem('jwt_token');
      const email = await AsyncStorage.getItem('user_email');
  
      console.log('Retrieved auth data:', { 
        hasToken: !!token, 
        hasEmail: !!email 
      });
  
      if (!token || !email) {
        console.log('Missing auth data');
        Alert.alert(
          'Authentication Required',
          'Please log in to continue.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
        return;
      }
  
      // Add token debugging
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', {
            exp: new Date(payload.exp * 1000).toISOString(),
            iat: new Date(payload.iat * 1000).toISOString(),
            sub: payload.sub,
            now: new Date().toISOString()
          });
  
          // Check if token is expired
          if (Date.now() >= payload.exp * 1000) {
            console.log('Token is expired');
            await AsyncStorage.multiRemove(['jwt_token', 'user_email']);
            Alert.alert(
              'Session Expired',
              'Please log in again.',
              [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
            );
            return;
          }
        }
      } catch (e) {
        console.log('Error parsing token:', e);
      }
  
      // Add user message to chat immediately
      const userMessage = { type: 'user', content: inputText };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
  
      console.log('Sending request...');
      const response = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          message: inputText
        }),
      });
  
      console.log('Response received:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });
  
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response format from server');
      }
  
      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }
  
      // Add bot response to chat
      const botMessage = { type: 'bot', content: data.response };
      setMessages(prev => [...prev, botMessage]);
      setHasStory(data.has_story);
  
    } catch (error) {
      console.error('Error in handleSend:', error);
      
      // Add error message to chat
      const errorMessage = { 
        type: 'error', 
        content: 'Sorry, something went wrong. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      Alert.alert(
        'Error',
        `Failed to send message: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('jwt_token');
      const email = await AsyncStorage.getItem('user_email');

      if (!token || !email) {
        Alert.alert(
          'Authentication Required',
          'Please log in to continue.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
        return;
      }

      const response = await fetch(`${API_URL}/chatbot/clear`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear chat');
      }

      setMessages([]);
      setHasStory(false);
      
    } catch (error) {
      console.error('Error clearing chat:', error);
      Alert.alert(
        'Error',
        'Failed to clear chat. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartReading = async () => {
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const email = await AsyncStorage.getItem('user_email');
      
      if (!token || !email) {
        Alert.alert(
          'Authentication Required',
          'Please log in to continue.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
        return;
      }
  
      console.log('Generating story...'); // Debug log
      const response = await fetch(`${API_URL}/chatbot/generate-story`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      console.log('Story generation response status:', response.status); // Debug log
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Debug log
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Story data received'); // Debug log
      
      // Store story data in AsyncStorage for the reading screen
      await AsyncStorage.setItem('current_story', JSON.stringify(data));
      
      // Navigate to reading screen
      router.push('/read');
      
    } catch (error) {
      console.error('Error generating story:', error);
      Alert.alert(
        'Error',
        'Sorry, there was an error generating your story. Please try again.',
        [{ text: 'OK' }]
      );
      const errorMessage = { 
        type: 'error', 
        content: 'Sorry, there was an error generating your story. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View 
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.botMessage,
        item.type === 'error' && styles.errorMessage
      ]}
    >
      <Text style={[
        styles.messageText,
        item.type === 'user' && styles.userMessageText,
        item.type === 'error' && styles.errorMessageText
      ]}>
        {item.content}
      </Text>
    </View>
  );

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd();
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Story Builder</Text>
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClear}
          disabled={loading || messages.length === 0}
        >
          <MaterialIcons name="refresh" size={24} color="white" />
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {hasStory && (
        <TouchableOpacity 
          style={styles.startReadingButton}
          onPress={handleStartReading}
          disabled={loading}
        >
          <Text style={styles.startReadingButtonText}>Start Reading</Text>
        </TouchableOpacity>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          maxLength={500}
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    color: 'white',
    marginLeft: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  errorMessage: {
    alignSelf: 'center',
    backgroundColor: '#FFE5E5',
    borderWidth: 1,
    borderColor: '#FFB6B6',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  errorMessageText: {
    color: '#FF0000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  startReadingButton: {
    backgroundColor: '#34C759',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  startReadingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
};