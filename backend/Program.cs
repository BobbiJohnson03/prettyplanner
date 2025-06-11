using FluentValidation;
using FluentValidation.AspNetCore;
using GoalTracker.API.Models;
using GoalTracker.API.Services;
using GoalTracker.API.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc; // Required for ValidationProblemDetails, BadRequestObjectResult, StatusCodes
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Load configuration sections
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var mongoDBSettings = builder.Configuration.GetSection("MongoDB");

// Add services to the container
builder.Services.Configure<MongoDBSettings>(mongoDBSettings);

// Register application services
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<GoalService>();
builder.Services.AddSingleton<CategoryService>();
builder.Services.AddSingleton<KanbanTaskService>();
builder.Services.AddSingleton<NotificationService>();
builder.Services.AddSingleton<SummaryService>();

// Configure controllers with FluentValidation and API behavior options
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<Program>();
        fv.AutomaticValidationEnabled = true;
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    })
    // --- START: Added configuration for detailed API validation responses ---
    .ConfigureApiBehaviorOptions(options =>
    {
        // This delegate is invoked when model state is invalid.
        // We're overriding the default behavior to return a more consistent and parsable
        // ValidationProblemDetails object, which includes detailed validation errors.
        options.InvalidModelStateResponseFactory = context =>
        {
            var problemDetails = new ValidationProblemDetails(context.ModelState)
            {
                // Set the status code to 400 Bad Request
                Status = StatusCodes.Status400BadRequest,
                // Provide a standard RFC 7807 type URI for validation errors
                Type = "https://tools.ietf.org/html/rfc7807#section-3.1",
                // A general detail message
                Detail = "One or more validation errors occurred."
            };

            // Return a BadRequestObjectResult with the problem details
            return new BadRequestObjectResult(problemDetails);
        };
    });
    // --- END: Added configuration ---

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "GoalTracker API", Version = "v1" });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Secret"]!)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GoalTracker API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();