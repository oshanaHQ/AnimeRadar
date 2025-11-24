import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string().required('Username required'),
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Min 6 chars').required('Password required'),
}).required();

export default function Register() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];

      const existing = parsedUsers.find((u: any) => u.email === data.email);
      if (existing) {
        Alert.alert('Error', 'Email already registered');
        return;
      }

      parsedUsers.push(data);
      await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));

      Alert.alert('Success', 'Account created!');
      router.push('/login');
    } catch (err) {
      Alert.alert('Failed', 'Could not register');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#C4C4C4"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#C4C4C4"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
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
            placeholderTextColor="#C4C4C4"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1B1F3B',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00CFFF',
    marginBottom: 50,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#2C2F4A',
    color: '#FFF8E7',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 207, 255, 0.2)',
  },
  button: {
    backgroundColor: '#00CFFF',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonText: {
    color: '#1B1F3B',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  error: {
    color: '#FF6B6B',
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 8,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 24,
    color: '#00CFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});