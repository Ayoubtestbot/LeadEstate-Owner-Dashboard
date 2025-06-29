# 🚀 LeadEstate Owner Dashboard - Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push this code to your GitHub repository
3. **Backend API**: Ensure your Agency Backend is deployed and accessible

## 🔧 Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```env
# API Configuration
VITE_API_URL=https://your-agency-backend.leadestate.com
VITE_OWNER_API_KEY=your-super-secret-owner-api-key

# Owner Information
VITE_OWNER_NAME=LeadEstate Owner
VITE_OWNER_EMAIL=owner@leadestate.com

# GitHub Integration
VITE_GITHUB_OWNER=Ayoubtestbot

# Domain Configuration
VITE_BASE_DOMAIN=leadestate.com
VITE_AGENCY_SUBDOMAIN_SUFFIX=.leadestate.com

# Template Repositories
VITE_FRONTEND_TEMPLATE_REPO=LeadEstate-Agency-Frontend
VITE_BACKEND_TEMPLATE_REPO=LeadEstate-Agency-Backend

# Analytics
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: leadestate-owner-dashboard
# - Directory: ./
# - Override settings? N

# Add environment variables
vercel env add VITE_API_URL
vercel env add VITE_OWNER_API_KEY
# ... add all other variables

# Redeploy with environment variables
vercel --prod
```

## 🔗 Custom Domain Setup

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain: `admin.leadestate.com`

2. **Configure DNS**:
   - Add CNAME record: `admin` → `cname.vercel-dns.com`
   - Or A record: `admin` → Vercel IP addresses

## ✅ Post-Deployment Checklist

- [ ] Dashboard loads successfully
- [ ] API connection test passes
- [ ] Agency creation works
- [ ] Environment variables are set correctly
- [ ] Custom domain is configured
- [ ] SSL certificate is active

## 🧪 Testing the Deployment

1. **Access Dashboard**: Go to your deployed URL
2. **Test API Connection**: Check browser console for API calls
3. **Create Test Agency**: Try creating a new agency
4. **Verify Repositories**: Check if GitHub repositories are created
5. **Check Email**: Verify manager invitation emails are sent

## 🔧 Troubleshooting

### Common Issues:

1. **API Connection Failed**:
   - Check `VITE_API_URL` environment variable
   - Verify backend is deployed and accessible
   - Check CORS settings in backend

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check Vercel dashboard for variable values

3. **Build Errors**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **GitHub Integration Issues**:
   - Verify `GITHUB_TOKEN` in backend
   - Check repository permissions
   - Ensure template repositories exist

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test API endpoints directly

---

**Your Owner Dashboard will be accessible at**: `https://your-project.vercel.app`

**Custom domain**: `https://admin.leadestate.com` (after DNS configuration)
