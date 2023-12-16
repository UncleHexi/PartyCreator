using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SplitBillController : ControllerBase
    {
        private readonly ISplitBillRepository _splitBillRepository;

        public SplitBillController(ISplitBillRepository splitBillRepository)
        {
            _splitBillRepository = splitBillRepository;
        }

        [HttpGet("GetGuestsCount/{eventId:int}"), Authorize]
        public ActionResult<int> GetGuestsCount(int eventId)
        {
            try
            {
                // Wywołaj metodę getGuests z ISplitBillRepository
                var guestsCount = _splitBillRepository.getGuests(eventId);

                // Zwróć wynik
                return Ok(guestsCount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wewnętrzny błąd serwera: {ex.Message}");
            }
        }

        // ... inne metody kontrolera ...
    }
}
