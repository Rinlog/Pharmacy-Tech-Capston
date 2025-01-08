using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using PharmPracticumBackend.DL;
using PharmPracticumBackend.Sanitization;

var builder = WebApplication.CreateBuilder(args);

// Setup configuration by loading from appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Register IConfiguration in the DI container
builder.Services.AddSingleton(builder.Configuration);

//CORS (local 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });

});

//other service registering

builder.Logging.AddConsole();
builder.Services.AddScoped<PharmDL>();
builder.Services.AddScoped<SanitizationClass>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOptions();
var app = builder.Build();

app.UseCors("AllowAll");

app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.Run();
