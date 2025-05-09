using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactTypescriptAspNetCoreMVC.Server.Data.Auth;
using ReactTypescriptAspNetCoreMVC.Server.DTOs;
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
        private readonly AuthDbContext _context;

        public ProjectsController(IProjectService service, UserManager<AppUser> userManager, AuthDbContext context)
        {
            _service = service;
            _userManager = userManager;
            _context = context;
        }

        private async Task<(string userId, IList<string> roles)> GetUserContext()
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user!);
            return (user!.Id, roles);
        }

        private async Task<AppUser> GetUser()
        {
            var appUser = await _userManager.GetUserAsync(User);
            if (appUser == null)
            {
                return null;
            }
            return appUser;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var (userId, roles) = await GetUserContext();
            var projects = await _service.GetUserProjectsAsync(userId, roles);
            // var projectsWithAuthors = await _context.Projects
            //     .Include(p => p.Author)
            //     .ToListAsync();

            var projectsPayload = await _context.Projects
                .Include(p => p.Author) // 👈 Required to get Author fields
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    SharedWithRole = p.SharedWithRole,
                    AuthorDisplayName = string.IsNullOrWhiteSpace(p.Author.DisplayName)
                        ? p.Author.Email
                        : p.Author.DisplayName,
                    AuthorEmail = p.Author.Email
                })
                .ToListAsync();

            // var projects2 = await _context.Projects.Select(p => new ProjectDto
            // {
            //     Id = p.Id,
            //     Title = p.Title,
            //     AuthorDisplayName = p.Author.DisplayName ?? "Problem getting p.Author.DisplayName",
            //     AuthorEmail = p.Author.Email ?? "Problem getting p.Author.Email",
            // }).ToListAsync();

            // return Ok(projectsWithAuthors);
            // return Ok(projects2);
            return Ok(projectsPayload);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var (userId, roles) = await GetUserContext();
            var project = await _service.GetProjectByIdAsync(id, userId, roles);
            // var projectsWithAuthors = await _context.Projects
            //     .Include(p => p.Author)
            //     .ToListAsync();

            var projects = await _context.Projects
                .Include(p => p.Author)
                .Where(p =>
                    p.OwnerId == userId || // user owns the project
                    (p.SharedWithRole != null && roles.Contains(p.SharedWithRole))
                )
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    SharedWithRole = p.SharedWithRole,
                    AuthorDisplayName = string.IsNullOrWhiteSpace(p.Author.DisplayName) ? p.Author.Email : p.Author.DisplayName,
                    AuthorEmail = p.Author.Email
                })
                .ToListAsync();
            // return Ok(projectsWithAuthors);
            return project == null ? NotFound() : Ok(project);
        }

        // [HttpPost]
        // public async Task<IActionResult> Create(Project project)
        // {
        //     var (userId, _) = await GetUserContext();
        //     project.OwnerId = userId;

        //     // var user = await _userManager.GetUserAsync(User);
        //     // if (user != null)
        //     // {
        //     //     project.Author = user;
        //     // }
        //     project.OwnerId = userId;
        //     var created = await _service.CreateProjectAsync(project);
        //     return CreatedAtAction(nameof(GetProject), new { id = created.Id }, created);
        // }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
        {
            var (userId, _) = await GetUserContext();
            var user = await _userManager.GetUserAsync(User);
            // if (user != null)
            // {
            //     Author = user;
            // }


            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                SharedWithRole = request.SharedWithRole,
                OwnerId = userId, // ← this is your "Author"
                Author = await GetUser()
            };

            var created = await _service.CreateProjectAsync(project);
            return CreatedAtAction(nameof(GetProject), new { id = created.Id, project.Author }, created);
        }

        // [HttpPut("{id}")]
        // public async Task<IActionResult> Update(int id, Project project)
        // {
        //     if (id != project.Id) return BadRequest();
        //     await _service.UpdateProjectAsync(project);
        //     return NoContent();
        // }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectDto request)
        {
            var (userId, _) = await GetUserContext();
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound();

            // prevent changing the owner
            project.Title = request.Title;
            project.Description = request.Description;
            project.SharedWithRole = request.SharedWithRole;

            // project.OwnerId = userId; // optional: re-assert ownership if needed

            await _context.SaveChangesAsync();
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
