import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'navy' | 'success' | 'outline';
}

export function Badge({ label, variant = 'gold' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.badgeText, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  gold: {
    backgroundColor: '#F7F2E7',
    borderWidth: 1,
    borderColor: '#E8DCC4',
  },
  goldText: {
    color: '#8A7039',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  navy: {
    backgroundColor: Palette.darkSurface,
  },
  navyText: {
    color: Palette.warmIvory,
    fontSize: 11,
    fontWeight: '700',
  },
  success: {
    backgroundColor: '#EDFDF5',
    borderWidth: 1,
    borderColor: '#D1FADF',
  },
  successText: {
    color: '#027A48',
    fontSize: 11,
    fontWeight: '700',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  outlineText: {
    color: Palette.secondaryText,
    fontSize: 11,
    fontWeight: '600',
  },
});
