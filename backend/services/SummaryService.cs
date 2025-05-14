using GoalTracker.API.Models;
using GoalTracker.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace GoalTracker.API.Services
{
    public class SummaryService
    {
        private readonly IMongoCollection<Goal> _goals;
        private readonly IMongoCollection<KanbanTask> _tasks;

        public SummaryService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionURI);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _goals = database.GetCollection<Goal>("Goals");
            _tasks = database.GetCollection<KanbanTask>("KanbanTasks");
        }

        public async Task<int> GetCompletedGoalsCountAsync(string userId)
        {
            return (int)await _goals.CountDocumentsAsync(g => g.UserId == userId && g.IsCompleted);
        }

        public async Task<int> GetCompletedTasksCountAsync(string userId)
        {
            return (int)await _tasks.CountDocumentsAsync(t => t.UserId == userId && t.Status.ToLower() == "done");
        }

        public async Task<Dictionary<string, int>> GetGoalCompletionsByDayAsync(string userId)
        {
            var results = await _goals.Aggregate()
                .Match(g => g.UserId == userId && g.IsCompleted)
                .Group(g => g.CreatedAt.Date, g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            return results.ToDictionary(r => r.Date.ToShortDateString(), r => r.Count);
        }

        public async Task<Dictionary<string, int>> GetTaskCompletionsByDayAsync(string userId)
        {
            var results = await _tasks.Aggregate()
                .Match(t => t.UserId == userId && t.Status.ToLower() == "done")
                .Group(t => t.CreatedAt.Date, t => new { Date = t.Key, Count = t.Count() })
                .ToListAsync();

            return results.ToDictionary(r => r.Date.ToShortDateString(), r => r.Count);
        }
    }
}
