import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
};

export default function AnimeScreen() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  async function getAnime() {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime");
      const json = await res.json();
      setAnime(json.data);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUser() {
    const stored = await AsyncStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUsername(user.username || user.email);
    }
  }

  useEffect(() => {
    loadUser();
    getAnime();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* USER HEADER */}
      <Text style={styles.userHeader}>Welcome, {username} 👋</Text>

      <Text style={styles.header}>Top Anime</Text>

      <FlatList
        data={anime}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.images.jpg.large_image_url }}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  userHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00CFFF",
    marginBottom: 10,
  },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "white" },
  card: {
    marginBottom: 15,
    backgroundColor: "#1E2230",
    borderRadius: 10,
    padding: 10,
  },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  title: { color: "white", fontSize: 18, fontWeight: "bold" },
});
