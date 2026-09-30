<div align="center">

# Rakshit Sinha · Portfolio

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-R3F_9_+_drei-000000?logo=threedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

*A cyanotype engineering drawing set: a real 3D drone, its exploded assembly and a tower inspection.*

</div>

---

## What it is

A single-page portfolio laid out as a blueprint drawing set. There are six numbered "sheets". A fixed
three.js scene behind the page, rendered as a technical illustration, is choreographed to scroll:

1. **Hero:** a DJI Avata 2 in ceramic and graphite with ink outlines, orbiting and leaning toward the cursor.
2. **General notes:** the drone explodes along dashed assembly axes and holds still, with lettered callouts
   led out to a label column beside it.
3. **Revision history:** it flies to an inked lattice transmission tower. A scan plane sweeps the tower,
   detection boxes snap onto the insulators, and the matching mAP figure lights up in the Skylark card.

Each project has an illustrated SVG "plate" that drafts itself in as you scroll. Hovering any card snaps
YOLO-style detection brackets onto it.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. For a production build run `npm run build`, then `npm run preview`. Output goes
to `dist/`.

## Editing content

All text lives in **`src/config/data.js`**: identity, notes, experience, the featured project and its
write-up, projects, skills (the bill of materials) and nav links. No component needs to change for a
content update.

## Layout

| Path | What |
|---|---|
| `src/components/` | One component per sheet, plus `Plates` (project illustrations), `SheetFrame` (border, rulers, readout) and `Detector` (hover brackets) |
| `src/components/scene/` | Lazy-loaded R3F scene: `Scene` (lighting and scroll stage), `model` (GLB loader and part map), `Drone`, `Tower` |
| `public/models/drone.glb` | The drone. Textures are stripped, the mesh is simplified, and it's meshopt-compressed (25 MB down to 0.6 MB) |
| `src/index.css` | Every style; design tokens in `:root` |

Respects `prefers-reduced-motion`: the drone holds still, reveal animations are off, and the scroll-driven 3D stops after the hero. On phones the
3D only appears in the hero, and it is skipped entirely when data-saver is on.

## Credits

Drone model: ["DJI Avata2"](https://sketchfab.com/3d-models/dji-avata2-e27ed758e2174a89a48368e84027f8d9)
by raphael.harris.gaffga, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The site
repaints it with its own materials.
