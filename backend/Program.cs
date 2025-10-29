using backend.Controllers;
using backend.Data;
using backend.Hubs;
using backend.Mapping;
using backend.Middleware;
using backend.Models;
using backend.Repositories;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

builder.Services.AddOpenApi();

builder.Configuration
    .AddEnvironmentVariables();


// Add services to the container.
builder.Services.AddScoped<IResourceRepository, ResourceRepository>();
builder.Services.AddScoped<IResourceService, ResourceService>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IAdminService, AdminService>();

//Creating a service to get responses, new authorization and parse of apikey to json
builder.Services.AddHttpClient("openai", client =>
{
    client.BaseAddress = new Uri("https://api.openai.com/v1/responses");
    var apiKey = Environment.GetEnvironmentVariable("OPEN_API_KEY");

    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    client.DefaultRequestHeaders.Accept.ParseAdd("application/json");

});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();

// Add Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null
            );
        }
    );
});

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(ResourceMappingProfile));

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"] ?? "")),
        ClockSkew = TimeSpan.Zero
    };
});


// Cors implementation for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",    // development
            "https://innoviahubb.netlify.app"   // production
            )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add Authorization
builder.Services.AddAuthorization();

// Add SignalR
// If connection string is provided in Azure use Azure SignalR Service.
// Otherwise use the normal in-process SignalR (so local dev keeps working).
var azureSignalRConnection = builder.Configuration["Azure:SignalR:ConnectionString"];

if (!string.IsNullOrEmpty(azureSignalRConnection))
{
    // You can pass the connection string explicitly or let the SDK read the env var.
    builder.Services.AddSignalR()
           .AddAzureSignalR(options => options.ConnectionString = azureSignalRConnection);
}
else
{
    builder.Services.AddSignalR();
}

// Add JWT Token Manager
builder.Services.AddScoped<IJwtTokenManager, JwtTokenManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Add middleware
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseCors("FrontendPolicy");

app.MapHub<BookingHub>("/bookingHub").RequireCors("FrontendPolicy");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers().RequireCors("FrontendPolicy");
app.Run();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    await DbSeeder.SeedRolesAndUsersAsync(roleManager, userManager);
}
