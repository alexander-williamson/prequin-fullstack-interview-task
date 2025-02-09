using FluentMigrator.Runner;
using FluentMigrator.Runner.Initialization;
using Microsoft.Extensions.DependencyInjection;

namespace migrations
{
    enum Mode
    {
        unknown = 0,
        up = 1,
        seed = 2,
        down = 3
    }

    class Program
    {
        static void Main(string[] args)
        {
            Mode mode = Mode.unknown;
            if (args.Length == 1)
            {
                switch (args[0])
                {
                    case "up":
                        mode = Mode.up;
                        break;
                    case "seed":
                        mode = Mode.seed;
                        break;
                    case "down":
                        mode = Mode.down;
                        break;
                }
            }

            if (mode == Mode.unknown)
            {
                throw new Exception("Invalid arguments passed to the application. Hint: Try running dotnet run \"up\" or \"down\".");
            }

            string[] tags = mode == Mode.seed || mode == Mode.down ? new[] { "seed" } : [];

            using (var serviceProvider = CreateServices(tags))
            using (var scope = serviceProvider.CreateScope())
            {
                switch (mode)
                {
                    case Mode.up:
                        UpdateDatabase(scope.ServiceProvider);
                        break;
                    case Mode.seed:
                        SeedDatabase(scope.ServiceProvider);
                        break;
                    case Mode.down:
                        RollbackEverything(scope.ServiceProvider);
                        break;
                    default:
                        throw new Exception("Unhandled mode");
                }
            }
        }

        private static ServiceProvider CreateServices(string[] tags)
        {
            return new ServiceCollection()
                 // Add common FluentMigrator services
                 .AddFluentMigratorCore()
                 .ConfigureRunner(rb => rb
                     // Add SQLite support to FluentMigrator
                     .AddMySql8()
                     // Set the connection string
                     .WithGlobalConnectionString("Server=127.0.0.1;Database=prequin;Uid=mysql_user;Pwd=1bTcWCQLGFRESiuRWlRE;")
                     // Define the assembly containing the migrations
                     .ScanIn(typeof(Program).Assembly).For.Migrations())
                 // Enable logging to console in the FluentMigrator way
                 .AddLogging(lb => lb.AddFluentMigratorConsole())
                // optional seed only
                .Configure<RunnerOptions>(opt =>
                {
                    opt.Tags = tags;
                })
                 // Build the service provider
                 .BuildServiceProvider(false);
        }

        private static void UpdateDatabase(IServiceProvider serviceProvider)
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            runner.MigrateUp();
        }

        private static void SeedDatabase(IServiceProvider serviceProvider)
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            runner.MigrateUp();
        }

        private static void RollbackEverything(IServiceProvider serviceProvider)
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            runner.MigrateDown(0);
        }
    }
}