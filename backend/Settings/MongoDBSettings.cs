namespace GoalTracker.API.Settings
{
    public class MongoDBSettings
    {
        public string ConnectionURI { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string GoalsCollectionName { get; set; } = null!;
    }
}
