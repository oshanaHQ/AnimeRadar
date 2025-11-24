import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <IconSymbol
                size={28}
                name="house.fill"
                color={focused ? colors.primary : colors.secondary}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="favourites"
          options={{
            title: 'Favourites',
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="heart"
                size={28}
                color={focused ? colors.primary : colors.secondary} 
              />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
