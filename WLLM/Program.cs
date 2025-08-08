using System.Text.Json.Serialization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Mvc;
using UI.CSharpAttributes;
using CAPA_NEGOCIO.SystemConfig;
using BusinessLogic.BDConnection;
using WLLM.Hubs.MensajeriaNotificaciones;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.SignalR;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
#region CONFIGURACIONES PARA SOCKETS
builder.Services.AddSignalR();
builder.Services
	.AddSignalR()
	.AddHubOptions<ChatHub>(options =>
	{
		options.EnableDetailedErrors = true;
	}).AddJsonProtocol(options =>
	{
		// Desactivar camelCase
		options.PayloadSerializerOptions.PropertyNamingPolicy = null;
    });
    
// Registrar el proveedor de ID de usuario
builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
#endregion    
    
#region CONFIGURACIONES PARA API
builder.Services.AddControllers()
	.AddJsonOptions(JsonOptions => JsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null)// retorna los nombres reales de las propiedades
	.AddJsonOptions(options => options.JsonSerializerOptions.WriteIndented = false)// Desactiva la indentación
	.AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddResponseCompression(options =>
{
	options.EnableForHttps = true; // Activa la compresión también para HTTPS
	options.Providers.Add<GzipCompressionProvider>(); // Usar Gzip
	options.Providers.Add<BrotliCompressionProvider>(); // Usar Brotli (más eficiente)
});
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
	options.Level = System.IO.Compression.CompressionLevel.Fastest; // Puedes ajustar la compresión
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
	options.Level = System.IO.Compression.CompressionLevel.Fastest; // Nivel de compresión para Brotli
});
#endregion

builder.Services.AddControllersWithViews();
builder.Services.AddSession(options =>
{
	options.IdleTimeout = TimeSpan.FromMinutes(60);
});




var app = builder.Build();
new BDConnection().IniciarMainConecction(app.Environment.IsDevelopment());
SystemConfigImpl.IsDevelopment = app.Environment.IsDevelopment();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}
app.UseMiddleware<MemoryLoggingMiddleware>();

app.UseHttpsRedirection();

//app.UseWebOptimizer();
app.UseStaticFiles();
app.UseDefaultFiles();
app.UseResponseCompression(); // Usa la compresión en la aplicación
app.UseRouting();
app.UseAuthorization();
app.MapRazorPages();
app.MapControllers();

// 🔥 Liberar memoria antes de iniciar la aplicación
int requestCounter = 0;
const int requestThreshold = 100; // Ajusta el número de solicitudes antes de liberar memoria

// Mapear el Hub
// Habilitar sesión ANTES de SignalR
app.UseSession();

// Y al mapear el Hub, permite transporte con cookies/sesión
/*app.MapHub<ChatHub>("/chatHub", options =>
{
	options.Transports = HttpTransportType.WebSockets | HttpTransportType.LongPolling;
	options.LongPolling.PollTimeout = TimeSpan.FromSeconds(110);
});*/
app.MapHub<ChatHub>("/chatHub");


SystemConfigImpl.GetMediaAttachPath();
app.Use(async (context, next) =>
{
	Interlocked.Increment(ref requestCounter);

	await next(); // Ejecuta la petición

	if (requestCounter >= requestThreshold)
	{
		requestCounter = 0;
		GC.Collect();
		GC.WaitForPendingFinalizers();
	}
});

app.Run();
