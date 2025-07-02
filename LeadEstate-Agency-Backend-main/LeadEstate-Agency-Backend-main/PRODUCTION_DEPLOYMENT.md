# 🚀 Production Authentication Deployment Guide

## 📋 Overview

This guide will help you upgrade from demo authentication to full production authentication with real database persistence, JWT tokens, and email-based password reset.

## 🔧 Prerequisites

- PostgreSQL database (Railway, Supabase, or similar)
- Brevo account for email service
- Render account for backend deployment

## 📊 Current vs Production Authentication

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| **User Storage** | Hardcoded | PostgreSQL database |
| **Password Security** | Plain text | Bcrypt hashed |
| **JWT Tokens** | Demo tokens | Real JWT with secrets |
| **Password Reset** | UI only | Email-based with tokens |
| **Session Management** | Basic | Secure with expiry |

## 🗄️ Step 1: Database Setup

### 1.1 Create Owners Table

Run the database migration to create the owners table:

```bash
# Connect to your PostgreSQL database and run:
node src/scripts/setup-owners-table.js
```

Or manually execute the SQL:

```sql
-- See: src/database/migrations/create-owners-table.sql
-- This creates the owners table with proper security fields
```

### 1.2 Verify Database

The script will create:
- ✅ `owners` table with security fields
- ✅ Default owner account: `owner@leadestate.com` / `password123`
- ✅ Proper indexes for performance
- ✅ Password hashing with bcrypt

## ⚙️ Step 2: Environment Variables

### 2.1 Required Environment Variables

Add these to your Render deployment:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Email Service (Brevo)
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@leadestate.com
BREVO_SENDER_NAME=LeadEstate

# Frontend URLs
FRONTEND_URL=https://leadestate-owner-dashboard.vercel.app

# API Keys
OWNER_API_KEY=owner-dashboard-2024

# Server Configuration
NODE_ENV=production
PORT=10000
```

### 2.2 Generate JWT Secret

```bash
# Generate a secure JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🖥️ Step 3: Backend Deployment

### 3.1 Update Render Configuration

1. **Change Start Command** in Render:
   ```bash
   # From:
   node src/server-memory.js
   
   # To:
   node src/server-postgres.js
   ```

2. **Add Environment Variables** (see Step 2.1)

3. **Deploy** the updated backend

### 3.2 Verify Backend Deployment

Test the authentication endpoints:

```bash
# Test owner login
curl -X POST https://your-backend.onrender.com/api/auth/owner/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@leadestate.com","password":"password123"}'

# Should return JWT token and user data
```

## 📧 Step 4: Email Service Setup

### 4.1 Configure Brevo

1. **Create Brevo Account**: https://www.brevo.com/
2. **Get API Key**: Account → API Keys → Create new key
3. **Add to Environment Variables**

### 4.2 Test Email Service

```bash
# Test forgot password email
curl -X POST https://your-backend.onrender.com/api/auth/owner/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@leadestate.com"}'
```

## 🌐 Step 5: Frontend Update

The frontend is already updated to use production authentication. It will automatically:

- ✅ Use real JWT tokens
- ✅ Verify tokens with backend
- ✅ Handle password reset flow
- ✅ Manage secure sessions

## 🧪 Step 6: Testing

### 6.1 Test Authentication Flow

1. **Login Test**:
   - Go to: https://leadestate-owner-dashboard.vercel.app
   - Use: `owner@leadestate.com` / `password123`
   - Should redirect to dashboard

2. **Protected Routes Test**:
   - Try accessing `/dashboard` without login
   - Should redirect to login page

3. **Password Reset Test**:
   - Click "Forgot password"
   - Enter email and submit
   - Check email for reset link

### 6.2 Test Database Persistence

```sql
-- Check if login updates last_login_at
SELECT email, last_login_at FROM owners WHERE email = 'owner@leadestate.com';

-- Check if reset tokens are stored
SELECT email, reset_token, reset_token_expires FROM owners WHERE reset_token IS NOT NULL;
```

## 🔐 Step 7: Security Verification

### 7.1 Password Security

- ✅ Passwords are bcrypt hashed (12 rounds)
- ✅ Reset tokens expire after 1 hour
- ✅ JWT tokens have expiration
- ✅ No sensitive data in localStorage

### 7.2 API Security

- ✅ Rate limiting on auth endpoints
- ✅ Input validation and sanitization
- ✅ CORS properly configured
- ✅ SQL injection protection

## 🎯 Step 8: Create Additional Owners

### 8.1 Add New Owner Account

```sql
-- Add a new owner (password will be 'newpassword123')
INSERT INTO owners (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  company_name,
  email_verified_at
) VALUES (
  'admin@yourcompany.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS',
  'Admin',
  'User',
  'Your Company',
  NOW()
);
```

### 8.2 Password Reset for New Users

New users can use the "Forgot Password" feature to set their initial password.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check `DATABASE_URL` format
   - Verify database is accessible from Render

2. **JWT Token Invalid**:
   - Ensure `JWT_SECRET` is set and consistent
   - Check token expiration settings

3. **Email Not Sending**:
   - Verify Brevo API key
   - Check sender email configuration

4. **Login Fails**:
   - Verify owners table exists
   - Check password hash format
   - Ensure user status is 'active'

### Debug Commands

```bash
# Check database connection
node -e "const {Pool} = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0])).catch(console.error)"

# Test JWT generation
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({test: true}, process.env.JWT_SECRET, {expiresIn: '1h'}))"
```

## ✅ Success Checklist

- [ ] Database migration completed
- [ ] Environment variables configured
- [ ] Backend deployed with `server-postgres.js`
- [ ] Authentication endpoints working
- [ ] Email service configured
- [ ] Frontend authentication working
- [ ] Password reset flow tested
- [ ] Additional owners created (if needed)

## 🎉 Completion

Once all steps are completed, you'll have:

- ✅ **Secure Authentication**: Real database with hashed passwords
- ✅ **JWT Tokens**: Proper token-based authentication
- ✅ **Password Reset**: Email-based password recovery
- ✅ **Session Management**: Secure session handling
- ✅ **Multi-User Support**: Multiple owner accounts
- ✅ **Production Ready**: Scalable and secure system

Your authentication system is now production-ready! 🚀
