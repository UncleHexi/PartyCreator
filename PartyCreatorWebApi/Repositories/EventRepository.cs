using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

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

        public Task<List<Event>> ListEventsJoinedByUser()
        {
            throw new NotImplementedException();
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

        public async Task<InviteList> GetInviteList(InviteList inviteList)
        {
            var result = await _dataContext.InviteLists.Where(i=> i.UserId == inviteList.UserId && i.EventId == inviteList.EventId).FirstOrDefaultAsync();
            return result;
        }

        public async Task<GuestList> GetGuestList(GuestList guestList)
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
    }
}
