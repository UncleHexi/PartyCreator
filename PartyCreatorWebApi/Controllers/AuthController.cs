using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IUsersRepository _usersRepository;

        public AuthController(IAuthRepository authRepository ,IUsersRepository usersRepository)
        {
            _authRepository = authRepository;
            _usersRepository = usersRepository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserTemp>> Register(UserDto request)
        {
            _authRepository.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            
            var result = await _usersRepository.GetUserByEmail(request.Email);

            if (result != null)
            {
                return BadRequest("Użytkownik o takim email już istnieje");
            }

            User user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Description = request.Description,
                Birthday = request.Birthday,
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            return Ok(await _usersRepository.AddUser(user));
        }

        [HttpGet("test"), Authorize]
        public async Task<ActionResult<UserTemp>> GetUser()
        {
            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            var result = await _usersRepository.GetUserByEmail(request.Email);

            if(result == null)
            {
                return BadRequest("Nie znaleziono użytkownika");
            }

            if(!_authRepository.VerifyPasswordHash(request.Password, result.PasswordHash, result.PasswordSalt))
            {
                return BadRequest("Podane haslo sie nie zgadza");
            }

            string token = _authRepository.CreateToken(result);
            return Ok(token);
        }
    }
}
