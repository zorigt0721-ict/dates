# 💖 Date Invitation — Deployment Guide

## Quick Local Test

```bash
npm install
npm start
# Open http://localhost:3000
```

---

## Deploy to Railway (Recommended — easiest)

1. Push this project to a **GitHub repo**
2. Go to [railway.app](https://railway.app) → "New Project" → "Deploy from GitHub Repo"
3. Select your repo
4. Railway auto-detects Node.js and runs `npm start`
5. Add environment variables (optional, already hardcoded):
   - `BOT_TOKEN` = `8707563999:AAH8MUG8JOtxr-3IxGmcMtaELBLqFENmWAE`
   - `CHAT_ID` = `7437967842`
6. Click **Deploy** → get your public URL!

---

## Deploy to Render

1. Push to GitHub
2. Go to [render.com](https://render.com) → "New Web Service"
3. Connect your repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add env vars `BOT_TOKEN` and `CHAT_ID` (optional)
6. Deploy → get your `.onrender.com` URL

---

## Deploy to Vercel (Serverless)

For Vercel, you need to convert the Express backend to a serverless function:

1. Create `vercel.json` in root:
```json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/(.*)", "dest": "public/$1" }
  ]
}
```
2. Push to GitHub → import on [vercel.com](https://vercel.com)
3. Add env vars in Vercel dashboard
4. Deploy!

---

## Deploy to Netlify (Frontend) + Railway (Backend)

Split deployment:
1. Deploy `public/` folder to Netlify as a static site
2. Deploy `server.js` to Railway as the backend
3. In `script.js`, change the fetch URL from `/api/accept` to your Railway backend URL:
   ```js
   const res = await fetch("https://your-railway-app.up.railway.app/api/accept", { ... });
   ```

---

## Share the Link

Once deployed, share the public URL with your special someone! 💌
