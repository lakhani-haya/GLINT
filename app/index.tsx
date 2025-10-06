import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { palette } from '../src/theme/palette';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { useTasksStore } from '../src/store/useTasks';
import { dayjs, formatDate, isToday, isTomorrow } from '../src/lib/dates';
import TaskModal from '../src/components/TaskModal';

type FilterType = 'All' | 'Today' | 'Next 7d';

export default function HomeScreen() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { getUpcomingOccurrences, markTaskDone } = useTasksStore();
  
  const upcomingOccurrences = getUpcomingOccurrences(14);
  
  const filteredOccurrences = upcomingOccurrences.filter(({ date }) => {
    const taskDate = dayjs(date);
    const today = dayjs();
    
    switch (filter) {
      case 'Today':
        return taskDate.isSame(today, 'day');
      case 'Next 7d':
        return taskDate.diff(today, 'days') <= 7;
      default:
        return true;
    }
  });
  
  const renderDayHeader = (date: string) => {
    const taskDate = dayjs(date);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return formatDate(date, 'ddd, MMM D');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>This week</Text>
        
        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          {(['All', 'Today', 'Next 7d'] as FilterType[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.segment,
                filter === option && styles.segmentActive,
              ]}
              onPress={() => setFilter(option)}
            >
              <Text
                style={[
                  styles.segmentText,
                  filter === option && styles.segmentTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Add Task Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowTaskModal(true)}
        >
          <Feather name="plus" size={20} color={palette.brandInk} />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOccurrences.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No upcoming tasks</Text>
            <Text style={styles.emptySubtitle}>
              Add your first task to get started.
            </Text>
          </View>
        ) : (
          filteredOccurrences.map(({ date, tasks }) => (
            <View key={date} style={styles.daySection}>
              <Text style={styles.dayHeader}>{renderDayHeader(date)}</Text>
              {tasks.map((task) => (
                <View key={`${date}-${task.id}`} style={styles.taskCard}>
                  <View style={styles.taskIndicator} />
                  <View style={styles.taskContent}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    {task.recurrence && (
                      <Text style={styles.taskFrequency}>
                        every {task.recurrence.every} {task.recurrence.unit}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.doneButton}
                    onPress={() => {
                      markTaskDone(task.id);
                      Alert.alert('Task Completed', `${task.name} has been marked as done!`, [
                        { text: 'OK', style: 'default' }
                      ]);
                    }}
                  >
                    <Feather name="check" size={18} color={palette.muted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Task Modal */}
      <TaskModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
    </SafeAreaView>
  );
}

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
  subtitle: {
    ...typography.body,
    color: palette.muted,
    marginBottom: spacing.lg,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: palette.surface,
    borderRadius: 10,
    padding: 2,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: palette.bg,
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    ...typography.body,
    color: palette.muted,
    fontSize: 14,
  },
  segmentTextActive: {
    color: palette.ink,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  addButtonText: {
    ...typography.body,
    color: palette.brandInk,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  daySection: {
    marginBottom: spacing.xl,
  },
  dayHeader: {
    ...typography.heading,
    color: palette.ink,
    marginBottom: spacing.md,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: palette.brand,
  },
  taskIndicator: {
    width: 3,
    height: '100%',
    backgroundColor: palette.brand,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  taskContent: {
    flex: 1,
    marginLeft: spacing.sm,
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
  },
  doneButton: {
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
  },
});
