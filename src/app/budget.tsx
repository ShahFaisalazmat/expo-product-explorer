import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCategory, Product, SortOption, BudgetRuleMatch } from '@/types/product';
import { Palette, MaxContentWidth, CardShadow } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';

export default function BudgetFinderScreen() {
  const [maxBudgetStr, setMaxBudgetStr] = useState('75');
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const budgetNum = parseFloat(maxBudgetStr) || 0;

  // Rule-Based Algorithm: Filters products, checks bounds, generates transparent explanations
  const recommendations: BudgetRuleMatch[] = useMemo(() => {
    return PRODUCTS.filter((item: Product) => {
      const matchCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchBudget = item.numericPrice <= budgetNum;
      return matchCat && matchBudget;
    })
      .map((item: Product): BudgetRuleMatch => {
        const savings = +(budgetNum - item.numericPrice).toFixed(2);
        const savingsPercent = Math.round((savings / budgetNum) * 100);

        let explanation = '';
        if (savings === 0) {
          explanation = `Exact budget match! Maximizes your $${budgetNum.toFixed(
            2
          )} allocation.`;
        } else if (item.rating >= 4.7) {
          explanation = `Top-rated choice (★ ${item.rating.toFixed(
            1
          )}) leaving $${savings.toFixed(
            2
          )} (${savingsPercent}%) spare in your budget.`;
        } else if (savingsPercent >= 50) {
          explanation = `Maximum savings: Saves you $${savings.toFixed(
            2
          )} (${savingsPercent}% under budget).`;
        } else {
          explanation = `Fits comfortably within your $${budgetNum.toFixed(
            2
          )} limit with $${savings.toFixed(2)} remaining.`;
        }

        return {
          product: item,
          fitsBudget: true,
          savings,
          explanation,
        };
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.product.rating - a.product.rating;
        } else if (sortBy === 'priceAsc') {
          return a.product.numericPrice - b.product.numericPrice;
        } else {
          return b.product.numericPrice - a.product.numericPrice;
        }
      });
  }, [budgetNum, selectedCategory, sortBy]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Finder</Text>
        <Text style={styles.subtitle}>
          Rule-based algorithmic matching based on ceiling price, category, and consumer rating
        </Text>
      </View>

      {/* Control Panel Card */}
      <View style={styles.controlCard}>
        <Text style={styles.controlLabel}>Maximum Budget (USD $)</Text>
        <View style={styles.budgetInputRow}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.budgetInput}
            keyboardType="numeric"
            value={maxBudgetStr}
            onChangeText={setMaxBudgetStr}
            placeholder="e.g. 75"
            placeholderTextColor={Palette.secondaryText}
          />
          {/* Quick preset buttons */}
          <View style={styles.presetRow}>
            {['40', '75', '100'].map((preset) => (
              <Pressable
                key={preset}
                onPress={() => setMaxBudgetStr(preset)}
                style={[
                  styles.presetBtn,
                  maxBudgetStr === preset && styles.presetBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    maxBudgetStr === preset && styles.presetBtnTextActive,
                  ]}
                >
                  ${preset}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <Text style={[styles.controlLabel, styles.sectionMargin]}>
          Target Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.catChip,
                    isSelected && styles.catChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      isSelected && styles.catChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Sorting controls */}
        <Text style={[styles.controlLabel, styles.sectionMargin]}>
          Sort Results By
        </Text>
        <View style={styles.sortRow}>
          <Pressable
            onPress={() => setSortBy('rating')}
            style={[
              styles.sortBtn,
              sortBy === 'rating' && styles.sortBtnSelected,
            ]}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'rating' && styles.sortBtnTextSelected,
              ]}
            >
              ★ Highest Rated
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSortBy('priceAsc')}
            style={[
              styles.sortBtn,
              sortBy === 'priceAsc' && styles.sortBtnSelected,
            ]}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'priceAsc' && styles.sortBtnTextSelected,
              ]}
            >
              $ Lowest Price
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSortBy('priceDesc')}
            style={[
              styles.sortBtn,
              sortBy === 'priceDesc' && styles.sortBtnSelected,
            ]}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'priceDesc' && styles.sortBtnTextSelected,
              ]}
            >
              $ Highest Price
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          Found {recommendations.length} matching{' '}
          {recommendations.length === 1 ? 'product' : 'products'} under ${budgetNum.toFixed(2)}
        </Text>
      </View>

      {/* Matches List */}
      <View style={styles.resultsList}>
        {recommendations.length === 0 ? (
          <View style={styles.noMatchesCard}>
            <Text style={styles.noMatchIcon}>🔍</Text>
            <Text style={styles.noMatchTitle}>No products under ${budgetNum}</Text>
            <Text style={styles.noMatchSubtitle}>
              Try increasing your ceiling budget or selecting a different category.
            </Text>
          </View>
        ) : (
          recommendations.map((match) => (
            <View key={match.product.id} style={styles.matchCard}>
              <View style={styles.matchTop}>
                <View style={styles.matchInfo}>
                  <Badge label={match.product.category} variant="gold" />
                  <Text style={styles.matchName}>{match.product.name}</Text>
                  <Text style={styles.matchRating}>
                    ★ {match.product.rating.toFixed(1)} ({match.product.reviewsCount} reviews)
                  </Text>
                </View>

                <View style={styles.matchPriceBox}>
                  <Text style={styles.matchPrice}>
                    {match.product.formattedPrice}
                  </Text>
                  <Text style={styles.matchSavings}>
                    Save ${match.savings.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Rule Explanation Box */}
              <View style={styles.ruleBox}>
                <Text style={styles.ruleIcon}>💡</Text>
                <Text style={styles.ruleText}>{match.explanation}</Text>
              </View>

              {/* View details */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/product/[id]',
                    params: {
                      id: match.product.id,
                      name: match.product.name,
                      price: match.product.formattedPrice,
                      category: match.product.category,
                    },
                  })
                }
                style={styles.viewBtn}
              >
                <Text style={styles.viewBtnText}>View Product Details →</Text>
              </Pressable>
            </View>
          ))
        )}
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
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginTop: 2,
    lineHeight: 16,
  },
  controlCard: {
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginBottom: 16,
    ...CardShadow,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionMargin: {
    marginTop: 16,
  },
  budgetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  budgetInput: {
    flex: 1,
    backgroundColor: Palette.lightGrayBg,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Palette.lightGrayBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  presetBtnActive: {
    backgroundColor: Palette.deepNavy,
    borderColor: Palette.deepNavy,
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.secondaryText,
  },
  presetBtnTextActive: {
    color: Palette.mutedGold,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    backgroundColor: Palette.lightGrayBg,
  },
  catChipSelected: {
    backgroundColor: Palette.deepNavy,
    borderColor: Palette.deepNavy,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primaryText,
  },
  catChipTextSelected: {
    color: Palette.mutedGold,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    backgroundColor: Palette.lightGrayBg,
    alignItems: 'center',
  },
  sortBtnSelected: {
    backgroundColor: Palette.darkSurface,
    borderColor: Palette.mutedGold,
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.secondaryText,
  },
  sortBtnTextSelected: {
    color: Palette.mutedGold,
  },
  resultsHeader: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.secondaryText,
  },
  resultsList: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: 12,
  },
  matchCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  matchTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  matchInfo: {
    flex: 1,
    marginRight: 10,
  },
  matchName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primaryText,
    marginTop: 4,
    marginBottom: 2,
  },
  matchRating: {
    fontSize: 12,
    color: Palette.secondaryText,
  },
  matchPriceBox: {
    alignItems: 'flex-end',
  },
  matchPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  matchSavings: {
    fontSize: 11,
    fontWeight: '700',
    color: '#027A48',
    marginTop: 2,
  },
  ruleBox: {
    backgroundColor: '#F9F8F5',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: Palette.mutedGold,
    marginBottom: 10,
  },
  ruleIcon: {
    fontSize: 14,
  },
  ruleText: {
    fontSize: 12,
    color: Palette.primaryText,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  viewBtn: {
    backgroundColor: Palette.deepNavy,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    color: Palette.warmIvory,
    fontSize: 12,
    fontWeight: '700',
  },
  noMatchesCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  noMatchIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  noMatchTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primaryText,
    marginBottom: 6,
  },
  noMatchSubtitle: {
    fontSize: 13,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
  },
});
