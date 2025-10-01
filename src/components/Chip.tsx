import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ChipProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'category';
}

export default function Chip({ 
  label, 
  isSelected = false, 
  onPress, 
  variant = 'default' 
}: ChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        variant === 'category' && styles.categoryChip,
        isSelected && styles.chipSelected,
        isSelected && variant === 'category' && styles.categoryChipSelected,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text
        style={[
          styles.chipText,
          variant === 'category' && styles.categoryChipText,
          isSelected && styles.chipTextSelected,
          isSelected && variant === 'category' && styles.categoryChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  chipSelected: {
    backgroundColor: palette.brand,
  },
  chipText: {
    ...typography.body,
    fontSize: 14,
    color: palette.muted,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: palette.brandInk,
  },
  categoryChip: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
  },
  categoryChipSelected: {
    backgroundColor: palette.brand,
    borderColor: palette.brand,
  },
  categoryChipText: {
    color: palette.ink,
  },
  categoryChipTextSelected: {
    color: palette.brandInk,
    fontWeight: '600',
  },
});
