import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { UserProvider } from './userContext';
import { useRouter } from 'expo-router';

// SplashScreen component
const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/landing');
    }, 3000);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/just_logo.png')} style={styles.logo} />
    </View>
  );
};

export default function App() {
  return (
    <UserProvider>
      <SplashScreen />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
