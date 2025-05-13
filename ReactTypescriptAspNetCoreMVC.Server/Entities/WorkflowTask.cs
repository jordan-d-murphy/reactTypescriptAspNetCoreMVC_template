namespace ReactTypescriptAspNetCoreMVC.Server.Entities
{
    public class WorkflowTask
    {
        public WorkflowTask(string id, string key, string title, string status, string label, string priority)
        {
            Id = id;
            Key = key;
            Title = title;
            Status = status;
            Label = label;
            Priority = priority;
        }
        public string Id { get; set; }
        public string Key { get; set; }
        public string Title { get; set; }
        public string Status { get; set; }
        public string Label { get; set; }
        public string Priority { get; set; }
        public string V1 { get; }
        public string V2 { get; }
        public string V3 { get; }
        public string V4 { get; }
        public string V5 { get; }
    }
}
