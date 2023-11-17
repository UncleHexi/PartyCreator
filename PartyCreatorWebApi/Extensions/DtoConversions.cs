using PartyCreatorWebApi.Dtos;
using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Extensions
{
    public class DtoConversions
    {
        public static UserDto UserToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Birthday = user.Birthday,
                Description = user.Description,
                Image = user.Image
            };
        }

        public static List<UserContactDto> UserToUserContactDto(List<User> users)
        {
            return (from user in users select new UserContactDto
            {
                UserId = user.Id,
                Name = user.FirstName + " " + user.LastName,
                Email = user.Email
            }).ToList();
        }
    }
}
