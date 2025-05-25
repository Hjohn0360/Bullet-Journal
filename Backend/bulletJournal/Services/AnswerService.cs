using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.bulletJournal.Models;
using System.Text;
using Microsoft.Extensions.Options;

namespace Backend.bulletJournal.Services{
    public class AnswerService{
        private readonly IMongoCollection<Answer> _answer;
        public AnswerService(IMongoDatabase database){
            _answer = database.GetCollection<Answer>("Answers");
        }

            public async Task<List<Answer>> GetAsync() =>
                await _answer.Find(_ => true).ToListAsync();
            public async Task<Answer?> GetAsync(string id) =>
                await _answer.Find(x => x.Id == id).FirstOrDefaultAsync();
            public async Task CreateAsync(Answer newAnswer) =>
                await _answer.InsertOneAsync(newAnswer);
            public async Task UpdateAsync(string id, Answer updatedAnswer) =>
                await _answer.ReplaceOneAsync(x => x.Id == id, updatedAnswer);
            public async Task RemoveAsync(string id) =>
                await _answer.DeleteOneAsync(x => x.Id == id);
            
    }
}