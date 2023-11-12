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
    }
}
