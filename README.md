# CADD-EXPERTS — website

3D, scroll-driven website for a Civil & Mechanical CAD training institute.
Built with **React 19 · Vite · React Three Fiber / drei (Three.js) · GSAP · Framer Motion · Lenis**.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build locally
```

## Editing content

All content (contact details, stats, courses, software, projects, careers, testimonials, gallery, facilities, FAQ)
is in **`src/data/site.js`**. Swap that module for a headless-CMS fetch that returns the same shapes to make it CMS-driven.

**Before launch, replace the `TODO` placeholders:**
- `site.contact`: phone, WhatsApp number, email, address, map query
- `site.url`: production domain (also in `public/robots.txt`, `public/sitemap.xml` and the JSON-LD in `index.html`)
- `testimonials`: these are **sample** texts. Use real, consented student testimonials (add a `photo` URL per entry).
- `gallery` / `facilities`: add `image: '/images/cad-lab.jpg'`. The site serves `.avif` / `.webp` siblings automatically
  when they exist. Without an image, a generated technical drawing is shown.
- `site.formEndpoint`: set a POST endpoint (Formspree, serverless function, CRM webhook) to receive enquiries.
  When it is empty, the form opens a prefilled WhatsApp chat instead.
- Social links and the Privacy / Terms templates.

## Structure

```
src/
  data/site.js          content / configuration
  three/                3D: parametric Building, Gearbox (procedural gears), kit (blueprint materials,
                        dimensions, CAD axes), Stage (lazy canvas), CameraRig, scenes
  components/           Layout (nav, footer, mobile CTA), ui (magnetic buttons, tilt, reveal, counter,
                        accordion), Scene3D (lazy loader + low-end fallback), BlueprintArt, Glyph
  sections/             Hero, About, Domains, CourseExplorer, SoftwareWall, ScrollStory + Stories,
                        Projects (+ CAD viewer), Content (why, process, careers, testimonials, gallery,
                        facilities, FAQ), Enquiry (form + contact)
  pages/                Home + all inner pages (lazy-loaded)
  styles/global.css     design tokens and all styles
```

## 3D & performance

- All 3D models are procedural, so there are no model files to download. Three.js loads in its own chunk only when a scene is needed.
- Each canvas mounts as it nears the viewport and stops rendering while it is off-screen.
- Pixel ratio adapts to the device tier. Low-end phones, Save-Data users and browsers without WebGL get animated SVG
  technical drawings instead of WebGL.
- `prefers-reduced-motion` disables smooth scrolling, the intro sequence and decorative animation.

## Deployment & SEO

This is a single-page app. Configure the host to rewrite unknown paths to `/index.html` (`public/_redirects` handles Netlify;
use `vercel.json` rewrites on Vercel). Each page sets its own title, description, canonical URL and JSON-LD
(Course list, FAQPage, LocalBusiness, CreativeWork). Server-rendered HTML gives the best crawler coverage, so consider
prerendering the routes (e.g. `vite-plugin-prerender` / `react-snap`) or porting to a framework with SSG.
