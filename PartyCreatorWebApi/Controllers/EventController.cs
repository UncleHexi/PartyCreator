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
                Title = request.Title,
                Description = request.Description,
                DateTime = request.DateTime,
                City = request.City,
                Zip = request.Zip,
                Address = request.Address,
                Country = request.Country,
                Color = request.Color,
                PlaylistTitle = request.PlaylistTitle,
                ShoppingListTitle = request.ShoppingListTitle,
                ReceiptTitle = request.ReceiptTitle
            };

            var addedEvent = await _eventRepository.CreateEvent(_event);

            if (addedEvent == null)
            {
                return BadRequest("Wystapil problem, nie udalo sie stworzyć wydarzenia");
            }

            return Ok(addedEvent);
        }
    }
}
