using System.Text.Json.Serialization;

namespace ReactTypescriptAspNetCoreMVC.Server.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsComplete { get; set; }
        public int ProjectId { get; set; }

        [JsonIgnore]
        public Project? Project { get; set; }
    }
}