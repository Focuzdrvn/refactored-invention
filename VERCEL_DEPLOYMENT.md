# Vercel Deployment Guide - Frontend

## 🚀 Deploy to Vercel

### Step 1: Prepare Repository

1. Push your frontend code to GitHub: https://github.com/Focuzdrvn/refactored-invention

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend commit for Vercel deployment"
git remote add origin https://github.com/Focuzdrvn/refactored-invention.git
git push -u origin main
```

### Step 2: Deploy Backend FIRST

⚠️ **IMPORTANT**: Deploy backend to Railway before deploying frontend!

You need the Railway backend URL for the frontend environment variables.

Follow: `backend/RAILWAY_DEPLOYMENT.md`

### Step 3: Create Vercel Project

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import `Focuzdrvn/refactored-invention`
5. Vercel will auto-detect Vite

### Step 4: Configure Build Settings

Vercel should auto-detect:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not, set them manually.

### Step 5: Set Environment Variables

In Vercel project → Settings → Environment Variables, add:

```env
VITE_API_URL=https://YOUR_RAILWAY_BACKEND_URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Example**:

```env
VITE_API_URL=https://fuzzy-octo-spoon-production.up.railway.app
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **CRITICAL**:

- Use the SAME Supabase project as backend
- No trailing slash in VITE_API_URL
- All variables must start with `VITE_`

### Step 6: Configure Custom Domain

1. In Vercel project → Settings → Domains
2. Add domain: `upvote.focuzdrvn.tech`
3. Vercel will provide DNS records
4. Add these to your domain provider (e.g., Namecheap, Cloudflare):

```
Type: CNAME
Name: upvote
Value: cname.vercel-dns.com
```

Or if root domain:

```
Type: A
Name: @
Value: 76.76.21.21
```

Wait 5-10 minutes for DNS propagation.

### Step 7: Redeploy with Variables

After adding environment variables:

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache: No"

### Step 8: Update Backend CORS

Once frontend is deployed, update Railway backend environment variable:

```env
FRONTEND_URL=https://upvote.focuzdrvn.tech
```

Then redeploy backend on Railway.

### Step 9: Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

Add to **Redirect URLs**:

```
https://upvote.focuzdrvn.tech/auth/callback
https://YOUR_RAILWAY_URL/api/auth/google/callback
```

Add to **Site URL**:

```
https://upvote.focuzdrvn.tech
```

### Step 10: Test Deployment

1. Visit `https://upvote.focuzdrvn.tech`
2. Click "Login with Google"
3. Should redirect to Google OAuth
4. After login, should redirect back to voting dashboard

## 🔧 Troubleshooting

### Build Fails

- Check Vercel deployment logs
- Verify all dependencies are in package.json
- Ensure build command is correct

### White Screen

- Check browser console for errors
- Verify environment variables are set
- Check if API URL is correct

### CORS Errors

- Verify FRONTEND_URL in Railway backend matches exactly
- No trailing slashes
- Backend must be deployed and running

### OAuth Not Working

- Verify Supabase redirect URLs include both frontend and backend
- Check Supabase project is same as backend
- Verify VITE*SUPABASE*\* variables are correct

### API Connection Errors

- Verify VITE_API_URL is correct Railway URL
- Test backend: `curl https://YOUR_RAILWAY_URL/health`
- Check Railway backend is running

## 📊 Monitoring

Vercel provides:

- Real-time deployment logs
- Analytics dashboard
- Performance metrics
- Error tracking

Access via: Project → Analytics

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

## 🎨 Performance Optimizations

Vercel automatically provides:

- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Code splitting
- ✅ Gzip/Brotli compression
- ✅ Edge caching

## ✅ Frontend Deployment Complete!

Your voting app is now live at: **https://upvote.focuzdrvn.tech** 🎉

## 🔐 Final Security Checklist

- [ ] Backend deployed on Railway with all env variables
- [ ] Frontend deployed on Vercel with correct API URL
- [ ] Custom domain configured and SSL active
- [ ] Supabase OAuth redirect URLs updated
- [ ] CORS configured correctly (FRONTEND_URL in backend)
- [ ] Admin password is strong and hashed
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Test complete voting flow
- [ ] Monitor Railway and Vercel dashboards

## 📚 Post-Deployment

### Monitor Your Application:

- Railway Dashboard: Backend logs and metrics
- Vercel Dashboard: Frontend analytics
- MongoDB Atlas: Database monitoring
- Supabase Dashboard: Auth logs

### Regular Maintenance:

- Check logs weekly
- Monitor error rates
- Update dependencies monthly
- Backup MongoDB regularly

### Support:

- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Supabase: https://supabase.com/docs
