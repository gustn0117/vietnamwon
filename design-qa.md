# Design QA — 베트남원

## Evidence

- Source visual truth: `references/option-1.png`
- Final desktop implementation: `qa/implementation-desktop-final.png`
- Final mobile implementation: `qa/implementation-mobile-final.png`
- Full-view comparison: `qa/compare-desktop-final.png`
- Focused header/hero comparison: `qa/compare-focus-header-hero.png`
- Focused category/trust comparison: `qa/compare-focus-categories.png`
- Interaction captures: `qa/interaction-mobile-menu.png`, `qa/interaction-category-modal.png`, `qa/interaction-consult-success.png`
- Browser test log: `qa/browser-checks.json`

## Normalization

- Desktop source pixels: 1159 × 1356.
- Desktop implementation pixels: 1159 × 1356.
- Desktop CSS viewport: 1159 × 1356; device scale factor 1.
- Mobile implementation pixels: 390 × 844.
- Mobile CSS viewport: 390 × 844; device scale factor 1.
- State: signed-out home page, default search state, no modal open for the primary comparison.
- The source and implementation are compared at equal pixel density without browser chrome or device frames.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: local Pretendard Variable produces the intended strong Korean sans-serif hierarchy. Headline weights, line height, wrapping, and small UI text remain readable at both tested viewports.
- Spacing and layout rhythm: header, hero, discovery heading, two-row category grid, trust strip, and consultation banner follow the source order and now occupy comparable proportions. Mobile has no horizontal overflow (`scrollWidth` equals `clientWidth`, 390px).
- Colors and visual tokens: deep navy, white, travel blue, and restrained champagne-gold map closely to the source. Text and CTA contrast remain clear.
- Image quality and asset fidelity: every visible image slot uses a dedicated locally stored generated asset with matching premium Vietnam travel art direction. WebP delivery preserves sharpness while reducing transfer size. No placeholder imagery, CSS drawings, handmade SVGs, or hotlinked assets are used.
- Copy and content: the site consistently uses the 베트남원 identity and coherent Korean travel copy. Primary actions remain focused on discovery and consultation.
- Icons: Phosphor icons provide a consistent family for search, account, navigation, trust, and consultation controls.
- Accessibility: semantic buttons/forms, labels, alt text, visible focus indicators, Escape-to-close behavior, reduced-motion support, and practical mobile targets are present.

## Browser Verification

Tested in the Chrome production preview at `http://127.0.0.1:4173/`:

- Mobile menu opens.
- Category detail modal opens.
- Consultation form opens and reaches its success state.
- Search filters the category grid to the matching result.
- Browser console errors: none.
- Runtime exceptions: none.
- Browser log errors: none.

## Comparison History

### Iteration 1

- Earlier finding [P1]: desktop hero and card regions were too tall, so the consultation banner did not enter the same 1159 × 1356 crop as the source.
- Earlier finding [P1]: the initial narrow layout allowed the long hero title and header controls to crowd the right edge.
- Fixes: reduced header and hero proportions, tightened card height and section spacing, added an intentional mobile headline break, and used a zero-minimum mobile grid track with a compact search control.
- Post-fix evidence: `qa/compare-desktop-v2.png` and `qa/implementation-mobile-v3.png`.

### Iteration 2

- Earlier finding [P2]: desktop discovery spacing was still looser than the source, placing the consultation banner lower than intended.
- Fixes: tightened hero height, discovery padding, grid margin, and trust-strip spacing.
- Post-fix evidence: `qa/compare-desktop-final.png`, `qa/compare-focus-header-hero.png`, and `qa/compare-focus-categories.png`.

## Follow-up Polish

- [P3] The implementation uses an original open-source palm/island icon with an HTML wordmark instead of copying the generated mock logo exactly.
- [P3] The source mock shows an additional 회원가입 label; the implementation keeps the header focused on the working consultation journey until real authentication is added.

final result: passed
