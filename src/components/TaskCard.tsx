import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { palette } from '../theme/palette';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onMarkDone?: () => void;
  showCategory?: boolean;
}

export default function TaskCard({ 
  task, 
  onPress, 
  onMarkDone, 
  showCategory = false 
}: TaskCardProps) {
  const renderFrequency = () => {
    if (!task.recurrence) return null;
    const { every, unit } = task.recurrence;
    return `every ${every} ${unit}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.indicator} />
      <View style={styles.content}>
        <Text style={styles.name}>{task.name}</Text>
        {showCategory && (
          <Text style={styles.category}>{task.category}</Text>
        )}
        {renderFrequency() && (
          <Text style={styles.frequency}>{renderFrequency()}</Text>
        )}
        {task.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {task.notes}
          </Text>
        )}
      </View>
      {onMarkDone && (
        <TouchableOpacity style={styles.doneButton} onPress={onMarkDone}>
          <Feather name="check" size={18} color={palette.muted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: palette.brand,
  },
  indicator: {
    width: 3,
    height: '100%',
    backgroundColor: palette.brand,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    ...typography.body,
    color: palette.ink,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    ...typography.caption,
    color: palette.brandInk,
    marginBottom: 2,
  },
  frequency: {
    ...typography.caption,
    color: palette.muted,
    marginBottom: 2,
  },
  notes: {
    ...typography.caption,
    color: palette.muted,
    fontStyle: 'italic',
  },
  doneButton: {
    padding: spacing.sm,
  },
});
