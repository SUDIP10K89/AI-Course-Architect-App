## MODIFIED Requirements

### Requirement: Mobile home screen SHALL provide parity-relevant learning overview
The mobile home screen SHALL present a learning overview comparable to the web home experience, including summary stats and a concise recent-courses section that helps users quickly continue learning without marketing-only content.

#### Scenario: Home screen shows parity-relevant stats
- **WHEN** an authenticated user opens the mobile home screen
- **THEN** the app shows current learning summary information derived from course stats
- **AND** the summary includes the primary progress indicators needed to continue learning

#### Scenario: Home screen shows recent courses
- **WHEN** recent courses are available
- **THEN** the home screen shows a recent courses section limited to the first three courses
- **AND** selecting a recent course opens that course in mobile

#### Scenario: Home screen omits feature-marketing section
- **WHEN** a user opens the mobile home screen after this change
- **THEN** the home screen does not show the standalone "Why AI Course Architect?" feature section
- **AND** the screen remains focused on learning stats, generation, and recent-course continuation
