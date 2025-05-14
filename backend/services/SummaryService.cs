using GoalTracker.API.Models;
using GoalTracker.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
// using System.Globalization; // Niepotrzebne jeśli zakomentowane metody są nieużywane

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

        // 🔒 Tymczasowo zakomentowane — powodowały błędy przy kompilacji
        // public async Task<Dictionary<string, int>> GetGoalCompletionsByDayAsync(string userId)
        // {
        //     var goals = await _goals
        //         .Find(g => g.UserId == userId && g.IsCompleted)
        //         .ToListAsync();

        //     var grouped = new Dictionary<string, int>();

        //     foreach (var goal in goals)
        //     {
        //         if (DateTime.TryParse(goal.CreatedAt, out var date))
        //         {
        //             var key = date.ToString("yyyy-MM-dd");
        //             if (grouped.ContainsKey(key))
        //                 grouped[key]++;
        //             else
        //                 grouped[key] = 1;
        //         }
        //     }

        //     return grouped;
        // }

        // public async Task<Dictionary<string, int>> GetTaskCompletionsByDayAsync(string userId)
        // {
        //     var tasks = await _tasks
        //         .Find(t => t.UserId == userId && t.Status.ToLower() == "done")
        //         .ToListAsync();

        //     var grouped = new Dictionary<string, int>();

        //     foreach (var task in tasks)
        //     {
        //         if (DateTime.TryParse(task.CreatedAt, out var date))
        //         {
        //             var key = date.ToString("yyyy-MM-dd");
        //             if (grouped.ContainsKey(key))
        //                 grouped[key]++;
        //             else
        //                 grouped[key] = 1;
        //         }
        //     }

        //     return grouped;
        // }
    }
}