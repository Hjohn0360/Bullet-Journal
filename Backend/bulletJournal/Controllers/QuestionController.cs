using System;
using System.Collections.Generic;
using Backend.bulletJournal.Models;
using Backend.bulletJournal.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using MongoDB.Driver;

namespace Backend.bulletJournal.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase{
        private readonly QuestionService _questionService;
        private readonly UserService _userService;
        public QuestionController(QuestionService questionService, UserService userService){
            _questionService = questionService;
            _userService = userService;
        }
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
        public async Task<IActionResult> Post(Question newQuestion, [FromHeader] string? userId = null){
            try{
                var currentUserId = userId ?? GetCurrentUserId();
                if(string.IsNullOrEmpty(currentUserId)){
                    return Unauthorized("User Id is Required");
                }

                var isAdmin = await _userService.IsUserAdminAsync(currentUserId); 
                if(!isAdmin){
                    return Forbid("Only administrators can create questions.");
                }
                
                await _questionService.CreateAsync(newQuestion);
                return CreatedAtAction(nameof(Get), new { id = newQuestion.Id }, newQuestion);
            }
            catch(Exception ex){
                return StatusCode(500, $"An error occured while creating the question: {ex.Message}");
            }
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Question updatedQuestion, [FromHeader] string? userId = null){
            try{
                var currentUserId = userId ?? GetCurrentUserId();
                if(string.IsNullOrEmpty(currentUserId)){
                    return Unauthorized("User Id is Required.");
                }

                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(!isAdmin){
                    return Forbid("Only administrators can update questions.");
                }
                
                var question = await _questionService.GetAsync(id);
                if(question is null){
                    return NotFound();
                }
                updatedQuestion.Id = question.Id;
                await _questionService.UpdateAsync(id, updatedQuestion);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, $"An error has occured while updating the question: {ex.Message}");
            }
        }
        
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromHeader] string? userId = null){
            try{
                var currentUserId = userId ?? GetCurrentUserId();
                if(string.IsNullOrEmpty(currentUserId)){
                    return Unauthorized("User Id is Required.");
                }
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(!isAdmin){
                    return Forbid("Only administrators can delete questions");
                }
                
                var question = await _questionService.GetAsync(id);
                if(question is null){
                    return NotFound();
                }  
                await _questionService.RemoveAsync(id);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, $"An error occured while deleting the question: {ex.Message}");
            }
        }
    }
}