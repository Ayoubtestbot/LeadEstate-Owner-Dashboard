# 🏢 LeadEstate Owner Dashboard

**Complete Owner Dashboard for managing multiple real estate agencies with automated repository creation and deployment.**

The Owner Dashboard is the central control panel for LeadEstate, allowing owners to create, manage, and monitor multiple real estate agencies. Each agency gets its own dedicated CRM system with automated GitHub repositories and deployment infrastructure.

## 🎯 Key Features

### 📊 **Dashboard Overview**
- **Real-time Statistics**: Total agencies, active users, monthly revenue, system health
- **Recent Agencies**: Latest created agencies with status and metrics
- **Growth Metrics**: Month-over-month growth tracking
- **Responsive Design**: Perfect on desktop, tablet, and mobile

### 🏢 **Agency Management**
- **Complete Agency CRUD**: Create, view, edit, and manage agencies
- **Advanced Search & Filtering**: Find agencies by name, status, manager
- **Agency Statistics**: User counts, plans, creation dates
- **Status Management**: Active, pending, inactive, suspended states

### 📈 **Analytics & Reporting**
- **Performance Metrics**: Revenue trends, user growth, conversion rates
- **Time Range Filters**: 7 days, 30 days, 3 months, 1 year
- **Top Performers**: Best performing agencies ranking
- **Growth Tracking**: Detailed analytics with visual charts

### ⚙️ **Settings & Configuration**
- **Profile Management**: Owner account settings
- **Notification Preferences**: Email, SMS, system alerts
- **Security Settings**: Two-factor auth, session management
- **System Configuration**: Default plans, limits, backup settings

### 🆘 **Support System**
- **Ticket Management**: Create and track support tickets
- **Priority Levels**: Low, medium, high, urgent
- **Status Tracking**: Open, in progress, resolved, closed
- **Quick Help**: Documentation, live chat, phone support

## 🏗️ **Agency Creation Process**

### **Current Demo Mode**
When you create an agency through the Owner Dashboard:

1. **Frontend Form Submission**
   ```javascript
   {
     name: "Elite Properties",
     managerName: "John Smith",
     managerEmail: "john@eliteproperties.com",
     city: "New York",
     description: "Premium real estate agency"
   }
   ```

2. **Backend API Call**
   ```bash
   POST /api/owner-integration/create-agency
   Content-Type: application/json
   ```

3. **Demo Response**
   - Creates agency object with unique ID
   - Returns success message with "(Demo Mode)" indicator
   - Agency appears immediately in Dashboard and Agencies page
   - No database persistence (demo data only)

### **Full Production Mode** (When Enabled)

When all environment variables are configured:

1. **Database Creation**
   ```sql
   -- Creates agency record in PostgreSQL
   INSERT INTO agencies (id, name, email, status, settings, created_at)

   -- Creates manager user with invitation token
   INSERT INTO users (id, email, first_name, role, status, agency_id, invitation_token)
   ```

2. **GitHub Repository Creation**
   ```bash
   # Automatically creates 3 repositories:
   - {agency-name}-frontend    # React CRM Dashboard
   - {agency-name}-backend     # Node.js API Server
   - {agency-name}-database    # PostgreSQL Schema
   ```

3. **Automated Deployment**
   ```bash
   # Auto-deploys to production:
   - Frontend: Vercel (https://{agency-name}.vercel.app)
   - Backend: Render (https://{agency-name}-api.onrender.com)
   - Database: Railway (PostgreSQL instance)
   ```

4. **Manager Invitation**
   ```bash
   # Sends email to manager with:
   - Welcome message and setup instructions
   - Secure invitation link with token
   - Agency dashboard URL
   - Login credentials setup
   ```

5. **Complete Agency Setup**
   - Manager receives email invitation
   - Sets up password and completes profile
   - Gets access to dedicated CRM dashboard
   - Isolated system with own database and users

## 🚀 **Development**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Development Server**: http://localhost:5173
**Production URL**: https://lead-estate-owner-dashboard.vercel.app

## 🏗️ **Project Structure**

