# Jatin Kumar – Portfolio Website

A fully interactive, single-page portfolio built with **HTML · CSS · Vanilla JS · Three.js**.

🔗 **Live Site:** [jkbytecrafter.github.io/PortfolioWebsite](https://jkbytecrafter.github.io/PortfolioWebsite/)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Antigravity Particle Field** | 500-particle 3D dash field (inspired by antigravity.google) with mouse-parallax depth, rendered via Three.js |
| **Typewriter Effect** | Cycles through roles — CS Undergraduate, AI/ML Enthusiast, Competitive Programmer, etc. |
| **Live LeetCode Stats** | Real-time solved count (Easy / Medium / Hard) via multi-endpoint API fallback chain |
| **Live Codeforces Stats** | Rating, rank, max-rating via official Codeforces REST API |
| **Live GitHub Stats** | Repos, Followers, Following, Stars via GitHub REST API |
| **Project Flip Cards** | 5 interactive 3D CSS flip cards — each links to a live deployed project |
| **Awards Timeline** | Scroll-reveal animated timeline of achievements |
| **Certifications Grid** | NPTEL course cards with verification links |
| **Publications Section** | IEEE Xplore & conference paper cards |
| **Custom Cursor** | Magnetic dot + ring cursor with hover glow effect |
| **Fully Responsive** | Mobile-first layout, hamburger nav |

---

## 🚀 Projects Showcased

| # | Project | Stack | Live |
|---|---|---|---|
| 1 | **Drone-to-Map AI System** | Python, YOLOv8, DeepSORT, Folium, Docker | — |
| 2 | **Academic Research Assistant** | Python, Flask, Gemini LLM, FAISS | — |
| 3 | **SnapLink – Distributed URL Shortener** | FastAPI, Redis, PostgreSQL, Docker | [Live ↗](https://snaplink-api-o90i.onrender.com/) |
| 4 | **Autonomous Data Analyst** | FastAPI, Streamlit, PyCaret, LangChain, Gemini | [Live ↗](https://huggingface.co/spaces/jkbytecrafter/autonomous-data-analyst) |
| 5 | **Hindi News Bias Detector** | FastAPI, SentenceTransformers, Scikit-learn, Docker | [Live ↗](https://huggingface.co/spaces/jkbytecrafter/NewsBiasDetector) |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#FAFAFA` (light) |
| Primary Accent | `#6366F1` (Indigo / Violet) |
| Secondary | `#0891B2` (Cyan) |
| Highlight | `#B5179E` (Rose) |
| Font | Outfit (display) + JetBrains Mono (code) |

---

## 🛠️ Tech Stack

- **Three.js** – 3D antigravity particle canvas on hero
- **Vanilla CSS** – Design tokens, glassmorphism, flip cards, reveal animations
- **LeetCode Stats API** – `leetcode-stats-api.herokuapp.com` → `allorigins.win` CORS proxy → `alfa-leetcode-api.onrender.com` (3-level fallback chain)
- **Codeforces API** – `codeforces.com/api/user.info` + `user.rating`
- **GitHub REST API** – `api.github.com/users/JKBYTEcrafter`

---

## 📁 File Structure

```
PortfolioWebsite/
├── index.html                    # All sections & markup
└── sections/
    ├── Global/
    │   ├── global.css            # Design tokens, reset, utilities
    │   ├── navbar.css / navbar.js
    │   ├── footer.css / footer.js
    │   ├── cursor.js             # Custom magnetic cursor
    │   ├── api.js                # LeetCode / Codeforces / GitHub fetchers
    │   └── utils.js              # Scroll-reveal & shared helpers
    ├── Hero/
    │   ├── hero.css
    │   └── hero.js               # Three.js antigravity particle system + typewriter
    ├── About/
    ├── Skills/
    ├── Projects/
    │   ├── projects.css
    │   └── projects.js
    ├── Competitive/
    ├── Awards/
    ├── Courses/
    ├── Publications/
    ├── Education/
    └── Contact/
```

---

## 🚀 Run Locally

No build step required — just open in any modern browser.

```bash
# Clone the repo
git clone https://github.com/JKBYTEcrafter/PortfolioWebsite.git
cd PortfolioWebsite

# Serve locally (recommended for Three.js canvas)
python -m http.server 5678
# Then open http://localhost:5678
```

---

## 📡 Deploy on GitHub Pages

1. Go to **Settings → Pages** in this repo
2. Source: **Deploy from branch → `main` → `/ (root)`**
3. Site goes live at `https://jkbytecrafter.github.io/PortfolioWebsite/`

---

## 👤 Contact

- 📧 jatinkumar15002@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/jatin-kumar-2ba94a28a)
- 🐙 [GitHub](https://github.com/JKBYTEcrafter)
- 🟡 [LeetCode](https://leetcode.com/u/JKByteCrafter/)
- 🔵 [Codeforces](https://codeforces.com/profile/jatinkumar15002)

---

*Built with ❤️ by Jatin Kumar*
