import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  const updateUserEmail = async (email) => {
    try {
      if (email) {
        await AsyncStorage.setItem('userEmail', email);
      } else {
        await AsyncStorage.removeItem('userEmail');
      }
      setUserEmail(email);
    } catch (error) {
      console.error('Error updating user email:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      userEmail,
      updateUserEmail 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;