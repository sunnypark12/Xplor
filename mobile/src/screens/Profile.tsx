import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTravel } from '../contexts/TravelContext';
import { useNavigation } from '@react-navigation/native';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { travelProfile } = useTravel();
  const navigation = useNavigation<any>();

  const personality = travelProfile?.personality || 'Cultural Explorer';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <Image source={personalityToAsset(personality)} style={styles.avatar} resizeMode="cover" />
        </View>
        <Text style={styles.name}>{user?.displayName || 'Explorer'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.persona}>{personality}</Text>

        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16 }]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.primaryBtnText}>Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tertiaryBtn} onPress={() => navigation.navigate('Quiz')}>
          <Text style={styles.tertiaryBtnText}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0b1220' },
  card: { width: '90%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
  avatarWrap: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 12 },
  avatar: { width: '100%', height: '100%' },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  email: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  persona: { color: '#fff', marginTop: 8, fontWeight: '700' },
  primaryBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, width: '100%', alignItems: 'center', marginBottom: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, width: '100%', alignItems: 'center' },
  secondaryBtnText: { color: '#fff', fontWeight: '700' }
  ,tertiaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2563eb', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, width: '100%', alignItems: 'center', marginTop: 8 },
  tertiaryBtnText: { color: '#2563eb', fontWeight: '700' }
});

export default Profile;

function personalityToAsset(personality: string): any {
  try {
    switch (personality) {
      case 'Budget Backpacker':
        return require('../assets/Budget Backpacker.png');
      case 'Cultural Explorer':
        return require('../assets/Cultural Explorer.png');
      case 'Culinary Explorer':
        return require('../assets/Culinary Explorer.png');
      case 'Hidden Gem Hunter':
        return require('../assets/Hidden Gem Hunter.png');
      case 'Thrill Seeker':
        return require('../assets/Thrill-Seeker.png');
      case 'Luxe Unwinder':
        return require('../assets/Luxe Unwinder.png');
      case 'Social Connector':
        return require('../assets/Social Connector.png');
      case 'Family Traveler':
        return require('../assets/Family Traveler.png');
      default:
        return require('../assets/Cultural Explorer.png');
    }
  } catch (e) {
    return require('../assets/Cultural Explorer.png');
  }
}


