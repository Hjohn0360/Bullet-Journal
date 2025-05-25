using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.bulletJournal.Models{
    public class Answer{
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } 

        [BsonRepresentation(BsonType.ObjectId)]
        public string QuestionId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;
        public string answerText { get; set; } = string.Empty;
        public string answerType { get; set; } = string.Empty;
        public DateOnly answerDate { get; set; }
        public string? selectedOption { get; set; }
        public int rating { get; set; }
        // NOTE -- For yes or no questions
        public bool answerValue { get; set; }
        // TODO -- Add time of when question was answered
    }
}