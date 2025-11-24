import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { toggleFavourite } from '../store/animeSlice';

export default function FavouritesScreen() {
  const { favourites } = useSelector((state: RootState) => state.anime);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  if (favourites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'white' }}>No favourites added</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favourites}
      keyExtractor={(item) => item.mal_id.toString()}
      contentContainerStyle={{ padding: 15 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push({ pathname: '/anime-details' as any, params: { anime: JSON.stringify(item) } })}
        >
          <Image source={{ uri: item.images.jpg.large_image_url }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>

          <TouchableOpacity
            onPress={() => dispatch(toggleFavourite(item))}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <Text style={{ fontSize: 24 }}>❤️</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1B1F3B' },
  card: { marginBottom: 15, backgroundColor: '#1E2230', borderRadius: 10, padding: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
