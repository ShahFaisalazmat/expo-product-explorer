import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Palette, MaxContentWidth, CardShadow } from '@/constants/theme';
import { Badge } from '@/components/common/Badge';
import { Product } from '@/types/product';

export default function FavoritesScreen() {
  const { favoriteProducts, toggleFavorite, addToCart } = useApp();

  const renderFavoriteItem = ({ item }: { item: Product }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/product/[id]',
            params: {
              id: item.id,
              name: item.name,
              price: item.formattedPrice,
              category: item.category,
            },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Badge label={item.category} variant="gold" />
          <Pressable
            accessibilityLabel={`Remove ${item.name} from favorites`}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            style={styles.heartBtn}
          >
            <Text style={styles.heartText}>♥</Text>
          </Pressable>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.tagline} numberOfLines={2}>
          {item.tagline}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.ratingText}>
            ★ {item.rating.toFixed(1)} ({item.reviewsCount} reviews)
          </Text>
          <Badge
            label={item.inStock ? 'In Stock' : 'Pre-order'}
            variant={item.inStock ? 'success' : 'outline'}
          />
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>{item.formattedPrice}</Text>
          </View>

          <View style={styles.footerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to cart`}
              onPress={(e) => {
                e.stopPropagation();
                addToCart(item.id, 1);
              }}
              style={styles.cartBtn}
            >
              <Text style={styles.cartBtnText}>+ Add to Cart</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♥</Text>
          <Text style={styles.emptyTitle}>No saved favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            When exploring products, tap the heart icon on any card to save items
            to your personal wishlist.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={styles.browseBtn}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Your Saved Wishlist</Text>
            <Text style={styles.headerSubtitle}>
              {favoriteProducts.length}{' '}
              {favoriteProducts.length === 1 ? 'item' : 'items'} saved for later
            </Text>
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
    padding: 16,
    paddingBottom: 32,
  },
  headerInfo: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 2,
  },
  card: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE4E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartText: {
    color: '#D92D20',
    fontSize: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.primaryText,
    marginBottom: 4,
    lineHeight: 22,
  },
  tagline: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginBottom: 10,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primaryText,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 10,
    color: Palette.secondaryText,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cartBtn: {
    backgroundColor: Palette.deepNavy,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cartBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 36,
    marginHorizontal: 16,
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginTop: 40,
    maxWidth: 500,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#D92D20',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.deepNavy,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Palette.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: Palette.deepNavy,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 14,
  },
});
