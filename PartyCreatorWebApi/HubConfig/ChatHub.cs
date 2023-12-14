using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace PartyCreatorWebApi.HubConfig
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendPrivateMessage(string id, string user, string message)
        {
            await Clients.User(id).SendAsync("ReceiveMessagePrivate",user, message);
        }

        public async Task AddToEventGroup(string eventId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, eventId);
            string message = $"{Context.UserIdentifier} has joined";
            string user = $"{Context.UserIdentifier}";
            await Clients.Group(eventId).SendAsync("EventJoined", user, message);
        }

        public async Task RemoveFromEventGroup(string eventId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, eventId);
            string message = $"{Context.UserIdentifier} has left";
            string user = $"{Context.UserIdentifier}";
            await Clients.Group(eventId).SendAsync("EventLeft", user, message);
        }
    }
}
