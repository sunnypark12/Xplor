import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTravel } from '../contexts/TravelContext';

const glass = {
  card: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)', borderWidth: 1 },
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.8)'
};

type PlanItem = { id: string; time: string; title: string; subtitle?: string; image?: string };

const Planning: React.FC = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { travelProfile } = useTravel();
  const isWide = width >= 900;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [openId, setOpenId] = useState<string | null>(null);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const initialDays = useMemo<PlanItem[][]>(() => [
    [
      { id: 'd1-1', time: '04:00 PM - 05:45 PM', title: 'Shopping at COEX Mall', subtitle: "Experience Korea's mall" },
      { id: 'd1-2', time: '05:45 PM - 06:00 PM', title: 'Subway to Jamsil Station', subtitle: 'Take line 2 (Green) Train' },
      { id: 'd1-3', time: '06:00 PM - 07:30 PM', title: 'Dinner @ BBQ', subtitle: "Try famous Korea's Crispy Fried Chicken and Beer Combo.", image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format' },
      { id: 'd1-4', time: '07:30 PM - 08:00 PM', title: 'Convenience Store Stop', subtitle: 'Grab late night snacks before heading back' }
    ],
    [
      { id: 'd2-1', time: '09:00 AM - 11:00 AM', title: 'Gyeongbokgung Palace', subtitle: 'Morning tour of the main palace' },
      { id: 'd2-2', time: '11:30 AM - 12:30 PM', title: 'Lunch @ Tosokchon Samgyetang', subtitle: 'Traditional ginseng chicken soup' },
      { id: 'd2-3', time: '01:30 PM - 03:00 PM', title: 'Bukchon Hanok Village Walk', subtitle: 'Stroll through traditional houses' },
      { id: 'd2-4', time: '03:30 PM - 05:00 PM', title: 'Cafe @ Samcheong-dong', subtitle: 'Coffee and dessert break' }
    ],
    [
      { id: 'd3-1', time: '10:00 AM - 12:00 PM', title: 'DMZ Half-day Tour', subtitle: 'Historic exploration' },
      { id: 'd3-2', time: '12:30 PM - 01:30 PM', title: 'Lunch @ Local Eatery', subtitle: 'Korean set menu' },
      { id: 'd3-3', time: '02:00 PM - 03:30 PM', title: 'Myeongdong Shopping', subtitle: 'Cosmetics and street snacks' },
      { id: 'd3-4', time: '04:00 PM - 05:00 PM', title: 'N Seoul Tower', subtitle: 'City views at sunset' }
    ]
  ], []);

  const [dayPlans, setDayPlans] = useState<PlanItem[][]>(initialDays);

  const toggleOptions = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  const removeItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDayPlans((prev) => prev.map((day, idx) => idx === activeTab ? day.filter(i => i.id !== id) : day));
    setOpenId(null);
  };

  const suggestAlternative = (id: string) => {
    const alternatives: PlanItem[] = [
      { id: id + '-alt', time: 'Same Time', title: 'Alternative: Local Bistro', subtitle: 'Chef special & comfy vibe', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=60&auto=format' },
      { id: id + '-alt2', time: 'Same Time', title: 'Alternative: River Walk', subtitle: 'Scenic stroll and photos' },
      { id: id + '-alt3', time: 'Same Time', title: 'Alternative: Night Market', subtitle: 'Snacks & souvenirs', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=60&auto=format' }
    ];
    const pick = alternatives[Math.floor(Math.random() * alternatives.length)];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDayPlans((prev) => prev.map((day, idx) => idx === activeTab ? day.map(i => i.id === id ? { ...pick, time: i.time } : i) : day));
    setOpenId(null);
  };

  const goToProfile = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile Logo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Korea Trip Planning</Text>
        <TouchableOpacity onPress={goToProfile} style={styles.profileBtn}>
          {!!travelProfile?.personality && (
            <Image
              source={personalityToAsset(travelProfile.personality)}
              style={styles.profileIcon}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

      <View style={[styles.row, { flexDirection: isWide ? 'row' : 'column' }]}> 
        {/* Left column - Trip Details + Travel Style */}
        <View style={[styles.col, { flex: isWide ? 1 : undefined }]}> 
          {/* Trip Details */}
          <View style={[styles.card, { marginBottom: 16 }]}> 
            <Text style={styles.sectionTitle}>Trip Details:</Text>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <View style={{ width: 130, height: 90, borderRadius: 8, overflow: 'hidden', marginRight: 16 }}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=800&q=60&auto=format' }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ flex: 1 }}>
                <Row label="Destination:" value="South Korea" />
                <Row label="Dates:" value="Sept 26 - Sept 29" />
                <Row label="Group Size:" value="Couple" />
                <Row label="Budget:" value="5,000 USD" />
                <Row label="Occasion:" value="Anniversary" />
              </View>
            </View>

            <TouchableOpacity style={[styles.button, { marginTop: 14 }]}> 
              <Text style={styles.buttonText}>Edit My Trip</Text>
            </TouchableOpacity>
          </View>

          {/* Travel Style */}
          <View style={[styles.card]}> 
            <Text style={styles.sectionTitle}>My Travel Style:</Text>
            <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
              <View style={{ width: 110, height: 110, borderRadius: 12, overflow: 'hidden', marginRight: 16 }}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=60&auto=format' }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>The Budget Backpacker</Text>
                <Text style={styles.muted}>Stretch every dollar, chase every experience. The world is your hostel.</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.ghostButton, { marginTop: 14 }]}> 
              <Text style={styles.ghostButtonText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right column - Day tabs + timeline cards */}
        <View style={[styles.col, { flex: isWide ? 1.4 : undefined }]}> 
          {/* Tabs */}
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {['Day One', 'Day Two', 'Day Three'].map((t, i) => (
              <TouchableOpacity key={t} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}> 
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cards timeline (by day) */}
          {dayPlans[activeTab].map((item) => (
            <View key={item.id}>
              <TouchableOpacity onPress={() => toggleOptions(item.id)}>
                <View style={[styles.timelineCard, item.image ? { flexDirection: 'row', alignItems: 'center' } : undefined]}> 
                <View style={{ flex: 1 }}>
                  <Text style={styles.time}>{item.time}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {!!item.subtitle && <Text style={styles.muted}>{item.subtitle}</Text>}
                </View>
                {item.image && (
                  <View style={{ width: 110, height: 110, borderRadius: 12, overflow: 'hidden', marginLeft: 12 }}>
                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
                  </View>
                )}
                </View>
              </TouchableOpacity>
              {openId === item.id && (
                <View style={styles.slideActions}>
                  <TouchableOpacity onPress={() => removeItem(item.id)} style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)' }]}>
                    <Text style={styles.actionText}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => suggestAlternative(item.id)} style={[styles.actionBtn, { backgroundColor: 'rgba(37,99,235,0.15)', borderColor: 'rgba(37,99,235,0.4)' }]}>
                    <Text style={styles.actionText}>Suggest Alternative</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
    <Text style={[styles.muted, { width: 90 }]}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { color: glass.textPrimary, fontSize: 24, fontWeight: '800' },
  profileBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  profileIcon: { width: '100%', height: '100%' },
  scroll: { flex: 1 },
  title: { fontSize: 18, color: glass.textPrimary, marginBottom: 10 },
  row: { gap: 16 },
  col: { flex: 1 },
  card: { padding: 16, borderRadius: 18, ...glass.card },
  sectionTitle: { color: glass.textPrimary, fontSize: 18, fontWeight: '800' },
  value: { color: glass.textPrimary, fontSize: 16 },
  button: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  ghostButton: { borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  ghostButtonText: { color: glass.textPrimary, fontWeight: '700' },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)', borderWidth: 1 },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  tabText: { color: glass.textSecondary },
  tabTextActive: { color: glass.textPrimary, fontWeight: '800' },
  timelineCard: { padding: 16, borderRadius: 18, marginBottom: 14, ...glass.card },
  time: { color: glass.textSecondary, marginBottom: 4 },
  cardTitle: { color: glass.textPrimary, fontSize: 20, fontWeight: '800' },
  muted: { color: glass.textSecondary },
  slideActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: -8, marginBottom: 12, gap: 8 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  actionText: { color: glass.textPrimary, fontWeight: '700' }
});

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

export default Planning;


