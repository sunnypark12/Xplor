import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HowItWorks: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How It Works</Text>
      <Text style={styles.body}>Answer a quick quiz, plan your trip, and let Xplor create your itinerary.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  body: { fontSize: 16, opacity: 0.8, textAlign: 'center' }
});

export default HowItWorks;


