using CourseManagementAPI.Auth;
using CourseManagementAPI.Data;
using CourseManagementAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

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
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = jwtSettings?.Issuer,
        ValidAudience = jwtSettings?.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.Secret ?? string.Empty))
    };
});

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Course Management API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app root
});

app.UseStaticFiles();
app.UseCors(policy => policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
                          .AllowAnyHeader()
                          .AllowAnyMethod());

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed data for basic testing
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    var existingStudent = context.Users.FirstOrDefault(u => u.Username == "student1");
    if (existingStudent != null) {
        existingStudent.Password = "student123";
    }

    if (!context.Users.Any())
    {
        var admin = new CourseManagementAPI.Models.User { Username = "admin", Password = "admin123", Role = "Admin" };
        var instructor = new CourseManagementAPI.Models.User { Username = "instructor1", Password = "instructor123", Role = "Instructor" };
        var student = new CourseManagementAPI.Models.User { Username = "student1", Password = "student123", Role = "Student" };
        
        context.Users.AddRange(new[] { admin, instructor, student });
        context.SaveChanges();

        context.Courses.AddRange(new[]
        {
            new CourseManagementAPI.Models.Course { Title = "Introduction to Web Development", InstructorId = admin.Id, Status = "Active" },
            new CourseManagementAPI.Models.Course { Title = "Mobile App Design", InstructorId = admin.Id, Status = "Active" },
            new CourseManagementAPI.Models.Course { Title = "Advanced C# Programming", InstructorId = instructor.Id, Status = "Active" }
        });
        context.SaveChanges();
    }
}

app.Run();