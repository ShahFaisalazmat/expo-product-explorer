import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { PRODUCTS } from '@/data/products';
import { Palette, MaxContentWidth, CardShadow } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';

export default function ProfileScreen() {
  const { favoriteCount, cartItemCount, compareIds, clearCart, clearCompare } =
    useApp();
  const [expandedSection, setExpandedSection] = useState<string | null>('arch');

  const toggleSection = (key: string) => {
    setExpandedSection((curr) => (curr === key ? null : key));
  };

  const handleResetData = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset all demo state (cart and compare)?')) {
        clearCart();
        clearCompare();
      }
    } else {
      Alert.alert(
        'Reset Demo Data',
        'Clear all items currently in cart and compare?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => {
              clearCart();
              clearCompare();
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <View style={styles.innerContent}>
        {/* Student Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>HK</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>Hamad Khan</Text>
              <Text style={styles.rollNo}>Roll No: 23I-3095</Text>
              <Text style={styles.courseTag}>
                SMD Assignment 2 • Software Mobile Development
              </Text>
            </View>
          </View>

          <View style={styles.profileMetaRow}>
            <Badge label="BS Computer Science" variant="gold" />
            <Badge label="Expo SDK 57 / React 19" variant="navy" />
          </View>
        </View>

        {/* Live Application Metrics */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionHeading}>Live Application Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{PRODUCTS.length}</Text>
              <Text style={styles.statLabel}>Catalog Items</Text>
            </View>

            <Pressable
              onPress={() => router.push('/(tabs)/explore')}
              style={styles.statBox}
            >
              <Text style={[styles.statNumber, styles.goldNumber]}>
                {favoriteCount}
              </Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/cart')}
              style={styles.statBox}
            >
              <Text style={[styles.statNumber, styles.navyNumber]}>
                {cartItemCount}
              </Text>
              <Text style={styles.statLabel}>Cart Items</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/compare')}
              style={styles.statBox}
            >
              <Text style={styles.statNumber}>{compareIds.length}/2</Text>
              <Text style={styles.statLabel}>In Compare</Text>
            </Pressable>
          </View>
        </View>

        {/* Viva Quick Reference & Architecture Notes */}
        <View style={styles.vivaCard}>
          <Text style={styles.sectionHeading}>
            SMD Viva Architectural Reference
          </Text>
          <Text style={styles.vivaSub}>
            Tap any section below for talking points and technical explanations
            prepared for your assignment viva.
          </Text>

          {/* Section 1: Navigation Hierarchy */}
          <Pressable
            onPress={() => toggleSection('arch')}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionTitle}>
              1. Navigation Hierarchy & Expo Router
            </Text>
            <Text style={styles.chevron}>
              {expandedSection === 'arch' ? '▲' : '▼'}
            </Text>
          </Pressable>
          {expandedSection === 'arch' && (
            <View style={styles.accordionBody}>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Root Stack</Text> (
                <Text style={styles.codeText}>src/app/_layout.tsx</Text>): Host
                layout rendering a native Stack with custom Deep Navy (#101828)
                and Warm Ivory styling.
              </Text>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Bottom Tabs</Text> (
                <Text style={styles.codeText}>src/app/(tabs)/_layout.tsx</Text>):
                Encapsulates Products, Favorites, and Profile screens without
                duplicate containers.
              </Text>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Stack Overlays</Text>: Dedicated
                stack routes for <Text style={styles.codeText}>/product/[id]</Text>,{' '}
                <Text style={styles.codeText}>/cart</Text>,{' '}
                <Text style={styles.codeText}>/compare</Text>, and{' '}
                <Text style={styles.codeText}>/budget</Text> push smoothly on
                top of the tab bar.
              </Text>
            </View>
          )}

          {/* Section 2: Route Parameters */}
          <Pressable
            onPress={() => toggleSection('params')}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionTitle}>
              2. Route Parameters Passing
            </Text>
            <Text style={styles.chevron}>
              {expandedSection === 'params' ? '▲' : '▼'}
            </Text>
          </Pressable>
          {expandedSection === 'params' && (
            <View style={styles.accordionBody}>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Sender</Text>:{' '}
                <Text style={styles.codeText}>
                  router.push&#123; pathname: '/product/[id]', params: &#123; id,
                  name, price, category &#125; &#125;
                </Text>
              </Text>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Receiver</Text>:{' '}
                <Text style={styles.codeText}>
                  useLocalSearchParams&lt;&#123; id, name, price, category
                  &#125;&gt;()
                </Text>
              </Text>
              <Text style={styles.bodyPoint}>
                • Parameters are serializable strings ensuring 100% deep linking
                and web URL parity.
              </Text>
            </View>
          )}

          {/* Section 3: State Management & Derived Values */}
          <Pressable
            onPress={() => toggleSection('state')}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionTitle}>
              3. React Context & Derived State
            </Text>
            <Text style={styles.chevron}>
              {expandedSection === 'state' ? '▲' : '▼'}
            </Text>
          </Pressable>
          {expandedSection === 'state' && (
            <View style={styles.accordionBody}>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Zero Duplicate State</Text>:
                Subtotals, shipping thresholds ($50 free), tax (8%), and totals
                are dynamically calculated in{' '}
                <Text style={styles.codeText}>useMemo</Text> hooks using raw
                numeric prices.
              </Text>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Lightweight Context</Text>: No
                heavy third-party dependencies added; pure idiomatic React
                patterns.
              </Text>
            </View>
          )}

          {/* Section 4: Algorithmic Logic */}
          <Pressable
            onPress={() => toggleSection('algo')}
            style={styles.accordionHeader}
          >
            <Text style={styles.accordionTitle}>
              4. Smart Compare & Budget Finder
            </Text>
            <Text style={styles.chevron}>
              {expandedSection === 'algo' ? '▲' : '▼'}
            </Text>
          </Pressable>
          {expandedSection === 'algo' && (
            <View style={styles.accordionBody}>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Smart Compare</Text>: Evaluates
                lower price and higher rating independently between two
                selected items.
              </Text>
              <Text style={styles.bodyPoint}>
                • <Text style={styles.boldText}>Budget Finder</Text>: Rule-based
                recommendation engine matching product price against ceiling
                budget with explanatory reasoning.
              </Text>
            </View>
          )}
        </View>

        {/* Demo Data Reset */}
        <View style={styles.resetCard}>
          <Pressable onPress={handleResetData} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Reset Demo State (Cart & Compare)</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Palette.warmIvory,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  profileCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.deepNavy,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Palette.mutedGold,
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.mutedGold,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  rollNo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A7039',
    marginTop: 2,
  },
  courseTag: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  profileMetaRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 12,
  },
  statsCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.deepNavy,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Palette.lightGrayBg,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primaryText,
    marginBottom: 2,
  },
  goldNumber: {
    color: '#8A7039',
  },
  navyNumber: {
    color: Palette.deepNavy,
  },
  statLabel: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '600',
    textAlign: 'center',
  },
  vivaCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  vivaSub: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginBottom: 14,
    lineHeight: 17,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.lightGrayBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primaryText,
    flex: 1,
  },
  chevron: {
    fontSize: 11,
    color: Palette.secondaryText,
    marginLeft: 8,
  },
  accordionBody: {
    padding: 12,
    backgroundColor: '#FAF9F6',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: Palette.mutedGold,
  },
  bodyPoint: {
    fontSize: 12,
    color: Palette.primaryText,
    lineHeight: 18,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '700',
    color: Palette.deepNavy,
  },
  codeText: {
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
    backgroundColor: 'rgba(0,0,0,0.05)',
    fontSize: 11,
  },
  resetCard: {
    alignItems: 'center',
    marginTop: 4,
  },
  resetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FEE4E2',
  },
  resetBtnText: {
    color: '#D92D20',
    fontWeight: '700',
    fontSize: 12,
  },
});
