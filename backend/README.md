# Innovia Hub Backend

## 🚀 Quick Start

### Prerequisites

- .NET 9.0 SDK
- MySQL Server 8.0.43

### Setup

1. **Clone the repository**
2. **Install MySQL** and create database `InnoviaHubDB`
3. **Copy** `appsettings.Development.example.json` to `appsettings.Development.json`
4. **Update** connection string with your MySQL password
5. **Run** the following commands:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

### Test

Open: http://localhost:5296

## 📚 Setup Instructions

See `README_Khaled.md` for detailed setup instructions in Swedish.

## 🔧 Current Status

- ✅ Entity Framework + MySQL configured
- ✅ Identity Core (Members & Admin) implemented
- ✅ JWT Authentication implemented
- ✅ Health Check endpoint added
- 🔄 Next: Resource entities and DTOs

## 🔐 Security Features

- **JWT Bearer Authentication** with HMAC-SHA256
- **Role-based Authorization** (Admin/Member)
- **Secure Password Requirements** (8+ chars, mixed case, numbers, symbols)
- **Token Expiration** (60 minutes, configurable)
- **Health Check** endpoint for API status

## 📁 Project Structure

```
backend/
├── Controllers/          # API Controllers (Auth, Admin)
├── Data/                # Database Context & Seeder
├── Models/              # Data Models (ApplicationUser)
├── DTOs/                # Data Transfer Objects
├── Utils/               # JWT Token Manager
├── Migrations/          # EF Migrations
├── wwwroot/             # Static files (HTML test interface)
└── Program.cs           # Main Program with JWT config
```

## 🆘 Need Help?

1. Check setup instructions in your preferred language
2. Review error logs
3. Ask the team

## 🔐 Security Note

- Never commit database passwords to Git
- Use `appsettings.Development.json` for local development
- The `.gitignore` file protects sensitive information
- JWT secret keys are configured in `appsettings.json`

## 👥 Development Team

**Innovia Hub - Group 5**

- **Adam Mattsson**
- **Johan Persson**
- **Khaled Khalosi**
- **Marinela-Adelheid Dragomir**
- **Max Lönnström**

---

**Project**: Innovia Hub  
**Last Updated**: 2025-09-02  
**Version**: 2.0 - JWT Authentication
