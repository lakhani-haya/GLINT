import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { palette } from '../theme/palette';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  actionText?: string;
  onAction?: () => void;
  iconName?: keyof typeof Feather.glyphMap;
}

export default function EmptyState({
  title,
  subtitle,
  actionText,
  onAction,
  iconName,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {iconName && (
        <View style={styles.iconContainer}>
          <Feather name={iconName} size={48} color={palette.muted} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.lg,
    opacity: 0.6,
  },
  title: {
    ...typography.heading,
    color: palette.ink,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: palette.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actionButton: {
    backgroundColor: palette.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  actionButtonText: {
    ...typography.body,
    color: palette.brandInk,
    fontWeight: '600',
  },
});
