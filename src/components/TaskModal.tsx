import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { palette } from '../theme/palette';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useTasksStore } from '../store/useTasks';
import { Task, TaskCategory, FrequencyUnit } from '../types';
import { dayjs } from '../lib/dates';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  task?: Task | null;
  preselectedDate?: string;
}

const categories: TaskCategory[] = ['Hair', 'Nails', 'Lashes', 'Skin', 'Brows', 'Waxing', 'Other'];
const frequencyUnits: FrequencyUnit[] = ['days', 'weeks', 'months'];

export default function TaskModal({ visible, onClose, task, preselectedDate }: TaskModalProps) {
  const { addTask, updateTask, deleteTask } = useTasksStore();
  
  const [name, setName] = useState(task?.name || '');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'Other');
  const [notes, setNotes] = useState(task?.notes || '');
  const [every, setEvery] = useState(task?.recurrence?.every?.toString() || '1');
  const [unit, setUnit] = useState<FrequencyUnit>(task?.recurrence?.unit || 'weeks');
  const [anchorDate, setAnchorDate] = useState(
    task?.recurrence?.anchorDate || preselectedDate || dayjs().format('YYYY-MM-DD')
  );
  const [isFlexible, setIsFlexible] = useState(task?.isFlexible || false);
  const [hasRecurrence, setHasRecurrence] = useState(!!task?.recurrence);

  const handleSave = () => {
    if (!name.trim()) return;

    const taskData = {
      name: name.trim(),
      category,
      notes: notes.trim() || undefined,
      isFlexible,
      recurrence: hasRecurrence ? {
        kind: 'interval' as const,
        every: parseFloat(every) || 1,
        unit,
        anchorDate,
      } : null,
      active: true,
      lastDoneAt: null,
      nextDueAt: null,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
    resetForm();
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Other');
    setNotes('');
    setEvery('1');
    setUnit('weeks');
    setAnchorDate(dayjs().format('YYYY-MM-DD'));
    setIsFlexible(false);
    setHasRecurrence(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={palette.ink} />
          </TouchableOpacity>
          <Text style={styles.title}>{task ? 'Edit Task' : 'Add Task'}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Task Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter task name"
              placeholderTextColor={palette.muted}
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Recurrence Toggle */}
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <Text style={styles.label}>Recurring Task</Text>
              <Switch
                value={hasRecurrence}
                onValueChange={setHasRecurrence}
                trackColor={{ false: palette.line, true: palette.brand }}
                thumbColor={hasRecurrence ? palette.brandInk : palette.muted}
              />
            </View>
          </View>

          {/* Frequency (if recurring) */}
          {hasRecurrence && (
            <View style={styles.section}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.frequencyRow}>
                <Text style={styles.frequencyLabel}>Every</Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={every}
                  onChangeText={setEvery}
                  keyboardType="numeric"
                  placeholder="1"
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.unitRow}>
                    {frequencyUnits.map((u) => (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.unitChip,
                          unit === u && styles.unitChipSelected,
                        ]}
                        onPress={() => setUnit(u)}
                      >
                        <Text
                          style={[
                            styles.unitChipText,
                            unit === u && styles.unitChipTextSelected,
                          ]}
                        >
                          {u}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Flexible Toggle */}
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.label}>Flexible Scheduling</Text>
                <Text style={styles.description}>
                  Allow this task to be moved within a few days
                </Text>
              </View>
              <Switch
                value={isFlexible}
                onValueChange={setIsFlexible}
                trackColor={{ false: palette.line, true: palette.brand }}
                thumbColor={isFlexible ? palette.brandInk : palette.muted}
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes (optional)"
              placeholderTextColor={palette.muted}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Delete Button (for editing) */}
          {task && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Feather name="trash-2" size={18} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  closeButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.title,
    color: palette.ink,
  },
  saveButton: {
    backgroundColor: palette.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  saveButtonText: {
    ...typography.body,
    color: palette.brandInk,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginVertical: spacing.lg,
  },
  label: {
    ...typography.body,
    color: palette.ink,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.caption,
    color: palette.muted,
    marginTop: 2,
  },
  textInput: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: palette.ink,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryRow: {
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
  categoryChipSelected: {
    backgroundColor: palette.brand,
  },
  categoryChipText: {
    ...typography.body,
    fontSize: 14,
    color: palette.muted,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: palette.brandInk,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  frequencyLabel: {
    ...typography.body,
    color: palette.ink,
  },
  frequencyInput: {
    backgroundColor: palette.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 60,
    textAlign: 'center',
    ...typography.body,
    color: palette.ink,
  },
  unitRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitChip: {
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  unitChipSelected: {
    backgroundColor: palette.brand,
  },
  unitChipText: {
    ...typography.body,
    fontSize: 14,
    color: palette.muted,
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: palette.brandInk,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  deleteButtonText: {
    ...typography.body,
    color: '#EF4444',
    fontWeight: '600',
  },
});