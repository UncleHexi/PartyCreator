using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly DataContext _dataContext;

        public NotificationRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<Notification> CreateNotification(Notification request)
        {
            var result = _dataContext.Notifications.AddAsync(request);
            await _dataContext.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<Notification> DeleteNotification(int id)
        {
            var result = await _dataContext.Notifications.FirstOrDefaultAsync(x => x.Id == id);
            if(result != null)
            {
                _dataContext.Notifications.Remove(result);
                await _dataContext.SaveChangesAsync();
                return result;
            }
            return null;
        }

        public Task<List<Notification>> GetAllNotificationsOfUser(int id)
        {
            var result = _dataContext.Notifications.Where(n => n.UserId == id).ToListAsync();
            return result;
        }
    }
}
