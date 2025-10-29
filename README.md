# Om
Detta projekt är ett bokningssystem för ett coworkingcenter där man kan boka skrivbord, mötesrum, etc med realtidsuppdatering.
Utöver detta så finns det en AI chatbot för bokning att ta hjälp av, och även IoT implementeringar för att ha koll på temperatur i de olika rummen på anläggningen.

# Teknisk information
## Ramverk och bibliotek
- React
- Tailwind
- ASP.NET Core Web API
- MySQL
- SignalR 

## Annat
- Frontend körs på [http://localhost:5173](http://localhost:5173)
- Backend körs på [http://localhost:5296](http://localhost:5296)
- Använder RESTful API.
- Använder JWT-token för autentisering.

# Appbyggande
## Nödvändiga installationer
- .NET 8 eller 9
- Node.js & npm
- MySQL

## Databas
- Skapa en SQL connection på localhost:3306.
- Gå in på "appsettings.json" i backend-mappen.
- I strängen "DefaultConnection", ändra "User" till din connections användarnamn och "Password" till din connections lösenord.
- Sätt en secretkey till minst 32 tecken.

## Env filer
För att projektet ska fungera att köra så måste du ha en .env fil i backenden med en api nyckel från OpenAI.  

- Skapa en .env fil i roten av backenden, där csproj ligger. I .env filen så gör du följande:  
- OPEN_API_KEY="DIN OPEN AI NYCKEL"

I frontenden så behöver du också två olika .env filer. Du behöver en .env för produktion, och en .env.development för att köra projektet i dev läge lokalt.  

- Skapa en .env fil och en .env.development fil i roten av frontendmappen. I .env filerna gör du följande:  
- .env: VITE_API_BASE_URL=DIN_PRODUKTIONS_URL  
- .env.development: VITE_API_BASE_URL=http://localhost:5296  


## Starta applikationen
```
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

```
cd frontend
npm install
npm run dev
```

## Användare
För att boka måste du logga in. <br />
Du kan skapa en ny användare eller logga in med admin kontot. <br />
Admins kan använda admin tools genom att gå in på [http://localhost:5173/admin](http://localhost:5173/admin) <br />

**Admin konto:** <br />
**E-post: admin@innoviahub.com**, <br />
**Lösenord: Admin123!**

## Egna funktioner  
De funktioner som jag har utvecklat vidare själv är:  
- AI Chatbot  
- IoT implementering av temperatur enheter

# Endpoints
<details>

<summary> Authentication endpoints </summary> 

**GET**
**/api/auth/health**

Returnerar statuskod 400 om API:et fungerar.

**POST**
**/api/auth/register** <br />
Body: <br />
string Email, <br />
string FirstName, <br />
string LastName, <br />
string Password, <br />
string ConfirmPassword

Skapar en ny användare med rollen "Member".

**POST**
**/api/auth/login** <br />
Body: <br /> 
string Email, <br /> 
string Password 

Loggar in användare och returnerar JWT-token.

**POST**
**api/auth/logout**

Loggar ut användare.

**GET**
**api/auth/profile** <br />
Autentisering: Member

Returnerar hela objektet av användaren som loggar in.

**PUT**
**/api/auth/profile** <br />
Autentisering: Member <br />
Body: <br />
string FirstName <br /> 
string LastName 

Ändrar FirstName och LastName av användaren som loggar in.

**POST**
**/api/auth/refresh-token** <br />
Autentisering: Member <br />
Body: <br />
string Token

Uppdaterar och returnerar token.

</details>

<details>

<summary> Booking endpoints </summary> 


**GET**
**/api/bookings/** <br />
Autentisering: Admin, Member <br />

Returnerar alla bokningar.

**GET**
**/api/bookings/{bookingId}** <br />
Autentisering: Admin, Member

Returnerar bokning som motsvarar id.

**GET**
**/api/bookings/myBookings** <br />
Autentisering: Admin, Member <br />
Body: <br />
bool includeExpiredBookings (default är false)

Returnerar alla aktiva bokningar som tillhör användaren. Måste specificera om man vill inkludera inaktiva bokningar.

**GET**
**/api/bookings/getByResource/{resourceId}** <br />
Autentisering: Admin, Member <br />
Body: <br />
bool includeExpiredBookings (default är false)

Returnerar alla aktiva bokningar som tillhör en resurs. Måste specificera om man vill inkludera inaktiva bokningar.

**POST**
**/api/bookings** <br />
Autentisering: Admin, Member <br />
Body: <br /> 
int ResourceId <br /> 
DateTime BookingTime <br />
string Timeslot (måste vara "FM" eller "EF")

Skapar en bokning. Tiden på "BookingTime" ersätts av "8:00" eller "12:00" beroende på timeslot.

**PUT**
**/api/bookings** <br /> 
Autentisering: Admin <br />
Body: <br />
int BookingId, <br />
bool IsActive, <br /> 
DateTime BookingDate, <br />
DateTime EndDate, <br />
string UserId, <br />
int ResourceId

Uppdaterar bokning.

**POST**
**/api/bookings/cancel/{bookingId}** <br />
Autentisering: Admin, Member <br />

Tar bort bokning som motsvarar "bookingId". <br />
Members kan bara ta bort sina egna bokningar och Admins kan ta bort vilken bokning som helst. <br />
Bokningar som har gått ut kan inte tas bort.

**POST**
**/api/bookings/delete/{bookingId}** <br />
Autentisering: Admin

Tar bort bokning.

</details>

<details>

<summary> Resource endpoints </summary> 

**GET**
**/api/bookings/resources** <br />
Autentisering: Admin, Member

Returnerar alla resurser.

**GET**
**api/resources/{resourceId}** <br />
Autentisering: Admin, Member

Returnerar resurs som motsvarar id.

**POST**
**api/resources** <br />
Autentisering: Admin <br />
Body: <br />
int ResourceTypeId (1 = DropInDesk, 2 = MeetingRoom, 3 = VRset, 4 = AIserver), <br />
string Name

Skapar en ny resurs.

**PUT**
**api/resources/{resourceId}** <br />
Autentisering: Admin <br />
Body: <br />
int ResourceTypeId (1 = DropInDesk, 2 = MeetingRoom, 3 = VRset, 4 = AIserver), <br />
string Name, <br />
bool IsBooked

Uppdaterar resursen som motsvarar id.

**DELETE**
**api/resources/{resourceId}** <br />
Autentisering: Admin

Tar bort resurs.

</details>
