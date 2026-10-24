import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { ProductCategory } from '@/types/product';
import { CATEGORIES } from '@/data/products';
import { Palette } from '@/constants/theme';

interface CategorySelectorProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelectCategory(cat)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat}`}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.selectedChip : styles.unselectedChip,
              pressed && styles.pressedChip,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.selectedChipText : styles.unselectedChipText,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: Palette.deepNavy,
    borderColor: Palette.deepNavy,
  },
  unselectedChip: {
    backgroundColor: Palette.whiteCards,
    borderColor: Palette.cardBorder,
  },
  pressedChip: {
    opacity: 0.8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedChipText: {
    color: Palette.mutedGold,
  },
  unselectedChipText: {
    color: Palette.primaryText,
  },
});
