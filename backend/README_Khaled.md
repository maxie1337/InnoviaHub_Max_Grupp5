# Innovia Hub Backend - Implementerade Steg

## Översikt

Detta dokument beskriver de steg som har implementerats i backend-delen av Innovia Hub

## Implementerade Funktioner

### 1. Konfigurera Entity Framework och MySQL Databas ✅

#### Vad som implementerades:

- Konfiguration av MySQL-anslutning i `appsettings.json`
- Upprättande av `ApplicationDbContext` för Entity Framework
- Skapande av första migration (`InitialCreate`)
- Uppdatering av databasen med EF Core

#### Tekniska detaljer:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=InnoviaHubDB;User=root;Password=1234;"
}
```

#### Filer som skapades/ändrades:

- `appsettings.json` - Databasanslutning
- `Data/ApplicationDbContext.cs` - DbContext-klass
- `Models/WeatherForecast.cs` - Grundmodell
- `Migrations/` - Databasmigrationer

---

### 2. Fixa Identity Core (medlemmar & admin) ✅

#### Vad som implementerades:

- Konfiguration av ASP.NET Core Identity
- Skapande av `ApplicationUser`-modell med anpassade fält
- Upprättande av rollbaserad autentisering (Member/Admin)
- Konfiguration av lösenordskrav och användarinställningar
- **Skapande av AuthController för användarhantering**
- **Skapande av AdminController för administrativa funktioner**
- **Implementering av DTOs för datatransfer**
- **Skapande av DbSeeder för initial databasdata**
- **Implementering av JWT Authentication med JwtTokenManager**
- **Health Check endpoint för API-status**

#### Tekniska detaljer:

```csharp
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = "Member";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
```

#### JWT Konfiguration:

```json
"Jwt": {
  "SecretKey": "YourSuperSecretKeyHere123!@#$%^&*()_InnoviaHub2025_SecureKey",
  "Issuer": "InnoviaHub",
  "Audience": "InnoviaHubUsers",
  "ExpirationMinutes": 60
}
```

#### Identity-konfiguration:

- Lösenordskrav: 8 tecken, versaler, gemener, siffror, specialtecken
- Unik e-postadress krävs
- E-postbekräftelse inte obligatorisk
- Token-providers för lösenordsåterställning
- JWT Bearer Authentication

#### Filer som skapades/ändrades:

- `Models/ApplicationUser.cs` - Användarmodell
- `Program.cs` - Identity och JWT-konfiguration
- `Data/ApplicationDbContext.cs` - Uppdaterad för Identity
- `Migrations/AddIdentity` - Identity-tabeller
- `Migrations/AddUpdatedAtField` - Uppdaterad användarmodell
- **`Controllers/AuthController.cs` - Användarautentisering med JWT**
- **`Controllers/AdminController.cs` - Administrativa funktioner**
- **`DTOs/AuthDtos.cs` - Data Transfer Objects**
- **`Data/DbSeeder.cs` - Databasinitialisering**
- **`Utils/JwtTokenManager.cs` - JWT Token-hantering**

---

## API Endpoints

### 🔐 Autentiseringsendpoints (`/api/auth`)

#### GET `/api/auth/health`

- **Beskrivning**: Kontrollera API-status (kräver ingen autentisering)
- **Response**: API-status och timestamp

#### POST `/api/auth/register`

- **Beskrivning**: Registrera en ny användare
- **Request Body**:

```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

- **Response**: Användarinformation och JWT token

#### POST `/api/auth/login`

- **Beskrivning**: Logga in användare
- **Request Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response**: Användarinformation och JWT token

#### POST `/api/auth/logout`

- **Beskrivning**: Logga ut användare
- **Authorization**: Kräver JWT token
- **Response**: Bekräftelse på utloggning

#### GET `/api/auth/profile`

- **Beskrivning**: Hämta användarprofil
- **Authorization**: Kräver JWT token
- **Response**: Användarinformation

#### PUT `/api/auth/profile`

- **Beskrivning**: Uppdatera användarprofil
- **Authorization**: Kräver JWT token
- **Request Body**:

```json
{
  "firstName": "string",
  "lastName": "string"
}
```

- **Response**: Uppdaterad användarinformation

#### POST `/api/auth/refresh-token`

- **Beskrivning**: Uppdatera JWT token
- **Request Body**:

```json
{
  "token": "string"
}
```

- **Response**: Ny JWT token

### ⚙️ Administrativa endpoints (`/api/admin`)

#### GET `/api/admin/users`

- **Beskrivning**: Hämta alla användare
- **Authorization**: Kräver JWT token med Admin-roll
- **Response**: Lista över alla användare

#### GET `/api/admin/users/{id}`

