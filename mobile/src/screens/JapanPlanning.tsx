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

const JapanPlanning: React.FC = () => {
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
      { id: 'd1-1', time: '09:00 AM - 11:00 AM', title: 'Senso-ji Temple', subtitle: 'Tokyo\'s oldest temple in Asakusa' },
      { id: 'd1-2', time: '11:30 AM - 12:30 PM', title: 'Lunch @ Tsukiji Outer Market', subtitle: 'Fresh sushi and local delicacies' },
      { id: 'd1-3', time: '01:30 PM - 03:00 PM', title: 'Tokyo Skytree', subtitle: 'City views from Japan\'s tallest tower', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=60&auto=format' },
      { id: 'd1-4', time: '03:30 PM - 05:00 PM', title: 'Shibuya Crossing', subtitle: 'Experience the world\'s busiest intersection' }
    ],
    [
      { id: 'd2-1', time: '08:00 AM - 10:00 AM', title: 'Mount Fuji Viewing', subtitle: 'Early morning views from Hakone' },
      { id: 'd2-2', time: '10:30 AM - 12:00 PM', title: 'Hakone Hot Springs', subtitle: 'Relax in traditional onsen' },
      { id: 'd2-3', time: '12:30 PM - 02:00 PM', title: 'Lunch @ Local Ryokan', subtitle: 'Traditional Japanese multi-course meal' },
      { id: 'd2-4', time: '03:00 PM - 05:00 PM', title: 'Lake Ashi Cruise', subtitle: 'Scenic boat ride with Fuji views', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=60&auto=format' }
    ],
    [
      { id: 'd3-1', time: '09:00 AM - 11:00 AM', title: 'Meiji Shrine', subtitle: 'Peaceful shrine in the heart of Tokyo' },
      { id: 'd3-2', time: '11:30 AM - 01:00 PM', title: 'Harajuku Shopping', subtitle: 'Trendy fashion and street food' },
      { id: 'd3-3', time: '01:30 PM - 03:00 PM', title: 'Lunch @ Ramen Street', subtitle: 'Authentic tonkotsu ramen experience' },
      { id: 'd3-4', time: '03:30 PM - 05:00 PM', title: 'Imperial Palace Gardens', subtitle: 'Stroll through historic grounds' }
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
      { id: id + '-alt', time: 'Same Time', title: 'Alternative: Traditional Tea Ceremony', subtitle: 'Authentic Japanese cultural experience', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=60&auto=format' },
      { id: id + '-alt2', time: 'Same Time', title: 'Alternative: Tokyo National Museum', subtitle: 'Rich history and art collection' },
      { id: id + '-alt3', time: 'Same Time', title: 'Alternative: Ginza Shopping District', subtitle: 'Luxury shopping and department stores', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=60&auto=format' }
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
        <Text style={styles.headerTitle}>Japan Trip Planning</Text>
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
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <Row label="Destination:" value="Tokyo, Japan" />
            <Row label="Duration:" value="3 Days" />
            <Row label="Travel Style:" value="Cultural Explorer" />
          </View>

          {/* Travel Style */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Travel Style</Text>
            <View style={styles.styleItem}>
              <View style={styles.styleDot} />
              <Text style={styles.styleText}>Cultural sites & temples</Text>
            </View>
            <View style={styles.styleItem}>
              <View style={styles.styleDot} />
              <Text style={styles.styleText}>Traditional experiences</Text>
            </View>
            <View style={styles.styleItem}>
              <View style={styles.styleDot} />
              <Text style={styles.styleText}>Local cuisine focus</Text>
            </View>
          </View>
        </View>

        {/* Right column - Itinerary */}
        <View style={[styles.col, { flex: isWide ? 1 : undefined }]}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Japan Itinerary</Text>
            
            {/* Day Tabs */}
            <View style={styles.tabContainer}>
              {['Day One', 'Day Two', 'Day Three'].map((day, idx) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setActiveTab(idx)}
                  style={[styles.tab, activeTab === idx && styles.tabActive]}
                >
                  <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Timeline */}
            <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
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
            </ScrollView>
          </View>
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
  actionText: { color: glass.textPrimary, fontWeight: '700' },
  styleItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  styleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 12 },
  styleText: { color: glass.textPrimary, fontSize: 14 },
  timeline: { maxHeight: 400 }
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

export default JapanPlanning;
