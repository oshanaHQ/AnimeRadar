import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const stored = await AsyncStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }

  async function logout() {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>My Profile</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={56} color="#00CFFF" />
        </View>

        <Text style={styles.username}>
          {user.username || user.email.split('@')[0]}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* My Favourites Button */}
      <TouchableOpacity
        style={styles.favouritesBtn}
        onPress={() => router.push('/(tabs)/favourites')}
      >
        <Feather name="heart" size={26} color="#FF6B6B" />
        <Text style={styles.favouritesText}>My Favourites</Text>
        <Feather name="arrow-right" size={24} color="#FF6B6B" />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Feather name="log-out" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1F3B',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF8E7',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: 'rgba(44, 47, 74, 0.85)',
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 207, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 207, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00CFFF',
  },
  username: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00CFFF',
    letterSpacing: 0.8,
  },
  email: {
    fontSize: 16,
    color: '#C4C4C4',
    marginTop: 8,
    fontWeight: '600',
  },
  favouritesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    marginBottom: 30,
  },
  favouritesText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B6B',
    flex: 1,
    marginLeft: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4C4C',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#FF4C4C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '800',
    marginLeft: 12,
  },
});