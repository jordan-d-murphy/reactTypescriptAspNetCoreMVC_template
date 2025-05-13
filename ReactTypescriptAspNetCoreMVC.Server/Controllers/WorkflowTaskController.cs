using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactTypescriptAspNetCoreMVC.Server.Data.Auth;

namespace ReactTypescriptAspNetCoreMVC.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkflowTasksController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public WorkflowTasksController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkflowTasks()
        {
            var tasks = await _context.WorkflowTasks.ToListAsync();
            return Ok(tasks);
        }
    }
}
