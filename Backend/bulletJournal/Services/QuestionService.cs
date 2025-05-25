using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.bulletJournal.Models;
using System.Text;
using Microsoft.Extensions.Options;

namespace Backend.bulletJournal.Services{
    public class QuestionService{
        private readonly IMongoCollection<Question> _question;
        public QuestionService(IMongoDatabase database){
            _question = database.GetCollection<Question>("Questions");
        }
            public async Task<List<Question>> GetAsync() =>
                await _question.Find(_ => true).ToListAsync();
            public async Task<Question?> GetAsync(string id) => 
                await _question.Find(x => x.Id == id).FirstOrDefaultAsync();
            public async Task CreateAsync(Question newQuestion) => 
                await _question.InsertOneAsync(newQuestion);
            public async Task UpdateAsync(string id, Question updatedQuestion) =>
                await _question.ReplaceOneAsync(x => x.Id == id, updatedQuestion);
            public async Task RemoveAsync(string id) =>
                await _question.DeleteOneAsync(x => x.Id == id);

    }
}