using Microsoft.EntityFrameworkCore;
using TodoBlazorServer.Data;
using TodoBlazorServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// Configure Entity Framework Core with SQLite
builder.Services.AddDbContextFactory<TodoContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add TodoService
builder.Services.AddScoped<TodoService>();

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<TodoContext>>();
    using var context = contextFactory.CreateDbContext();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
