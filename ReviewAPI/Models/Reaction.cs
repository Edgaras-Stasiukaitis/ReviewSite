using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReviewAPI.Models
{
    public enum ReactionState : byte
    {
        NoReaction = 0,
        UpVote = 1,
        DownVote = 2
    }

    public class Reaction
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, Column(TypeName = "tinyint")]
        public ReactionState ReactionState { get; set; } = ReactionState.NoReaction;

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonIgnore]
        public virtual Review Review { get; set; }
    }
}
