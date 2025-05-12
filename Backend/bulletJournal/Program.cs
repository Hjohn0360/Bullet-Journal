using MongoDB.Driver;
using MongoDB.Bson;
using Backend.bulletJournal.Models;
using Backend.bulletJournal.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure MongoDB
const string connectionUri = "mongodb+srv://hjohnfitz306:Int3r3ssantW04nung@cluster0.wwse2qd.mongodb.net/";
var settings = MongoClientSettings.FromConnectionString(connectionUri);
settings.ServerApi = new ServerApi(ServerApiVersion.V1);

// Register MongoDB client
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(settings));

// Register MongoDB database
builder.Services.AddScoped(sp => 
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("Cluster0"); // Replace with your database name
});

builder.Services.AddScoped<UserService>();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Test MongoDB connection
using (var scope = app.Services.CreateScope())
{
    var client = scope.ServiceProvider.GetRequiredService<IMongoClient>();
    try
    {
        var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
        Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to connect to MongoDB: {ex.Message}");
    }
}

app.Run();