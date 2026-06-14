# Master Review Academy
### LET Board Examination Review Platform

---

## STEP-BY-STEP DEPLOYMENT GUIDE
*(Takes about 15–20 minutes total)*

---

## PART 1 — Upload to GitHub (5 minutes)

1. Go to **github.com** → Sign up for a free account (if you don't have one)
2. Click the **"+"** button → **"New repository"**
3. Name it: `master-review-academy`
4. Set to **Public**
5. Click **"Create repository"**
6. On the next page, click **"uploading an existing file"**
7. Drag and drop ALL the files and folders from this project folder
8. Click **"Commit changes"**

---

## PART 2 — Deploy to Vercel (5 minutes)

1. Go to **vercel.com** → Sign up with your GitHub account
2. Click **"Add New Project"**
3. Select your `master-review-academy` repository
4. Leave all settings as default
5. Click **"Deploy"**
6. Wait ~2 minutes for it to build
7. ✅ Your app is now live at: `master-review-academy.vercel.app`
   *(or a similar free URL — Vercel shows it when done)*

---

## PART 3 — Install as App on Android (2 minutes)

**Share this with your classmates:**

1. Open the Vercel URL in **Google Chrome** on your Android phone
2. Tap the **3-dot menu (⋮)** in the top-right corner
3. Tap **"Add to Home screen"**
4. Name it: **MRA Review**
5. Tap **"Add"**
6. ✅ The app icon now appears on your home screen!

---

## PART 4 — Install as App on iPhone (2 minutes)

1. Open the Vercel URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button (□↑)** at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Name it: **MRA Review**
5. Tap **"Add"**
6. ✅ The app icon now appears on your home screen!

---

## PART 5 — Optional: Convert to Android APK (10 minutes)

If you want a real installable `.apk` file (like a Play Store app):

1. Go to **pwabuilder.com**
2. Paste your Vercel URL
3. Click **"Package for Stores"**
4. Choose **Android**
5. Download the `.apk` file
6. Share the `.apk` via chat/email to classmates
7. On their phone: Settings → Security → Enable **"Install from unknown sources"**
8. Tap the `.apk` file → Install
9. ✅ Installed like a real Android app!

---

## ADMIN ACCESS

- **Username:** crael
- **Password:** ftrc2024

Sign in with these credentials to access the Admin Panel and Rating Sheet.

---

## ADDING NEW QUIZZES

Open `src/App.jsx` and:
1. Add your question array: `const NEW_Q = [ ... ]`
2. Add entry to `QUIZ_REGISTRY`
3. Add entry to `SUBJECTS` if it's a new subject
4. Push to GitHub → Vercel auto-redeploys in ~2 minutes

---

## PROJECT STRUCTURE

```
master-review-academy/
├── public/
│   ├── index.html          ← App shell + PWA meta tags
│   ├── manifest.json       ← PWA manifest (app name, icon, colors)
│   ├── sw.js               ← Service worker (offline support)
│   └── icons/
│       ├── icon-192.png    ← App icon (Android + PWA)
│       ├── icon-512.png    ← App icon (large)
│       └── icon-152.png    ← App icon (iOS)
├── src/
│   ├── index.js            ← React entry point
│   └── App.jsx             ← Complete platform (900 questions + UI)
├── package.json            ← Dependencies
├── vercel.json             ← Deployment config
└── README.md               ← This file
```

