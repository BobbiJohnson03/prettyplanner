using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GoalTracker.API.Models 
{
    public class User
    {
        [BsonId] // informuje MongoDB, że to pole jest identyfikatorem dokumentu (odpowiednik id w SQL, klucza głównego)
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public string Username { get; set; } = null!;

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [BsonElement("avatarUrl")]
        public string AvatarUrl { get; set; } = string.Empty;

    }
}
