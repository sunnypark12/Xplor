import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTravel } from '../contexts/TravelContext';
import WebGlobe from '@components/WebGlobe';

const Globe: React.FC = () => {
  const navigation = useNavigation<any>();
  const { travelProfile } = useTravel();

  return (
    <View style={styles.wrap}>
      {/* Header bar with profile icon */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.brand}>Xplor</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarBtn}>
          {!!travelProfile?.personality && (
            <Image
              source={personalityToAsset(travelProfile.personality)}
              style={styles.avatar}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      </View>
      <WebGlobe />
      {Platform.OS !== 'web' && (
        <View style={styles.overlay}> 
          <Text style={styles.title}>Globe</Text>
          <Text style={styles.sub}>3D globe is available on web. This is a placeholder on native.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#0b1220' },
  headerBar: { position: 'absolute', top: 44, left: 20, right: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)' },
  avatar: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', inset: 0 as any, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  sub: { color: 'rgba(255,255,255,0.7)', textAlign: 'center' }
});

export default Globe;

// Helper to map personality -> image asset
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


