# 🏢 LeadEstate Owner Dashboard

A comprehensive **Owner Dashboard** for managing multiple real estate agencies in the LeadEstate CRM ecosystem. This dashboard provides complete oversight and management capabilities for agency owners to monitor, configure, and scale their real estate operations.

## 🌟 Features

### 📊 **Dashboard Overview**
- **Real-time Analytics** - Live agency performance metrics
- **System Health Monitoring** - Database, server, and application status
- **Quick Actions** - Fast access to common management tasks
- **Growth Metrics** - Agency growth rates and user statistics

### 🏢 **Agency Management**
- **Complete CRUD Operations** - Create, Read, Update, Delete agencies
- **Billing & Plan Management** - Comprehensive subscription and pricing control
- **Manager Administration** - Agency manager account management
- **Status Control** - Activate/deactivate agencies
- **Bulk Operations** - Manage multiple agencies efficiently

### 💳 **Billing System**
- **Multiple Plans** - Basic ($49), Standard ($99), Premium ($199), Enterprise ($399)
- **Custom Pricing** - Flexible pricing for enterprise clients
- **Billing Cycles** - Monthly, Quarterly (5% discount), Yearly (10% discount)
- **Payment Methods** - Credit Card, Bank Transfer, PayPal, Invoice
- **Tax Management** - Tax ID and VAT number support
- **Billing History** - Complete billing and payment tracking

### 📈 **Analytics & Reporting**
- **Time Range Filtering** - 7-day, 30-day analytics views
- **Performance Metrics** - Agency performance and user engagement
- **Export Functionality** - CSV export for detailed analysis
- **Growth Tracking** - New agencies, user growth, revenue metrics
- **Visual Charts** - Interactive charts and graphs

### ⚙️ **Settings Management**
- **Company Configuration** - Name, email, phone, timezone settings
- **Notification Preferences** - Email, SMS, push notification controls
- **Security Settings** - 2FA, session timeout, password policies
- **API Configuration** - Rate limits, webhook URLs, API keys
- **System Preferences** - Language, theme, and display options

### 🎫 **Support System**
- **Ticket Management** - Create and track support tickets
- **Priority Levels** - High, medium, low priority classification
- **Category Organization** - Technical, general, billing categories
- **FAQ System** - Dynamic FAQ management
- **Contact Integration** - Direct communication channels

## 🚀 Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client for API communication

### **Backend Integration**
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Robust relational database
- **RESTful APIs** - Complete API coverage for all features
- **Real-time Updates** - Live data synchronization

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Access to LeadEstate Backend API

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/Ayoubtestbot/LeadEstate-Owner-Dashboard.git

# Navigate to project directory
cd LeadEstate-Owner-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Environment Configuration**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://leadestate-backend-9fih.onrender.com
VITE_OWNER_API_KEY=owner-dashboard-2024
```

## 📡 API Integration

### **Backend Endpoints**
All frontend functionality is backed by comprehensive API endpoints:

#### **Agency Management**
- `GET /api/owner-integration/agencies` - List all agencies
- `POST /api/owner-integration/create-agency` - Create new agency
- `PUT /api/owner-integration/agencies/:id` - Update agency
- `DELETE /api/owner-integration/agencies/:id` - Delete agency
- `PUT /api/owner-integration/agency/:id/status` - Update status

#### **Analytics & Monitoring**
- `GET /api/owner-integration/analytics` - Analytics data
- `GET /api/owner-integration/dashboard/stats` - Dashboard statistics
- `GET /api/owner-integration/system/health` - System health

#### **Settings & Configuration**
- `GET /api/owner-integration/settings` - Get settings
- `PUT /api/owner-integration/settings` - Update settings

#### **Support System**
- `POST /api/owner-integration/support/tickets` - Submit ticket
- `GET /api/owner-integration/support/tickets` - Get tickets
- `GET /api/owner-integration/support/faqs` - Get FAQs

## 🔐 Security Features

- **API Key Authentication** - Secure API access control
- **Input Validation** - Comprehensive data validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CORS Configuration** - Cross-origin request security

## 📱 Responsive Design

- **Mobile-First** - Optimized for mobile devices
- **Tablet Support** - Perfect tablet experience
- **Desktop Optimized** - Full desktop functionality
- **Cross-Browser** - Compatible with all modern browsers

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Deploy to Vercel
vercel --prod
```

