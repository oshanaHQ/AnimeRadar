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
        blurRadius={0}
      >
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <Animated.View entering={FadeInUp.duration(1000)}>
            <Text style={styles.logo}> AnimeRadar</Text>
            <Text style={styles.heroTitle}>Your Anime</Text>
            <Text style={styles.heroTitle}>Never Looked Better</Text>
            <Text style={styles.heroSubtitle}>
              Discover • Track • Fall in Love — All in One Place
            </Text>
          </Animated.View>

          {/* Floating Feature Cards */}
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

          {/* Epic Final CTA */}
          <Animated.View entering={FadeIn.delay(1200).duration(1000)} style={styles.finalCta}>
            <Text style={styles.finalTitle}>Ready to Dive In?</Text>
            <Text style={styles.finalSubtitle}>
              Join thousands of otakus who found their next obsession
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Get Started Free</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')} style={{ marginTop: 16 }}>
              <Text style={styles.secondaryText}>
                New here? <Text style={{ color: '#FF6B6B', fontWeight: '800' }}>Create Account →</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Final Touch – Minimal Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with passion for anime</Text>
          </View>

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
    backgroundColor: 'rgba(27, 31, 59, 0.88)',
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
    textShadowRadius: 0,
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
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0,
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

  // NEW EPIC FINAL SECTION
  finalCta: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  finalTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF8E7',
    textAlign: 'center',
    letterSpacing: 1,
  },
  finalSubtitle: {
    fontSize: 18,
    color: '#C4C4C4',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 26,
  },
  primaryButton: {
    backgroundColor: '#00CFFF',
    paddingVertical: 22,
    paddingHorizontal: 60,
    borderRadius: 32,
    elevation: 0,
    shadowColor: '#00CFFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0,
    shadowRadius: 25,
  },
  primaryButtonText: {
    color: '#1B1F3B',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryText: {
    color: '#C4C4C4',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    marginTop: 60,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});