import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ username: '', email: '', password: '' });
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setEditedUser({
        username: parsed.username || parsed.email.split('@')[0],
        email: parsed.email,
        password: '',
      });
    }
  }

  async function saveProfile() {
    if (!editedUser.username.trim() || !editedUser.email.trim()) {
      Alert.alert('Error', 'Username and email are required');
      return;
    }

    try {
      const updatedUser = {
        ...user,
        username: editedUser.username.trim(),
        email: editedUser.email.trim(),
        ...(editedUser.password ? { password: editedUser.password } : {}),
      };

      // Update logged-in user
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Update in registered users list
      const usersJson = await AsyncStorage.getItem('users');
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const updatedUsers = users.map((u: any) =>
          u.email === user.email
            ? { ...u, username: updatedUser.username, email: updatedUser.email, ...(editedUser.password ? { password: editedUser.password } : {}) }
            : u
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile');
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  }

  if (!user) return null;

  const colors = theme === 'dark'
    ? {
        background: '#1B1F3B',
        text: '#FFF8E7',
        accent: '#00CFFF',
        cardBg: 'rgba(44, 47, 74, 0.85)',
        border: 'rgba(0, 207, 255, 0.2)',
        favBg: 'rgba(255, 107, 107, 0.12)',
        favBorder: 'rgba(255, 107, 107, 0.3)',
        favColor: '#FF6B6B',
        inputBg: '#2C2F4A',
        placeholder: '#888',
      }
    : {
        background: '#FFFFFF',
        text: '#1B1F3B',
        accent: '#00CFFF',
        cardBg: '#F5F7FA',
        border: '#00CFFF',
        favBg: '#FFF5F5',
        favBorder: '#FF6B6B',
        favColor: '#FF6B6B',
        inputBg: '#F0F0F0',
        placeholder: '#666',
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Text style={[styles.header, { color: colors.text }]}>My Profile</Text>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <View style={[styles.avatarCircle, { borderColor: colors.accent }]}>
          <Feather name="user" size={56} color={colors.accent} />
        </View>

        {isEditing ? (
          <>
            <TextInput
              style={[styles.editInput, { backgroundColor: colors.inputBg, color: colors.text }]}
              value={editedUser.username}
              onChangeText={(text) => setEditedUser({ ...editedUser, username: text })}
              placeholder="Username"
              placeholderTextColor={colors.placeholder}
            />
            <TextInput
              style={[styles.editInput, { backgroundColor: colors.inputBg, color: colors.text, marginTop: 12 }]}
              value={editedUser.email}
              onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.editInput, { backgroundColor: colors.inputBg, color: colors.text, marginTop: 12 }]}
              value={editedUser.password}
              onChangeText={(text) => setEditedUser({ ...editedUser, password: text })}
              placeholder="New Password (optional)"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
            />
          </>
        ) : (
          <>
            <Text style={[styles.username, { color: colors.accent }]}>
              {user.username || user.email.split('@')[0]}
            </Text>
            <Text style={[styles.email, { color: theme === 'dark' ? '#C4C4C4' : '#666' }]}>
              {user.email}
            </Text>
          </>
        )}
      </View>

      {/* Edit / Save Button */}
      <TouchableOpacity
        style={[styles.editBtn, { backgroundColor: colors.accent }]}
        onPress={() => (isEditing ? saveProfile() : setIsEditing(true))}
      >
        <Feather name={isEditing ? 'check' : 'edit-2'} size={24} color="#FFF" />
        <Text style={styles.editBtnText}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {/* My Favourites Button */}
      <TouchableOpacity
        style={[
          styles.favouritesBtn,
          { backgroundColor: colors.favBg, borderColor: colors.favBorder },
        ]}
        onPress={() => router.push('/(tabs)/favourites')}
      >
        <Feather name="heart" size={26} color={colors.favColor} />
        <Text style={[styles.favouritesText, { color: colors.favColor }]}>My Favourites</Text>
        <Feather name="arrow-right" size={24} color={colors.favColor} />
      </TouchableOpacity>

      {/* Theme Toggle Button */}
      <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme}>
        <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={24} color="#FFF" />
        <Text style={styles.themeToggleText}>
          {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
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
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  profileCard: {
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1.5,
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
  },
  username: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  email: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
  },
  editInput: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    fontSize: 17,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 207, 255, 0.3)',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  editBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
  },
  cancelBtn: {
    padding: 12,
    marginBottom: 20,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  favouritesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 20,
  },
  favouritesText: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginLeft: 16,
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00CFFF',
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  themeToggleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
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