using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;
using System;
using System.Threading.Tasks;

namespace PartyCreatorWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptItemController : ControllerBase
    {
        private readonly IReceiptItemRepository _receiptItemRepository;

        public ReceiptItemController(IReceiptItemRepository receiptItemRepository)
        {
            _receiptItemRepository = receiptItemRepository;
        }

        [HttpGet("GetReceiptItems/{eventId:int}"), Authorize]
        public async Task<ActionResult> GetReceiptItems(int eventId)
        {
            try
            {
                var receiptItems = await _receiptItemRepository.GetReceiptItems(eventId);
                return Ok(receiptItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("GetReceiptItemById/{id:int}"), Authorize]
        public async Task<ActionResult> GetReceiptItemById(int id)
        {
            try
            {
                var receiptItem = await _receiptItemRepository.GetReceiptItemById(id);

                if (receiptItem != null)
                    return Ok(receiptItem);
                else
                    return NotFound("Item not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("AddReceiptItem"), Authorize]
        public async Task<ActionResult> AddReceiptItem(ReceiptItem receiptItem)
        {
            try
            {
                var result = await _receiptItemRepository.AddReceiptItem(receiptItem);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut("UpdateReceiptItem"), Authorize]
        public async Task<ActionResult> UpdateReceiptItem(ReceiptItem receiptItem)
        {
            try
            {
                var result = await _receiptItemRepository.UpdateReceiptItem(receiptItem);

                if (result != null)
                    return Ok(result);
                else
                    return NotFound("Item not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("RemoveReceiptItem/{id:int}"), Authorize]
        public async Task<ActionResult> RemoveReceiptItem(int id)
        {
            try
            {
                var result = await _receiptItemRepository.RemoveReceiptItem(id);

                if (result)
                    return Ok("Item removed");
                else
                    return NotFound("Item not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut("SetItemPrice/{itemId:int}/{price:int}"), Authorize]
        public async Task<ActionResult> SetItemPrice(int itemId, int price)
        {
            try
            {
                var result = await _receiptItemRepository.SetItemPrice(itemId, price);

                if (result)
                    return Ok("Price set");
                else
                    return NotFound("Item not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
