using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using Backend.bulletJournal.Models;
using Backend.bulletJournal.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Backend.bulletJournal.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class AnswerController : ControllerBase{
        private readonly AnswerService _answerService;
        private readonly UserService _userService;

        public AnswerController(AnswerService answerService, UserService userService){
            _answerService = answerService;
            _userService = userService;
        }
        private string GetCurrentUserId(){
            return User.FindFirst("id")?.Value ?? string.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<List<Answer>>> Get() =>
            // TODO -- Restrict user to only be able to get all of their answers rather then every answer no matter who created it.
            await _answerService.GetAsync();
        
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Answer>> Get(string id){
            // TODO -- Check if the answer actually belongs to that user or if admin, allow them to see all answers
            var answer = await _answerService.GetAsync(id);
            if(answer is null){
                return NotFound();
            }
            return answer;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Answer newAnswer, [FromHeader] string? userId = null){
            try{
                var currentUserId = userId ?? GetCurrentUserId();
                if(string.IsNullOrEmpty(currentUserId)){
                    return Unauthorized("User Id is required");
                }
                var user = await _userService.GetUserByIdAsync(currentUserId);
                if(user == null){
                    return Unauthorized("Invalid User");
                }
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(isAdmin){
                    return Forbid("Admins cannot create answer questions, only Regular Users can.");
                }
                newAnswer.UserId = currentUserId;
                await _answerService.CreateAsync(newAnswer);
                return CreatedAtAction(nameof(Get), new { id = newAnswer.Id }, newAnswer);
            }
            catch(Exception ex){
                return StatusCode(500, $"YOU messed it up, Answer it again!(Problem with creating answer: {ex.Message})");
            }
        }
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Answer updatedAnswer, [FromHeader] string? userId = null){
            try{
                var currentUserId = userId ?? GetCurrentUserId();
                if(string.IsNullOrEmpty(currentUserId)){
                    return Unauthorized("User Id is Required");
                }
                var user = await _userService.GetUserByIdAsync(currentUserId);
                if(user == null){
                    return Unauthorized("Invalid User");
                }
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(isAdmin){
                    return Forbid("Admins can't update answers, only regular users can");
                }
                var answer = await _answerService.GetAsync(id);
                if(answer is null){
                    return NotFound();
                }
                if(answer.UserId != currentUserId){
                    return Forbid("You can only update your own answers");
                }
                updatedAnswer.Id = answer.Id;
                updatedAnswer.UserId = currentUserId;

                await _answerService.UpdateAsync(id, updatedAnswer);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, $"YOU broke it, the app's broken now...(Problem with updating answer: {ex.Message})");
            }
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromHeader] string? userId = null){
            try{
                var currentUserId =userId ?? GetCurrentUserId();
                if(string.IsNullOrEmpty(currentUserId)){
                    return Unauthorized("User Id is Required");
                }
                var user = await _userService.GetUserByIdAsync(currentUserId);
                if(user == null){
                    return Unauthorized("Invalid User");
                }
                var isAdmin = await _userService.IsUserAdminAsync(currentUserId);
                if(isAdmin){
                    return Forbid("Admins can't delete answers, only regular users can");
                }
                var answer = await _answerService.GetAsync(id);
                if(answer is null){
                    return NotFound();
                }
                if(answer.UserId != currentUserId){
                    return Forbid("You can only delete your own answers");
                }
                await _answerService.RemoveAsync(id);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, $"Danger!! Your laptop finna blow up!(Problem with deleting answer: {ex.Message})");
            }
        }
    }
}
