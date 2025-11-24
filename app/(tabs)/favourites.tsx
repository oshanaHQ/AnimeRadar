import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import type { AppDispatch, RootState } from '../store';
import { toggleFavourite } from '../store/animeSlice';

export default function FavouritesScreen() {
  const { favourites } = useSelector((state: RootState) => state.anime);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme(); 

  const colors = theme === 'dark'
    ? { background: '#1B1F3B', text: '#FFF8E7', card: 'rgba(44,47,74,0.7)' }
    : { background: '#FFF', text: '#1B1F3B', card: '#EDEDED' };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Favourites</Text>

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.mal_id.toString()}
        contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No favourites added yet</Text>
          </View>
        }
        renderItem={({ item }) => (
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
              <Text style={styles.favIcon}>♥</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: '900', marginBottom: 20 },
  listContainer: { paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 20, fontWeight: '600' },
  card: { marginBottom: 20, borderRadius: 24, overflow: 'hidden', elevation: 12, borderWidth: 1, borderColor: 'rgba(0, 207, 255, 0.15)' },
  image: { width: '100%', height: 240, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  title: { fontSize: 18, fontWeight: '800', padding: 16, paddingTop: 12 },
  favButton: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(0, 0, 0, 0.65)', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 2, borderColor: 'rgba(255, 107, 107, 0.3)' },
  favIcon: { fontSize: 34, color: '#FF6B6B' },
});