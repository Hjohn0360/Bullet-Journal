using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.bulletJournal.Models; 
using Backend.bulletJournal.Services;
// Remove this unnecessary self-reference
// using Backend.bulletJournal.Controllers;

namespace Backend.bulletJournal.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase{
        private readonly UserService _userService;
        public UserController(UserService userService){
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<User>>> Get() 
            // Remove the 'return' keyword here - it's not valid with the lambda syntax
            => await _userService.GetAsync();
        
        // Fix the attribute syntax - missing comma
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> Get(string id){
            var user = await _userService.GetAsync(id);

            if (user is null)
                return NotFound();

            user.PasswordHash = null;
            user.Salt = null;

            return user;
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User newUser){
            // NOTE -- Checks if the username or email exists
            var existingUsername = await _userService.GetByUsernameAsync(newUser.Username);
            if (existingUsername != null)
                return BadRequest("Username already exists");
            
            var existingEmail = await _userService.GetByEmailAsync(newUser.Email);
            if (existingEmail != null)
                return BadRequest("Email already exists");
            
            // NOTE -- Temporarily stores pw in plain text
            string plainPw = newUser.PasswordHash;

            await _userService.CreateAsync(newUser);

            newUser.PasswordHash = null;
            newUser.Salt = null;

            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel login){
            if (string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password)){
                return BadRequest("Username and password are required");
            }

            var user = await _userService.GetByUsernameAsync(login.Username);
            if (user == null)
                return Unauthorized("Invalid username or password");
            
            if (!_userService.VerifyPassword(login.Password, user.PasswordHash, user.Salt))
                return Unauthorized("Invalid username or password");
            
            return Ok(new { id = user.Id, username = user.Username });
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, User updatedUser){
            var user = await _userService.GetAsync(id);

            if(user is null)
                return NotFound();

            // NOTE -- Updating Pw
            if (!string.IsNullOrEmpty(updatedUser.PasswordHash)){/* NOTE -- PW will be rehashed in the service */}
            else{
                // NOTE -- Keep Pw if not updating
                updatedUser.PasswordHash = user.PasswordHash;
                updatedUser.Salt = user.Salt;
            }
            
            updatedUser.Id = user.Id;
            await _userService.UpdateAsync(id, updatedUser);

            return NoContent();
        }
        
        // Fix the attribute syntax - remove space after colon
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id){
            var user = await _userService.GetAsync(id);

            if(user is null)
                return NotFound();
            
            await _userService.RemoveAsync(id);

            return NoContent();
        }
    }


    public class LoginModel{
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}