// app/(auth)/login.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useUser } from '../../UserContext.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://af93-34-31-253-220.ngrok-free.app';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUserEmail } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Invalid Input', 'Please enter both email and password.');
      return;
    }
  
    setLoading(true);
    console.log('Login attempt with:', { email }); // Debug log
  
    try {
      console.log('Making request to:', `${API_URL}/auth/login`); // Debug log
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      console.log('Response status:', response.status); // Debug log
  
      // Get response text first for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response format from server');
      }
  
      if (response.ok) {
        console.log('Login successful, storing data...'); // Debug log
        try {
          await AsyncStorage.setItem('jwt_token', data.token);
          await AsyncStorage.setItem('user_email', email);
          await updateUserEmail(email);
  
          console.log('Data stored, navigating...'); // Debug log
          router.replace('/(tabs)/browse');
        } catch (storageError) {
          console.error('Storage error:', storageError);
          Alert.alert('Error', 'Failed to save login information');
        }
      } else {
        let errorMessage = 'An unexpected error occurred.';
        
        switch (response.status) {
          case 401:
            errorMessage = 'Invalid email or password.';
            break;
          case 404:
            errorMessage = 'Server not found.';
            break;
          case 422:
            errorMessage = 'Invalid email format.';
            break;
          default:
            errorMessage = data.error || errorMessage;
        }
        
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/just_logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Login to Your Account</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!loading}
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          editable={!loading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          role="button"
          tabIndex={0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.signUpText}>
        Don't have an account?
        <Link href="/(auth)/signup" style={[styles.linkText, loading && styles.linkDisabled]}>
          {' '}Sign up
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF8FE',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    minHeight: 54,
    cursor: 'pointer',
    userSelect: 'none',
  },
  buttonDisabled: {
    backgroundColor: '#9e9e9e',
    cursor: 'not-allowed',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 16,
    marginTop: 20,
  },
  linkText: {
    color: '#6200ea',
    fontWeight: 'bold',
  },
  linkDisabled: {
    color: '#9e9e9e',
  }
});

export default LoginPage;
