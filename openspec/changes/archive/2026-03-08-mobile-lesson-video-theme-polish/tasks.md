## 1. Lesson screen cleanup and media behavior

- [x] 1.1 Remove the duplicate in-content lesson back arrow and keep the navigator-provided back navigation
- [x] 1.2 Update lesson video cards to render thumbnail images with a fallback preview state
- [x] 1.3 Replace external YouTube redirects with in-app lesson video playback using the existing mobile video dependency

## 2. Home screen content polish

- [x] 2.1 Remove the feature-marketing section from the mobile home screen
- [x] 2.2 Limit the recent courses section to three items while preserving the existing view-all navigation

## 3. Theme parity across core screens

- [x] 3.1 Refactor Home screen styles to consume shared theme tokens for backgrounds, cards, text, banners, and inputs
- [x] 3.2 Refactor Courses list and Course Detail screens to consume shared theme tokens for backgrounds, cards, text, progress UI, and status treatments
- [x] 3.3 Refactor Lesson screen content and video presentation to consume shared theme tokens in both light and dark modes

## 4. Verification

- [ ] 4.1 Verify the lesson screen shows only one back control and that it navigates correctly from both Home and Courses flows
- [ ] 4.2 Verify lesson videos show thumbnails and play inside the app without redirecting to YouTube
- [ ] 4.3 Verify the home screen no longer shows the feature section and only displays three recent courses
- [ ] 4.4 Verify dark mode visibly changes Home, Courses, Course Detail, and Lesson screens and persists after app restart
