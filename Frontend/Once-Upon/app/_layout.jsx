import { Stack } from 'expo-router';
import { UserProvider } from '../UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Add the index screen */}
        <Stack.Screen 
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="(auth)" 
          options={{
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="read" 
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
      </Stack>
    </UserProvider>
  );
}