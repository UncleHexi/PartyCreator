namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface ISpotifyRepository
    {
        Task<string> GetAccessToken(string code);
    }
}
