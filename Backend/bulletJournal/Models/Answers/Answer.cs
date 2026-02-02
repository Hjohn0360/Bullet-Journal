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
        public string AnswerText { get; set; } = string.Empty;
        public string AnswerType { get; set; } = string.Empty;
        public DateTime AnswerDate { get; set; } = DateTime.UtcNow;
        public string? SelectedOption { get; set; }
        public int Rating { get; set; }
        // NOTE -- For yes or no questions
        public bool AnswerValue { get; set; }
        public string AnswerTime { get; set; } = string.Empty;
    }
}