﻿using PartyCreatorWebApi.Entities;

namespace PartyCreatorWebApi.Repositories.Contracts
{
    public interface IUsersRepository
    {
        Task<List<User>> GetUsers(); 
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserById(int id);
        Task<User> AddUser(User user);
        Task<User> EditUser(User user);
        Task<UserContact> AddContact(UserContact userContact);
        Task<List<UserContact>> ShowContacts(int userId);
        string GetUserIdFromContext();

    }
}
