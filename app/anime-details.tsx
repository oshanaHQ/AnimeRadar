import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from './contexts/ThemeContext';
import type { AppDispatch, RootState } from "./store";
import { toggleFavourite } from "./store/animeSlice";

export default function AnimeDetailsScreen() {
  const { anime } = useLocalSearchParams<{ anime: string }>();
  const animeData = anime ? JSON.parse(anime) : null;
  const dispatch = useDispatch<AppDispatch>();
  const favourites = useSelector((state: RootState) => state.anime.favourites);
  const { theme } = useTheme();

  const colors = theme === 'dark'
    ? { background: '#1B1F3B', text: '#FFF8E7', card: 'rgba(44,47,74,0.7)' }
    : { background: '#FFF', text: '#1B1F3B', card: '#EDEDED' };

  if (!animeData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No anime data available</Text>
      </View>
    );
  }

  const isFavourite = favourites.some(a => a.mal_id === animeData.mal_id);

  // Dynamic button styling
  const buttonStyle = {
    backgroundColor: isFavourite
      ? '#FF6B6B'                         // Red for favourite
      : theme === 'dark'
        ? '#00CFFF'                        // Bright blue for dark mode
        : '#1B1F3B',                       // Dark color for light mode
    shadowColor: isFavourite
      ? '#FF6B6B'
      : theme === 'dark'
        ? '#00CFFF'
        : '#000',
  };

  const buttonTextColor = isFavourite
    ? '#1B1F3B'                           // Dark text on red
    : theme === 'dark'
      ? '#1B1F3B'                         // Dark text on bright blue
      : '#FFF8E7';                        // Light text on dark

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: animeData.images.jpg.large_image_url }}
        style={styles.image}
      />
      <Text style={[styles.title, { color: '#00CFFF' }]}>{animeData.title}</Text>
      <Text style={[styles.synopsis, { color: colors.text }]}>
        {animeData.synopsis || "No synopsis available"}
      </Text>

      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => dispatch(toggleFavourite(animeData))}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>
          {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  contentContainer: { paddingBottom: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: "100%",
    height: 340,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 207, 255, 0.2)"
  },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 12, letterSpacing: 0.5 },
  synopsis: { fontSize: 16, lineHeight: 24, marginBottom: 30 },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  buttonText: { fontSize: 18, fontWeight: "900" },
});
