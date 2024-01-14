using Newtonsoft.Json;
using PartyCreatorWebApi.Repositories.Contracts;

namespace PartyCreatorWebApi.Repositories
{
    public class SpotifyRepository : ISpotifyRepository
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        public async Task<string> GetAccessToken(string code)
        {
            var client = new HttpClient();
            var requestContent = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", "http://localhost:4200/redirect"),
                new KeyValuePair<string, string>("client_id", "81810883fb3b47bb83ffa68101537c05"),
                new KeyValuePair<string, string>("client_secret", "d5380ae4782748ff92520e95cdd1e7f4")
            });

            var response = await client.PostAsync("https://accounts.spotify.com/api/token", requestContent);
            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<SpotifyRepository>(responseContent);

            return tokenResponse.AccessToken;
        }
    }
}
