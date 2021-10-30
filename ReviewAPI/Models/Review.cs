using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReviewAPI.Models
{
    public class Review : IUserOwnedResource
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "text")]
        public string Description { get; set; }

        [Required, Column(TypeName = "int")]
        public int Rating { get; set; }

        [Required, Column(TypeName = "datetime")]
        public DateTime CreationDate { get; set; } = DateTime.Now;

        [Required, Column(TypeName = "datetime")]
        public DateTime UpdateDate { get; set; } = DateTime.Now;

        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonIgnore]
        public virtual Item Item { get; set; }

        [JsonIgnore]
        public virtual ICollection<Reaction> Reactions { get; set; }
    }
}