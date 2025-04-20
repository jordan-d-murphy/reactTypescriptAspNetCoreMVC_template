using Microsoft.AspNetCore.Mvc;

namespace MyApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToolsController : ControllerBase
{
    [HttpGet("uuid")]
    public IActionResult GetUuid()
    {
        return Ok(Guid.NewGuid().ToString());
    }

    [HttpGet("timestamp")]
    public IActionResult GetTimestamp()
    {
        return Ok(DateTime.UtcNow.ToString("O")); // ISO 8601 format
    }

    [HttpGet("random")]
    public IActionResult GetRandomNumber()
    {
        return Ok(new Random().Next(1, 101)); // Random 1-100
    }
}