using GoalTracker.API.Models;
using GoalTracker.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace GoalTracker.API.Services
{
    public class GoalService
    {
        private readonly IMongoCollection<Goal> _goals;

        public GoalService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionURI);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _goals = database.GetCollection<Goal>(settings.Value.GoalsCollectionName);
        }

        public async Task<List<Goal>> GetAsync() =>
            await _goals.Find(_ => true).ToListAsync();

        public async Task<Goal> GetByIdAsync(string id) =>
            await _goals.Find(g => g.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Goal goal) =>
            await _goals.InsertOneAsync(goal);

        public async Task UpdateAsync(string id, Goal updatedGoal) =>
            await _goals.ReplaceOneAsync(g => g.Id == id, updatedGoal);

        public async Task DeleteAsync(string id) =>
            await _goals.DeleteOneAsync(g => g.Id == id);
    }
}
