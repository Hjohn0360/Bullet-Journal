using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.bulletJournal.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        
        public string Username { get; set; } = string.Empty; 
        
        public string Email { get; set; } = string.Empty; 
        
        public string PasswordHash { get; set; } = string.Empty; 
        
        public string Salt { get; set; } = string.Empty; 
        
        public string FirstName { get; set; } = string.Empty;
        
        public string LastName { get; set; } = string.Empty;
        
        public UserPreferences Preferences { get; set; } = new UserPreferences();
    }

    public class UserPreferences
    {
        public bool EmailNoti { get; set; } = true;
        
        public string TimeZone { get; set; } = "CDT";
    }
}