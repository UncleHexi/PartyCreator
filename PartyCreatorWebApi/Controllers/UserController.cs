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
            result.FirstName = userDto.FirstName;
            result.LastName = userDto.LastName;
            result.Birthday = userDto.Birthday;
            result.Description = userDto.Description;
            var editedUser = await _usersRepository.EditUser(result);
            return Ok(DtoConversions.UserToDto(editedUser));
        }

    }
}
