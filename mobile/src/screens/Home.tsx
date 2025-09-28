import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const primary = '#2563eb';
const dark = '#0b1220';
const glassBg = 'rgba(255,255,255,0.08)';
const glassBorder = 'rgba(255,255,255,0.18)';
const glassInput = 'rgba(255,255,255,0.06)';

const Home: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupSize, setGroupSize] = useState('Family');
  const [occasion, setOccasion] = useState('Anniversary');
  const [budget, setBudget] = useState('');

  const onGenerate = () => {
    console.log('Starting trip planning with data:', {
      destination,
      groupSize,
      occasion,
      startDate,
      endDate,
      budget
    });
  };

  const onReset = () => {
    setDestination('');
    setGroupSize('Family');
    setOccasion('Anniversary');
    setStartDate('');
    setEndDate('');
    setBudget('');
  };

  return (
    <LinearGradient colors={[dark, '#0e1530']} style={{ flex: 1 }}>
      <View style={styles.headerWrap}>
        <Text style={styles.brand}>Xplor</Text>
        <Text style={styles.tagline}>Plan smart. Xplor free.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Next Adventure...</Text>

          {/* Destination */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Where are you heading?"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.input}
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          {/* Dates */}
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 8 }]}> 
              <Text style={styles.label}>Departure</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  style={styles.input}
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
            </View>
            <View style={[styles.col, { marginLeft: 8 }]}> 
              <Text style={styles.label}>Return</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  style={styles.input}
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>
          </View>

          {/* Group & Occasion */}
          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 8 }]}> 
              <Text style={styles.label}>Group Size</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="Solo / Couple / Family / Friends / Group"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  style={styles.input}
                  value={groupSize}
                  onChangeText={setGroupSize}
                />
              </View>
            </View>
            <View style={[styles.col, { marginLeft: 8 }]}> 
              <Text style={styles.label}>Occasion</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="Anniversary / Birthday / Vacation / Adventure"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  style={styles.input}
                  value={occasion}
                  onChangeText={setOccasion}
                />
              </View>
            </View>
          </View>

          {/* Budget */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Budget</Text>
            <View style={styles.inputWrap}>
              <TextInput
                placeholder="Enter your budget (USD)"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.input}
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={{ marginTop: 12 }}>
            <TouchableOpacity style={styles.cta} onPress={onGenerate}>
              <Text style={styles.ctaText}>Generate my plan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.reset}>reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating map action (vibe) */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Map</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  brand: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  tagline: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontSize: 14,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: glassBg,
    borderColor: glassBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontWeight: '600',
  },
  inputWrap: {
    backgroundColor: glassInput,
    borderColor: glassBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    color: '#ffffff',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  cta: {
    backgroundColor: primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 6,
  },
  ctaText: {
    color: 'white',
    fontWeight: '700',
  },
  reset: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    backgroundColor: glassBg,
    borderColor: glassBorder,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
});

export default Home;


