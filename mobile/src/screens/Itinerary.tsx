import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTravel } from '../contexts/TravelContext';

const Itinerary: React.FC = () => {
  const { currentItinerary } = useTravel();
  if (!currentItinerary) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Active Itinerary</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentItinerary.tripInput.destination}</Text>
      <Text>{currentItinerary.tripInput.startDate.toString()} - {currentItinerary.tripInput.endDate.toString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 }
});

export default Itinerary;


