import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { PRODUCTS } from '@/data/products';
import { Palette, MaxContentWidth, CardShadow } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';

export default function CompareScreen() {
  const { comparedProducts, toggleCompare, clearCompare } = useApp();
  const [prodA, prodB] = comparedProducts;

  // Derive smart comparison highlights independently
  const hasBoth = Boolean(prodA && prodB);

  const lowerPriceId = hasBoth
    ? prodA!.numericPrice < prodB!.numericPrice
      ? prodA!.id
      : prodB!.numericPrice < prodA!.numericPrice
      ? prodB!.id
      : null // equal
    : null;

  const higherRatingId = hasBoth
    ? prodA!.rating > prodB!.rating
      ? prodA!.id
      : prodB!.rating > prodA!.rating
      ? prodB!.id
      : null
    : null;

  const handleSelectProduct = (id: string) => {
    toggleCompare(id);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Intro Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Smart Compare Pro</Text>
          <Text style={styles.subtitle}>
            Independent algorithmic evaluation of specifications, pricing, and ratings
          </Text>
        </View>
        {(prodA || prodB) && (
          <Pressable onPress={clearCompare} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Reset Both</Text>
          </Pressable>
        )}
      </View>

      {/* Side-by-Side Comparison Columns */}
      <View style={styles.compareGrid}>
        {/* Slot 1 */}
        <View style={styles.compareCol}>
          {prodA ? (
            <View style={styles.productSlot}>
              <View style={styles.slotHeader}>
                <Badge label="Product 1" variant="navy" />
                <Pressable
                  onPress={() => handleSelectProduct(prodA.id)}
                  style={styles.removeSlotBtn}
                  accessibilityLabel={`Remove ${prodA.name} from comparison`}
                >
                  <Text style={styles.removeSlotText}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.slotProductName} numberOfLines={2}>
                {prodA.name}
              </Text>
              <Text style={styles.slotCategory}>{prodA.category}</Text>

              {/* Price & Highlight */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Price</Text>
                <Text style={styles.metricValue}>{prodA.formattedPrice}</Text>
                {hasBoth && lowerPriceId === prodA.id && (
                  <View style={styles.highlightBadgeGreen}>
                    <Text style={styles.highlightBadgeTextGreen}>
                      ★ Lowest Price
                    </Text>
                  </View>
                )}
              </View>

              {/* Rating & Highlight */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Rating</Text>
                <Text style={styles.metricValue}>
                  ★ {prodA.rating.toFixed(1)}{' '}
                  <Text style={styles.subMetric}>({prodA.reviewsCount})</Text>
                </Text>
                {hasBoth && higherRatingId === prodA.id && (
                  <View style={styles.highlightBadgeGold}>
                    <Text style={styles.highlightBadgeTextGold}>
                      ★ Top Rated
                    </Text>
                  </View>
                )}
              </View>

              {/* Stock Status */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Availability</Text>
                <Badge
                  label={prodA.inStock ? 'In Stock' : 'Pre-order'}
                  variant={prodA.inStock ? 'success' : 'outline'}
                />
              </View>

              {/* Warranty */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Warranty</Text>
                <Text style={styles.specText}>{prodA.warrantyMonths} Months</Text>
              </View>

              {/* View details CTA */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/product/[id]',
                    params: {
                      id: prodA.id,
                      name: prodA.name,
                      price: prodA.formattedPrice,
                      category: prodA.category,
                    },
                  })
                }
                style={styles.detailsBtn}
              >
                <Text style={styles.detailsBtnText}>View Details →</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptySlotIcon}>➕</Text>
              <Text style={styles.emptySlotTitle}>Choose Product 1</Text>
              <Text style={styles.emptySlotSubtitle}>
                Select an item from the picker below to populate this slot.
              </Text>
            </View>
          )}
        </View>

        {/* Slot 2 */}
        <View style={styles.compareCol}>
          {prodB ? (
            <View style={styles.productSlot}>
              <View style={styles.slotHeader}>
                <Badge label="Product 2" variant="navy" />
                <Pressable
                  onPress={() => handleSelectProduct(prodB.id)}
                  style={styles.removeSlotBtn}
                  accessibilityLabel={`Remove ${prodB.name} from comparison`}
                >
                  <Text style={styles.removeSlotText}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.slotProductName} numberOfLines={2}>
                {prodB.name}
              </Text>
              <Text style={styles.slotCategory}>{prodB.category}</Text>

              {/* Price & Highlight */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Price</Text>
                <Text style={styles.metricValue}>{prodB.formattedPrice}</Text>
                {hasBoth && lowerPriceId === prodB.id && (
                  <View style={styles.highlightBadgeGreen}>
                    <Text style={styles.highlightBadgeTextGreen}>
                      ★ Lowest Price
                    </Text>
                  </View>
                )}
              </View>

              {/* Rating & Highlight */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Rating</Text>
                <Text style={styles.metricValue}>
                  ★ {prodB.rating.toFixed(1)}{' '}
                  <Text style={styles.subMetric}>({prodB.reviewsCount})</Text>
                </Text>
                {hasBoth && higherRatingId === prodB.id && (
                  <View style={styles.highlightBadgeGold}>
                    <Text style={styles.highlightBadgeTextGold}>
                      ★ Top Rated
                    </Text>
                  </View>
                )}
              </View>

              {/* Stock Status */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Availability</Text>
                <Badge
                  label={prodB.inStock ? 'In Stock' : 'Pre-order'}
                  variant={prodB.inStock ? 'success' : 'outline'}
                />
              </View>

              {/* Warranty */}
              <View style={styles.metricBlock}>
                <Text style={styles.metricLabel}>Warranty</Text>
                <Text style={styles.specText}>{prodB.warrantyMonths} Months</Text>
              </View>

              {/* View details CTA */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/product/[id]',
                    params: {
                      id: prodB.id,
                      name: prodB.name,
                      price: prodB.formattedPrice,
                      category: prodB.category,
                    },
                  })
                }
                style={styles.detailsBtn}
              >
                <Text style={styles.detailsBtnText}>View Details →</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptySlotIcon}>➕</Text>
              <Text style={styles.emptySlotTitle}>Choose Product 2</Text>
              <Text style={styles.emptySlotSubtitle}>
                Select an item from the picker below to unlock side-by-side analysis.
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Catalog Quick Selector Tray */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorTitle}>Select Products to Compare</Text>
        <Text style={styles.selectorSubtitle}>
          Tap any product to toggle its inclusion in the comparison slots above
        </Text>

        <View style={styles.itemGrid}>
          {PRODUCTS.map((prod) => {
            const isSelected = prodA?.id === prod.id || prodB?.id === prod.id;
            return (
              <Pressable
                key={prod.id}
                onPress={() => handleSelectProduct(prod.id)}
                style={[
                  styles.quickItemCard,
                  isSelected && styles.quickItemSelected,
                ]}
              >
                <View style={styles.quickItemRow}>
                  <Text
                    style={[
                      styles.quickItemName,
                      isSelected && styles.quickItemNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {prod.name}
                  </Text>
                  <Text
                    style={[
                      styles.quickItemPrice,
                      isSelected && styles.quickItemPriceSelected,
                    ]}
                  >
                    {prod.formattedPrice}
                  </Text>
                </View>
                <Text style={styles.quickItemCat}>
                  {prod.category} • ★ {prod.rating}
                </Text>
                <Text
                  style={[
                    styles.quickItemAction,
                    isSelected ? styles.actionRemove : styles.actionAdd,
                  ]}
                >
                  {isSelected ? '✓ In Comparison (Remove)' : '+ Add to Compare'}
                </Text>
              </Pressable>
            );
          })}
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
  header: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    maxWidth: 280,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FEE4E2',
  },
  clearBtnText: {
    color: '#D92D20',
    fontSize: 12,
    fontWeight: '700',
  },
  compareGrid: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  compareCol: {
    flex: 1,
  },
  productSlot: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeSlotBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSlotText: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontWeight: '700',
  },
  slotProductName: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primaryText,
    lineHeight: 18,
    minHeight: 36,
  },
  slotCategory: {
    fontSize: 11,
    color: Palette.secondaryText,
    marginBottom: 10,
  },
  metricBlock: {
    backgroundColor: Palette.lightGrayBg,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: Palette.secondaryText,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  subMetric: {
    fontSize: 12,
    color: Palette.secondaryText,
    fontWeight: '400',
  },
  specText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  highlightBadgeGreen: {
    backgroundColor: '#EDFDF5',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  highlightBadgeTextGreen: {
    color: '#027A48',
    fontSize: 10,
    fontWeight: '800',
  },
  highlightBadgeGold: {
    backgroundColor: '#FEF0C7',
    borderColor: '#FEDF89',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  highlightBadgeTextGold: {
    color: '#B54708',
    fontSize: 10,
    fontWeight: '800',
  },
  detailsBtn: {
    backgroundColor: Palette.deepNavy,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  detailsBtnText: {
    color: Palette.warmIvory,
    fontSize: 11,
    fontWeight: '700',
  },
  emptySlot: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E4E7EC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  emptySlotIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptySlotTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primaryText,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySlotSubtitle: {
    fontSize: 12,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectorCard: {
    width: '100%',
    maxWidth: MaxContentWidth,
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  selectorSubtitle: {
    fontSize: 12,
    color: Palette.secondaryText,
    marginBottom: 14,
  },
  itemGrid: {
    gap: 8,
  },
  quickItemCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: Palette.lightGrayBg,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  quickItemSelected: {
    backgroundColor: '#F9F6F0',
    borderColor: Palette.mutedGold,
  },
  quickItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primaryText,
    flex: 1,
    marginRight: 8,
  },
  quickItemNameSelected: {
    color: Palette.deepNavy,
  },
  quickItemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  quickItemPriceSelected: {
    color: '#8A7039',
  },
  quickItemCat: {
    fontSize: 11,
    color: Palette.secondaryText,
    marginVertical: 4,
  },
  quickItemAction: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionAdd: {
    color: Palette.deepNavy,
  },
  actionRemove: {
    color: '#8A7039',
  },
});
