using Microsoft.EntityFrameworkCore;
using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
