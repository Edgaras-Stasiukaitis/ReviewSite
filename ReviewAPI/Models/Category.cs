using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReviewAPI.Models
{
    public class Category
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Category name is required."), Column(TypeName = "nvarchar(128)")]
        public string Name { get; set; }

        [Column(TypeName = "text")]
        public string ImageURL { get; set; }

        [JsonIgnore]
        public virtual ICollection<Item> Items { get; set; }
    }
}
