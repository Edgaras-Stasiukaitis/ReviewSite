using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReviewAPI.Models
{
    public class Reaction
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, Column(TypeName = "tinyint")]
        public int ReactionState { get; set; } = -1;

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonIgnore]
        public virtual Review Review { get; set; }
    }
}
