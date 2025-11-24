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
import { useTheme } from '../contexts/ThemeContext'; // ← ONLY ADDED
import type { AppDispatch, RootState } from '../store';
import { fetchAnime, loadFavourites, toggleFavourite } from '../store/animeSlice';

export default function AnimeScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { animeList, favourites, loading } = useSelector((state: RootState) => state.anime);
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const { theme } = useTheme(); // ← ONLY ADDED

  const colors = theme === 'dark'
    ? { background: '#1B1F3B', text: '#FFF8E7', card: 'rgba(44,47,74,0.7)' }
    : { background: '#FFF', text: '#1B1F3B', card: '#EDEDED' };

  async function loadUser() {
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUsername(user.username || user.email);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchAnime(1));
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    loadUser();
    dispatch(fetchAnime(1));
    dispatch(loadFavourites());
  }, [dispatch]);

  const loadMore = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchAnime(nextPage));
    }
  };

  const filteredAnime = animeList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#00CFFF" />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading top anime...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.userHeader, { color: '#00CFFF' }]}>Welcome, {username}</Text>
      <Text style={[styles.header, { color: colors.text }]}>Top Anime</Text>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme === 'dark' ? '#2C2F4A' : '#F0F0F0', color: colors.text }]}
        placeholder="Search anime..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredAnime}
        keyExtractor={(item) => item.mal_id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00CFFF']} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => {
          const isFav = favourites.some((a) => a.mal_id === item.mal_id);
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() =>
                router.push({ pathname: '/anime-details' as any, params: { anime: JSON.stringify(item) } })
              }
            >
              <Image source={{ uri: item.images.jpg.large_image_url }} style={styles.image} />
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

              <TouchableOpacity
                onPress={() => dispatch(toggleFavourite(item))}
                style={styles.favButton}
              >
                <Text style={[styles.favIcon, isFav && styles.favIconFilled]}>
                  {isFav ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },
  userHeader: { fontSize: 24, fontWeight: '900', marginBottom: 8, letterSpacing: 0.5 },
  header: { fontSize: 28, fontWeight: '900', marginBottom: 20 },
  searchInput: { height: 56, borderRadius: 20, paddingHorizontal: 20, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#444' },
  card: { marginBottom: 20, borderRadius: 24, overflow: 'hidden', elevation: 12, borderWidth: 1, borderColor: 'rgba(0, 207, 255, 0.15)' },
  image: { width: '100%', height: 240, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  title: { fontSize: 18, fontWeight: '800', padding: 16, paddingTop: 12 },
  favButton: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(0, 0, 0, 0.65)', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 2, borderColor: 'rgba(255, 107, 107, 0.3)' },
  favIcon: { fontSize: 34, color: '#FFFFFF' },
  favIconFilled: { color: '#FF6B6B' },
});