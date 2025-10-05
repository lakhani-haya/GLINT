# Glint

A professional, minimalist React Native app for personal grooming scheduling. Built with Expo and TypeScript, featuring calendar views, task management, and smart bundling suggestions.

## Features

- **Calendar Integration**: Monthly calendar view with recurring task scheduling
- **Task Management**: Create, edit, and track grooming tasks by category
- **Smart Bundling**: UI-level suggestions for pairing related tasks
- **Minimalist Design**: Clean interface with subtle pastel pink accents
- **Local State**: No backend required - all data stored locally

## Screenshots

<div align="center">

### Home Screen - Upcoming Tasks
<img src="screenshots/home-screen.png" alt="Home Screen showing upcoming grooming tasks" width="300"/>

*Clean, minimalist home view displaying upcoming tasks with pastel pink accents*

### Calendar View - Monthly Overview
<img src="screenshots/calendar-screen.png" alt="Calendar view with task dots" width="300"/>

*Monthly calendar showing task indicators and day selection*

### Task Creation - Add New Task
<img src="screenshots/add-task-modal.png" alt="Task creation modal with categories" width="300"/>

*Comprehensive task creation form with category selection and recurrence settings*

### Task Library - Manage All Tasks
<img src="screenshots/tasks-screen.png" alt="Task library organized by categories" width="300"/>

*Task library with search, filtering, and category organization*

### Day View - Daily Task Management
<img src="screenshots/day-view-modal.png" alt="Day view showing tasks for selected date" width="300"/>

*Day detail view with mark complete and edit actions*

### Settings - App Preferences
<img src="screenshots/settings-screen.png" alt="Settings screen with preferences" width="300"/>

*Settings panel for customizing week start, reminders, and app behavior*

</div>

## Tech Stack

- React Native with Expo
- TypeScript
- Expo Router (file-based navigation)
- Zustand (state management)
- dayjs (date handling)
- react-native-calendars (calendar component)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI: `npm install -g @expo/cli`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lakhani-haya/GLINT.git
   cd GLINT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Use the Expo Go app on your device to scan the QR code, or use an iOS/Android simulator.

## Project Structure

```
app/                 # Expo Router screens
├── _layout.tsx     # Navigation shell (tabs)
├── index.tsx       # Home: Upcoming tasks
├── calendar.tsx    # Monthly calendar view
├── tasks.tsx       # Task library + categories
└── settings.tsx    # App preferences

src/
├── components/     # Reusable UI components
├── lib/           # Utility functions (dates, recurrence)
├── store/         # Zustand state management
├── theme/         # Design tokens (colors, spacing, typography)
└── types/         # TypeScript type definitions
```

## Core Features

### Task Categories
- Hair, Nails, Lashes, Skin, Brows, Waxing, Other

### Recurrence Types
- Interval-based: "every N days/weeks/months"
- Supports decimal values (e.g., "every 2.5 weeks")

### Smart Bundling
- Suggests pairing related tasks (Hair → Shave, Nails → Exfoliate)
- UI-only suggestions for better scheduling

## Design System

- **Colors**: Minimalist palette with pastel pink (#F6D9E6) accent
- **Typography**: System fonts with consistent sizing scale
- **Spacing**: 8pt grid system (4/8/12/16/20/24)
- **Layout**: Generous whitespace, subtle shadows, rounded corners

## Contributing

### Adding Screenshots

Screenshots are stored in the `/screenshots` directory. To update or add new screenshots:

1. Take screenshots of the app running on your device via Expo Go
2. Save them as PNG files with the names specified in `/screenshots/README.md`
3. Ensure images are high quality and show the app with sample data
4. Images will automatically appear in this README

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- Icons from [Feather Icons](https://feathericons.com/)
- Calendar component from [react-native-calendars](https://github.com/wix/react-native-calendars)
