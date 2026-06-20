# 🌾 AgriSarthi AI — Frontend

AI-powered crop advisory chatbot for farmers in Uttarakhand.

## Tech Stack
- React.js (Create React App)
- Tailwind CSS
- React Router DOM v6

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Dev Server
```bash
npm start
```
Opens at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Folder Structure
```
src/
├── components/
│   ├── Navbar.jsx      # Sticky responsive navbar
│   ├── Hero.jsx        # Landing hero with chat mockup
│   ├── Card.jsx        # Reusable feature card
│   └── Footer.jsx      # Site footer
├── pages/
│   ├── Home.jsx        # Home page (uses all 4 components)
│   ├── About.jsx       # About page
│   ├── Dashboard.jsx   # Chat dashboard
│   └── Login.jsx       # Login / Register
├── App.js              # Routes
└── index.js            # Entry point
```

## Pages & Routes
| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/dashboard` | Chat Dashboard |
| `/login` | Login / Register |

## Responsiveness
- Mobile-first design
- Hamburger menu for screens < 768px
- All grids use responsive breakpoints (`sm:`, `md:`, `lg:`)
- No horizontal scroll at any viewport width

## W2 Deliverable Checklist
- [x] Home page with Navbar, Hero, Card (×6), Footer
- [x] 3 additional routes: `/about`, `/dashboard`, `/login`
- [x] All routes have Navbar + Footer
- [x] Responsive layout (mobile + desktop)
- [x] All 4 components in `/components` folder

## Suggested Git Commits (W2)
```bash
git init
git add .
git commit -m "feat: add project structure with React Router and Tailwind setup"

# After adding components:
git add src/components/
git commit -m "feat: create Navbar, Hero, Card, and Footer components"

# After adding pages:
git add src/pages/
git commit -m "feat: add Home, About, Dashboard, and Login page routes"
```
