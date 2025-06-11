using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations; // Keep this if you have other [Required] attributes, but remove for Title
using System; // Required for DateTime

namespace GoalTracker.API.Models
{
    public class KanbanTask
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        // REMOVE THE TEMPORARY [Required] ATTRIBUTE HERE!
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;
        
        [BsonElement("priority")]
        public string Priority { get; set; } = "medium";

        [BsonElement("status")]
        public string Status { get; set; } = "todo";

        [BsonElement("color")]
        [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Color must be a valid hex code (e.g., #RRGGBB).")]
        public string Color { get; set; } = "#FFCDD2";

        [BsonElement("category")]
        public string Category { get; set; } = string.Empty;

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)] // Assuming UserId is stored as a MongoDB ObjectId
        // --- CRITICAL FIX: Make UserId nullable for PUT payloads ---
        public string? UserId { get; set; } // Change from null! to string?
        // --- END CRITICAL FIX ---

        [BsonElement("deadline")]
        public DateTime Deadline { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("orderIndex")]
        public float OrderIndex { get; set; } = 0;
    }
}