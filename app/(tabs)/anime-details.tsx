import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toggleFavourite } from "../store/animeSlice";

export default function AnimeDetailsScreen() {
  const { anime } = useLocalSearchParams<{ anime: string }>();
  const animeData = anime ? JSON.parse(anime) : null;
  const dispatch = useDispatch<AppDispatch>();
  const favourites = useSelector((state: RootState) => state.anime.favourites);

  if (!animeData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FFF8E7" }}>No anime data available</Text>
      </View>
    );
  }

  const isFavourite = favourites.some(a => a.mal_id === animeData.mal_id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}   // This fixes the button being cut off
      showsVerticalScrollIndicator={false}
    >
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

      {/* Extra safe spacing at the very bottom */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1F3B",
    paddingTop: 60,           // Your requested top spacing
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 60,        // This ensures button is NEVER cut off
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1F3B",
  },
  image: {
    width: "100%",
    height: 340,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 207, 255, 0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#00CFFF",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  synopsis: {
    fontSize: 16,
    color: "#C4C4C4",
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#00CFFF",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#00CFFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  buttonActive: {
    backgroundColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
  },
  buttonText: {
    color: "#1B1F3B",
    fontSize: 18,
    fontWeight: "900",
  },
});