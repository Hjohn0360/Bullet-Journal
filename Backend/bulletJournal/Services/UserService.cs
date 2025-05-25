using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.bulletJournal.Models; 
using System.Security.Cryptography;
using System.Text;
using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Backend.bulletJournal.Services{
    public class UserService{
        private readonly IMongoCollection<User> _user;
        // NOTE -- User CRUD 
        public UserService(IMongoDatabase database){
            _user = database.GetCollection<User>("Users");
        }
        public async Task<List<User>> GetAsync() =>
            await _user.Find(_ => true).ToListAsync();

        public async Task<User> GetAsync(string id) =>
            await _user.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task<User> GetByUsernameAsync(string username) =>
            await _user.Find(u => u.Username == username).FirstOrDefaultAsync();

        public async Task<User> GetByEmailAsync(string email) =>
            await _user.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task<User> CreateAsync(User user)
        {
            // NOTE -- Generates salt and hash password
            user.Salt = GenerateSalt();
            user.PasswordHash = HashPassword(user.PasswordHash, user.Salt);
            
            await _user.InsertOneAsync(user);
            return user;
        }

        public async Task UpdateAsync(string id, User updatedUser)
        {
            await _user.ReplaceOneAsync(u => u.Id == id, updatedUser);
        }

        public async Task RemoveAsync(string id) =>
            await _user.DeleteOneAsync(u => u.Id == id);


        // NOTE -- Admin/Role CRUD
        public async Task<List<User>> GetAdminUsersAsync() =>
            await _user.Find(u => u.Role.IsAdmin == true).ToListAsync();
        
        public async Task<User> GetUserWithNoRoleAsync(string userId){
            return await _user.Find(u => u.Id == userId).FirstOrDefaultAsync();
        }

        public async Task<User> CreateAdminAsync(User user){
            user.Role.IsAdmin = true;
            user.Role.Role = "Admin";
            return await CreateAsync(user);
        }

        public async Task PromoteToAdminAsync(string userId){
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update
                .Set(u => u.Role.IsAdmin, true)
                .Set(u => u.Role.Role, "Admin");
            await _user.UpdateOneAsync(filter, update);
        }

        public async Task<bool> IsUserAdminAsync(string userId){
            var user = await _user.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user?.Role.IsAdmin ?? false;
        }

        public bool IsAdmin(User user){
            return user?.Role.IsAdmin ?? false;
        }

        public bool HasRole(User user, string roleName){
            return user?.Role.Role?.Equals(roleName, StringComparison.OrdinalIgnoreCase) ?? false;
        }


        // NOTE -- Password Logic 
        public bool VerifyPassword(string password, string storedHash, string salt) =>
            HashPassword(password, salt) == storedHash;

        // NOTE -- Helper methods for password handling
        private string GenerateSalt()
        {
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        private string HashPassword(string password, string salt){
            byte[] saltBytes = Convert.FromBase64String(salt);
            using (var sha256 = SHA256.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password + salt);
                byte[] hashBytes = sha256.ComputeHash(passwordBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}