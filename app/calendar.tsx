import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { palette } from '../src/theme/palette';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { useTasksStore } from '../src/store/useTasks';
import { dayjs, formatDate } from '../src/lib/dates';
import TaskModal from '../src/components/TaskModal';
export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const { getUpcomingOccurrences, getOccurrencesForDate, markTaskDone } = useTasksStore();
  
  // Get all occurrences for the current month
  const monthStart = dayjs(currentMonth).startOf('month');
  const monthEnd = dayjs(currentMonth).endOf('month');
  const upcomingOccurrences = getUpcomingOccurrences(45); // Extended range for calendar
  
  // Create marked dates object for calendar
  const markedDates = upcomingOccurrences.reduce((acc, { date, tasks }) => {
    const dateKey = dayjs(date).format('YYYY-MM-DD');
    acc[dateKey] = {
      marked: true,
      dotColor: palette.brand,
      selectedColor: palette.brand,
    };
    return acc;
  }, {} as Record<string, any>);
  
  // Add selection to marked dates
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: palette.brandInk,
    };
  }
  
  const selectedDateTasks = selectedDate ? getOccurrencesForDate(selectedDate) : [];
  
  const handleTaskDone = (taskId: string, taskName: string) => {
    markTaskDone(taskId);
    Alert.alert('Task Completed', `${taskName} has been marked as done!`, [
      { text: 'OK', style: 'default' }
    ]);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        current={currentMonth}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={(month) => setCurrentMonth(month.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: palette.bg,
          calendarBackground: palette.bg,
          textSectionTitleColor: palette.muted,
          selectedDayBackgroundColor: palette.brandInk,
          selectedDayTextColor: '#ffffff',
          todayTextColor: palette.brandInk,
          dayTextColor: palette.ink,
          textDisabledColor: palette.muted,
          dotColor: palette.brand,
          selectedDotColor: '#ffffff',
          arrowColor: palette.brandInk,
          monthTextColor: palette.ink,
          indicatorColor: palette.brandInk,
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 13,
        }}
        style={styles.calendar}
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowTaskModal(true)}
      >
        <Feather name="plus" size={24} color={palette.brandInk} />
      </TouchableOpacity>
      
      {/* Day Sheet Modal */}
      <Modal
        visible={selectedDate !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedDate(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedDate && formatDate(selectedDate, 'dddd, MMM D')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedDate(null)}
            >
              <Feather name="x" size={24} color={palette.ink} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedDateTasks.length === 0 ? (
              <View style={styles.emptyDay}>
                <Text style={styles.emptyDayText}>No tasks scheduled</Text>
                <TouchableOpacity 
                  style={styles.addTaskButton}
                  onPress={() => {
                    setSelectedDate(null);
                    setShowTaskModal(true);
                  }}
                >
                  <Feather name="plus" size={16} color={palette.brandInk} />
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            ) : (
              selectedDateTasks.map((task) => (
                <View key={task.id} style={styles.dayTaskCard}>
                  <View style={styles.dayTaskContent}>
                    <Text style={styles.dayTaskName}>{task.name}</Text>
                    <Text style={styles.dayTaskCategory}>{task.category}</Text>
                    {task.recurrence && (
                      <Text style={styles.dayTaskFrequency}>
                        every {task.recurrence.every} {task.recurrence.unit}
                      </Text>
                    )}
                  </View>
                  <View style={styles.dayTaskActions}>
                    <TouchableOpacity
                      style={styles.doneTaskButton}
                      onPress={() => handleTaskDone(task.id)}
                    >
                      <Feather name="check" size={18} color={palette.success} />
                      <Text style={styles.doneTaskButtonText}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editTaskButton}>
                      <Feather name="edit-2" size={16} color={palette.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Task Modal */}
      <TaskModal
        visible={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        preselectedDate={selectedDate || undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  calendar: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  modalTitle: {
    ...typography.title,
    color: palette.ink,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyDayText: {
    ...typography.body,
    color: palette.muted,
    marginBottom: spacing.lg,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.brand,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  addTaskButtonText: {
    ...typography.body,
    color: palette.brandInk,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  dayTaskCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: palette.brand,
  },
  dayTaskContent: {
    marginBottom: spacing.md,
  },
  dayTaskName: {
    ...typography.body,
    color: palette.ink,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayTaskCategory: {
    ...typography.caption,
    color: palette.brandInk,
    marginBottom: 2,
  },
  dayTaskFrequency: {
    ...typography.caption,
    color: palette.muted,
  },
  dayTaskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doneTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    flex: 1,
    marginRight: spacing.sm,
  },
  doneTaskButtonText: {
    ...typography.body,
    color: palette.success,
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  editTaskButton: {
    padding: spacing.sm,
  },
});
