using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactTypescriptAspNetCoreMVC.Server.Entities;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;

namespace ReactTypescriptAspNetCoreMVC.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _service;
        private readonly UserManager<AppUser> _userManager;

        public ProjectsController(IProjectService service, UserManager<AppUser> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        private async Task<(string userId, IList<string> roles)> GetUserContext()
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user!);
            return (user!.Id, roles);
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var (userId, roles) = await GetUserContext();
            var projects = await _service.GetUserProjectsAsync(userId, roles);
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var (userId, roles) = await GetUserContext();
            var project = await _service.GetProjectByIdAsync(id, userId, roles);
            return project == null ? NotFound() : Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Project project)
        {
            var (userId, _) = await GetUserContext();
            project.OwnerId = userId;
            var created = await _service.CreateProjectAsync(project);
            return CreatedAtAction(nameof(GetProject), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Project project)
        {
            if (id != project.Id) return BadRequest();
            await _service.UpdateProjectAsync(project);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (userId, _) = await GetUserContext();
            await _service.DeleteProjectAsync(id, userId);
            return NoContent();
        }
    }
}