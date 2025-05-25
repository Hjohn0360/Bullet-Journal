using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
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

        public AnswerController(AnswerService answerService) =>
            _answerService = answerService;

        private string GetCurrentUserId(){
            return User.FindFirst("id")?.Value ?? string.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<List<Answer>>> Get() =>
            await _answerService.GetAsync();
        
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Answer>> Get(string id){
            var answer = await _answerService.GetAsync(id);
            if(answer is null){
                return NotFound();
            }
            return answer;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Answer newAnswer){
            try{
                // TODO -- Change code to make it so only users can respond to questions
                /*
                var currentUserId = GetCurrentUserId;
                var isAdmin = await _answerService.IsUserAdminAsync(currentUserId);
                if(!isAdmin){
                    return Forbid("Only users can respond to questions.");
                }
                */
                await _answerService.CreateAsync(newAnswer);
                return CreatedAtAction(nameof(Get), new { id = newAnswer.Id }, newAnswer);
            }
            catch(Exception ex){
                return StatusCode(500, "YOU messed it up, Answer it again!(Problem with creating answer)");
            }
        }
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Answer updatedAnswer){
            try{
                // TODO -- Only make it possible for users to change answers to questions
                var answer = await _answerService.GetAsync(id);
                if(answer is null){
                    return NotFound();
                }
                updatedAnswer.Id = answer.Id;
                await _answerService.UpdateAsync(id, updatedAnswer);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, "YOU broke it...(Problem with updating answer)");
            }
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id){
            try{
                // TODO -- Only make it possible for users to delete their answers to questions
                var answer = await _answerService.GetAsync(id);
                if(answer is null){
                    return NotFound();
                }
                await _answerService.RemoveAsync(id);
                return NoContent();
            }
            catch(Exception ex){
                return StatusCode(500, "YOU broke it again *Facepalm*(Problem with deleting answer)");
            }
        }
    }
}
