import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchAnime, loadFavourites, toggleFavourite } from '../store/animeSlice';

export default function AnimeScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { animeList, favourites, loading } = useSelector((state: RootState) => state.anime);
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load logged-in user
  async function loadUser() {
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUsername(user.username || user.email);
    }
  }

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchAnime());
    setRefreshing(false);
  }, [dispatch]);

  // Load data on mount
  useEffect(() => {
    loadUser();
    dispatch(fetchAnime());
    dispatch(loadFavourites());
  }, [dispatch]);

  // Filter anime by search text
  const filteredAnime = animeList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userHeader}>Welcome, {username} 👋</Text>
      <Text style={styles.header}>Top Anime</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search anime..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredAnime}
        keyExtractor={(item) => item.mal_id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const isFav = favourites.some((a) => a.mal_id === item.mal_id);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({ pathname: '/anime-details' as any, params: { anime: JSON.stringify(item) } })
              }
            >
              <Image source={{ uri: item.images.jpg.large_image_url }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>

              <TouchableOpacity
                onPress={() => dispatch(toggleFavourite(item))}
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
  searchInput: {
    height: 40,
    backgroundColor: '#1E2230',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  card: { marginBottom: 15, backgroundColor: '#1E2230', borderRadius: 10, padding: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
