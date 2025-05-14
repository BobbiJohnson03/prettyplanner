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
            var goals = await _goals.Find(g => g.UserId == userId && g.IsCompleted).ToListAsync();

            return goals
                .Where(g => DateTime.TryParse(g.CreatedAt, out _))
                .GroupBy(g => DateTime.Parse(g.CreatedAt).Date)
                .ToDictionary(g => g.Key.ToShortDateString(), g => g.Count());
        }

        public async Task<Dictionary<string, int>> GetTaskCompletionsByDayAsync(string userId)
        {
            var tasks = await _tasks.Find(t => t.UserId == userId && t.Status.ToLower() == "done").ToListAsync();

            return tasks
                .Where(t => DateTime.TryParse(t.CreatedAt, out _))
                .GroupBy(t => DateTime.Parse(t.CreatedAt).Date)
                .ToDictionary(g => g.Key.ToShortDateString(), g => g.Count());
        }
    }
}
