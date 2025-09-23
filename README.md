## Om
Detta projekt är ett bokningssystem för ett coworkingcenter där man kan boka skrivbord, mötesrum, etc med realtidsuppdatering.

## Teknisk information
# Ramverk och bibliotek
- React
- Tailwind
- ASP.NET Core Web API
- MySQL
- SignalR 

# Annat
- Frontend körs på [http://localhost:5173](http://localhost:5173)
- Backend körs på [http://localhost:5296](http://localhost:5296)
- Använder RESTful API.
- Använder JWT-token för autentisering.

## Appbyggande
# Nödvändiga installationer
- .NET 8 eller 9
- Node.js & npm
- MySQL

# Databas
Skapa en SQL connection på localhost:3306.
Gå in på "appsettings.json" i backend-mappen.
I strängen "DefaultConnection", ändra "User" till din connections användarnamn och "Password" till din connections lösenord.

# Starta applikationen
```
cd backend
dotnet ef database update
dotnet run
```

```
cd frontend
npm install
npm run dev
```

## Endpoints
# Auth endpoints

**GET**
**/api/auth/health**

Returnerar statuskod 400 om API:et fungerar.

**POST**
**/api/auth/register**
Body:
string Email,
string FirstName,
string LastName,
string Password,
string ConfirmPassword

Skapar en ny användare med rollen "Member".

**POST**
**/api/auth/login**
Body:
string Email,
string Password

Loggar in användare och returnerar JWT-token.

**POST**
**api/auth/logout**

Loggar ut användare.

**GET**
**api/auth/profile**
Autentisering: Member

Returnerar hela objektet av användaren som loggar in.

**PUT**
**/api/auth/profile**
Autentisering: Member
Body:
string FirstName
string LastName

Ändrar FirstName och LastName av användaren som loggar in.

**POST**
**/api/auth/refresh-token**
Autentisering: Member
Body:
string Token

Uppdaterar och returnerar token.


# Booking endpoints

**GET**
**/api/bookings/**
Autentisering: Admin, Member

Returnerar alla bokningar.

**GET**
**/api/bookings/{bookingId}**
Autentisering: Admin, Member

Returnerar bokning som motsvarar id.

**GET**
**/api/bookings/myBookings**
Autentisering: Admin, Member
Body:
bool includeExpiredBookings (default är false)

Returnerar alla aktiva bokningar som tillhör användaren. Måste specificera om man vill inkludera inaktiva bokningar.

**GET**
**/api/bookings/getByResource/{resourceId}**
Autentisering: Admin, Member
Body:
bool includeExpiredBookings (default är false)

Returnerar alla aktiva bokningar som tillhör en resurs. Måste specificera om man vill inkludera inaktiva bokningar.

**POST**
**/api/bookings**
Autentisering: Admin, Member
Body:
int ResourceId
DateTime BookingTime
string Timeslot (måste vara "FM" eller "EF")

Skapar en bokning. Tiden på "BookingTime" ersätts av "8:00" eller "12:00" beroende på timeslot.

**PUT**
**/api/bookings**
Autentisering: Admin
Body:
int BookingId,
bool IsActive,
DateTime BookingDate,
DateTime EndDate,
string UserId,
int ResourceId

Uppdaterar bokning.

**POST**
**/api/bookings/cancel/{bookingId}**
Autentisering: Admin, Member

Tar bort bokning som motsvarar "bookingId".
Members kan bara ta bort sina egna bokningar och Admins kan ta bort vilken bokning som helst.
Bokningar som har gått ut kan inte tas bort.

**POST**
**/api/bookings/delete/{bookingId}**
Autentisering: Admin

Tar bort bokning.


# Resource endpoints

**GET**
**/api/bookings/resources**
Autentisering: Admin, Member

Returnerar alla resurser.

**GET**
**api/resources/{resourceId}**
Autentisering: Admin, Member

Returnerar resurs som motsvarar id.

**POST**
**api/resources**
Autentisering: Admin
Body:
int ResourceTypeId (1 = DropInDesk, 2 = MeetingRoom, 3 = VRset, 4 = AIserver),
string Name

Skapar en ny resurs.

**PUT**
**api/resources/{resourceId}**
Autentisering: Admin
Body:
int ResourceTypeId (1 = DropInDesk, 2 = MeetingRoom, 3 = VRset, 4 = AIserver),
string Name,
bool IsBooked

Uppdaterar resursen som motsvarar id.

**DELETE**
**api/resources/{resourceId}**
Autentisering: Admin

Tar bort resurs.