### **Manual Deployment**
```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 🔄 Development Workflow

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Project Structure**
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the LeadEstate CRM ecosystem. All rights reserved.

## 🆘 Support

For support and questions:
- **Email**: support@leadestate.com
- **Documentation**: [LeadEstate Docs](https://docs.leadestate.com)
- **GitHub Issues**: [Report Issues](https://github.com/Ayoubtestbot/LeadEstate-Owner-Dashboard/issues)

## 🎯 Key Features Breakdown

### **Agency Creation & Management**
- **Smart Agency Setup** - Automated repository creation for each agency
- **Manager Account Generation** - Automatic manager user creation with email notifications
- **Billing Integration** - Complete billing setup during agency creation
- **Resource Allocation** - Configurable user, lead, and property limits
- **Multi-tenant Architecture** - Isolated data and configurations per agency

### **Advanced Billing Features**
- **Dynamic Pricing** - Real-time price calculation with discounts
- **Billing Cycle Management** - Flexible monthly, quarterly, yearly cycles
- **Custom Enterprise Pricing** - Tailored pricing for large clients
- **Payment Method Flexibility** - Multiple payment options
- **Tax Compliance** - VAT/Tax ID management
- **Billing History** - Complete audit trail

### **Comprehensive Analytics**
- **Real-time Metrics** - Live agency performance data
- **Growth Analytics** - Agency growth rates and trends
- **User Engagement** - Active user tracking and statistics
- **Revenue Tracking** - Billing and revenue analytics
- **Export Capabilities** - CSV export for external analysis
- **Time-based Filtering** - Customizable date ranges

### **Professional Support System**
- **Ticket Management** - Full support ticket lifecycle
- **Priority Classification** - Urgent, high, medium, low priorities
- **Category Organization** - Technical, billing, general categories
- **FAQ Management** - Dynamic FAQ system
- **Response Tracking** - Ticket status and response monitoring

## 🔧 Technical Architecture

### **Frontend Architecture**
- **Component-Based** - Modular, reusable React components
- **State Management** - React hooks for state management
- **API Integration** - Centralized API service layer
- **Error Handling** - Comprehensive error handling and user feedback
- **Loading States** - Smooth loading indicators and skeleton screens
- **Responsive Design** - Mobile-first responsive layout

### **Backend Integration**
- **RESTful APIs** - Complete REST API coverage
- **Database Persistence** - PostgreSQL for reliable data storage
- **Real-time Updates** - Live data synchronization
- **Error Recovery** - Graceful error handling and fallbacks
- **Security** - API key authentication and input validation
- **Performance** - Optimized queries and caching

### **Database Schema**
- **Agencies Table** - Complete agency information and settings
- **Users Table** - Manager and user account management
- **Billing Data** - Comprehensive billing and subscription data
- **Support System** - Tickets, FAQs, and support data
- **Analytics Data** - Performance metrics and statistics

## 🚀 Production Deployment

### **Current Deployment**
- **Frontend**: Deployed on Vercel with automatic GitHub integration
- **Backend**: Deployed on Render with PostgreSQL database
- **Database**: Railway PostgreSQL with automated backups
- **CDN**: Global content delivery for optimal performance

### **Environment Variables**
```env
# Production Configuration
VITE_API_BASE_URL=https://leadestate-backend-9fih.onrender.com
VITE_OWNER_API_KEY=owner-dashboard-2024
VITE_ENVIRONMENT=production
```

### **Performance Optimizations**
- **Code Splitting** - Lazy loading for optimal bundle size
- **Image Optimization** - Compressed and optimized images
- **Caching Strategy** - Efficient browser and API caching
- **Bundle Analysis** - Regular bundle size monitoring
- **Performance Monitoring** - Real-time performance tracking

## 📊 Monitoring & Analytics

### **System Monitoring**
- **Health Checks** - Automated system health monitoring
- **Performance Metrics** - Response time and throughput tracking
- **Error Tracking** - Comprehensive error logging and alerts
- **Uptime Monitoring** - 99.9% uptime target with alerts

### **Business Analytics**
- **Agency Growth** - New agency acquisition tracking
- **User Engagement** - Active user and session analytics
- **Revenue Metrics** - Billing and revenue performance
- **Support Analytics** - Ticket volume and resolution times

## 🔒 Security & Compliance

### **Security Measures**
- **API Authentication** - Secure API key-based authentication
- **Data Encryption** - Encrypted data transmission and storage
- **Input Validation** - Comprehensive input sanitization
- **SQL Injection Prevention** - Parameterized database queries
- **XSS Protection** - Cross-site scripting prevention
- **CORS Security** - Proper cross-origin request handling

### **Data Privacy**
- **GDPR Compliance** - European data protection compliance
- **Data Minimization** - Only necessary data collection
- **User Consent** - Clear consent mechanisms
- **Data Retention** - Defined data retention policies
- **Right to Deletion** - User data deletion capabilities

## 🎨 UI/UX Features

### **Design System**
- **Consistent Styling** - Unified design language
- **Accessibility** - WCAG 2.1 AA compliance
- **Dark/Light Mode** - Theme switching capability
- **Responsive Grid** - Flexible grid system
- **Icon Library** - Comprehensive Lucide icon set

### **User Experience**
- **Intuitive Navigation** - Clear and logical navigation
- **Fast Loading** - Optimized for quick page loads
- **Error Feedback** - Clear error messages and guidance
- **Success Notifications** - Positive feedback for actions
- **Keyboard Navigation** - Full keyboard accessibility

---

**🏆 LeadEstate Owner Dashboard - Empowering Real Estate Success**

*Built with modern technologies and best practices for scalable real estate management*
