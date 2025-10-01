import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { palette } from '../src/theme/palette';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { useTasksStore } from '../src/store/useTasks';
import { TaskCategory } from '../src/types';
import { formatDate, dayjs } from '../src/lib/dates';

const categories: TaskCategory[] = ['Hair', 'Nails', 'Lashes', 'Skin', 'Brows', 'Waxing', 'Other'];

export default function TasksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  
  const { tasks, getTasksByCategory } = useTasksStore();
  
  const filteredTasks = getTasksByCategory(selectedCategory || undefined).filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderCategoryChip = (category: TaskCategory) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
        onPress={() => setSelectedCategory(isSelected ? null : category)}
      >
        <Text
          style={[
            styles.categoryChipText,
            isSelected && styles.categoryChipTextActive,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderFrequencySummary = (task: any) => {
    if (!task.recurrence) return 'One-time';
    const { every, unit } = task.recurrence;
    return `every ${every} ${unit}`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={palette.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks: nails, lashes…"
            placeholderTextColor={palette.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(renderCategoryChip)}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search or category filter.'
                : 'Add your first task to get started.'}
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskRow}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskFrequency}>
                  {renderFrequencySummary(task)}
                </Text>
                {task.lastDoneAt && (
                  <Text style={styles.taskLastDone}>
                    Last done: {formatDate(task.lastDoneAt)}
                  </Text>
                )}
              </View>
              <View style={styles.taskActions}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) }]}>
                  <Text style={styles.categoryBadgeText}>{task.category}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={palette.muted} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      
      {/* Bundle Rules Button */}
      <TouchableOpacity style={styles.bundleButton}>
        <Feather name="link" size={20} color={palette.brandInk} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const getCategoryColor = (category: TaskCategory): string => {
  const colors = {
    Hair: '#FFE4E1',
    Nails: '#F0E6FF',
    Lashes: '#E6F7FF',
    Skin: '#F6FFED',
    Brows: '#FFF7E6',
    Waxing: '#FFF0F6',
    Other: '#F5F5F5',
  };
  return colors[category] || colors.Other;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: palette.ink,
    marginLeft: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: palette.brand,
  },
  categoryChipText: {
    ...typography.body,
    fontSize: 14,
    color: palette.muted,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: palette.brandInk,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    ...typography.body,
    color: palette.ink,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskFrequency: {
    ...typography.caption,
    color: palette.muted,
    marginBottom: 2,
  },
  taskLastDone: {
    ...typography.caption,
    color: palette.muted,
    fontSize: 12,
  },
  taskActions: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: palette.ink,
  },
  bundleButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    ...typography.heading,
    color: palette.ink,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: palette.muted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
