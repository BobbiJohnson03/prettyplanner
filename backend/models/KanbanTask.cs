using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GoalTracker.API.Models
{
    public class KanbanTask
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // Changed to nullable string

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public string Priority { get; set; } = "medium";
        public string Status { get; set; } = "todo";
        public string Color { get; set; } = "#FFCDD2";
        [BsonElement("category")]
        public string Category { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;
        
        public DateTime Deadline { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    }
}
