## Why

The mobile app still has a few polish issues in high-traffic learning screens that make the experience feel unfinished. The lesson screen duplicates back navigation, lesson videos do not present as a clear in-app media experience, the home screen shows extra marketing content, and dark mode does not visibly update several core screens.

## What Changes

- Remove the duplicate in-content back arrow from the lesson screen and rely on the stack header back navigation.
- Improve the lesson video experience so lesson videos show visible thumbnails and play inside the app instead of redirecting users to YouTube.
- Simplify the mobile home screen by removing the marketing-style "AI Course Architect" feature section.
- Limit the mobile home screen recent courses section to three items while keeping the existing path to the full courses list.
- Make dark mode visibly apply to Home, My Courses, Course Detail, and Lesson screens, including cards, text, banners, and interactive states.

## Capabilities

### New Capabilities
- `mobile-lesson-experience`: Lesson-screen navigation, video presentation, in-app playback, and theme-aware lesson styling.

### Modified Capabilities
- `mobile-home-parity`: Home-screen requirements change to remove the feature-marketing section and limit recent courses to three items.
- `mobile-settings`: Theme-preference requirements change so the saved theme must visibly apply to Home, Courses, Course Detail, and Lesson screens.

## Impact

- Affected code: `mobile/src/screens/LessonScreen.tsx`, `mobile/src/screens/HomeScreen.tsx`, `mobile/src/screens/CoursesListScreen.tsx`, `mobile/src/screens/CourseDetailScreen.tsx`, `mobile/src/navigation/AppNavigator.tsx`, `mobile/src/contexts/ThemeContext.tsx`, and supporting mobile components/types.
- Dependencies: existing `react-native-youtube-iframe` support on mobile for embedded lesson playback.
- Systems: mobile navigation headers, lesson media rendering, recent-course presentation, and app-wide theme token usage on core learning screens.
