## MODIFIED Requirements

### Requirement: Mobile theme preference SHALL be real and persistent
The mobile application SHALL provide a settings-controlled theme preference that changes actual application appearance behavior across the Home, Courses, Course Detail, and Lesson screens and persists across app restarts.

#### Scenario: User changes theme preference
- **WHEN** a user changes the theme setting on mobile
- **THEN** the app updates its active theme outside the settings screen
- **AND** the Home, Courses, Course Detail, and Lesson screens visibly switch to the selected theme while the app remains in use

#### Scenario: Theme persists after restart
- **WHEN** a user reopens the mobile app after previously changing the theme
- **THEN** the app restores the saved theme preference from persistent storage
- **AND** the Home, Courses, Course Detail, and Lesson screens continue using the restored theme without requiring the user to revisit settings
