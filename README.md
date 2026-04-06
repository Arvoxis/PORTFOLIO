# Personal Portfolio

A dark, editorial personal portfolio built with React + Vite.

**Stack**: React 18, Vite 5
**Design**: Syne (display) + DM Sans (body), amber accent, film-grain texture
**Animations**: Intersection Observer scroll reveals, CSS transitions

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Customization

**All personal content lives in one file: `src/config/data.js`**

Update the following exports:

| Export       | What it controls                                          |
|--------------|-----------------------------------------------------------|
| `personal`   | Name, role, tagline, bio, email, location, social links   |
| `experience` | Work history (company, role, period, bullet points)       |
| `projects`   | Project cards (name, description, tech stack, links)      |
| `skills`     | Skill categories and tags                                 |

No other files need to change for content updates.

## Adding a profile photo

Replace the initials placeholder in `src/components/About.jsx`:

```jsx
// Replace this:
<div className="about-img-initials">AC</div>

// With:
<img src="/your-photo.jpg" alt="Your name" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
```

Place the image in the `public/` folder.

## Swapping the accent color

In `src/index.css`, change the `--accent` variable:

```css
:root {
  --accent: #f59e0b;  /* amber — change to any color */
}
```

## Build for production

```bash
npm run build
npm run preview
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.
