import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { PRODUCTS } from '@/data/products';
import { useApp } from '@/context/AppContext';
import { Palette, MaxContentWidth, CardShadow } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';

export default function ProductDetailsScreen() {
  const { id, name, price, category } = useLocalSearchParams<{
    id: string;
    name: string;
    price: string;
    category?: string;
  }>();

  const {
    isFavorite,
    toggleFavorite,
    addToCart,
    isInCompare,
    toggleCompare,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Match full product from catalog using ID
  const product = PRODUCTS.find((p) => p.id === id);

  const displayName = product?.name || name || 'Product';
  const displayPrice = product?.formattedPrice || price || '$0.00';
  const displayCategory = product?.category || category || 'Electronics';
  const favorited = id ? isFavorite(id) : false;
  const compared = id ? isInCompare(id) : false;

  const showFeedback = (text: string) => {
    setFeedbackBanner(text);
    setTimeout(() => {
      setFeedbackBanner(null);
    }, 2500);
  };

  const handleHeaderAction = () => {
    const infoText = `Product: ${displayName}\nID: ${id}\nPrice: ${displayPrice}\nCategory: ${displayCategory}\nIn Stock: ${
      product?.inStock ? 'Yes' : 'No'
    }\nRating: ${product?.rating || 4.5} ★\n\nNavigation Data: Received via Expo Router route params.`;

    if (Platform.OS === 'web') {
      window.alert(infoText);
    } else {
      Alert.alert('Product Information & Params', infoText);
    }
  };

  const handleAddToCart = () => {
    if (!id) return;
    addToCart(id, quantity);
    showFeedback(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to your cart`);
  };

  const handleToggleFavorite = () => {
    if (!id) return;
    toggleFavorite(id);
    showFeedback(
      favorited ? 'Removed from your favorites' : 'Added to your favorites'
    );
  };

  const handleToggleCompare = () => {
    if (!id) return;
    const added = toggleCompare(id);
    showFeedback(
      added ? 'Added to Smart Compare' : 'Removed from Smart Compare'
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: displayName.length > 20 ? `${displayName.slice(0, 18)}...` : displayName,
          headerRight: () => (
            <Pressable
              onPress={handleHeaderAction}
              accessibilityRole="button"
              accessibilityLabel="Product parameter information"
              style={({ pressed }) => [
                styles.headerActionBtn,
                pressed && styles.headerActionBtnPressed,
              ]}
            >
              <Text style={styles.headerActionText}>Info ⓘ</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.innerContent}>
        {/* Dynamic Action Notification Banner */}
        {feedbackBanner && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>✓ {feedbackBanner}</Text>
          </View>
        )}

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Badge label={displayCategory} variant="gold" />
            <View style={styles.badgeRow}>
              <Badge
                label={product?.inStock ? 'In Stock' : 'Pre-order'}
                variant={product?.inStock ? 'success' : 'outline'}
              />
            </View>
          </View>

          <Text style={styles.productTitle}>{displayName}</Text>
          <Text style={styles.tagline}>
            {product?.tagline || 'Engineered for exceptional daily performance.'}
          </Text>

          {/* Price & Rating Row */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.priceValue}>{displayPrice}</Text>
            </View>

            <View style={styles.ratingBox}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingNum}>
                {product ? product.rating.toFixed(1) : '4.5'}
              </Text>
              <Text style={styles.reviewsCount}>
                ({product ? product.reviewsCount : 50} reviews)
              </Text>
            </View>
          </View>

          {/* Route Parameter Verification Box for Viva */}
          <View style={styles.paramBox}>
            <Text style={styles.paramTitle}>
              Route Parameter Delivery (Viva Demonstration)
            </Text>
            <Text style={styles.paramItem}>• Param [id]: <Text style={styles.paramValue}>{id}</Text></Text>
            <Text style={styles.paramItem}>• Param [name]: <Text style={styles.paramValue}>{name}</Text></Text>
            <Text style={styles.paramItem}>• Param [price]: <Text style={styles.paramValue}>{price}</Text></Text>
            <Text style={styles.paramItem}>• Param [category]: <Text style={styles.paramValue}>{category || 'Auto-resolved'}</Text></Text>
          </View>
        </View>

        {/* Purchase & Quantity Actions Card */}
        <View style={styles.actionCard}>
          <Text style={styles.sectionHeading}>Order Quantity</Text>
          <View style={styles.quantityRow}>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.stepBtn}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.stepBtnText}>−</Text>
              </Pressable>
              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyText}>{quantity}</Text>
              </View>
              <Pressable
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.stepBtn}
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>

            {/* Total calculation */}
            <View style={styles.totalBlock}>
              <Text style={styles.totalLabel}>Line Total</Text>
              <Text style={styles.totalValue}>
                ${((product?.numericPrice || 49.99) * quantity).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Primary Add to Cart Button */}
          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>
              Add to Cart • ${((product?.numericPrice || 49.99) * quantity).toFixed(2)}
            </Text>
          </Pressable>

          {/* Secondary Actions (Wishlist & Compare) */}
          <View style={styles.secondaryActions}>
            <Pressable
              onPress={handleToggleFavorite}
              style={[
                styles.secondaryBtn,
                favorited && styles.secondaryBtnActive,
              ]}
            >
              <Text style={styles.secondaryBtnIcon}>
                {favorited ? '♥' : '♡'}
              </Text>
              <Text
                style={[
                  styles.secondaryBtnText,
                  favorited && styles.secondaryBtnTextActive,
                ]}
              >
                {favorited ? 'Wishlisted' : 'Add to Wishlist'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleToggleCompare}
              style={[
                styles.secondaryBtn,
                compared && styles.secondaryBtnActive,
              ]}
            >
              <Text style={styles.secondaryBtnIcon}>⇄</Text>
              <Text
                style={[
                  styles.secondaryBtnText,
                  compared && styles.secondaryBtnTextActive,
                ]}
              >
                {compared ? 'In Compare' : 'Add to Compare'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Product Overview & Description */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionHeading}>Product Overview</Text>
          <Text style={styles.descriptionText}>
            {product?.description ||
              'High performance consumer electronics built with durable materials, advanced connectivity, and modern ergonomic standards.'}
          </Text>

          {/* Features list */}
          {product?.features && (
            <View style={styles.featuresList}>
              <Text style={styles.subHeading}>Key Capabilities</Text>
              {product.features.map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Specifications Table */}
          {product?.specs && (
            <View style={styles.specsTable}>
              <Text style={styles.subHeading}>Technical Specifications</Text>
              {Object.entries(product.specs).map(([key, val]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specVal}>{val}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Warranty & Return info */}
          <View style={styles.warrantyBox}>
            <Text style={styles.warrantyIcon}>🛡</Text>
            <View style={styles.warrantyInfo}>
              <Text style={styles.warrantyTitle}>
                {product?.warrantyMonths || 12}-Month Official Warranty
              </Text>
              <Text style={styles.warrantyDesc}>
                Includes 30-day money-back guarantee and dedicated customer support.
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation jump to Cart button */}
        <Pressable
          onPress={() => router.push('/cart')}
          style={styles.cartJumpBtn}
        >
          <Text style={styles.cartJumpText}>View Full Cart & Checkout →</Text>
        </Pressable>
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
  headerActionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerActionBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerActionText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 13,
  },
  feedbackBanner: {
    backgroundColor: '#EDFDF5',
    borderColor: '#A6F4C5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  feedbackText: {
    color: '#027A48',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.deepNavy,
    lineHeight: 28,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: Palette.secondaryText,
    lineHeight: 20,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 12,
    marginBottom: 14,
  },
  priceLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    color: Palette.secondaryText,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.deepNavy,
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    fontSize: 18,
    color: '#F79009',
  },
  ratingNum: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  reviewsCount: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  paramBox: {
    backgroundColor: '#F9F8F5',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Palette.mutedGold,
  },
  paramTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.deepNavy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  paramItem: {
    fontSize: 12,
    color: Palette.secondaryText,
    lineHeight: 18,
  },
  paramValue: {
    color: Palette.primaryText,
    fontWeight: '700',
  },
  actionCard: {
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
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.lightGrayBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  stepBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.deepNavy,
  },
  qtyDisplay: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: Palette.secondaryText,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  primaryBtn: {
    backgroundColor: Palette.deepNavy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnPressed: {
    backgroundColor: Palette.darkSurface,
    opacity: 0.9,
  },
  primaryBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.lightGrayBg,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    gap: 6,
  },
  secondaryBtnActive: {
    backgroundColor: '#F9F6F0',
    borderColor: Palette.mutedGold,
  },
  secondaryBtnIcon: {
    fontSize: 16,
    color: Palette.deepNavy,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  secondaryBtnTextActive: {
    color: '#8A7039',
  },
  detailsCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  descriptionText: {
    fontSize: 14,
    color: Palette.secondaryText,
    lineHeight: 22,
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primaryText,
    marginBottom: 10,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  featureBullet: {
    color: '#027A48',
    fontWeight: '800',
    fontSize: 13,
  },
  featureText: {
    fontSize: 13,
    color: Palette.primaryText,
    flex: 1,
    lineHeight: 18,
  },
  specsTable: {
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 14,
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  specKey: {
    fontSize: 13,
    color: Palette.secondaryText,
    fontWeight: '500',
  },
  specVal: {
    fontSize: 13,
    color: Palette.primaryText,
    fontWeight: '700',
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.lightGrayBg,
    borderRadius: 10,
    padding: 12,
  },
  warrantyIcon: {
    fontSize: 24,
  },
  warrantyInfo: {
    flex: 1,
  },
  warrantyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.deepNavy,
  },
  warrantyDesc: {
    fontSize: 11,
    color: Palette.secondaryText,
    marginTop: 2,
    lineHeight: 15,
  },
  cartJumpBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cartJumpText: {
    color: Palette.deepNavy,
    fontWeight: '700',
    fontSize: 14,
  },
});
