import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toggleFavourite } from "../store/animeSlice"; // create this in your slice

export default function AnimeDetailsScreen() {
  const { anime } = useLocalSearchParams<{ anime: string }>();
  const animeData = anime ? JSON.parse(anime) : null;
  const dispatch = useDispatch<AppDispatch>();
  const favourites = useSelector((state: RootState) => state.anime.favourites);

  if (!animeData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>No anime data available</Text>
      </View>
    );
  }

  const isFavourite = favourites.some(a => a.mal_id === animeData.mal_id);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: animeData.images.jpg.large_image_url }}
        style={styles.image}
      />
      <Text style={styles.title}>{animeData.title}</Text>
      <Text style={styles.synopsis}>
        {animeData.synopsis || "No synopsis available"}
      </Text>

      <TouchableOpacity
        style={[styles.button, isFavourite ? styles.buttonActive : {}]}
        onPress={() => dispatch(toggleFavourite(animeData))}
      >
        <Text style={styles.buttonText}>
          {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#1B1F3B" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 300, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00CFFF", marginBottom: 10 },
  synopsis: { fontSize: 16, color: "white", marginBottom: 20 },
  button: {
    padding: 12,
    backgroundColor: "#00CFFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#FF6B6B",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
