﻿using Azure.Core;
using PartyCreatorWebApi.Dtos;
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

        public async Task<List<Notification>> CreateNotificationToAllGuests(Notification notification)
        {
            var guests = await _dataContext.GuestLists.Where(x => x.EventId == notification.EventId).ToListAsync();
            List<Notification> results = new List<Notification>();

            foreach(GuestList guest in  guests)
            {
                notification.UserId= guest.UserId;
                await _dataContext.Notifications.AddAsync(notification);
                results.Add(notification);
            }
            await _dataContext.SaveChangesAsync();
            return results;
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

        public Task<List<NotificationDto>> GetAllNotificationsOfUser(int id)
        {
            var result = _dataContext.Notifications.Where(n => n.UserId == id)
                .Select(n=>new NotificationDto
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    Description = n.Description,
                    Type = n.Type,
                    IsRead = n.IsRead,
                    EventId = n.EventId,
                    EventTitle = _dataContext.Events.Where(e=>e.Id==n.EventId).Select(u=>u.Title).FirstOrDefault(),
                }).ToListAsync();
            
            return result;
        }

        public async Task<Notification> GetNotification(int id)
        {
            var result = await _dataContext.Notifications.FirstOrDefaultAsync(x => x.Id == id);
            return result;
        }

        public async Task<Notification> ToggleRead(Notification request)
        {
            request.IsRead = !request.IsRead;

            var result = _dataContext.Notifications.Update(request);
            await _dataContext.SaveChangesAsync();
            return result.Entity;
        }
    }
}
