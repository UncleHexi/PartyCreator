using Microsoft.EntityFrameworkCore;
using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FirstName = "admin",
                LastName = "admin",
                Email = "admin@admin.pl",
                Birthday = "01.01.2000",
                Description = "Admin",
                PasswordHash = new byte[256],
                PasswordSalt = new byte[256]
            });
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Notification> Notifications { get; set; }
    }
}
