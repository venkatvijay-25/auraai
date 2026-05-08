# Copilot Dashboard Design System

## Foundations

- Typography: `Space Grotesk` for headlines, `Manrope` for product copy, `IBM Plex Mono` for dense numeric values.
- Color direction: deep navy surfaces with electric blue as the primary action color, supported by mint for healthy states, gold for warnings, and coral for urgent conditions.
- Layout: rounded glass-like cards, a persistent operator rail, and a 12-column responsive grid that collapses cleanly to tablet and mobile.

## Shared primitives

- `Card`: the default surface for every dashboard module.
- `SectionHeader`: reusable eyebrow, title, meta, and actions pattern for every card.
- `SegmentedControl`: consistent filtering for ranges, mandates, and alert views.
- `Pill`: normalized status treatment across funding, risk, and health states.
- `MetricTile`: compact stat presentation for hero and detail zones.
- `ProgressBar`: reusable coverage and sleeve-distribution treatment.

## Product intent

- Reduce scanning fatigue from the original page by creating a clearer hierarchy and stronger grouping.
- Keep interactions lightweight and useful: filters, selected rows, searchable requests, and live-style alert segmentation.
- Make chart usage feel systematic so new pages can reuse the same visual grammar instead of inventing new patterns.
