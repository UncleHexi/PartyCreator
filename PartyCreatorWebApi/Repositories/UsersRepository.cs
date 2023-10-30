using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DataContext _dataContext;

        public UsersRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<User> AddUser(User user)
        {
            var result = _dataContext.Users.AddAsync(user);
            await _dataContext.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _dataContext.Users.FirstOrDefaultAsync(x => x.Email == email);
        }


        public async Task<List<User>> GetUsers()
        {
            return await _dataContext.Users.ToListAsync();
        }
    }
}