- **Beskrivning**: Hämta specifik användare
- **Authorization**: Kräver JWT token med Admin-roll
- **Parameters**: `id` - Användar-ID
- **Response**: Användarinformation

#### PUT `/api/admin/users/{id}/role`

- **Beskrivning**: Uppdatera användarroll
- **Authorization**: Kräver JWT token med Admin-roll
- **Parameters**: `id` - Användar-ID
- **Request Body**:

```json
{
  "role": "string"
}
```

- **Response**: Bekräftelse på uppdatering

#### PUT `/api/admin/users/{id}/status`

- **Beskrivning**: Uppdatera användarstatus
- **Authorization**: Kräver JWT token med Admin-roll
- **Parameters**: `id` - Användar-ID
- **Request Body**:

```json
{
  "isActive": "boolean"
}
```

- **Response**: Bekräftelse på uppdatering

#### GET `/api/admin/roles`

- **Beskrivning**: Hämta alla roller
- **Authorization**: Kräver JWT token med Admin-roll
- **Response**: Lista över alla roller

---

## Testdata

### Fördefinierade användare:

#### Admin-användare:

- **E-post**: `admin@innoviahub.com`
- **Lösenord**: `Admin123!`
- **Roll**: Admin

#### Medlemsanvändare:

- **E-post**: `member@innoviahub.com`
- **Lösenord**: `Member123!`
- **Roll**: Member

---

## Testgränssnitt

### HTML-testgränssnitt:

- **Fil**: `wwwroot/index.html`
- **Språk**: Svenska
- **Funktioner**: Testa alla API-endpoints med JWT Authentication
- **URL**: `http://localhost:5296`
- **Features**:
  - Health check utan autentisering
  - JWT token-hantering
  - Automatisk token-uppdatering
  - Rollbaserad åtkomst

---

## Databasstruktur

### Skapade tabeller:

1. **`__EFMigrationsHistory`** - Spårar databasmigrationer
2. **`AspNetUsers`** - Användarinformation med anpassade fält
3. **`AspNetRoles`** - Roller (Member/Admin)
4. **`AspNetUserRoles`** - Koppling mellan användare och roller
5. **`AspNetUserClaims`** - Användaranspråk
6. **`AspNetRoleClaims`** - Rollanspråk
7. **`AspNetUserLogins`** - Externa inloggningar
8. **`AspNetUserTokens`** - Användartokens

---

## Teknisk Stack

### Backend-ramverk:

- **ASP.NET Core 9.0** - Huvudramverk
- **Entity Framework Core 9.0** - ORM
- **MySQL** - Databas (via Pomelo.EntityFrameworkCore.MySql)
- **ASP.NET Core Identity** - Autentisering och auktorisering
- **JWT Bearer Authentication** - Stateless autentisering

### Paket som används:

```xml
<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="9.0.8" />
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="9.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.8" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.8" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.3.0" />
```

---

## Kommandon

### Bygga projektet:

```bash
dotnet build
```

### Skapa migration:

```bash
dotnet ef migrations add [MigrationName]
```

### Uppdatera databasen:

```bash
dotnet ef database update
```

### Köra projektet:

```bash
dotnet run
```

---

## Anslutningsinformation

- **Databas**: InnoviaHubDB
- **Server**: localhost
- **Användare**: root
- **Lösenord**: 1234
- **Port**: Standard MySQL (3306)
- **Backend URL**: `http://localhost:5296`
- **API Base**: `http://localhost:5296/api`

---

## Säkerhetsfunktioner

### Autentisering:

- Lösenordskrav: Minst 8 tecken
- Kräver versaler, gemener, siffror och specialtecken
- Unik e-postadress per användare
- JWT Bearer tokens med HMAC-SHA256-signering
- Token-expiration: 60 minuter (konfigurerbart)

### Auktorisering:

- Rollbaserad åtkomst (Admin/Member)
- Skyddade endpoints kräver giltig JWT token
- Admin-funktioner kräver Admin-roll
- Token-refresh funktionalitet

### JWT Konfiguration:

- **Secret Key**: Säker nyckel för token-signering
- **Issuer**: InnoviaHub
- **Audience**: InnoviaHubUsers
- **Expiration**: 60 minuter
- **Algorithm**: HMAC-SHA256

---

## Senaste Uppdateringar

### ✅ **Löst:**

- 400 Bad Request fel i Console
- 401 Unauthorized fel vid fristart
- Health check endpoint implementerad
- JWT Authentication fullt funktionell

### 🚀 **Nya Funktioner:**

- Health check utan autentisering
- Förbättrad felhantering
- Automatisk token-uppdatering
- Bättre användarupplevelse

---

_Senast uppdaterad: 2025-09-02_  
_Utvecklare: Khaled Khalosi_  
_Version: 2.0 - JWT Authentication_
