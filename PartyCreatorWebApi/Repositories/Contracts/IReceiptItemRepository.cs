using PartyCreatorWebApi.Entities;

public interface IReceiptItemRepository
{
    Task<List<ReceiptItem>> GetReceiptItems(int eventId);
    Task<ReceiptItem> GetReceiptItemById(int id);
    Task<ReceiptItem> AddReceiptItem(ReceiptItem receiptItem);
    Task<ReceiptItem> UpdateReceiptItem(ReceiptItem receiptItem);
    Task<bool> RemoveReceiptItem(int id);
    Task<bool> SetItemPrice(int itemId, int price);
}