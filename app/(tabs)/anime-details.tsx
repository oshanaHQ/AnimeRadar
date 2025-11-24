import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AnimeDetailsScreen() {
  const { anime } = useLocalSearchParams<{ anime: string }>();
  const animeData = anime ? JSON.parse(anime) : null;

  if (!animeData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>No anime data available</Text>
      </View>
    );
  }

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#1B1F3B" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 300, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00CFFF", marginBottom: 10 },
  synopsis: { fontSize: 16, color: "white" },
});
