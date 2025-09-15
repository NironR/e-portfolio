# E-Portfolio Boilerplate

A minimal, accessible e-portfolio built with Next.js (App Router) and Tailwind CSS (via @tailwindcss/v4 API). It includes common sections (Home, About, Projects, Experience, Contact), a Navbar and Footer, and clean defaults so you can focus on your content.

## Getting Started

1. Install dependencies

   npm install

2. Run the dev server

   npm run dev

3. Open the app

   Visit http://localhost:3000

## Customize

- Site title and description: src/app/layout.tsx (metadata) and Navbar brand text.
- Home hero: src/app/page.tsx
- Sections:
  - About: src/app/about/page.tsx
  - Projects: src/app/projects/page.tsx
  - Experience: src/app/experience/page.tsx
  - Contact: src/app/contact/page.tsx
- Styling: src/app/globals.css

Search for "Your Name" and replace with your name. Update links and content in each section.

## Production build

- Type check: npx tsc --noEmit
- Build: npm run build
- Start: npm start

## Notes

- This template uses next/font to load Geist. Tailwind utilities are available via @import "tailwindcss" in globals.css.
- The Navbar is sticky and there is a skip link for accessibility.
