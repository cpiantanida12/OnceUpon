import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Load user email from AsyncStorage on app start
    const loadUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('user_email');
        if (email) setUserEmail(email);
      } catch (error) {
        console.error('Error loading user email:', error);
      }
    };
    loadUserEmail();
  }, []);

  const updateUserEmail = async (email) => {
    try {
      if (email) {
        await AsyncStorage.setItem('user_email', email);
      } else {
        await AsyncStorage.removeItem('user_email');
      }
      setUserEmail(email);
    } catch (error) {
      console.error('Error updating user email:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userEmail, updateUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}