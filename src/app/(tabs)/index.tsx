import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { PRODUCTS } from '@/data/products';
import { ProductCategory, Product } from '@/types/product';
import { Palette, MaxContentWidth } from '@/constants/theme';
import { CategorySelector } from '@/components/products/CategorySelector';
import { ProductCard } from '@/components/products/ProductCard';
import { useApp } from '@/context/AppContext';

export default function ProductsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');
  const { compareIds } = useApp();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item: Product) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            {/* Hero / Identity Card */}
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View>
                  <Text style={styles.brandTitle}>Product Explorer Pro</Text>
                  <Text style={styles.tagline}>
                    Curated Electronics & Audio Architecture
                  </Text>
                </View>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>SMD-2</Text>
                </View>
              </View>

              {/* Student identity preserved */}
              <View style={styles.studentBanner}>
                <Text style={styles.studentLabel}>Developer / Student:</Text>
                <Text style={styles.studentValue}>
                  Hamad Khan • Roll No: 23I-3095
                </Text>
              </View>

              {/* Quick Launchers Row */}
              <View style={styles.launcherRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open Budget Finder"
                  onPress={() => router.push('/budget')}
                  style={({ pressed }) => [
                    styles.launcherBtn,
                    pressed && styles.launcherBtnPressed,
                  ]}
                >
                  <Text style={styles.launcherIcon}>🎯</Text>
                  <Text style={styles.launcherBtnText}>Budget Finder</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open Smart Compare"
                  onPress={() => router.push('/compare')}
                  style={({ pressed }) => [
                    styles.launcherBtn,
                    styles.launcherBtnGold,
                    pressed && styles.launcherBtnPressed,
                  ]}
                >
                  <Text style={styles.launcherIcon}>⇄</Text>
                  <Text
                    style={[styles.launcherBtnText, styles.launcherBtnGoldText]}
                  >
                    Compare ({compareIds.length}/2)
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search electronics, audio, specs..."
                  placeholderTextColor={Palette.secondaryText}
                  value={search}
                  onChangeText={setSearch}
                  autoCapitalize="none"
                  returnKeyType="search"
                />
                {search.length > 0 && (
                  <Pressable
                    onPress={() => setSearch('')}
                    style={styles.clearBtn}
                    accessibilityLabel="Clear search"
                  >
                    <Text style={styles.clearText}>✕</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Category Filter Chips */}
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Results count & status header */}
            <View style={styles.resultsInfo}>
              <Text style={styles.resultsText}>
                Showing{' '}
                <Text style={styles.resultsBold}>
                  {filteredProducts.length}
                </Text>{' '}
                {filteredProducts.length === 1 ? 'item' : 'items'}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find anything matching "{search}". Try searching for
              "headphones", "keyboard", or clear your filter.
            </Text>
            <Pressable
              onPress={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Palette.warmIvory,
    alignItems: 'center',
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingBottom: 28,
  },
  headerArea: {
    paddingTop: 12,
  },
  heroCard: {
    backgroundColor: Palette.deepNavy,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(198, 169, 107, 0.3)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.warmIvory,
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 12,
    color: Palette.mutedGold,
    marginTop: 2,
    fontWeight: '500',
  },
  badgeContainer: {
    backgroundColor: 'rgba(198, 169, 107, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Palette.mutedGold,
  },
  badgeText: {
    color: Palette.mutedGold,
    fontSize: 11,
    fontWeight: '800',
  },
  studentBanner: {
    backgroundColor: Palette.darkSurface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: Palette.mutedGold,
  },
  studentLabel: {
    color: Palette.mutedGold,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentValue: {
    color: Palette.warmIvory,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  launcherRow: {
    flexDirection: 'row',
    gap: 10,
  },
  launcherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.darkSurface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  launcherBtnGold: {
    borderColor: 'rgba(198, 169, 107, 0.4)',
  },
  launcherBtnPressed: {
    opacity: 0.8,
  },
  launcherIcon: {
    fontSize: 14,
  },
  launcherBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 12,
  },
  launcherBtnGoldText: {
    color: Palette.mutedGold,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.whiteCards,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.primaryText,
    height: '100%',
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    color: Palette.secondaryText,
    fontSize: 14,
    fontWeight: '700',
  },
  resultsInfo: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  resultsText: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  resultsBold: {
    fontWeight: '700',
    color: Palette.primaryText,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 36,
    marginHorizontal: 16,
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.primaryText,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  resetBtn: {
    backgroundColor: Palette.deepNavy,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 13,
  },
});
