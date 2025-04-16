
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GoalTracker.API.Models
{
    public class KanbanTask
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime Deadline { get; set; }
        
    } 
}