import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Min 6 chars').required('Password required'),
}).required();

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];

      const user = parsedUsers.find(
        (u: any) => u.email === data.email && u.password === data.password
      );

      if (!user) {
        Alert.alert('Login Failed', 'Invalid credentials');
        return;
      }

      // ✅ Save logged-in user so app can show username
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Alert.alert('Login Successful', `Welcome ${user.username}`);

      router.push('/(tabs)'); // go to tabs
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={{ marginTop: 20, color: '#00CFFF' }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1B1F3B' },
  title: { fontSize: 32, fontWeight: '900', color: '#00CFFF', marginBottom: 40 },
  input: { width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#2C2F4A', color: '#FFF', marginBottom: 10 },
  button: { backgroundColor: '#00CFFF', padding: 15, borderRadius: 10, marginTop: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#1B1F3B', fontWeight: '900', fontSize: 18 },
  error: { color: '#FF6B6B', alignSelf: 'flex-start', marginBottom: 5 }
});
