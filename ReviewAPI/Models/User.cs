using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReviewAPI.Models
{
    public class User : IdentityUser
    {
        [Required, Column(TypeName = "nvarchar(150)")]
        public string FirstName { get; set; }

        [Required, Column(TypeName = "nvarchar(150)")]
        public string LastName { get; set; }

        [Required, Column(TypeName = "nvarchar(150)")]
        public string Role { get; set; }

        [JsonIgnore]
        public virtual ICollection<Review> Reviews { get; set; }

        [JsonIgnore]
        public virtual ICollection<Reaction> Reactions { get; set; }
    }
}