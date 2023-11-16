using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface INotificationRepository
    {
        Task<Notification> CreateNotification(Notification request);
        Task<List<Notification>> GetAllNotificationsOfUser(int id);
        Task<Notification> DeleteNotification(int id);
    }
}
