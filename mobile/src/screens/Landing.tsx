import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Landing: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xplor</Text>
      <Text style={styles.subtitle}>Plan smart. Xplor free.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 48, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.7, marginBottom: 24 },
  button: { backgroundColor: '#111827', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '80%', marginBottom: 12 },
  secondary: { backgroundColor: '#374151' },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
});

export default Landing;


