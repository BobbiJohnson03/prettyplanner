using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GoalTracker.API.Models
{
    public class Goal
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("isCompleted")]
        public bool IsCompleted { get; set; } = false;

        [BsonElement("category")]
        public string Category { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [BsonElement("frequency")]
public string Frequency { get; set; } = string.Empty;

[BsonElement("targetCount")]
public int TargetCount { get; set; } = 0;

[BsonElement("currentCount")]
public int CurrentCount { get; set; } = 0;

[BsonElement("type")]
public string Type { get; set; } = "boolean"; // or 'counter', 'value'

[BsonElement("deadline")]
public DateTime Deadline { get; set; }

    }
}
