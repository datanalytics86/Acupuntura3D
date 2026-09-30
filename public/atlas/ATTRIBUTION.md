# Atlas figure attribution

The anterior and posterior body plates are adapted from surface illustrations by
**Goran tek-en**, under **Creative Commons Attribution-ShareAlike 4.0 International
(CC BY-SA 4.0)**.

- Author: Goran tek-en
- License: CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/
- Anterior: https://commons.wikimedia.org/wiki/File:Male_front_3d-shaded_human_illustration.svg
- Anterior file: https://upload.wikimedia.org/wikipedia/commons/7/7a/Male_front_3d-shaded_human_illustration.svg
- Posterior: https://commons.wikimedia.org/wiki/File:Male_back_3d-shaded_human_illustration.svg
- Posterior file: https://upload.wikimedia.org/wikipedia/commons/b/b7/Male_back_3d-shaded_human_illustration.svg

Changes made for this atlas (2026): background removed (PNG alpha is real;
paper shows between the limbs), crop, alignment to viewBox 800×1600
(vertex y=40, sole y=1480, midline x=400), and a small inward shift of the
legs so medial points stay on the skin. The plate composite is SVG, not a
new painting. The composite now includes a duotone grade and a vector contour
traced from the plate alpha. An academic pubic plane covers the source
linework. A hair cap was tried
and removed because it read as a pasted wig. The adapted plates stay CC BY-SA 4.0.
- Regional focus: mask `#region-focus` feathers face, hand and foot (white at the centre, 14% outside) so the rest of the body stays a ghost.
- Grade: a sepia `fig-duo` (`feColorMatrix` luminance plus `feComponentTransfer`) replaces `fig-grade`.
- Grain: the SVG `plate-grain` filter was removed; paper tooth is the CSS class `.paper-grain`.

They are not scans, traces, or copies of Microsoft Encarta, Netter, Deadman,
DK, Kenhub, Visible Body, Complete Anatomy, or any other commercial atlas.
No photograph of a real person is used as the figure.

Coordinate frame: `src/atlas/figure/landmarks.ts`.
