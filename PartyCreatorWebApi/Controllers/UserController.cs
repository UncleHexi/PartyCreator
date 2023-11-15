using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Extensions;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;

        public UserController(IUsersRepository usersRepository)
        {
            _usersRepository = usersRepository;
        }

        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(await _usersRepository.GetUsers());
        }

        [HttpGet("GetUserByEmail")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            return Ok(await _usersRepository.GetUserByEmail(email));
        }

        [HttpGet("GetMyProfile"), Authorize]
        public async Task<ActionResult<UserDto>> GetMyProfile()
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            var result = await _usersRepository.GetUserById(creatorId);
            return Ok(DtoConversions.UserToDto(result));
        }

        [HttpPost("EditMyProfile"), Authorize]
        public async Task<ActionResult<UserDto>> EditUser(UserDto userDto)
        {
            


            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            var result = await _usersRepository.GetUserById(creatorId);
            if(result.FirstName == userDto.FirstName && result.LastName == userDto.LastName && result.Birthday == userDto.Birthday && result.Description == userDto.Description)
            {
                return BadRequest("Nie wprowadzono zadnych zmian");
            }
            result.FirstName = userDto.FirstName;
            result.LastName = userDto.LastName;
            result.Birthday = userDto.Birthday;
            result.Description = userDto.Description;
            var editedUser = await _usersRepository.EditUser(result);
            return Ok(DtoConversions.UserToDto(editedUser));
        }

        [HttpPost("AddContact"), Authorize]
        public async Task<ActionResult<UserContact>> AddContact(UserContact request)
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            UserContact userContact = new UserContact
            {
                UserId = creatorId,
                Name = request.Name,
                Email = request.Email,
            };
            var result = await _usersRepository.AddContact(userContact);
            return Ok(result);
        }

        [HttpGet("GetMyContacts"), Authorize]
        public async Task<ActionResult<UserContact>> ShowContacts()
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());
            var result = await _usersRepository.ShowContacts(creatorId);
            return Ok(result);
        }

        [HttpPost("EditContact"), Authorize]
        public async Task<ActionResult<UserContact>> EditContact(UserContact request)
        {
            int creatorId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            if(request.UserId != creatorId)
            {
                return BadRequest("Nie masz uprawnien do edycji tego kontaktu");
            }

            UserContact userContact = new UserContact
            {
                Id = request.Id,
                UserId = creatorId,
                Name = request.Name,
                Email = request.Email,
            };
            var result = await _usersRepository.EditContact(userContact);
            return Ok(result);
        }

        [HttpDelete("DeleteContact/{id:int}"), Authorize]
        public async Task<ActionResult<UserContact>> DeleteContact(int id)
        {
            var result = await _usersRepository.DeleteContact(id);
            return Ok(result);
        }

    }
}
