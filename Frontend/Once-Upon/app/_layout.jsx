import React from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '../UserContext.jsx';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="(auth)" 
          options={{
            headerShown: false,
            gestureEnabled: false // Prevents back gesture when logged out
          }}
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: false,
            gestureEnabled: false // Prevents going back to auth screens when logged in
          }}
        />
      </Stack>
    </UserProvider>
  );
}