using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace PartyCreatorWebApi.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Birthday { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = new byte[256];
        public byte[] PasswordSalt { get; set; } = new byte[256];

    }
}
