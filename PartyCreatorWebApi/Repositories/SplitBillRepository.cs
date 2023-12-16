using PartyCreatorWebApi.Repositories.Contracts;
using System.Linq;

namespace PartyCreatorWebApi.Repositories
{
    public class SplitBillRepository : ISplitBillRepository
    {
        private readonly IEventRepository _eventRepository;

        public SplitBillRepository(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

    

         public int getGuests(int eventId)
        {
            var guestsCount = _eventRepository.GetGuestsUsers(eventId).Result.Count;
            return guestsCount;
        }
    }
}
