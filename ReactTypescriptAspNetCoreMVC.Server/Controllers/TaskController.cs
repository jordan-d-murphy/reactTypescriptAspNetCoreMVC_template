using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactTypescriptAspNetCoreMVC.Server.Data.Auth;
using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects/{projectId}/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public TasksController(AuthDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private async Task<(Project? project, string userId)> ValidateProjectAccess(int projectId)
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user!);
            var userId = user!.Id;

            var project = await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Author)
                .FirstOrDefaultAsync(p =>
                    p.Id == projectId &&
                    (p.OwnerId == userId || (p.SharedWithRole != null && roles.Contains(p.SharedWithRole))));

            return (project, userId);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(int projectId, TaskItem task)
        {
            var (project, userId) = await ValidateProjectAccess(projectId);
            if (project == null || project.OwnerId != userId)
                return Forbid();

            task.ProjectId = projectId;
            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int projectId, int id, TaskItem task)
        {
            if (id != task.Id) return BadRequest();
            var (project, userId) = await ValidateProjectAccess(projectId);
            if (project == null || project.OwnerId != userId)
                return Forbid();

            _context.TaskItems.Update(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int projectId, int id)
        {
            var (project, userId) = await ValidateProjectAccess(projectId);
            if (project == null || project.OwnerId != userId)
                return Forbid();

            var task = project.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
