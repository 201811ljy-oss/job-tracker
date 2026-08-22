---
name: web-resume-builder
description: Create or revise an editable HTML/CSS resume that prints reliably as a polished A4 page. Use when the user provides an existing resume, resume image/PDF/template, or personal career information and wants a web resume, editable resume, or browser-to-PDF workflow. Do not use for ordinary portfolio websites or resume advice without artifact creation.
---

# Web Resume Builder

Produce a semantic, editable web resume rather than placing a flattened resume image on a webpage. Preserve confirmed facts and, when a reference exists, preserve its visual language and information density.

## Choose the input mode

- **Reference-first:** The user provides a resume, screenshot, image, PDF, or template. Inspect it visually and treat the latest user-confirmed version as the design and content baseline. Rebuild it with HTML/CSS; do not use the reference page as a full-page background.
- **Information-first:** The user provides career information only. Normalize it into a one-page structure, draft restrained wording, and use the included starter as the initial visual system.

For reference-first work, inspect images with an image viewer. If a PDF contains layout or source content, use the available PDF workflow for extraction and page rendering; visual inspection remains authoritative for layout.

## Establish the source of truth

Before authoring, collect or infer the fields in [references/intake-and-content.md](references/intake-and-content.md). Keep a short internal list of:

1. confirmed facts;
2. requested corrections;
3. optional wording suggestions.

Never silently invent dates, metrics, titles, tools, proficiency, awards, or responsibilities. When information is incomplete, use a neutral placeholder or ask only for a fact that materially changes the result. Apply the newest explicit correction everywhere the same fact appears, including summaries and self-evaluations.

## Build the artifact

When no stronger project template exists, copy `assets/starter/` into the deliverable folder and adapt it. Keep at least:

- `index.html` for semantic content and optional browser editing behavior;
- `styles.css` for screen and print layout;
- `assets/` for a supplied portrait or other local media.

Use real text elements for all resume content. Prefer `contenteditable` for direct browser editing, with print-only controls hidden. A small local autosave feature and local photo replacement are useful when they remain offline and do not complicate printing.

For a one-page resume, preserve these invariants:

- A4 portrait: `210mm × 297mm` and `@page { size: A4 portrait; margin: 0; }`.
- All important colors print with `print-color-adjust: exact`.
- Dates use a two-column row and remain right-aligned.
- Sections, projects, and bullets must not split unexpectedly.
- The page has no overflow, clipping, extra print page, browser header/footer, or flattened-image border.
- A supplied portrait keeps its aspect ratio with `object-fit: cover`; never alter identity or generate a different face unless explicitly requested.

Match the reference before redesigning it. Common reusable motifs include a black title block, white title text, red triangle and divider line, a right-side portrait, stacked projects, and outlined skill tags. These are reference-dependent choices, not universal resume requirements.

## Iterate from feedback

Treat screenshot annotations and phrases such as “this gap,” “move everything down,” or “make the margins symmetric” as localized layout feedback. Follow [references/visual-iteration.md](references/visual-iteration.md). Change the narrowest CSS variable or selector that controls the issue, keep confirmed content untouched, then re-render.

Do not compensate for one spacing issue by scaling the entire page unless the user requested global scaling. If the user approves the design, preserve the current visual system and make later changes incrementally.

## Verify and deliver

Render the print view at A4 size after every meaningful layout change. Verify:

- exactly one page;
- `scrollHeight <= clientHeight` for the resume page;
- no clipped text or overlap;
- readable font weight and line height;
- right-aligned dates and undistorted portrait;
- top and bottom whitespace are intentionally balanced;
- every requested factual change appears in all relevant sections.

Deliver a self-contained folder and, when useful, a ZIP containing the HTML, CSS, assets, and a short opening/printing note. Do not deploy publicly unless the user asks.
