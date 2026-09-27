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
1. LOGO  (also used as the FAVICON)   →  images/logo/
─────────────────────────────────────────────────────────────
Save the file as one of these names:

  images/logo/logo.png     <-- recommended
  images/logo/logo.jpg
  images/logo/logo.jpeg
  images/logo/logo.webp
  images/logo/logo.svg

THIS FOLDER IS CURRENTLY EMPTY — that is why the navbar
shows the "W" letter badge instead of a logo. As soon as you
drop a file in with one of the names above, main.js picks it
up automatically and uses the SAME image for:
  • the navbar logo (every page)
  • the footer logo (every page)
  • the browser tab favicon

Recommended: transparent PNG, ~320×120 px (or a square
image if your logo is a round emblem).
No code changes needed. The images/favicon/ folder is no
longer used.

─────────────────────────────────────────────────────────────
2. LANDING IMAGE   →  images/landing/
─────────────────────────────────────────────────────────────
File name must be exactly:  landing.jpg  (or .png / .webp)

  images/landing/landing.jpg

Used as the full-screen background on the Home / Hero section.
Recommended: wide landscape photo, at least 1600×900 px.
A dark overlay is applied automatically so text stays readable.

─────────────────────────────────────────────────────────────
3. BIODATA FILES   →  biodata/   (outside this folder)
─────────────────────────────────────────────────────────────
Each team member's biodata goes in the top-level biodata/
folder. The filename must match the person's slug.
See biodata/README.txt for the full list.

─────────────────────────────────────────────────────────────
4. TEAM PHOTOS   →  images/team/
─────────────────────────────────────────────────────────────
File name must match the data-photo slug on each team card.
Current slugs (see index.html .team-avatar[data-photo]):

  narayani-tiwari.jpg          ✓     shiva-laxmi-upadhyay.jpg   (missing)
  timila-yami.jpg              ✓     renuka-kattel.jpg          ✓
  jamuna-tamrakar-sayami.jpg   ✓     narmada-thapa.jpg          ✓
  pragya-acharya-gautam.jpg    ✓     sabita-kandel.jpg          ✓
  shila-yogi.jpg               ✓     jyoti-panta.jpg            (missing)
  parvati-kattel.jpg           ✓     kamala-pandey.jpg          (missing)

  Any of .jpg .jpeg .png .webp works — square photos look best.

Rules:
  • File name = lowercase, hyphens for spaces, no special chars
  • Square photos work best (1:1 ratio), at least 300×300 px
  • The photo is automatically cropped to a circle
  • Falls back to the gradient icon if the file is missing

To add a new team member later:
  1. Add a new .team-card in index.html with data-photo="new-name"
  2. Save the photo as  images/team/new-name.jpg

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