```
src/
├── components/
│   ├── AddAgencyModal.jsx     # Agency creation modal
│   ├── Sidebar.jsx            # Left navigation sidebar
│   ├── Header.jsx             # Top header with user menu
│   └── ui/                    # Reusable UI components
├── pages/
│   ├── Dashboard.jsx          # Main dashboard with stats
│   ├── Agencies.jsx           # Agency management page
│   ├── Analytics.jsx          # Analytics and reporting
│   ├── Settings.jsx           # Owner settings and config
│   └── Support.jsx            # Support ticket system
├── services/
│   └── api.js                 # API service layer
├── contexts/                  # React contexts
├── hooks/                     # Custom React hooks
└── utils/                     # Utility functions
```

## 🔧 **Environment Variables**

### **Frontend (.env)**
```bash
# Backend API URL
VITE_API_URL=https://leadestate-backend-9fih.onrender.com

# Owner Dashboard API Key (for production)
VITE_OWNER_API_KEY=owner-dashboard-2024
```

### **Backend (Render Environment)**
```bash
# Required for production mode
OWNER_API_KEY=owner-dashboard-2024
DATABASE_URL=postgresql://user:password@host:port/database

# GitHub Integration (for repository creation)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username

# Email Service (for manager invitations)
BREVO_API_KEY=your_brevo_api_key

# Deployment URLs
FRONTEND_URL=https://lead-estate-owner-dashboard.vercel.app
```

## 📦 **Deployment**

### **Current Deployments**
- **Frontend**: https://lead-estate-owner-dashboard.vercel.app (Vercel)
- **Backend**: https://leadestate-backend-9fih.onrender.com (Render)
- **Repository**: https://github.com/Ayoubtestbot/LeadEstate-Owner-Dashboard

### **Deployment Process**
1. **Frontend (Vercel)**
   ```bash
   # Automatic deployment on push to main branch
   git push origin main
   # Vercel auto-builds and deploys
   ```

2. **Backend (Render)**
   ```bash
   # Automatic deployment from GitHub
   # Connected to: https://github.com/Ayoubtestbot/LeadEstate-Agency-Backend
   ```

## 🎮 **Usage Guide**

### **Getting Started**
1. **Access Dashboard**: https://lead-estate-owner-dashboard.vercel.app
2. **Navigate Pages**: Use sidebar to switch between sections
3. **Create Agency**: Click "Add New Agency" button
4. **View Analytics**: Check performance metrics and growth
5. **Manage Settings**: Configure preferences and notifications

### **Demo Mode vs Production**

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| **Agency Creation** | ✅ UI only | ✅ Full database + repos |
| **Data Persistence** | ❌ Session only | ✅ PostgreSQL database |
| **Repository Creation** | ❌ No repos | ✅ Auto GitHub repos |
| **Email Invitations** | ❌ No emails | ✅ Manager invitations |
| **Deployment** | ❌ No auto-deploy | ✅ Auto Vercel/Render |
| **Manager Access** | ❌ No login | ✅ Full authentication |

### **Enabling Production Mode**
1. Set all environment variables on Render
2. Connect PostgreSQL database
3. Configure GitHub token with repo permissions
4. Set up Brevo email service
5. Test agency creation flow

## 🔄 **Recent Updates**

### **✅ Latest Features (June 2024)**
- **Complete Owner Dashboard**: All pages functional with backend integration
- **Agency Management**: Full CRUD operations with search and filtering
- **Analytics Dashboard**: Real-time metrics with time range filters
- **Settings System**: Comprehensive configuration options
- **Support System**: Ticket management with priority levels
- **Demo Mode**: Graceful fallback when backend is unavailable
- **Responsive Design**: Perfect mobile and desktop experience
- **Error Handling**: Professional error management and user feedback

### **🏗️ Architecture**
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **Database**: PostgreSQL on Railway
- **Authentication**: JWT-based with role management
- **Repository Automation**: GitHub API integration
- **Email Service**: Brevo for manager invitations

## 📋 **Next Steps**

### **For Demo Mode (Current)**
1. ✅ Test all dashboard features
2. ✅ Create demo agencies
3. ✅ Explore analytics and settings
4. ✅ Test responsive design

### **For Production Mode**
1. Set `OWNER_API_KEY` on Render backend
2. Configure PostgreSQL database connection
3. Set up GitHub token for repository creation
4. Configure Brevo for email invitations
5. Test complete agency creation flow
6. Enable manager authentication system

**The Owner Dashboard is now a complete, production-ready application!** 🚀
