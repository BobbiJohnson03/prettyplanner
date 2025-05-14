using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GoalTracker.API.Models
{
    public class KanbanTask
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Deadline { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public string Status { get; set; } = "todo";
        public string Color { get; set; } = "#FFCDD2";
        public string UserId { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}
