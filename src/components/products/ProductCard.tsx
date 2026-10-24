import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Product } from '@/types/product';
import { Palette, CardShadow } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite, addToCart, isInCompare, toggleCompare } =
    useApp();
  const favorited = isFavorite(product.id);
  const compared = isInCompare(product.id);

  const handlePressDetails = () => {
    router.push({
      pathname: '/product/[id]',
      params: {
        id: product.id,
        name: product.name,
        price: product.formattedPrice,
        category: product.category,
      },
    });
  };

  return (
    <View style={styles.card}>
      {/* Top Header Row (Sibling): Category Badge & Action Buttons */}
      <View style={styles.topRow}>
        <Badge label={product.category} variant="gold" />

        <View style={styles.actionButtons}>
          {/* Compare toggle button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              compared ? 'Remove from compare' : 'Add to compare'
            }
            onPress={() => toggleCompare(product.id)}
            style={({ pressed }) => [
              styles.smallBtn,
              compared && styles.compareActiveBtn,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Text
              style={[
                styles.smallBtnText,
                compared && styles.compareActiveBtnText,
              ]}
            >
              ⇄
            </Text>
          </Pressable>

          {/* Favorite toggle button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              favorited ? 'Remove from favorites' : 'Add to favorites'
            }
            onPress={() => toggleFavorite(product.id)}
            style={({ pressed }) => [
              styles.smallBtn,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Text
              style={[styles.heartText, favorited && styles.heartTextActive]}
            >
              {favorited ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Middle Content Area (Sibling Pressable): Navigates to details on click */}
      <Pressable
        onPress={handlePressDetails}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${product.name}`}
        style={({ pressed }) => [
          styles.contentPressArea,
          pressed && styles.pressedOpacity,
        ]}
      >
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.tagline} numberOfLines={2}>
          {product.tagline}
        </Text>

        {/* Rating and Stock */}
        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)}{' '}
              <Text style={styles.reviewsText}>({product.reviewsCount})</Text>
            </Text>
          </View>
          <Badge
            label={product.inStock ? 'In Stock' : 'Pre-order'}
            variant={product.inStock ? 'success' : 'outline'}
          />
        </View>
      </Pressable>

      {/* Bottom Footer Row (Sibling): Price & Add to Cart button */}
      <View style={styles.footer}>
        <Pressable
          onPress={handlePressDetails}
          style={({ pressed }) => [
            styles.priceArea,
            pressed && styles.pressedOpacity,
          ]}
        >
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>{product.formattedPrice}</Text>
        </Pressable>

        <View style={styles.footerActions}>
          <Pressable
            onPress={handlePressDetails}
            style={({ pressed }) => [
              styles.viewDetailsBtn,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Text style={styles.viewDetailsText}>Details →</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to cart`}
            onPress={() => addToCart(product.id, 1)}
            style={({ pressed }) => [
              styles.cartBtn,
              pressed && styles.cartBtnPressed,
            ]}
          >
            <Text style={styles.cartBtnText}>+ Cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  pressedOpacity: {
    opacity: 0.8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  compareActiveBtn: {
    backgroundColor: Palette.deepNavy,
    borderColor: Palette.mutedGold,
  },
  smallBtnText: {
    fontSize: 16,
    color: Palette.secondaryText,
    fontWeight: '700',
  },
  compareActiveBtnText: {
    color: Palette.mutedGold,
  },
  heartText: {
    fontSize: 18,
    color: Palette.secondaryText,
  },
  heartTextActive: {
    color: '#D92D20',
  },
  contentPressArea: {
    marginBottom: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.primaryText,
    marginBottom: 4,
    lineHeight: 22,
  },
  tagline: {
    fontSize: 13,
    color: Palette.secondaryText,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    color: '#F79009',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  reviewsText: {
    fontWeight: '400',
    color: Palette.secondaryText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 12,
  },
  priceArea: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: Palette.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewDetailsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  viewDetailsText: {
    color: Palette.deepNavy,
    fontWeight: '700',
    fontSize: 13,
  },
  cartBtn: {
    backgroundColor: Palette.deepNavy,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  cartBtnPressed: {
    backgroundColor: Palette.darkSurface,
    opacity: 0.85,
  },
  cartBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 13,
  },
});
