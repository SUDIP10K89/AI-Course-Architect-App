# mobile-lesson-experience Specification

## Purpose
TBD - created by archiving change mobile-lesson-video-theme-polish. Update Purpose after archive.

## Requirements
### Requirement: Mobile lesson screen SHALL use a single navigation back control
The mobile lesson screen SHALL avoid duplicate back-navigation affordances and SHALL rely on a single consistent back action for returning to the previous screen.

#### Scenario: User opens a lesson
- **WHEN** a user navigates to a lesson screen from the home or courses flow
- **THEN** the lesson screen shows only one back-navigation control at the top of the screen
- **AND** using that control returns the user to the previous screen

### Requirement: Mobile lesson screen SHALL present visible lesson video thumbnails
The mobile lesson screen SHALL show each lesson video with a visible thumbnail or a clear fallback preview state so the video list is visually understandable before playback starts.

#### Scenario: Lesson contains related videos
- **WHEN** a lesson has one or more related videos
- **THEN** each video card shows its thumbnail image when available
- **AND** the card still shows a recognizable preview state if a thumbnail cannot be rendered

### Requirement: Mobile lesson screen SHALL play lesson videos inside the app
The mobile lesson screen SHALL allow users to play lesson videos without redirecting them out of the mobile app.

#### Scenario: User starts lesson video playback
- **WHEN** a user taps a video from the lesson screen
- **THEN** the selected video begins playback inside the app
- **AND** the app does not redirect the user to the YouTube website or external YouTube app for normal playback

### Requirement: Mobile lesson screen SHALL respond to the active theme
The mobile lesson screen SHALL apply the saved mobile theme to its surfaces, text, cards, and video presentation so dark mode and light mode are visibly different.

#### Scenario: User views a lesson in dark mode
- **WHEN** the saved mobile theme is dark and the user opens a lesson
- **THEN** the lesson screen renders using dark-theme background, surface, border, and text treatments
- **AND** lesson content remains readable with theme-appropriate contrast
