import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome6, Feather } from '@expo/vector-icons'

const Home = () => {
  return (
    <Tabs>
      <Tabs.Screen name="browse" options={{ title: 'Browse', tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="bookshelf" size={32} color="black" />
      ),
       }} />
      <Tabs.Screen name="build" options={{ title: 'Build', tabBarIcon: ({ color, size }) => (
        <FontAwesome6 name="wand-magic-sparkles" size={24} color="black" />
      ),
       }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color, size }) => (
        <Feather name="user" size={32} color="black" />
      ),
       }} />
    </Tabs>
  );
};

export default Home;