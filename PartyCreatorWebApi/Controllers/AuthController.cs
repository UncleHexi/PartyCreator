using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;

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

        [HttpGet("test")]
        public string Test()
        {
            return "dziala";
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto request)
        {   
            //sprawdz czy email juz istnieje
            var result = await _usersRepository.GetUserByEmail(request.Email.ToLower());

            if (result != null)
            {
                return BadRequest("Użytkownik o takim email już istnieje");
            }

            //mozna jeszcze sprawdzic czy haslo jest o podanych wytycznych
            //utworz password hash i salt
            _authRepository.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            User user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Description = request.Description,
                Email = request.Email.ToLower(),
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };
            
            //dodaj uzytkownika do bazy
            var addedUser = await _usersRepository.AddUser(user);

            if(addedUser==null)
            {
                return BadRequest("Wystapil problem, nie udalo sie zarejestrowac");
            }


            UserDto userDto = new UserDto
            {
                Id = addedUser.Id,
                FirstName = addedUser.FirstName,
                LastName = addedUser.LastName,
                Description = addedUser.Description,
                Birthday = addedUser.Birthday,
                Email = addedUser.Email
            };

            return Ok(userDto);
        }

        [HttpGet("getme"), Authorize]
        public ActionResult<string> GetMe()
        {
            var userId = _usersRepository.GetUserIdFromContext();
            return Ok(userId);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto request)
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

            LoginResponseDto loginResponseDto = new LoginResponseDto
            {
                Token = token
            };

            return Ok(loginResponseDto);
        }
    }
}
