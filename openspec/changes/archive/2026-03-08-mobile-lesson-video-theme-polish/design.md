## Context

The mobile navigation stack already renders a native header back arrow for the lesson route, but `LessonScreen` adds a second arrow inside the scroll content. The lesson video cards currently render a generic dark placeholder and open external YouTube URLs with `Linking`, which breaks the in-app learning flow. The theme system exists in `ThemeContext`, but major screens still hardcode light palette values instead of consuming the shared theme tokens.

This change touches multiple screens and one existing media dependency, so it benefits from an explicit design before implementation.

## Goals / Non-Goals

**Goals:**
- Use a single back-navigation control on the lesson screen.
- Render lesson videos with visible thumbnails and play them inline inside the lesson experience.
- Reduce home-page clutter by removing the feature-marketing section and showing only the first three recent courses.
- Make the persisted theme materially change the visual treatment of Home, Courses, Course Detail, and Lesson screens.

**Non-Goals:**
- Rework backend course or video payload shapes beyond consuming existing thumbnail fields.
- Add background audio, picture-in-picture, or a full custom media subsystem.
- Redesign the global navigation structure or tab layout.

## Decisions

### Decision: Keep stack-header navigation and remove the lesson-content back button
The duplicate arrow exists because both the stack navigator and `LessonScreen` provide backward navigation. The stack header is already consistent with the rest of the app and theme-aware through navigator colors.

Alternative considered:
- Hide the stack header on the lesson route and keep a custom in-content header. Rejected because it would require more custom styling work and would diverge from the other screens.

### Decision: Use thumbnail-backed video cards with inline playback on demand
The lesson screen already receives video metadata including `thumbnailUrl`, and the app already depends on `react-native-youtube-iframe`. The implementation should present each video as a card with the actual thumbnail, then switch into an embedded player state when the user taps a video.

Alternative considered:
- Continue opening videos in the external browser or YouTube app. Rejected because it interrupts the learning flow and conflicts with the requested in-app playback behavior.

### Decision: Apply theme tokens directly in the affected screens
The existing theme provider already exposes the token set needed to restyle surfaces, backgrounds, borders, and text. The affected screens should consume `useTheme()` and replace hardcoded light-only values with shared theme colors, while preserving status-specific accents where they remain meaningful.

Alternative considered:
- Add a new global styling abstraction before updating screens. Rejected for this change because the current issue is localized and can be fixed by consistently using the existing token source.

### Decision: Enforce the home-page content changes in the screen composition layer
Removing the feature section and limiting recent courses to three items are presentation decisions. They should be enforced in `HomeScreen` so the backend stats contract remains unchanged and the existing "See All" flow still exposes the full list elsewhere.

Alternative considered:
- Add a backend or context-level limit to recent courses. Rejected because the request is specific to the home-page presentation, not the shared data contract.

## Risks / Trade-offs

- [Inline YouTube embeds can be heavier than external links] -> Mitigation: instantiate the player only for the selected video instead of rendering active players for every card.
- [Some video records may have missing or broken thumbnail URLs] -> Mitigation: keep a styled fallback state with a play icon when the image cannot load.
- [Theme updates may miss nested UI states] -> Mitigation: audit banners, cards, inputs, progress bars, and empty/loading states in each affected screen rather than only swapping top-level backgrounds.
- [Home screen becomes more utility-focused and less promotional] -> Mitigation: keep the generator and stats sections intact so the screen still communicates product value through usage-oriented UI.
