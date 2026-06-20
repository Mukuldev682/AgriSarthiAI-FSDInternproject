#!/bin/bash
# Run this script inside the agrisarthi-frontend folder
# It sets up git with 3 proper commits for W2

git init
git add package.json tailwind.config.js postcss.config.js public/ README.md
git commit -m "chore: initialize React project with Tailwind CSS and routing setup"

git add src/components/
git commit -m "feat: add Navbar, Hero, Card, and Footer reusable components"

git add src/
git commit -m "feat: add Home, About, Dashboard, and Login page routes with responsive layout"

echo ""
echo "✅ Git setup complete! Run 'git log --oneline' to verify 3 commits."
echo "Now push to GitHub:"
echo "  git remote add origin https://github.com/YOUR_USERNAME/agrisarthi-frontend.git"
echo "  git branch -M main"
echo "  git push -u origin main"
