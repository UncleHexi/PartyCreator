using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeKit.Text;
using MimeKit;
using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;
using System.Security.Claims;
using MailKit.Net.Smtp;

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
            return "adamtogejestfajny";
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
                PasswordSalt = passwordSalt,
                VerificationToken = _authRepository.CreateRandomToken(),
            };
            
            //dodaj uzytkownika do bazy
            var addedUser = await _usersRepository.AddUser(user);

            if(addedUser==null)
            {
                return BadRequest("Wystapil problem, nie udalo sie zarejestrowac");
            }

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("partycreator@gmail.com"));
            email.To.Add(MailboxAddress.Parse(user.Email));
            email.Subject = "PartyCreator Weryfikacja";
            email.Body = new TextPart(TextFormat.Html) { Text = $"<h1>https://localhost:7241/api/Auth/verify?token={user.VerificationToken}<h1>" };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp-relay.brevo.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("mariusz.bar.walce@gmail.com", "gK6B82DOqJHXQFbk");
            smtp.Send(email);
            smtp.Disconnect(true);

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
            var user = await _usersRepository.GetUserByEmail(request.Email);

            if(user == null)
            {
                return BadRequest("Nie znaleziono użytkownika");
            }

            if(!_authRepository.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Podane haslo sie nie zgadza");
            }

            if(user.VerifiedAt == null)
            {
                return BadRequest("Musisz najpierw potwierdzic email zeby sie zalogowac");
            }

            string token = _authRepository.CreateToken(user);

            LoginResponseDto loginResponseDto = new LoginResponseDto
            {
                Token = token
            };

            return Ok(loginResponseDto);
        }

        [HttpGet("verify")]
        public async Task<ActionResult<LoginResponseDto>> Verify([FromQuery]string token)
        {
            var user = await _usersRepository.GetUserByToken(token);

            if (user == null)
            {
                return BadRequest("Niepoprawny token");
            }

            var result = await _usersRepository.Verify(user.Id);

            return Ok("Udalo sie potwierdzic email");
        }

        [HttpPost("change-password"), Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            
            int userId = Int32.Parse(_usersRepository.GetUserIdFromContext());

            
            var user = await _usersRepository.GetUserById(userId);
            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            
            if (!_authRepository.VerifyPasswordHash(changePasswordDto.OldPassword, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Niepoprawne stare hasło.");
            }

           
          //  if (changePasswordDto.NewPassword != changePasswordDto.ConfirmNewPassword)
            //{
              //  return BadRequest("Nowe hasło i potwierdzenie hasła nie są takie same.");
            //}

            _authRepository.CreatePasswordHash(changePasswordDto.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

            
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            var updatedUser = await _usersRepository.EditUser(user);

            if (updatedUser == null)
            {
                return BadRequest("Nie udało się zaktualizować hasła.");
            }

            return Ok();
        }

    }
}
