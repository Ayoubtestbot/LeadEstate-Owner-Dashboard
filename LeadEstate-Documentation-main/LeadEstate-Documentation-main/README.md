# LeadEstate Documentation

Complete documentation for the LeadEstate real estate CRM platform.

## 📚 Documentation Structure

### Setup Guides
- [System Requirements](docs/setup/requirements.md)
- [Local Development Setup](docs/setup/local-development.md)
- [Environment Configuration](docs/setup/environment.md)

### API Documentation
- [Authentication API](docs/api/authentication.md)
- [Leads API](docs/api/leads.md)
- [Properties API](docs/api/properties.md)
- [Analytics API](docs/api/analytics.md)

### Deployment Guides
- [Frontend Deployment](docs/deployment/frontend.md)
- [Backend Deployment](docs/deployment/backend.md)
- [Database Setup](docs/deployment/database.md)
- [Domain Configuration](docs/deployment/domains.md)

### User Guides
- [Agency Setup](docs/user-guides/agency-setup.md)
- [Lead Management](docs/user-guides/lead-management.md)
- [Property Management](docs/user-guides/property-management.md)
- [Team Management](docs/user-guides/team-management.md)

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Landing Page   │    │ Owner Dashboard │    │ Agency Frontend │
│   (Port 4000)   │    │   (Port 5000)   │    │   (Port 5001+)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Agency Backend  │
                    │   (Port 6001+)  │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

## 🚀 Quick Start

1. Clone all repositories
2. Follow setup guides for each component
3. Configure environment variables
4. Deploy to production platforms

## 📞 Support

For technical support and questions, please refer to the documentation or create an issue in the relevant repository.
