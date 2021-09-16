using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReviewAPI.Models
{
    public class Review
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Column(TypeName = "text")]
        public string Description { get; set; }
        [Required, Column(TypeName = "int")]
        public int Rating { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; }
    }
}