# Design QA — Midnight Concierge redesign

## Comparison target

- Source visual truth: `references/midnight-concierge-selected.png`
- Final implementation: `qa/implementation-dark-desktop-v2.png`
- Responsive evidence: `qa/implementation-dark-mobile-v1.png`
- Desktop viewport: 1536 × 1024 CSS px, device scale factor 1
- Source pixels: 1536 × 1024
- Implementation pixels: 1536 × 1024
- Density normalization: none required; source and implementation are equal-size 1× captures
- State: home route, page top, default navigation state

## Evidence

- Full-view side-by-side comparison: `qa/compare-dark-desktop-v2.png`
- Focused header/hero/service comparison: `qa/compare-dark-header-hero-v2.png`
- Earlier comparison: `qa/compare-dark-desktop-v1.png`
- Mobile menu: `qa/interaction-dark-mobile-menu.png`
- Service detail: `qa/interaction-dark-service-modal.png`
- Consultation success: `qa/interaction-dark-consult-success.png`
- Browser assertions: `qa/browser-checks-dark.json`

The focused comparison was required because the supplied logo, Korean display type, header control density, hero crop, and six service cards are too small to judge reliably in the full-page pair alone.

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: Pretendard variable is used for Korean UI and display copy, with Georgia limited to the small italic signature. Headline scale, line-height, hierarchy, and wrapping closely match the selected visual at 1536 px. Mobile wrapping remains readable without truncation.
- Spacing and layout rhythm: the 33 px utility bar, 76 px main header, 462 px hero, six-card strip, and beginning of the tailored-experience section align closely with the reference's vertical landmarks. Grid margins and gaps preserve the same dense premium rhythm without overlap.
- Colors and visual tokens: near-black and charcoal surfaces, warm ivory copy, and restrained metallic gold map consistently to the selected concept. Focus states retain visible gold contrast.
- Image quality and asset fidelity: all visible hero, casino, concierge, nightlife, golf, hotel, vehicle, and private-VIP imagery is supplied or individually generated at the required crop. No placeholder, CSS drawing, inline SVG illustration, or emoji substitutes remain.
- Copy and content: the primary nightlife/VIP promise, service taxonomy, trust cues, and consultation path match the selected direction. Korean copy is coherent and avoids explicit imagery or language.
- Icons: all interface icons use the existing Phosphor icon family with consistent duotone/solid treatments and optical size.
- Responsiveness: the 390 × 844 check has `scrollWidth === innerWidth === 390`; navigation moves to a drawer and service cards become a swipeable rail. No clipping or persistent-control overflow was found.
- Accessibility: semantic buttons/forms, visible focus, labels, escape-to-close, alt text, reduced-motion handling, and mobile tap targets are present. Modal opening locks body scroll.

## Comparison history

### Pass 1

Evidence: `qa/compare-dark-desktop-v1.png`

- [P1] The desktop header clipped the supplied vertical ONE AGENCY logo down to the emblem, omitting its wordmark.
- [P2] The vehicle service and lower experience card showed a missing asset while the final photo was still being produced.
- [P3] The browser requested a missing favicon and logged one 404.

Fixes made:

- Reduced the header logo render width so the complete supplied lockup is visible without cropping.
- Added the final private vehicle asset and used it in both the service card and consultation banner.
- Added `app/favicon.ico` from the supplied logo.

### Pass 2

Evidence: `qa/compare-dark-desktop-v2.png` and `qa/compare-dark-header-hero-v2.png`

- The supplied logo is fully visible, all six service cards contain finished imagery, and the browser console/network check reports no errors.
- No P0, P1, or P2 visual or functional differences remain.

## Primary interactions tested

- Mobile menu opens, traps the page behind it, and closes.
- Service card opens the correct casino detail modal and body scrolling is locked.
- Header search for `카지노` returns one matching card and resets correctly.
- VIP consultation modal accepts required fields and reaches the success state.
- Escape-to-close behavior is implemented for drawer and modals.
- Final browser console, runtime exception, and HTTP ≥400 check: zero errors.

## Intentional/acceptable differences

- The generated concept depicted a horizontal AI-rendered brand lockup. The implementation uses the user's exact supplied vertical ONE AGENCY logo instead, which takes precedence over the mock's altered lockup.
- The final hero uses an adult male guest viewed from behind rather than the mock's female guest, while preserving the same skyline, private-lounge composition, dark negative space, and premium nightlife mood.

## Follow-up polish

- [P3] A future official horizontal/vector ONE AGENCY lockup would allow the desktop header brand to read larger while keeping the current 76 px header height.

## Implementation checklist

- [x] Supplied logo used in header, drawer, footer, and favicon
- [x] Dark nightlife-first visual system implemented
- [x] Individually generated premium imagery placed in every visible asset slot
- [x] Desktop and mobile layouts verified
- [x] Search, navigation, details, and consultation flow verified
- [x] Lint, typecheck, and production build passed

final result: passed
