using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;
using System.Security.Claims;

namespace PartyCreatorWebApi.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UsersRepository(DataContext dataContext, IHttpContextAccessor httpContextAccessor)
        {
            _dataContext = dataContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<User> AddUser(User user)
        {
            var result = _dataContext.Users.AddAsync(user);
            await _dataContext.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var result = await _dataContext.Users.FirstOrDefaultAsync(x => x.Email == email);
            return result;
        }

        public string GetUserIdFromContext()
        {
            var result = string.Empty;
            if (_httpContextAccessor.HttpContext != null)
            {
                result = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            }
            return result;
        }

        public async Task<List<User>> GetUsers()
        {
            return await _dataContext.Users.ToListAsync();
        }
    }
}
