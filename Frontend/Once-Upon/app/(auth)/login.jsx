import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useUser } from '../../UserContext.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { updateUserEmail } = useUser();  // Changed from setUserID to updateUserEmail

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Invalid Input', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('https://47a3-34-71-64-138.ngrok-free.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        
        console.log('User email:', email);

        // Store the email in the context
        await updateUserEmail(email);  // Changed from setUserID to updateUserEmail

        // Store the JWT token
        await AsyncStorage.setItem('jwt_token', token);

        router.replace('/(tabs)/browse');
      } else if (response.status === 401) {
        Alert.alert('Login Failed', 'Invalid email or password.');
      } else if (response.status === 404) {
        Alert.alert('Error', 'Server not found.');
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while connecting to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/just_logo.png')} style={styles.logo} />
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
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.signUpText}>
        Don't have an account?
        <Link href="/(auth)/signup" style={styles.linkText}> Sign up</Link>
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
});

export default LoginPage;