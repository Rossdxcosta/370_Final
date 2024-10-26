using Team04_API.Repositries;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using System.Text;
using Team04_API.Data;
using Team04_API.Models.Users;
using Team04_API.Models.Users.Role;
using Team04_API.Models.Email;
using Team04_API.Services.TestData;
using Quartz;
using Team04_API.Services;
using Team04_API.Models.DTOs.MessageDTO;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// This is used to give our db context access to our JWT
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContext<dataDbContext>(
    (serviceProvider, options) =>
    {
        //options.UseSqlServer(builder.Configuration.GetConnectionString("Data"));
        //Using this externally hosted database which will probably soon be on a environment
        options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL"));
    });

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});
//Add authentication to swagger ui
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorisation",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.OperationFilter<AuthenticationRequirementsOperationFilter>();
});

//Adding mail service 
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));

QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

//Adding the repos
builder.Services.AddTransient<IMailService, MailService>();
builder.Services.AddScoped<IPasswordHash, PasswordHash>();
builder.Services.AddScoped<IMethodsRepo, MethodsRepo>();
builder.Services.AddScoped<IUserMethods, UserMethods>();
builder.Services.AddScoped<IAnomalyDetection, AnomalyDetection>();
builder.Services.AddScoped<IChatMethods, ChatMethods>();
builder.Services.AddScoped<ILocationsMethods, LocationsMethods>();
builder.Services.AddScoped<IReportingMethod, ReportingMethods>();
builder.Services.AddScoped<ChatHub>();
builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());

builder.Services.AddSignalR();

//Will remove later
builder.Services.AddQuartz(options =>
{
    var jobkey = JobKey.Create(nameof(DetectAnomalyJob));
    options.UseMicrosoftDependencyInjectionJobFactory();
    options.AddJob<DetectAnomalyJob>(jobkey)
    .AddTrigger(trigger => trigger.ForJob(jobkey).WithSimpleSchedule(schedule => schedule.WithIntervalInMinutes(1).RepeatForever()));


});

builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});

// Background service for updating ticket statuses
builder.Services.AddHostedService<DetectBreach>();

builder.Services.AddScoped<SendReportJob>();
builder.Services.AddScoped<DynamicJobSchedulerService>();
builder.Services.AddScoped<ReportManagementService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(policy =>
    {
        policy.AllowAnyMethod()
           .AllowAnyHeader()
           .SetIsOriginAllowed(origin => true)
           .AllowCredentials();

    });
}
app.UseCors(policy =>
{
    policy.AllowAnyMethod()
       .AllowAnyHeader()
       .SetIsOriginAllowed(origin => true)
       .AllowCredentials();

});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chat");

using (var scope = app.Services.CreateScope())
{
    var jobScheduler = scope.ServiceProvider.GetRequiredService<DynamicJobSchedulerService>();

    // If you have any initial setup for the job scheduler, you can do it here
    // For example:
    // await jobScheduler.InitializeJobs();

    await jobScheduler.LoadAndScheduleReports();
}

app.Run();
