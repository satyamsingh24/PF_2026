# Satyam Singh Bhadoriya — Portfolio

Personal portfolio of **Satyam Singh Bhadoriya**, DevOps Engineer (CI/CD, AWS, Docker, Kubernetes, Terraform).
Built with React + Vite.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Structure

- `src/data/portfolio.js` — all site content (profile, experience, skills, education, certifications, contact, Ask AI answers).
  `NAV` sets the order of the navbar and the page sections.
- `src/components/` — Navbar, Hero, Avatar (eye-tracking), About, Projects/ProjectCard (experience cards), Skills, Education, Certifications, Contact, Footer, ChatDrawer.
- `public/assets/` — avatar layers, profile photo.

## Ask AI

The chat drawer calls `VITE_RAG_API_URL` (default `http://localhost:8000`) if a backend is running.
Without one it answers from the built-in answers in `src/data/portfolio.js`.
