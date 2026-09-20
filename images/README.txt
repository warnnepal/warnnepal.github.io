WARN Nepal – Images Folder Guide
=================================

Drop your image files into the correct sub-folder.
The site picks them up automatically — no code changes needed
for logo, landing, or team photos.

Supported formats everywhere: .png  .jpg  .jpeg  .webp  .gif
(For logo, .svg is also supported.)

─────────────────────────────────────────────────────────────
FOLDER STRUCTURE
─────────────────────────────────────────────────────────────

images/
 ├── logo/           → organization logo
 ├── landing/        → hero / home page background image
 ├── favicon/        → browser tab icon
 ├── team/           → team member photos
 └── gallery/        → gallery images (caption = filename)

─────────────────────────────────────────────────────────────
1. LOGO   →  images/logo/
─────────────────────────────────────────────────────────────
File name must be exactly:  logo.png  (or logo.jpg / logo.svg / logo.webp)

  images/logo/logo.png

Appears in the navbar and footer on every page.
Recommended: transparent background, ~160×60 px.
Falls back to the "W" letter badge if the file is missing.

─────────────────────────────────────────────────────────────
2. LANDING IMAGE   →  images/landing/
─────────────────────────────────────────────────────────────
File name must be exactly:  landing.png  (or .jpg / .webp)

  images/landing/landing.png

Used as the full-screen background on the Home / Hero section.
Recommended: wide landscape photo, at least 1600×900 px.
A dark overlay is applied automatically so text stays readable.

─────────────────────────────────────────────────────────────
3. FAVICON   →  images/favicon/
─────────────────────────────────────────────────────────────
File name must be exactly:  favicon.png  (or favicon.ico)

  images/favicon/favicon.png

To activate it, add this line inside the <head> of index.html
and gallery.html:

  <link rel="icon" href="images/favicon/favicon.png" />

─────────────────────────────────────────────────────────────
4. TEAM PHOTOS   →  images/team/
─────────────────────────────────────────────────────────────
File name must match the data-photo slug on each team card.
Current slugs (see index.html .team-avatar[data-photo]):

  images/team/sunita-sharma.png    → Sunita Sharma
  images/team/anita-thapa.png      → Anita Thapa
  images/team/ramesh-kc.png        → Ramesh KC
  images/team/priya-rai.png        → Priya Rai

Rules:
  • File name = lowercase, hyphens for spaces, no special chars
  • Square photos work best (1:1 ratio), at least 300×300 px
  • The photo is automatically cropped to a circle
  • Falls back to the gradient icon if the file is missing

To add a new team member later:
  1. Add a new .team-card in index.html with data-photo="new-name"
  2. Save the photo as  images/team/new-name.png

─────────────────────────────────────────────────────────────
5. GALLERY IMAGES   →  images/gallery/
─────────────────────────────────────────────────────────────
The FILENAME (without extension) becomes the caption automatically.
Examples:
  dashain.png           → caption "Dashain"
  community-day.jpg     → caption "Community Day"
  workshop-2024.webp    → caption "Workshop 2024"

IMPORTANT: After adding a new image, you must also add the
filename (without extension) to the GALLERY_FILES array in
BOTH of these files:

  js/main.js    →  const GALLERY_FILES = [ ... ]
  js/gallery.js →  const GALLERY_FILES = [ ... ]

Current files registered:
  community-program
  skills-training
  women-empowerment

Recommended size: at least 800×600 px (landscape).
The gallery page shows a full-screen slideshow + a grid below.
Clicking any grid photo opens a full-size lightbox.

─────────────────────────────────────────────────────────────
NOTE ON FILE NAMES
─────────────────────────────────────────────────────────────
• Use lowercase letters only
• Use hyphens (-) instead of spaces
• Avoid special characters, brackets, or non-ASCII letters
• File names are case-sensitive on Linux/Mac servers
