using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUsersRepository _usersRepository;

        public NotificationController(INotificationRepository notificationRepository, IUsersRepository usersRepository)
        {
            _notificationRepository = notificationRepository;
            _usersRepository = usersRepository;
        }

        [HttpGet("getAllOfUser"), Authorize]
        public async Task<ActionResult<Notification>> GetNotificationOfUser()
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            var result = await _notificationRepository.GetAllNotificationsOfUser(creatorId);
            return Ok(result);
        }

        [HttpPut("toggleRead/{id}"), Authorize]
        public async Task<ActionResult<Notification>> ToggleRead(int id)
        {
            var notification = await _notificationRepository.GetNotification(id);
            if (notification == null)
            {
                return BadRequest("Nie ma takiego powiadomienia");
            }

            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            if(notification.UserId !=  creatorId)
            {
                return BadRequest("Nie masz dostępu do tego powiadomienia");
            }


            var result = await _notificationRepository.ToggleRead(notification);
            return Ok(result);
        }
    }
}
