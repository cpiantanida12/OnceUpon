import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome6, Feather } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookshelf" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="build"
        options={{
          title: 'Build',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="wand-magic-sparkles" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={32} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;