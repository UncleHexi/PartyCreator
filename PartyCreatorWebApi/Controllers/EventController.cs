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
    public class EventController : ControllerBase
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUsersRepository _usersRepository;

        public EventController(IEventRepository eventRepository, IUsersRepository usersRepository)
        {
            _eventRepository = eventRepository;
            _usersRepository = usersRepository;
        }

        [HttpGet("getOfCreator"), Authorize]
        public async Task<ActionResult<List<Event>>> GetOfCreator()
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            var result = await _eventRepository.ListEventsMadeByUser(creatorId);
            return Ok(result);
        }

        [HttpPost("create"), Authorize]
        public async Task<ActionResult<Event>> Create(EventDto request)
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            Event _event = new Event
            {
                CreatorId = creatorId,
                PlaylistTitle = request.PlaylistTitle,
                ShoppingListTitle = request.ShoppingListTitle,
                ReceiptTitle = request.ReceiptTitle,
                Title = request.Title,
                Description = request.Description,
                DateTime = request.DateTime,
                City = request.City,
                Address = request.Address,
                Country = request.Country,
                Color = request.Color
            };

            var addedEvent = await _eventRepository.CreateEvent(_event);

            if (addedEvent == null)
            {
                return BadRequest("Wystapil problem, nie udalo sie stworzyć wydarzenia");
            }

            return Ok(addedEvent);
        }
        [HttpGet("{id}"), Authorize]
        public async Task<ActionResult<Event>> GetEventDetails(int id)
        {
            var eventDetails = await _eventRepository.GetEventDetails(id);

            if (eventDetails == null)
            {
                return NotFound("Nie znaleziono wydarzenia o podanym ID");
            }

            return Ok(eventDetails);
        }
        [HttpGet("getUpcoming"), Authorize]
        public async Task<ActionResult<List<Event>>> GetUpcomingEvents()
        {
            try
            {
                int userId = Int32.Parse(_usersRepository.GetUserIdFromContext());

                var upcomingEvents = await _eventRepository.ListEventsJoinedByUser(userId);
                return Ok(upcomingEvents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}

