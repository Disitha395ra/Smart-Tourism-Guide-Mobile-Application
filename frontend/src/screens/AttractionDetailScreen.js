import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

export default function AttractionDetailScreen({ route, navigation }) {
  const { attraction } = route.params;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  const infoItems = [
    { icon: 'location', label: 'Location', value: `${attraction.location?.city || attraction.location}, Sri Lanka` },
    { icon: 'time', label: 'Opening Hours', value: attraction.openingHours || 'Check locally' },
    { icon: 'cash', label: 'Entry Fee', value: attraction.entryFee > 0 ? `LKR ${attraction.entryFee}` : 'Free entry' },
    { icon: 'sunny', label: 'Best Time', value: attraction.bestTimeToVisit || 'Year-round' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: attraction.images?.[0] || attraction.image }}
            style={styles.heroImage}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.heroOverlay}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{attraction.category?.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle}>{attraction.name}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.heroLocation}>{attraction.location?.city}, Sri Lanka</Text>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingText}>★ {attraction.rating} ({attraction.totalReviews || 0})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {['info', 'guides', 'reviews'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 'info' && (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{attraction.description}</Text>

              <Text style={styles.sectionTitle}>Details</Text>
              {infoItems.map((item, i) => (
                <View key={i} style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                </View>
              ))}

              {attraction.tags && attraction.tags.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Tags</Text>
                  <View style={styles.tagsRow}>
                    {attraction.tags.map((tag, i) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Navigate Button */}
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={() => Alert.alert('Navigation', 'Google Maps integration will open here.\n\nFor now, please add your Google Maps API key to enable this feature.')}
              >
                <Ionicons name="navigate" size={18} color={COLORS.white} />
                <Text style={styles.navigateBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </>
          )}

          {activeTab === 'guides' && (
            <View style={styles.guidesTab}>
              <Text style={styles.guidesTabInfo}>
                Find verified local guides for {attraction.name}.
              </Text>
              <TouchableOpacity
                style={styles.findGuidesBtn}
                onPress={() => navigation.navigate('Guides')}
              >
                <Text style={styles.findGuidesBtnText}>Browse All Guides →</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.reviewsTab}>
              <Text style={styles.noReviews}>No reviews yet. Be the first to visit and review!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  heroContainer: { position: 'relative', height: 280 },
  heroImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 44, left: 16, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 8 },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, background: 'transparent', paddingBottom: 20 },
  categoryPill: { backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6 },
  categoryPillText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
  heroTitle: { fontSize: 24, fontWeight: '900', color: COLORS.white, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  heroLocation: { color: 'rgba(255,255,255,0.9)', fontSize: 13, flex: 1 },
  ratingPill: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  ratingText: { color: COLORS.gold, fontSize: 12, fontWeight: '700' },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: -1, borderRadius: 14, padding: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, marginTop: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.gray, fontWeight: '600' },
  tabTextActive: { color: COLORS.white, fontWeight: '700' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  description: { fontSize: 14, color: COLORS.gray, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  infoIcon: { width: 36, height: 36, backgroundColor: '#EFF7FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: COLORS.gray },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#EFF7FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  navigateBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
  navigateBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  guidesTab: { padding: 20, alignItems: 'center' },
  guidesTabInfo: { color: COLORS.gray, fontSize: 14, textAlign: 'center', marginBottom: 20 },
  findGuidesBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  findGuidesBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  reviewsTab: { padding: 20, alignItems: 'center' },
  noReviews: { color: COLORS.gray, fontSize: 14, textAlign: 'center' },
});
