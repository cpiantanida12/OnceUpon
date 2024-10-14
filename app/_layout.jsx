import React from 'react';
import { UserProvider } from '../UserContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="landing" options={{ title: 'Landing Page', headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login Page', headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up Page', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}