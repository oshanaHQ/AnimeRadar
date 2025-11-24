import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addFavourite, fetchAnime, removeFavourite } from '../store/animeSlice';

export default function AnimeScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { animeList, favourites, loading } = useSelector((state: RootState) => state.anime);
  const [username, setUsername] = useState('');

  async function loadUser() {
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUsername(user.username || user.email);
    }
  }

  useEffect(() => {
    loadUser();
    dispatch(fetchAnime());
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const toggleFavourite = (anime: typeof animeList[0]) => {
    const exists = favourites.find(a => a.mal_id === anime.mal_id);
    if (exists) dispatch(removeFavourite(anime.mal_id));
    else dispatch(addFavourite(anime));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.userHeader}>Welcome, {username} 👋</Text>
      <Text style={styles.header}>Top Anime</Text>

      <FlatList
        data={animeList}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={({ item }) => {
          const isFav = favourites.some(a => a.mal_id === item.mal_id);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/anime-details' as any, params: { anime: JSON.stringify(item) } })}
            >
              <Image source={{ uri: item.images.jpg.large_image_url }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity
                onPress={() => toggleFavourite(item)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <Text style={{ fontSize: 24 }}>{isFav ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#1B1F3B' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  userHeader: { fontSize: 20, fontWeight: '700', color: '#00CFFF', marginBottom: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: 'white' },
  card: { marginBottom: 15, backgroundColor: '#1E2230', borderRadius: 10, padding: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
