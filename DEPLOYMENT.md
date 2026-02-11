# 🚀 Quick Deployment Guide

## Local Setup (1 minute)

```bash
npm install
npm start
```

Open: http://localhost:3000

**Login:**
- Admin: `admin` / `admin123`
- Partner: `partner` / `partner123`

---

## Deploy to Render.com (FREE)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Driver dashboard v2"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Create Web Service on Render

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: driver-dashboard
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Click **Create Web Service**

### 3. Configure Environment (Optional)

Add environment variables:
- `SESSION_SECRET`: random-secret-key
- `NODE_ENV`: production

### 4. Deploy! 🎉

Render will automatically deploy.
Your app will be live at: `https://driver-dashboard.onrender.com`

---

## What You Get

✅ Full authentication system
✅ Single-page dashboard
✅ Role-based access control
✅ Free HTTPS
✅ Auto-deploy on git push

---

## Post-Deployment

1. Test login with both accounts
2. Try adding a driver (admin)
3. Try changing status (partner)
4. Test search and filters

---

## Free Tier Notes

- 750 hours/month free
- Sleeps after 15 min inactivity
- First request: ~30 seconds to wake
- Perfect for this application

---

## Troubleshooting

**Server won't start?**
```bash
node --version  # Should be v14+
npm install
PORT=3001 npm start
```

**Login not working?**
- Clear browser cookies
- Check credentials
- Look at server logs

**Changes not deploying?**
```bash
git add .
git commit -m "Update"
git push
```

---

## Security Recommendations

For production use:

1. Change session secret
2. Enable HTTPS cookies
3. Use bcrypt for passwords
4. Add rate limiting
5. Enable CORS if needed

---

**Ready to go! 🚀**
