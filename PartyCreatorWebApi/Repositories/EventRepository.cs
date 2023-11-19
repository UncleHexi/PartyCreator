using Microsoft.EntityFrameworkCore;
using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;
using System.Transactions;

namespace PartyCreatorWebApi.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly DataContext _dataContext;

        public EventRepository(DataContext dataContext)
        {
            _dataContext = dataContext;

        }

        public async Task<Event> CreateEvent(Event _event)
        {
            var result = _dataContext.Events.AddAsync(_event);
            await _dataContext.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<List<Event>> ListEventsJoinedByUser(int userId)
        {
            var events = await _dataContext.Events
               .Where(e => _dataContext.GuestLists.Any(gl => gl.UserId == userId && gl.EventId == e.Id))
               .ToListAsync();

            return events;
        }

        public async Task<List<Event>> ListEventsMadeByUser(int creatorId)
        {
            var result = await _dataContext.Events.Where(x=> x.CreatorId == creatorId).ToListAsync();
            return result;
        }

        public async Task<Event> GetEventDetails(int id)
        {
            var eventDetails = await _dataContext.Events.FirstOrDefaultAsync(e => e.Id == id);
            return eventDetails;
        }

        public async Task<InviteList> InviteToEvent(InviteList inviteList)
        {
            var result = _dataContext.InviteLists.AddAsync(inviteList);
            await _dataContext.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<InviteList> CheckInviteList(InviteList inviteList)
        {
            var result = await _dataContext.InviteLists.Where(i=> i.UserId == inviteList.UserId && i.EventId == inviteList.EventId).FirstOrDefaultAsync();
            return result;
        }

        public async Task<GuestList> CheckGuestList(GuestList guestList)
        {
            var result = await _dataContext.GuestLists.Where(i => i.UserId == guestList.UserId && i.EventId == guestList.EventId).FirstOrDefaultAsync();
            return result;
        }

        public async Task<InviteList> DeleteInvite(int id)
        {
            var result = await _dataContext.InviteLists.FirstOrDefaultAsync(i => i.Id == id);
            if(result != null)
            {
                _dataContext.InviteLists.Remove(result);
                await _dataContext.SaveChangesAsync();
                return result;
            }
            return null;
        }

        public async Task<GuestList> AddToGuestList(GuestList guestList)
        {
            var result = await _dataContext.GuestLists.AddAsync(guestList);
            await _dataContext.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<List<Event>> ListFinishedEvents(int userId)
        {
            var finishedEventsCreatedByUser = await _dataContext.Events
                .Where(e => e.CreatorId == userId && e.DateTime < DateTime.Now)
                .ToListAsync();

            var finishedEventsAsGuest = await _dataContext.Events
                .Where(e => _dataContext.GuestLists.Any(gl => gl.UserId == userId && gl.EventId == e.Id) && e.DateTime < DateTime.Now)
                .ToListAsync();

            var allFinishedEvents = finishedEventsCreatedByUser.Concat(finishedEventsAsGuest).ToList();

            // Sortuj wszystkie zakończone wydarzenia od najnowszego do najstarszego
            var sortedFinishedEvents = allFinishedEvents.OrderByDescending(e => e.DateTime).ToList();

            return sortedFinishedEvents;
        }

        public async Task<List<GuestList>> GetGuestsFromEvent(int id)
        {
            var result = await _dataContext.GuestLists.Where(x => x.EventId == id).ToListAsync();
            return result;
        }

        public async Task<List<AllGuestList>> GetAllGuestsList(int eventId)
        {
            var guestIdList = await _dataContext.GuestLists.Where(g => g.EventId == eventId).Select(g => g.UserId).ToListAsync();
            var inviteIdList = await _dataContext.InviteLists.Where(i => i.EventId == eventId).Select(i => i.UserId).ToListAsync();
            var guestList = await _dataContext.Users.Where(u => guestIdList.Contains(u.Id)).Select(u => new AllGuestList { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName}).ToListAsync();
            var sortedGuestList = guestList.OrderBy(g => g.LastName).ToList();
            var inviteList = await _dataContext.Users.Where(u => inviteIdList.Contains(u.Id)).Select(u => new AllGuestList { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName }).ToListAsync();
            var sortedInviteList = inviteList.OrderBy(g => g.LastName).ToList();
            sortedGuestList.AddRange(sortedInviteList);
            return sortedGuestList;
        }

        public async Task<List<AllGuestList>> GetGuestsUsers(int eventId)
        {
            var guestIdList = await _dataContext.GuestLists.Where(g => g.EventId == eventId).Select(g => g.UserId).ToListAsync();
            var guestList = await _dataContext.Users.Where(u => guestIdList.Contains(u.Id)).Select(u => new AllGuestList { Id = u.Id ,FirstName = u.FirstName, LastName = u.LastName }).ToListAsync();
            var sortedGuestList = guestList.OrderBy(g => g.LastName).ToList();
            return sortedGuestList;
        }

        public async Task<List<AllGuestList>> GetInvitedUsers(int eventId)
        {
            var inviteIdList = await _dataContext.InviteLists.Where(i => i.EventId == eventId).Select(i => i.UserId).ToListAsync();
            var inviteList = await _dataContext.Users.Where(u => inviteIdList.Contains(u.Id)).Select(u => new AllGuestList { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName }).ToListAsync();
            var sortedInviteList = inviteList.OrderBy(g => g.LastName).ToList();
            return sortedInviteList;
        }
    }
}
