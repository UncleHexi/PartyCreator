using Microsoft.EntityFrameworkCore;
using PartyCreatorWebApi.Entities;
using PartyCreatorWebApi.Repositories.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PartyCreatorWebApi.Repositories
{
    public class ReceiptItemRepository : IReceiptItemRepository
    {
        private readonly DataContext _dataContext;

        public ReceiptItemRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<List<ReceiptItem>> GetReceiptItems(int eventId)
        {
            return await _dataContext.ReceiptItems.Where(x => x.EventId == eventId).ToListAsync();
        }

        public async Task<ReceiptItem> GetReceiptItemById(int id)
        {
            return await _dataContext.ReceiptItems.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<ReceiptItem> AddReceiptItem(ReceiptItem receiptItem)
        {
            var result = await _dataContext.ReceiptItems.AddAsync(receiptItem);
            await _dataContext.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<ReceiptItem> UpdateReceiptItem(ReceiptItem receiptItem)
        {
            var result = _dataContext.ReceiptItems.Update(receiptItem);
            await _dataContext.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<bool> RemoveReceiptItem(int id)
        {
            var receiptItem = await _dataContext.ReceiptItems.FindAsync(id);

            if (receiptItem != null)
            {
                _dataContext.ReceiptItems.Remove(receiptItem);
                await _dataContext.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> SetItemPrice(int itemId, int price)
        {
            var receiptItem = await _dataContext.ReceiptItems.FindAsync(itemId);

            if (receiptItem != null)
            {
                receiptItem.Price = price;
                await _dataContext.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}