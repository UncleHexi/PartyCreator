using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        private readonly IUsersRepository _usersRepository;
        private readonly IEventRepository _eventRepository;

        public ChatController(IChatRepository chatRepository, IUsersRepository usersRepository, IEventRepository eventRepository)
        {
            _chatRepository = chatRepository;
            _usersRepository = usersRepository;
            _eventRepository = eventRepository;
        }

        [HttpPost("sendMessage"), Authorize]
        public async Task<ActionResult<ChatMessageDto>> SendMessage([FromBody] ChatMessage request)
        {
            int userId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            var checkGuest = await _eventRepository.CheckGuestList(new GuestList { Id = 0, EventId = request.EventId, UserId = request.UserId });
            var eventDetails = await _eventRepository.GetEventDetails(request.EventId);
            if (checkGuest == null && userId != eventDetails.CreatorId)
            {
                return BadRequest("Nie uczestniczysz w tym wydarzeniu");
            }

            var result = await _chatRepository.CreateChatMessage(request);
            //dodac interakcje z hubem

            return Ok(result);
        }

        [HttpGet("getAllMessages/{id}"), Authorize]
        public async Task<ActionResult<List<ChatMessageDto>>> GetAllMessages(int id)
        {
            int userId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            var checkGuest = await _eventRepository.CheckGuestList(new GuestList { Id = 0, EventId = id, UserId = userId });
            var eventDetails = await _eventRepository.GetEventDetails(id);
            if (checkGuest == null && userId != eventDetails.CreatorId)
            {
                return BadRequest("Nie uczestniczysz w tym wydarzeniu");
            }

            var result = await _chatRepository.GetAllMessages(id);

            return Ok(result);
        }
    }
}
