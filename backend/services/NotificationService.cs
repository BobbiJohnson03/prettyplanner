using GoalTracker.API.Models;
using GoalTracker.API.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace GoalTracker.API.Services
{
    public class NotificationService
    {
        private readonly IMongoCollection<Notification> _notifications;

        public NotificationService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionURI);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _notifications = database.GetCollection<Notification>("Notifications");
        }

        public async Task<List<Notification>> GetByUserIdAsync(string userId) =>
            await _notifications.Find(n => n.UserId == userId).ToListAsync();

        public async Task<Notification?> GetByIdAsync(string id) =>
            await _notifications.Find(n => n.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Notification notification) =>
            await _notifications.InsertOneAsync(notification);

        public async Task MarkAsReadAsync(string id)
        {
            var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
            await _notifications.UpdateOneAsync(n => n.Id == id, update);
        }

        public async Task DeleteAsync(string id) =>
            await _notifications.DeleteOneAsync(n => n.Id == id);
    }
}
