using GoalTracker.API.Models;
using GoalTracker.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace GoalTracker.API.Services
{
    public class CategoryService
    {
        private readonly IMongoCollection<Category> _categories;

        public CategoryService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionURI);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _categories = database.GetCollection<Category>("Categories");
        }

        public async Task<List<Category>> GetByUserIdAsync(string userId) =>
            await _categories.Find(c => c.UserId == userId).ToListAsync();

        public async Task<Category?> GetByIdAsync(string id) =>
            await _categories.Find(c => c.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Category category) =>
            await _categories.InsertOneAsync(category);

        public async Task UpdateAsync(string id, Category updatedCategory) =>
            await _categories.ReplaceOneAsync(c => c.Id == id, updatedCategory);

        public async Task DeleteAsync(string id) =>
            await _categories.DeleteOneAsync(c => c.Id == id);
    }
}
