using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface IEventRepository
    {
        Task<Event> CreateEvent(Event _event);
        Task<List<Event>> ListEventsMadeByUser(int creatorId);
        Task<List<Event>> ListEventsJoinedByUser(int userId);
        Task<Event> GetEventDetails(int id);


    }
}
