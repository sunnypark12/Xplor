import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTravel } from '../contexts/TravelContext';
import type { TravelProfile } from '../types';

const Quiz: React.FC = () => {
  const navigation = useNavigation<any>();
  const { saveTravelProfile, loading } = useTravel();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    { id: 'adventureLevel', title: "What's your ideal vacation vibe?", options: ['low', 'medium', 'high'] },
    { id: 'explorationStyle', title: 'What gets you most excited when traveling?', options: ['foodie', 'cultural', 'nature', 'mixed'] },
    { id: 'budgetLevel', title: 'How do you prefer to spend on travel?', options: ['budget', 'moderate', 'luxury'] },
    { id: 'pacePreference', title: "What's your preferred travel pace?", options: ['slow', 'moderate', 'fast'] },
    { id: 'groupDynamic', title: 'Who do you usually travel with?', options: ['solo', 'couple', 'family', 'friends'] }
  ];

  const onSelect = (value: string) => {
    const current = questions[step];
    setAnswers(a => ({ ...a, [current.id]: value }));
    if (step < questions.length - 1) setStep(step + 1);
    else onSubmit({ ...answers, [current.id]: value });
  };

  const onSubmit = async (all: Record<string, string>) => {
    const profile: TravelProfile = {
      adventureLevel: (all.adventureLevel as any) || 'medium',
      explorationStyle: (all.explorationStyle as any) || 'mixed',
      budgetLevel: (all.budgetLevel as any) || 'moderate',
      pacePreference: (all.pacePreference as any) || 'moderate',
      groupDynamic: (all.groupDynamic as any) || 'solo',
      createdAt: new Date()
    };
    await saveTravelProfile(profile);
    navigation.navigate('Dashboard');
  };

  const q = questions[step];
  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Question {step + 1} / {questions.length}</Text>
      <Text style={styles.title}>{q.title}</Text>
      <View style={{ height: 12, backgroundColor: '#e5e7eb', borderRadius: 8, width: '90%', marginBottom: 16 }}>
        <View style={{ height: 12, borderRadius: 8, backgroundColor: '#2563eb', width: `${((step + 1) / questions.length) * 100}%` }} />
      </View>
      {q.options.map(opt => (
        <TouchableOpacity key={opt} style={styles.opt} onPress={() => onSelect(opt)} disabled={loading}>
          <Text style={styles.optText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  progress: { marginBottom: 8, color: '#6b7280' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  opt: { width: '90%', padding: 14, borderRadius: 12, borderColor: '#e5e7eb', borderWidth: 1, marginBottom: 10 },
  optText: { textAlign: 'center', fontWeight: '600' }
});

export default Quiz;


