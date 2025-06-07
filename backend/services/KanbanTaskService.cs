using GoalTracker.API.Models;
using GoalTracker.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace GoalTracker.API.Services
{
    public class KanbanTaskService
    {
        private readonly IMongoCollection<KanbanTask> _tasks;

        public KanbanTaskService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionURI);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _tasks = database.GetCollection<KanbanTask>("KanbanTasks");
        }

        public async Task<List<KanbanTask>> GetByUserIdAsync(string userId) =>
            await _tasks.Find(t => t.UserId == userId).ToListAsync();

        public async Task<KanbanTask?> GetByIdAsync(string id) =>
            await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(KanbanTask task) =>
            await _tasks.InsertOneAsync(task);

        public async Task UpdateAsync(string id, KanbanTask updatedTask) =>
            await _tasks.ReplaceOneAsync(t => t.Id == id, updatedTask);

        public async Task DeleteAsync(string id) =>
            await _tasks.DeleteOneAsync(t => t.Id == id);

            public async Task DeleteByCategoryAsync(string userId, string categoryName)
{
    var filter = Builders<KanbanTask>.Filter.Eq(t => t.UserId, userId) &
                 Builders<KanbanTask>.Filter.Eq(t => t.Category, categoryName);

    await _tasks.DeleteManyAsync(filter);

}

    }
}
