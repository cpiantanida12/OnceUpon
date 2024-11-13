import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const options = ['Profile', 'Account', 'Display', 'Sound', 'Notifications'];

const AccountScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear all auth data
              await AsyncStorage.multiRemove(['jwt_token', 'user_email']);
              // Navigate to login screen
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
        
        {/* Add Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        {selectedOption && (
          <Text style={styles.detailsText}>
            {selectedOption} Details
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '30%',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },
  option: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#ececec',
  },
  details: {
    flex: 1,
    padding: 15,
  },
  detailsText: {
    fontSize: 18,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#FF6B6B',
    marginTop: 'auto', // This pushes the logout button to the bottom
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default AccountScreen;
