import { HapticTab } from '@/components/haptic-tab';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext'; // ← ONLY ADDED
import { store } from '../store';

export default function RootLayout() {
  const { theme } = useTheme(); // ← ONLY ADDED

  // Dynamic colors based on current theme
  const colors = theme === 'dark'
    ? {
        background: '#1B1F3B',
        primary: '#00CFFF',      // Active tab (cyan)
        secondary: '#C4C4C4',    // Inactive tab
        text: '#FFF8E7',
      }
    : {
        background: '#FFFFFF',
        primary: '#00CFFF',      // Keep your brand cyan as primary
        secondary: '#888888',
        text: '#1B1F3B',
      };

  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: { backgroundColor: colors.background },
          headerShown: false,
          tabBarButton: HapticTab,
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