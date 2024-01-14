using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface IChatRepository
    {
        Task<ChatMessageDto> CreateChatMessage(ChatMessage chatMessage);
        Task<List<ChatMessageDto>> GetAllMessages(int eventId);
        Task<List<ChatMessage>> DeleteAllFromEvent(int eventId);
    }
}
