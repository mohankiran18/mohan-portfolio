# Kadali Mohan Kiran — Portfolio Website

A premium, modern developer portfolio built with HTML5, CSS3, and JavaScript.

---

## 📁 Folder Structure

```
portfolio/
├── index.html          ← Main HTML file
├── css/
│   └── style.css       ← All styles (glassmorphism, animations, responsive)
├── js/
│   └── main.js         ← Interactions, cursor, typing effect, animations
└── README.md
```

---

## 🚀 How to Run

### Option 1 — Open Directly
Simply double-click `index.html` in your file manager. It opens in your default browser. ✅

### Option 2 — Live Server (Recommended for development)
1. Install VS Code + **Live Server** extension
2. Right-click `index.html` → **Open with Live Server**
3. Auto-reloads on every save 🔥

### Option 3 — Python Local Server
```bash
cd portfolio
python -m http.server 8000
# Open http://localhost:8000
```

---

## 🖼️ Adding Your Profile Photo

Replace the placeholder icons with your actual photo:

**In `index.html`, find:**
```html
<div class="profile-placeholder">
  <i class="fa-solid fa-user"></i>
</div>
```
**Replace with:**
```html
<div class="profile-placeholder">
  <img src="assets/profile.jpg" alt="Mohan Kiran" />
</div>
```

Do the same for `.about-profile-placeholder`.

Then add your photo as `assets/profile.jpg` (recommended: 500×500px, square crop).

---

## ✏️ Customization Guide

| What to Change | Where |
|---|---|
| Profile photo | Replace placeholder div with `<img>` tag |
| Project GitHub links | `href` on `.overlay-btn` in Projects section |
| Live demo links | `href` on `.overlay-btn-alt` |
| Contact form action | Replace `handleFormSubmit` with EmailJS or Formspree |
| Colors/theme | Edit CSS variables in `:root {}` block |
| Add more projects | Copy a `.project-card` block in HTML |

---

## 📧 Making the Contact Form Actually Send Emails

Use **EmailJS** (free tier available):

1. Sign up at https://emailjs.com
2. Create a service + template
3. Replace `handleFormSubmit` in `main.js`:

```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
  from_name: nameEl.value,
  from_email: emailEl.value,
  message: msgEl.value,
}).then(() => { /* success */ });
```

---

## 🎨 Design Suggestions for Further Improvement

1. **Add your real photo** — biggest single improvement; makes it feel genuine
2. **Project screenshots** — replace the colored icon placeholder with real project screenshots
3. **Add a dark/light toggle** — toggle CSS variables on `body`
4. **Deploy for free** — GitHub Pages, Netlify, or Vercel (just drag & drop the folder)
5. **Add a blog section** — link to Dev.to or Hashnode articles to show thought leadership
6. **3D tilt effect on project cards** — use VanillaTilt.js for an interactive card effect
7. **Add more projects** — even small weekend experiments count
8. **Video background in hero** — a subtle looping WebGL or video adds depth

---

## 🌐 Free Deployment (Recommended)

**GitHub Pages:**
1. Push this folder to a GitHub repo
2. Settings → Pages → Branch: main → Save
3. Your site lives at `https://yourusername.github.io/portfolio`

**Netlify (drag & drop):**
1. Go to https://netlify.com
2. Drag the `portfolio` folder onto the deploy zone
3. Done — live URL in 30 seconds!

---

Built with ❤️ for Kadali Mohan Kiran
