import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Color palette
  const colors = {
    background: '#1B1F3B',
    primary: '#00CFFF',
    accent: '#FF6B6B',
    text: '#FFF8E7',
    secondary: '#C4C4C4',
  };

  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: { backgroundColor: colors.background },
        }}
      >

        {/* HOME TAB */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />

        {/* PROFILE TAB */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />

        {/* FAVOURITES TAB */}
        <Tabs.Screen
          name="favourites"
          options={{
            title: 'Favourites',
            tabBarIcon: ({ color, size }) => (
              <Feather name="heart" size={size} color={color} />
            ),
          }}
        />

      </Tabs>
    </Provider>
  );
}
