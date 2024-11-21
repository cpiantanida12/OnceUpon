import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { userEmail } = useUser();
  const [showSplash, setShowSplash] = useState(true);

  // useEffect(() => {
  //   const splashTimer = setTimeout(() => {
  //     setShowSplash(false);
  //     if (userEmail) {
  //       router.replace('/(tabs)/browse');
  //     } else {
  //       router.replace('/(auth)/landing');
  //     }
  //   }, 3000);
    useEffect(() => {
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
        router.replace('/(auth)/landing');
      }, 3000);

    return () => clearTimeout(splashTimer);
  }, [userEmail]);

  return (
    <View style={styles.container}>
      {showSplash ? (
        <Image 
          source={require('../assets/images/just_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <ActivityIndicator size="large" color="#6200ea" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebf9ff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});