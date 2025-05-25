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
        public string Type { get; set; } = string.Empty;
        public string Options { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public bool IsRequired { get; set; }
    }
}