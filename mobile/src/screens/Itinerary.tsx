import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTravel } from '../contexts/TravelContext';

type TimelineItem = {
  id: string;
  time: Date;
  title: string;
  subtitle?: string;
  type: 'activity' | 'travel';
  status?: 'upcoming' | 'current' | 'done';
  alert?: { type: 'traffic' | 'delay'; message: string } | null;
  heroImage?: string;
};

const Itinerary: React.FC = () => {
  const { userLocation, updateItinerary } = useTravel();
  const route = useRoute();
  const preset = (route.params as any)?.preset as string | undefined;

  const [items, setItems] = useState<TimelineItem[]>([]);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    // Seed a sample day schedule inspired by the design
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    const d12 = new Date(base);
    const d1330 = new Date(base.getTime() + 90 * 60000);
    const d1530 = new Date(base.getTime() + 210 * 60000);
    const d1830 = new Date(base.getTime() + 390 * 60000);

    if (preset === 'japan') {
      const jp: TimelineItem[] = [
        {
          id: 'current-card',
          time: new Date(base.getTime() - 30 * 60000),
          title: 'Hotel Check in',
          subtitle: '@ Shibuya Excel Hotel',
          type: 'activity',
          status: 'current',
          heroImage: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1200&q=60&auto=format',
        },
        { id: 'lunch', time: d12, title: 'Lunch @ Ichiran Ramen Shibuya', type: 'activity' },
        { id: 'travel', time: d1330, title: 'Travel Time → Sensō-ji (Asakusa)', type: 'travel' },
        { id: 'shopping', time: d1530, title: 'Shopping @ Shibuya Crossing', type: 'activity' },
        { id: 'dinner', time: d1830, title: 'Dinner @ Sushi Zanmai', type: 'activity' },
      ];
      setItems(jp);
      return;
    }

    const seeded: TimelineItem[] = [
      {
        id: 'current-card',
        time: new Date(base.getTime() - 30 * 60000),
        title: 'Hotel Check in',
        subtitle: '@ Shilla Stay Hongdae',
        type: 'activity',
        status: 'current',
        heroImage: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=1200&q=60&auto=format',
      },
      { id: 'lunch', time: d12, title: 'Lunch @ Kimbap Heaven', type: 'activity' },
      { id: 'travel', time: d1330, title: 'Travel Time → Starfield', type: 'travel' },
      { id: 'shopping', time: d1530, title: 'Shopping @ Starfield', type: 'activity' },
      { id: 'dinner', time: d1830, title: 'Dinner @ TBD', type: 'activity' },
    ];
    setItems(seeded);
  }, [preset]);

  // Real-time analysis loop
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const updated = items.map((it) => {
      const t = it.time.getTime();
      const diff = t - now.getTime();
      let status: TimelineItem['status'] = 'upcoming';
      if (diff < -15 * 60000) status = 'done';
      else if (Math.abs(diff) <= 30 * 60000) status = 'current';

      let alert: TimelineItem['alert'] = null;
      if (it.type === 'travel') {
        const withinWindow = diff <= 0 && diff > -60 * 60000;
        const preWindow = diff > 0 && diff < 30 * 60000;
        const stationary = !userLocation || (userLocation.accuracy ?? 50) > 40;
        if (preWindow || withinWindow || stationary) {
          alert = { type: 'traffic', message: 'Traffic Heavy. Update Time?' };
        }
      }
      return { ...it, status, alert };
    });
    setItems(updated);
  }, [now, userLocation]);

  const dateHeader = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, []);

  const handleUpdateTime = (itemId: string) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, time: new Date(i.time.getTime() + 30 * 60000), alert: null } : i)));
    updateItinerary({ type: 'delay', affectedActivityId: itemId, reason: 'Traffic heavy', timestamp: new Date(), newStartTime: new Date() }).catch(() => {});
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.headerDate}>{dateHeader}</Text>
      <Text style={styles.headerToday}>Today</Text>

      {/* Currently card */}
      {items.find((i) => i.id === 'current-card') && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Currently…</Text>
          <View style={styles.currentCard}>
            <Image source={{ uri: items[0].heroImage! }} style={styles.currentImage} />
            <View style={{ padding: 14 }}>
              <Text style={styles.currentTitle}>{items[0].title}</Text>
              {!!items[0].subtitle && <Text style={styles.currentSub}>{items[0].subtitle}</Text>}
            </View>
          </View>
        </View>
      )}

      {/* Timeline */}
      <View style={{ marginTop: 10 }}>
        {items
          .filter((i) => i.id !== 'current-card')
          .map((it, idx) => (
            <View key={it.id} style={{ flexDirection: 'row', marginBottom: 22 }}>
              <View style={{ width: 24, alignItems: 'center' }}>
                {it.alert ? (
                  <View style={[styles.dot, { backgroundColor: '#b91c1c' }]} />
                ) : (
                  <View style={[styles.dot, { backgroundColor: '#94a3b8' }]} />
                )}
                {idx < items.length - 2 && <View style={styles.stem} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.timeText, it.alert && styles.timeTextAlert]}>
                  {it.time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.itemTitle, it.status === 'done' && styles.itemDone]}>{it.title}</Text>
                {it.alert && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={styles.alertText}>Traffic Heavy. <Text onPress={() => handleUpdateTime(it.id)} style={styles.updateLink}>Update Time?</Text></Text>
                  </View>
                )}
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerDate: { fontSize: 18, color: '#334155', marginBottom: 6 },
  headerToday: { fontSize: 40, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginLeft: 8, marginBottom: 8 },
  currentCard: { backgroundColor: '#f1f5f9', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  currentImage: { width: '100%', height: 160 },
  currentTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  currentSub: { fontSize: 14, color: '#475569', marginTop: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, marginTop: 2 },
  stem: { width: 2, flex: 1, backgroundColor: '#0f172a', opacity: 0.3, marginTop: 6 },
  timeText: { color: '#64748b', fontSize: 16, marginBottom: 8, textDecorationLine: 'line-through', textDecorationColor: '#94a3b8' },
  timeTextAlert: { color: '#b91c1c', textDecorationLine: 'none' },
  itemTitle: { color: '#334155', fontWeight: '800', fontSize: 20 },
  itemDone: { color: '#94a3b8', textDecorationLine: 'line-through' },
  alertText: { color: '#7f1d1d' },
  updateLink: { color: '#991b1b', textDecorationLine: 'underline' }
});

export default Itinerary;


