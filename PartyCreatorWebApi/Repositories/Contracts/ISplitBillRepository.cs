namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface ISplitBillRepository
    {
        int getGuests(int eventId);
    }
}
