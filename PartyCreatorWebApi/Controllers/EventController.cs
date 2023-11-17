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
        private readonly INotificationRepository _notificationRepository;

        public EventController(IEventRepository eventRepository, IUsersRepository usersRepository, INotificationRepository notificationRepository)
        {
            _eventRepository = eventRepository;
            _usersRepository = usersRepository;
            _notificationRepository = notificationRepository;
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
        [HttpPost("invite"), Authorize]
        public async Task<ActionResult<InviteList>> InviteToEvent(InviteList request)
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            if(request.UserId == creatorId)
            {
                return BadRequest("Nie możesz zaprosić samego siebie do wydarzenia");
            }

            var user = await _usersRepository.GetUserById(request.UserId);
            if(user == null)
            {
                return BadRequest("Nie znaleziono takiego użytkownika");
            }

            var _event = await _eventRepository.GetEventDetails(request.EventId);
            if(_event == null)
            {
                return BadRequest("Nie znaleziono takiego wydarzenia");
            }

            if(creatorId != _event.CreatorId)
            {
                return BadRequest("Musisz być twórcą wydarzenia aby móc do niego zapraszać");
            }

            var invitedUser = await _eventRepository.CheckInviteList(request);
            if(invitedUser != null)
            {
                return BadRequest("Użytkownik jest już zaproszony do wydarzenia");
            }

            var guestList = new GuestList
            {
                UserId = request.UserId,
                EventId = request.EventId
            };
            var guestUser = await _eventRepository.CheckGuestList(guestList);
            if(guestUser != null)
            {
                return BadRequest("Uzytkownik już uczestniczy w wydarzeniu");
            }

            var result = await _eventRepository.InviteToEvent(request);
            if(result == null)
            {
                return BadRequest("Wystąpił błąd podczas zapraszania");
            }

            var notification = new Notification
            {
                UserId = request.UserId,
                Description = "Zaproszenie do wydarzenia",
                Type = "Zaproszenie",
                IsRead = false,
                EventId = request.EventId
            };
            await _notificationRepository.CreateNotification(notification);

            return Ok(result);
        }

        [HttpPost("accept"), Authorize]
        public async Task<ActionResult<GuestList>> AcceptInvite(Notification request) //tu mozna zmienic notification
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            if(request.UserId != creatorId)
            {
                return BadRequest("Możesz akceptować tylko twoje wydarzenia");
            }

            var _event = await _eventRepository.GetEventDetails(request.EventId);
            if(_event == null)
            {
                return BadRequest("Nie można znaleźć wydarzenia");
            }

            //usun invite
            var invite = await _eventRepository.CheckInviteList(new InviteList { UserId = request.UserId, EventId = request.EventId });
            if(invite == null)
            {
                return BadRequest("Nie masz zaproszenia");
            }
            await _eventRepository.DeleteInvite(invite.Id);
            //dodaj do guest
            var guest = await _eventRepository.AddToGuestList(new GuestList { UserId=request.UserId, EventId = request.EventId });
            if(guest == null)
            {
                return BadRequest("Nie udało się dodać do wydarzenia");
            }
            //usun powiadomienie
            await _notificationRepository.DeleteNotification(request.Id);
            return Ok(guest);
        }

        [HttpPost("decline"), Authorize]
        public async Task<ActionResult<InviteList>> DeclineIvite(Notification request)
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            if (request.UserId != creatorId)
            {
                return BadRequest("Możesz akceptować tylko twoje wydarzenia");
            }

            var _event = await _eventRepository.GetEventDetails(request.EventId);
            if (_event == null)
            {
                return BadRequest("Nie można znaleźć wydarzenia");
            }

            //usun invite
            var invite = await _eventRepository.CheckInviteList(new InviteList { UserId = request.UserId, EventId = request.EventId });
            if (invite == null)
            {
                return BadRequest("Nie masz zaproszenia");
            }
            var result = await _eventRepository.DeleteInvite(invite.Id);
            
            //usun powiadomienie
            await _notificationRepository.DeleteNotification(request.Id);
            return Ok(result);

        }

        [HttpGet("getAccess/{id}"), Authorize]
        public async Task<ActionResult<MessageDto>> GetAccess(int id)
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            var _event = await _eventRepository.GetEventDetails(id);
            if(_event==null)
            {
                return BadRequest("Nie ma takiego wydarzenia");
            }

            if(creatorId == _event.CreatorId)
            {
                return Ok(new MessageDto { Id = creatorId, Role = "Admin" });
            }

            var guests = await _eventRepository.GetGuestsFromEvent(id);
            var user = guests.Where(x => x.UserId == creatorId).FirstOrDefault();
            if (user == null)
            {
                return BadRequest("Nie jesteś na liście wydarzenia");
            }
            return Ok(new MessageDto { Id = creatorId, Role = "Guest" });
        }

        [HttpGet("GetAllGuests/{id:int}"), Authorize]
        public async Task<ActionResult<List<AllGuestList>>> GetAllGuests(int id)
        {
            var result = await _eventRepository.GetAllGuestsList(id);
            return Ok(result);
        }

        [HttpGet("GetGuestsUsers/{id:int}"), Authorize]
        public async Task<ActionResult<List<AllGuestList>>> GetGuestsUsers(int id)
        {
            var result = await _eventRepository.GetGuestsUsers(id);
            return Ok(result);
        }

        [HttpGet("GetInvitesUsers/{id:int}"), Authorize]
        public async Task<ActionResult<List<AllGuestList>>> GetInvitesUsers(int id)
        {
            var result = await _eventRepository.GetInvitedUsers(id);
            return Ok(result);
        }

    }

}

