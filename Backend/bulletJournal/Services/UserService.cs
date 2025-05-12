using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.bulletJournal.Models; 
using System.Security.Cryptography;
using System.Text;

namespace Backend.bulletJournal.Services{
    public class UserService{
        private readonly IMongoCollection<User> _users;
        public UserService(IMongoDatabase database){
            _users = database.GetCollection<User>("Users");
        }
        public async Task<List<User>> GetAsync() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task<User> GetAsync(string id) =>
            await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

        public async Task<User> GetByUsernameAsync(string username) =>
            await _users.Find(u => u.Username == username).FirstOrDefaultAsync();

        public async Task<User> GetByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task<User> CreateAsync(User user)
        {
            // NOTE -- Generates salt and hash password
            user.Salt = GenerateSalt();
            user.PasswordHash = HashPassword(user.PasswordHash, user.Salt);
            
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task UpdateAsync(string id, User updatedUser)
        {
            await _users.ReplaceOneAsync(u => u.Id == id, updatedUser);
        }

        public async Task RemoveAsync(string id) =>
            await _users.DeleteOneAsync(u => u.Id == id);

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

        private string HashPassword(string password, string salt)
        {
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