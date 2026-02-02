using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.bulletJournal.Models{
    public class Question{
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } 
        
        //[BsonRepresentation(BsonType.ObjectId)]
        //public string? UserId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } 
        public DateTime CreatedDate { get; set; } 
    }
}