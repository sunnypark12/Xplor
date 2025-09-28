import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTravel } from '../contexts/TravelContext';
import type { TripInput, TripConstraint } from '../types';

const TripPlanning: React.FC = () => {
  const navigation = useNavigation<any>();
  const { createItinerary, loading } = useTravel();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [budget, setBudget] = useState('');
  const [specialInterests, setSpecialInterests] = useState('');
  const [constraints, setConstraints] = useState<TripConstraint[]>([]);
  const [constraintText, setConstraintText] = useState('');
  const [constraintType, setConstraintType] = useState<TripConstraint['type']>('other');

  const onAddConstraint = () => {
    if (!constraintText.trim()) return;
    setConstraints(prev => [...prev, { type: constraintType, description: constraintText.trim() }]);
    setConstraintText('');
  };

  const onSubmit = async () => {
    const input: TripInput = {
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers: Number(travelers) || 1,
      specialInterests: specialInterests ? specialInterests.split(',').map(s => s.trim()) : [],
      constraints,
      budget: budget ? Number(budget) : undefined,
      accommodation: undefined
    };
    await createItinerary(input);
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Your Next Adventure</Text>
      <TextInput placeholder="Destination" style={styles.input} value={destination} onChangeText={setDestination} />
      <TextInput placeholder="Start Date (YYYY-MM-DD)" style={styles.input} value={startDate} onChangeText={setStartDate} />
      <TextInput placeholder="End Date (YYYY-MM-DD)" style={styles.input} value={endDate} onChangeText={setEndDate} />
      <TextInput placeholder="Travelers" keyboardType="numeric" style={styles.input} value={travelers} onChangeText={setTravelers} />
      <TextInput placeholder="Budget (optional)" keyboardType="numeric" style={styles.input} value={budget} onChangeText={setBudget} />
      <TextInput placeholder="Special Interests (comma-separated)" style={styles.input} value={specialInterests} onChangeText={setSpecialInterests} />

      <View style={{ width: '90%', marginTop: 8 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Constraints</Text>
        <TextInput placeholder="Type (mobility/dietary/time/other)" style={styles.input} value={constraintType} onChangeText={(t) => setConstraintType((t as any) || 'other')} />
        <TextInput placeholder="Description" style={styles.input} value={constraintText} onChangeText={setConstraintText} />
        <TouchableOpacity style={[styles.button, { backgroundColor: '#374151' }]} onPress={onAddConstraint}>
          <Text style={styles.buttonText}>Add Constraint</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Itinerary'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 48 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  input: { width: '100%', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', marginTop: 8 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: '700' }
});

export default TripPlanning;


