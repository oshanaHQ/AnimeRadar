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
  const [page, setPage] = useState(1);   // ← ONLY ADDED

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
    setPage(1);                          // ← ONLY ADDED
    await dispatch(fetchAnime(1));       // ← CHANGED: pass page 1
    setRefreshing(false);
  }, [dispatch]);

  // Load data on mount
  useEffect(() => {
    loadUser();
    dispatch(fetchAnime(1));             // ← CHANGED: start from page 1
    dispatch(loadFavourites());
  }, [dispatch]);

  // Load more when reaching end
  const loadMore = () => {               // ← ONLY ADDED
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchAnime(nextPage));
    }
  };

  // Filter anime by search text
  const filteredAnime = animeList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00CFFF" />
        <Text style={styles.loadingText}>Loading top anime...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userHeader}>Welcome, {username}</Text>
      <Text style={styles.header}>Top Anime</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search anime..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredAnime}
        keyExtractor={(item) => item.mal_id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00CFFF']} />}
        onEndReached={loadMore}           // ← ONLY ADDED
        onEndReachedThreshold={0.5}       // ← ONLY ADDED
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

              {/* FIXED & BEAUTIFUL HEART BUTTON */}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1B1F3B',
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1F3B',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#C4C4C4',
  },
  userHeader: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00CFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF8E7',
    marginBottom: 20,
  },
  searchInput: {
    height: 56,
    backgroundColor: '#2C2F4A',
    color: '#FFF8E7',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(44, 47, 74, 0.7)',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.15)',
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    color: '#FFF8E7',
    fontSize: 18,
    fontWeight: '800',
    padding: 16,
    paddingTop: 12,
  },

  // BEAUTIFUL & VISIBLE HEART
  favButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  favIcon: {
    fontSize: 34,
    color: '#FFFFFF',
  },
  favIconFilled: {
    color: '#FF6B6B',
    textShadowColor: 'rgba(255, 107, 107, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});