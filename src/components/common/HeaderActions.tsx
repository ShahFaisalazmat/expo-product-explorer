import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Palette } from '@/constants/theme';

export function HeaderRightActions() {
  const { cartItemCount, compareIds } = useApp();

  return (
    <View style={styles.container}>
      {/* Smart Compare Quick Link */}
      <Pressable
        accessibilityLabel="Smart Compare"
        accessibilityRole="button"
        onPress={() => router.push('/compare')}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Text style={styles.iconText}>⇄</Text>
        {compareIds.length > 0 && (
          <View style={styles.compareBadge}>
            <Text style={styles.badgeText}>{compareIds.length}</Text>
          </View>
        )}
      </Pressable>

      {/* Cart Quick Link */}
      <Pressable
        accessibilityLabel="Shopping Cart"
        accessibilityRole="button"
        onPress={() => router.push('/cart')}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Text style={styles.iconText}>🛒</Text>
        {cartItemCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.badgeText}>
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 16,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  iconText: {
    fontSize: 16,
    color: Palette.warmIvory,
  },
  compareBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Palette.mutedGold,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Palette.mutedGold,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Palette.deepNavy,
    fontSize: 10,
    fontWeight: '800',
  },
});
