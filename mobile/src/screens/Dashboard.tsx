import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Dashboard: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TripPlanning')}>
        <Text style={styles.buttonText}>Start New Adventure</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  button: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: '700' }
});

export default Dashboard;


