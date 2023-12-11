using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly DataContext _dataContext;

        public ChatRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<ChatMessage> CreateChatMessage(ChatMessage chatMessage)
        {
            var result = _dataContext.ChatMessages.AddAsync(chatMessage);
            await _dataContext.SaveChangesAsync();
            return result.Result.Entity;
        }

        public async Task<List<ChatMessageDto>> GetAllMessages(int eventId)
        {
            var result = await _dataContext.ChatMessages.Where(m => m.EventId == eventId)
                .Select(n=> new ChatMessageDto
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    FirstName = _dataContext.Users.Where(u => u.Id == n.UserId).Select(f => f.FirstName).FirstOrDefault(),
                    LastName = _dataContext.Users.Where(u => u.Id == n.UserId).Select(f => f.LastName).FirstOrDefault(),
                    EventId = n.EventId,
                    Message = n.Message,
                    DateTime = n.DateTime
                }).ToListAsync();
            return result;
        }
    }
}
