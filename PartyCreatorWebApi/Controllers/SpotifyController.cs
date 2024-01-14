using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Repositories.Contracts;
using PartyCreatorWebApi.Dtos;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpotifyController : ControllerBase
    {
        private readonly ISpotifyRepository _spotifyRepository;

        public SpotifyController(ISpotifyRepository spotifyRepository)
        {
            _spotifyRepository = spotifyRepository;
        }

        [HttpPost("getAccessToken"), Authorize]
        public async Task<ActionResult<string>> GetAccessToken([FromBody]SpotifyDto code)
        {
            var result = await _spotifyRepository.GetAccessToken(code.Code);
            LoginResponseDto loginResponseDto = new LoginResponseDto
            {
                Token = result
            };
            return Ok(loginResponseDto);
        }
    }
}
