using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using ReviewAPI.Controllers;
using ReviewAPI.Models;
using System;
using System.Text;
using System.Threading.Tasks;

namespace ReviewAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private static async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var RoleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            foreach (var role in new[] { "Admin", "Member" })
                if (!await RoleManager.RoleExistsAsync(role))
                    await RoleManager.CreateAsync(new IdentityRole(role));
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(Startup));
            services.Configure<ApplicationSettings>(Configuration.GetSection("ApplicationSettings"));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(Configuration.GetConnectionString("IdentityConnection")).UseLazyLoadingProxies());
            services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<DatabaseContext>().AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequiredLength = 4;
            });

            services.AddCors();

            var key = Encoding.UTF8.GetBytes(Configuration["ApplicationSettings:JWT_Secret"]);
            var tokenValidationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = false,
                ClockSkew = TimeSpan.Zero
            };
            services.AddSingleton(tokenValidationParams);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.SaveToken = true;
                x.TokenValidationParameters = tokenValidationParams;
            });
            services.AddAuthorization(options =>
            {
                options.AddPolicy("SameUser", policy => policy.Requirements.Add(new SameUserRequirement()));
            });
            services.AddSingleton<IAuthorizationHandler, SameUserAuthorizationHandler>();

            services.AddControllers();

            services.AddSwaggerGen();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

            app.UseAuthentication();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                c.RoutePrefix = string.Empty;
            });

            app.UseRouting();

            app.Use(async (context, next) =>
            {
                await next.Invoke();
                if (context.GetEndpoint() == null)
                {
                    context.Response.ContentType = "application/json";
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new { message = $"Requested endpoint ({context.Request.GetEncodedUrl()}) was not found." }));
                }
                if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
                {
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new { message = "User token has expired or is non existent." }));
                }
                if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
                {
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(new { message = "User has no access to requested resource." }));
                }
            });

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            CreateRoles(serviceProvider).Wait();
        }
    }
}
