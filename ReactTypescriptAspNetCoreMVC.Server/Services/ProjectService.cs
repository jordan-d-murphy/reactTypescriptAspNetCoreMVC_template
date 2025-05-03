using Microsoft.EntityFrameworkCore;
using ReactTypescriptAspNetCoreMVC.Server.Data.Auth;
using ReactTypescriptAspNetCoreMVC.Server.Entities;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;

namespace ReactTypescriptAspNetCoreMVC.Server.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AuthDbContext _context;

        public ProjectService(AuthDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Project>> GetUserProjectsAsync(string userId, IList<string> roles)
        {
            return await _context.Projects
                .Include(p => p.Tasks)
                .Where(p => p.OwnerId == userId || (p.SharedWithRole != null && roles.Contains(p.SharedWithRole)))
                .ToListAsync();
        }

        public async Task<Project?> GetProjectByIdAsync(int id, string userId, IList<string> roles)
        {
            return await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id && (p.OwnerId == userId || (p.SharedWithRole != null && roles.Contains(p.SharedWithRole))));
        }

        public async Task<Project> CreateProjectAsync(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task UpdateProjectAsync(Project project)
        {
            _context.Projects.Update(project);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProjectAsync(int id, string userId)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.OwnerId == userId);
            if (project != null)
            {
                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
            }
        }
    }
}
