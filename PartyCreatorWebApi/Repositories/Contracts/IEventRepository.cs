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
        Task<InviteList> InviteToEvent(InviteList invitetList);
        Task<InviteList> GetInviteList(InviteList inviteList);
        Task<GuestList> GetGuestList(GuestList guestList);
        Task<InviteList> DeleteInvite(int id);
        Task<GuestList> AddToGuestList(GuestList guestList);

    }
}
