import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTravel } from '../contexts/TravelContext';
import DateTimePicker from '@react-native-community/datetimepicker';
// Removed Picker to restore original text-input UI for group/occasion

const primary = '#2563eb';
const dark = '#0b1220';
const glassBg = 'rgba(255,255,255,0.08)';
const glassBorder = 'rgba(255,255,255,0.18)';
const glassInput = 'rgba(255,255,255,0.06)';

const Home: React.FC = () => {
  const navigation = useNavigation<any>();
  const { travelProfile } = useTravel();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [groupSize, setGroupSize] = useState('Family');
  const [occasion, setOccasion] = useState('Anniversary');
  const [tempStart, setTempStart] = useState<Date>(new Date());
  const [tempEnd, setTempEnd] = useState<Date>(new Date());
  const [budget, setBudget] = useState('');

  const onGenerate = () => {
    navigation.navigate('Itinerary');
  };

  const onReset = () => {
    setDestination('');
    setGroupSize('Family');
    setOccasion('Anniversary');
    setStartDate(null);
    setEndDate(null);
    setBudget('');
  };

  return (
    <LinearGradient colors={[dark, '#0e1530']} style={{ flex: 1 }}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.brand}>Xplor</Text>
          <Text style={styles.tagline}>Plan smart. Xplor free.</Text>
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
            <TouchableOpacity style={styles.inputWrap} onPress={() => { setTempStart(startDate || new Date()); setShowStartPicker(true); }}>
              <Text style={{ color: '#fff', paddingVertical: 12 }}>
                {startDate ? startDate.toISOString().slice(0,10) : 'Select date'}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              Platform.OS === 'android' ? (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display={'default'}
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (event.type === 'set' && date) setStartDate(date);
                  }}
                />
              ) : (
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerCard}>
                    <DateTimePicker
                      value={tempStart}
                      mode="date"
                      display={'inline'}
                      onChange={(_, date) => { if (date) setTempStart(date); }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                      <TouchableOpacity onPress={() => setShowStartPicker(false)} style={styles.overlayBtn}><Text style={styles.overlayBtnText}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => { setStartDate(tempStart); setShowStartPicker(false); }} style={[styles.overlayBtn, { marginLeft: 8 }]}><Text style={styles.overlayBtnText}>Set</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            )}
            </View>
            <View style={[styles.col, { marginLeft: 8 }]}> 
              <Text style={styles.label}>Return</Text>
            <TouchableOpacity style={styles.inputWrap} onPress={() => { setTempEnd(endDate || new Date()); setShowEndPicker(true); }}>
              <Text style={{ color: '#fff', paddingVertical: 12 }}>
                {endDate ? endDate.toISOString().slice(0,10) : 'Select date'}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              Platform.OS === 'android' ? (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display={'default'}
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (event.type === 'set' && date) setEndDate(date);
                  }}
                />
              ) : (
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerCard}>
                    <DateTimePicker
                      value={tempEnd}
                      mode="date"
                      display={'inline'}
                      onChange={(_, date) => { if (date) setTempEnd(date); }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                      <TouchableOpacity onPress={() => setShowEndPicker(false)} style={styles.overlayBtn}><Text style={styles.overlayBtnText}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => { setEndDate(tempEnd); setShowEndPicker(false); }} style={[styles.overlayBtn, { marginLeft: 8 }]}><Text style={styles.overlayBtnText}>Set</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            )}
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
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Globe')}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Map</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerBar: { paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  avatarBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: glassBorder, backgroundColor: glassBg },
  avatar: { width: '100%', height: '100%' },
  pickerOverlay: { position: 'absolute', inset: 0 as any, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  pickerCard: { width: '90%', maxWidth: 420, backgroundColor: 'rgba(17,24,39,0.95)', borderRadius: 12, padding: 12, borderColor: 'rgba(255,255,255,0.18)', borderWidth: 1 },
  overlayBtn: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  overlayBtnText: { color: '#fff', fontWeight: '700' },
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


