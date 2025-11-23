// app/index.tsx – AnimeRadar Landing Page (NEW STRUCTURE 2025)
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function Landing() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="light" />

      <ImageBackground
        source={{
          uri: 'https://i.postimg.cc/8P08pYHT/lucid-origin-a-surreal-and-vibrant-cinematic-photo-of-Intense-shonen-anime-style-visual-for-a-0.jpg',
        }}
        style={styles.background}
        blurRadius={10}
      >
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <Animated.View entering={FadeInUp.duration(1000)}>
            <Text style={styles.logo}>AnimeRadar</Text>
            <Text style={styles.heroTitle}>Your Anime</Text>
            <Text style={styles.heroTitle}>Never Looked Better</Text>
            <Text style={styles.heroSubtitle}>
              Discover • Track • Fall in Love — All in One Place
            </Text>
          </Animated.View>

          {/* Floating Feature Cards (Glassmorphism) */}
          <Animated.View entering={FadeInDown.delay(600).duration(900)} style={styles.featuresGrid}>
            <View style={styles.glassCard}>
              <View style={styles.iconCircle}>
                <Feather name="trending-up" size={28} color="#00CFFF" />
              </View>
              <Text style={styles.cardTitle}>Trending Now</Text>
              <Text style={styles.cardDesc}>See what everyone's watching</Text>
            </View>

            <View style={styles.glassCard}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 107, 107, 0.15)' }]}>
                <Feather name="heart" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.cardTitle}>Save Forever</Text>
              <Text style={styles.cardDesc}>Your favorites, always with you</Text>
            </View>

            <View style={styles.glassCard}>
              <View style={styles.iconCircle}>
                <Feather name="info" size={28} color="#00CFFF" />
              </View>
              <Text style={styles.cardTitle}>Deep Details</Text>
              <Text style={styles.cardDesc}>Everything you need to know</Text>
            </View>
          </Animated.View>

          {/* Call to Action – Glowing Button */}
          <Animated.View entering={FadeIn.delay(1200).duration(800)} style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.glowButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.9}
            >
              <Text style={styles.glowButtonText}>Start Watching Now</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')} style={{ marginTop: 20 }}>
              <Text style={styles.registerText}>Create Free Account →</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Badge */}
          <Animated.View entering={FadeIn.delay(1600).duration(800)}>
            <View style={styles.premiumBadge}>
              <Text style={styles.badgeText}>Join 200K+ Anime Lovers</Text>
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 31, 59, 0.93)',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.15,
    paddingBottom: 80,
    alignItems: 'center',
  },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    color: '#00CFFF',
    letterSpacing: 4,
    textShadowColor: '#00CFFF',
    textShadowRadius: 30,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF8E7',
    textAlign: 'center',
    lineHeight: 50,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#C4C4C4',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 60,
    width: '100%',
  },
  glassCard: {
    backgroundColor: 'rgba(40, 45, 80, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: 24,
    padding: 24,
    width: width * 0.38,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.2)',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 207, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFF8E7',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardDesc: {
    color: '#C4C4C4',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaSection: {
    marginTop: 70,
    alignItems: 'center',
  },
  glowButton: {
    backgroundColor: '#00CFFF',
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 20,
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  glowButtonText: {
    color: '#1B1F3B',
    fontSize: 22,
    fontWeight: '900',
  },
  registerText: {
    color: '#FF6B6B',
    fontSize: 17,
    fontWeight: '600',
  },
  premiumBadge: {
    marginTop: 80,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 50,
    elevation: 15,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.7,
  },
  badgeText: {
    color: '#FFF8E7',
    fontSize: 18,
    fontWeight: '800',
  },
});