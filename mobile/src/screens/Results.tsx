import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

type RouteParams = { personality: string };

const personalityToAsset: Record<string, any> = {
  'Budget Backpacker': require('../assets/Budget Backpacker.png'),
  'Cultural Explorer': require('../assets/Cultural Explorer.png'),
  'Culinary Explorer': require('../assets/Culinary Explorer.png'),
  'Hidden Gem Hunter': require('../assets/Hidden Gem Hunter.png'),
  'Thrill Seeker': require('../assets/Thrill Seeker.png'),
  'Luxe Unwinder': require('../assets/Luxe Unwinder.png'),
  'Social Connector': require('../assets/Social Connector.png'),
  'Family Traveler': require('../assets/Family Traveler.png'),
};

const Results: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { personality } = (route.params || { personality: 'Cultural Explorer' }) as RouteParams;
  const img = personalityToAsset[personality] || personalityToAsset['Cultural Explorer'];

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>You're a</Text>
      <Text style={styles.persona}>{personality}</Text>
      <Image source={img} style={styles.image} resizeMode="contain" />
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0b1220' },
  title: { color: '#ffffff', fontSize: 18, opacity: 0.85 },
  persona: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 6, marginBottom: 16, textAlign: 'center' },
  image: { width: 260, height: 260, marginBottom: 24 },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  btnText: { color: '#fff', fontWeight: '700' }
});

export default Results;


