import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { palette } from '../src/theme/palette';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { useTasksStore } from '../src/store/useTasks';

type WeekStart = 'monday' | 'sunday';
type ReminderOffset = 'none' | '1d' | '12h' | '2h';
type ThemeIntensity = 'light' | 'default' | 'strong';

export default function SettingsScreen() {
  const { settings, updateSettings } = useTasksStore();
  
  const weekStartOptions: { value: WeekStart; label: string }[] = [
    { value: 'monday', label: 'Monday' },
    { value: 'sunday', label: 'Sunday' },
  ];
  
  const reminderOptions: { value: ReminderOffset; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: '1d', label: '1 day before' },
    { value: '12h', label: '12 hours before' },
    { value: '2h', label: '2 hours before' },
  ];
  
  const themeIntensityOptions: { value: ThemeIntensity; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'default', label: 'Default' },
    { value: 'strong', label: 'Strong' },
  ];
  
  const renderOptionRow = <T,>(
    title: string,
    options: { value: T; label: string }[],
    currentValue: T,
    onSelect: (value: T) => void
  ) => (
    <View style={styles.settingSection}>
      <Text style={styles.settingTitle}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={String(option.value)}
          style={styles.optionRow}
          onPress={() => onSelect(option.value)}
        >
          <Text style={styles.optionLabel}>{option.label}</Text>
          <View style={styles.optionRadio}>
            {currentValue === option.value && (
              <View style={styles.optionRadioSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week Start */}
        {renderOptionRow(
          'Week Start',
          weekStartOptions,
          settings.weekStart,
          (value: WeekStart) => updateSettings({ weekStart: value })
        )}
        
        {/* Default Reminder */}
        {renderOptionRow(
          'Default Reminder Offset',
          reminderOptions,
          settings.defaultReminder,
          (value: ReminderOffset) => updateSettings({ defaultReminder: value })
        )}
        
        {/* Theme Intensity */}
        {renderOptionRow(
          'Theme Accent Intensity',
          themeIntensityOptions,
          settings.themeIntensity,
          (value: ThemeIntensity) => updateSettings({ themeIntensity: value })
        )}
        
        {/* Auto-bundle Toggle */}
        <View style={styles.settingSection}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.settingTitle}>Auto-bundle Related Tasks</Text>
              <Text style={styles.settingDescription}>
                Suggest pairing related tasks when creating new ones
              </Text>
            </View>
            <Switch
              value={settings.autoBundling}
              onValueChange={(value) => updateSettings({ autoBundling: value })}
              trackColor={{ false: palette.line, true: palette.brand }}
              thumbColor={settings.autoBundling ? palette.brandInk : palette.muted}
            />
          </View>
        </View>
        
        {/* App Info */}
        <View style={styles.settingSection}>
          <Text style={styles.settingTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>1</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with care for personal grooming scheduling
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  settingSection: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.sm,
  },
  settingTitle: {
    ...typography.heading,
    color: palette.ink,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  settingDescription: {
    ...typography.caption,
    color: palette.muted,
    marginTop: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  optionLabel: {
    ...typography.body,
    color: palette.ink,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.brandInk,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  infoLabel: {
    ...typography.body,
    color: palette.ink,
  },
  infoValue: {
    ...typography.body,
    color: palette.muted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    ...typography.caption,
    color: palette.muted,
    textAlign: 'center',
  },
});
