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

  // Updated 5Q with overlapping personality mappings
  const questions = [
    {
      id: 'q1',
      title: 'Arrival – You’ve just landed and dropped your bags. What’s your first move?',
      options: [
        { id: 'A', label: 'A. Wander to a café or quiet corner to soak it all in.', personalities: ['Hidden Gem Hunter', 'Family Traveler'] },
        { id: 'B', label: 'B. Head straight to a landmark or museum.', personalities: ['Cultural Explorer'] },
        { id: 'C', label: 'C. Find the nearest food street or market.', personalities: ['Culinary Explorer'] },
        { id: 'D', label: 'D. Hunt down a hidden trail, lookout, or spontaneous adventure.', personalities: ['Thrill Seeker', 'Budget Backpacker'] },
      ]
    },
    {
      id: 'q2',
      title: 'Midday Energy – The afternoon is open. Where are you going?',
      options: [
        { id: 'A', label: 'A. A local workshop, festival, or heritage street.', personalities: ['Cultural Explorer'] },
        { id: 'B', label: 'B. An outdoor adventure—hike, kayak, surf, or cycle.', personalities: ['Thrill Seeker', 'Budget Backpacker'] },
        { id: 'C', label: 'C. A bustling market or food crawl.', personalities: ['Culinary Explorer'] },
        { id: 'D', label: 'D. A spa, rooftop pool, or beach lounger.', personalities: ['Luxe Unwinder'] },
      ]
    },
    {
      id: 'q3',
      title: 'A Curveball – Your planned stop is unexpectedly closed. What do you do?',
      options: [
        { id: 'A', label: 'A. Bookstore, teahouse, or easy stroll.', personalities: ['Hidden Gem Hunter', 'Family Traveler'] },
        { id: 'B', label: 'B. Ask a local for a hidden gem and pivot.', personalities: ['Hidden Gem Hunter'] },
        { id: 'C', label: 'C. Upgrade: private guide, luxe meal, or spa instead.', personalities: ['Luxe Unwinder'] },
        { id: 'D', label: 'D. Find another thrill—improvise with an adventure.', personalities: ['Thrill Seeker', 'Social Connector'] },
      ]
    },
    {
      id: 'q4',
      title: 'Golden Hour – It’s sunset. What’s your scene?',
      options: [
        { id: 'A', label: 'A. Picnic in a quiet park or beach.', personalities: ['Family Traveler', 'Hidden Gem Hunter'] },
        { id: 'B', label: 'B. Rooftop or city panorama spot.', personalities: ['Social Connector'] },
        { id: 'C', label: 'C. Sunset hike, cliff, or boat ride.', personalities: ['Thrill Seeker', 'Budget Backpacker'] },
        { id: 'D', label: 'D. Dinner at a renowned spot timed for views.', personalities: ['Culinary Explorer', 'Luxe Unwinder'] },
      ]
    },
    {
      id: 'q5',
      title: 'Tomorrow’s Big Ticket – You can only lock one thing for tomorrow:',
      options: [
        { id: 'A', label: 'A. A guided cultural or historic experience.', personalities: ['Cultural Explorer'] },
        { id: 'B', label: 'B. A cooking class, winery, or food market.', personalities: ['Culinary Explorer'] },
        { id: 'C', label: 'C. An adrenaline rush—surf, trek, canyon, climb.', personalities: ['Thrill Seeker', 'Budget Backpacker'] },
        { id: 'D', label: 'D. A day of full comfort—resort, spa, or leisure.', personalities: ['Luxe Unwinder'] },
      ]
    },
  ] as const;

  const onSelect = (value: string) => {
    const current = questions[step];
    setAnswers(a => ({ ...a, [current.id]: value }));
    if (step < questions.length - 1) setStep(step + 1);
    else onSubmit({ ...answers, [current.id]: value });
  };

  const onSubmit = async (all: Record<string, string>) => {
    const tally: Record<string, number> = {};
    questions.forEach((q, idx) => {
      const sel = all[q.id];
      const opt = q.options.find(o => o.id === sel);
      if (opt) {
        opt.personalities.forEach(p => { tally[p] = (tally[p] || 0) + 1; });
      }
      // keep q1 for tie-breaker reference
      if (idx === 0 && opt) tally['__q1__'] = q.options.findIndex(o => o.id === sel);
    });
    // find top personality
    let top: string | null = null;
    let max = -1;
    for (const key of Object.keys(tally)) {
      if (key === '__q1__') continue;
      if (tally[key] > max) { max = tally[key]; top = key; }
      else if (tally[key] === max) {
        // tie: prefer first instinct from q1 if one of tied equals q1 personality
        const q1Sel = all['q1'];
        const q1Opt = questions[0].options.find(o => o.id === q1Sel);
        const q1IsKey = q1Opt ? (q1Opt.personalities as readonly string[]).includes(key) : false;
        if (q1IsKey) top = key;
      }
    }
    const personality = top || 'Cultural Explorer';

    const profile: TravelProfile = {
      adventureLevel: 'medium',
      explorationStyle: 'mixed',
      budgetLevel: 'moderate',
      pacePreference: 'moderate',
      groupDynamic: 'friends',
      personality,
      createdAt: new Date()
    };
    await saveTravelProfile(profile);
    navigation.navigate('Results', { personality });
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
        <TouchableOpacity key={opt.id} style={styles.opt} onPress={() => onSelect(opt.id)} disabled={loading}>
          <Text style={styles.optText}>{opt.label}</Text>
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


