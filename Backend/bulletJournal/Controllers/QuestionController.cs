using System;
using System.Collections.Generic;
using Backend.bulletJournal.Models;
using Backend.bulletJournal.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Backend.bulletJournal.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase{
        private readonly QuestionService _questionService;
        private readonly UserService _userService;
        public QuestionController(QuestionService questionService) => 
            _questionService = questionService;
        
        private string GetCurrentUserId(){
            return User.FindFirst("id")?.Value ?? string.Empty;
        }
        [HttpGet]
        public async Task<ActionResult<List<Question>>> Get() =>
            await _questionService.GetAsync();
                    
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Question>> Get(string id){
            var question = await _questionService.GetAsync(id);

            if (question is null){
                return NotFound();
            }

            return question;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Question newQuestion){
            try{
                /*
                var currentUserId = GetCurrentUserId();
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId); 
                if(!isAdmin){
                    return Forbid("Only administrators can create questions.");
                }
                */
                await _questionService.CreateAsync(newQuestion);
                return CreatedAtAction(nameof(Get), new { id = newQuestion.Id }, newQuestion);
            }
            catch(Exception ex){
                return StatusCode(500, "An error occured while creating the question.");
            }
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Question updatedQuestion){
            try{
                /*
                var currentUserId = GetCurrentUserId();
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(!isAdmin){
                    return Forbid("Only administrators can update questions.");
                }
                */
                var question = await _questionService.GetAsync(id);
                if(question is null){
                    return NotFound();
                }
                updatedQuestion.Id = question.Id;
                await _questionService.UpdateAsync(id, updatedQuestion);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, "An error has occured while updating the question.");
            }
        }
        
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id){
            try{
                /*
                var currentUserId = GetCurrentUserId();
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(!isAdmin){
                    return Forbid("Only administrators can delete questions");
                }
                */
                var question = await _questionService.GetAsync(id);
                if(question is null){
                    return NotFound();
                }  
                await _questionService.RemoveAsync(id);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, "An error occured while deleting the question.");
            }
        }
    }
}