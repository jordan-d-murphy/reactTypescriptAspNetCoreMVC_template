using ReactTypescriptAspNetCoreMVC.Server.Entities;

namespace ReactTypescriptAspNetCoreMVC.Server.Interfaces
{
    public interface IProjectService
    {
        Task<IEnumerable<Project>> GetUserProjectsAsync(string userId, IList<string> roles);
        Task<Project?> GetProjectByIdAsync(int id, string userId, IList<string> roles);
        Task<Project> CreateProjectAsync(Project project);
        Task UpdateProjectAsync(Project project);
        Task DeleteProjectAsync(int id, string userId);
    }
}