using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface IChatRepository
    {
        Task<ChatMessage> CreateChatMessage(ChatMessage chatMessage);
        Task<List<ChatMessageDto>> GetAllMessages(int eventId);
    }
}
