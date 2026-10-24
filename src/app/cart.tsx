import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Palette, MaxContentWidth, CardShadow } from '@/constants/theme';
import { CartItem } from '@/types/product';

export default function CartScreen() {
  const {
    cartItems,
    cartItemCount,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useApp();

  const handleCheckout = () => {
    const message = `Order Simulation Summary:\nItems: ${cartItemCount}\nSubtotal: $${cartSubtotal.toFixed(
      2
    )}\nShipping: ${
      cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`
    }\nEstimated Tax: $${cartTax.toFixed(
      2
    )}\nTotal: $${cartTotal.toFixed(
      2
    )}\n\n(Simulated Academic Checkout for SMD Assignment 2)`;

    if (Platform.OS === 'web') {
      window.alert(message);
      clearCart();
    } else {
      Alert.alert('Simulated Checkout', message, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm Simulation',
          onPress: () => {
            clearCart();
            Alert.alert(
              'Order Placed!',
              'Your simulated order has been registered.'
            );
          },
        },
      ]);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.cartCard}>
        <View style={styles.itemHeader}>
          <View style={styles.infoCol}>
            <Text style={styles.category}>{item.product.category}</Text>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.unitPrice}>
              Unit: {item.product.formattedPrice}
            </Text>
          </View>

          <Pressable
            accessibilityLabel={`Remove ${item.product.name} from cart`}
            onPress={() => removeFromCart(item.product.id)}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.itemFooter}>
          {/* Stepper controls */}
          <View style={styles.stepper}>
            <Pressable
              accessibilityLabel="Decrease quantity"
              onPress={() =>
                updateCartQuantity(item.product.id, item.quantity - 1)
              }
              style={styles.stepperBtn}
            >
              <Text style={styles.stepperBtnText}>−</Text>
            </Pressable>

            <View style={styles.stepperValueContainer}>
              <Text style={styles.stepperValue}>{item.quantity}</Text>
            </View>

            <Pressable
              accessibilityLabel="Increase quantity"
              onPress={() =>
                updateCartQuantity(item.product.id, item.quantity + 1)
              }
              style={styles.stepperBtn}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </Pressable>
          </View>

          {/* Subtotal */}
          <View style={styles.subtotalBox}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>
              ${item.subtotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our curated electronics catalog and add products to start
            your simulated shopping session.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={styles.exploreBtn}
          >
            <Text style={styles.exploreBtnText}>Browse Products</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.headerTitle}>Active Shopping Bag</Text>
              <Text style={styles.headerSubtitle}>
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your
                cart
              </Text>
            </View>
            <Pressable onPress={clearCart} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Simulated Order Breakdown</Text>
            <Text style={styles.simulationNote}>
              * All figures are rule-based derivations computed from active state
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cart Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${cartSubtotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Estimated Shipping{' '}
                <Text style={styles.conditionText}>
                  (Free over $50)
                </Text>
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  cartShipping === 0 && styles.freeShipping,
                ]}
              >
                {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Simulated Sales Tax (8%)
              </Text>
              <Text style={styles.summaryValue}>${cartTax.toFixed(2)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Estimated Grand Total</Text>
              <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Proceed to Simulated Checkout"
              onPress={handleCheckout}
              style={({ pressed }) => [
                styles.checkoutBtn,
                pressed && styles.checkoutBtnPressed,
              ]}
            >
              <Text style={styles.checkoutBtnText}>
                Simulate Checkout (${cartTotal.toFixed(2)})
              </Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#FEE4E2',
  },
  clearAllText: {
    color: '#D92D20',
    fontSize: 12,
    fontWeight: '700',
  },
  cartCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
    marginRight: 12,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.mutedGold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.primaryText,
    lineHeight: 20,
  },
  unitPrice: {
    fontSize: 13,
    color: Palette.secondaryText,
    marginTop: 4,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 12,
    color: Palette.secondaryText,
    fontWeight: '700',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.lightGrayBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  stepperBtn: {
    width: 34,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.deepNavy,
  },
  stepperValueContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.primaryText,
  },
  subtotalBox: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: Palette.secondaryText,
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  summaryCard: {
    backgroundColor: Palette.whiteCards,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    ...CardShadow,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.deepNavy,
    marginBottom: 4,
  },
  simulationNote: {
    fontSize: 11,
    color: Palette.secondaryText,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: Palette.secondaryText,
  },
  conditionText: {
    fontSize: 11,
    color: Palette.mutedGold,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.primaryText,
  },
  freeShipping: {
    color: '#027A48',
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E4E7EC',
    paddingTop: 14,
    marginTop: 6,
    marginBottom: 18,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.deepNavy,
  },
  checkoutBtn: {
    backgroundColor: Palette.deepNavy,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutBtnPressed: {
    backgroundColor: Palette.darkSurface,
    opacity: 0.9,
  },
  checkoutBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 15,
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
  exploreBtn: {
    backgroundColor: Palette.deepNavy,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: Palette.warmIvory,
    fontWeight: '700',
    fontSize: 14,
  },
});
