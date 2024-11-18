import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://b353-35-202-168-65.ngrok-free.app';

const SignUpPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const handleCreateAccount = async () => {
      if (!firstName || !lastName) {
        if (Platform.OS === 'web') {
          alert('Please enter both first and last names.');
        } else {
          Alert.alert('Missing Information', 'Please enter both first and last names.');
        }
        return;
      }
      if (!validateEmail(email)) {
        if (Platform.OS === 'web') {
          alert('Please enter a valid email address.');
        } else {
          Alert.alert('Invalid Email', 'Please enter a valid email address.');
        }
        return;
      }
      if (password.length < 6) {
        if (Platform.OS === 'web') {
          alert('Password must be at least 6 characters long.');
        } else {
          Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: email,
            password: password,
            f_name: firstName,
            l_name: lastName,
            date_of_birth: dateOfBirth.getTime()
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (Platform.OS === 'web') {
            localStorage.setItem('userEmail', email);
          } else {
            await AsyncStorage.setItem('userEmail', email);
          }
          
          if (Platform.OS === 'web') {
            alert('Account created successfully!');
          } else {
            Alert.alert('Success', 'Account created successfully!');
          }
          router.push('/(auth)/survey');
        } else {
          if (Platform.OS === 'web') {
            alert(data.error || 'An error occurred during account creation.');
          } else {
            Alert.alert('Error', data.error || 'An error occurred during account creation.');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        if (Platform.OS === 'web') {
          alert('An error occurred while connecting to the server.');
        } else {
          Alert.alert('Error', 'An error occurred while connecting to the server.');
        }
      }
    };

    const handleDateChange = (event, selectedDate) => {
      if (Platform.OS === 'web') {
        // For web, handle the input change directly
        const newDate = new Date(event.target.value);
        setDateOfBirth(newDate);
      } else {
        // For mobile, handle the DateTimePicker change
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(Platform.OS === 'ios');
        setDateOfBirth(currentDate);
      }
    };

    const formatDate = (date) => {
      // For web input, we need YYYY-MM-DD format
      if (Platform.OS === 'web') {
        return date.toISOString().split('T')[0];
      }
      // For mobile display, use more readable format
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const renderDatePicker = () => {
      if (Platform.OS === 'web') {
        return (
          <input
            type="date"
            value={formatDate(dateOfBirth)}
            onChange={handleDateChange}
            max={formatDate(new Date())}
            style={{
              height: 40,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 5,
              marginBottom: 20,
              paddingHorizontal: 10,
              backgroundColor: '#fff',
              width: '100%',
              padding: '0 10px',
            }}
          />
        );
      }

      return (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{formatDate(dateOfBirth)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </>
      );
    };

    return (
      <View style={styles.container}>
        <Image source={require('../../assets/images/just_logo.png')} style={styles.logo} />
        <Text style={styles.title}>Create Your Account</Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
          />
          <Text style={styles.label}>Date of Birth</Text>
          {renderDatePicker()}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.signInText}>
          Already have an account?
          <Link href="/(auth)/login" style={styles.linkText}> Sign in</Link>
        </Text>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EFF8FE',
    padding: 10,
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  textContainer: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#6200ea',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 40,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
  signInText: {
    fontSize: 16,
    marginTop: 20,
  },
  linkText: {
    color: '#6200ea',
    fontWeight: 'bold',
  },
});

export default SignUpPage;