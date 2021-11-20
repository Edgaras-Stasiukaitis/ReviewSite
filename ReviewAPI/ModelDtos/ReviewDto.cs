using ReviewAPI.Models;
using System;
using System.Collections.Generic;

namespace ReviewAPI.ModelDtos
{
    public record ReviewDto(int Id, string Title, string Description, int Rating, DateTime CreationDate, DateTime UpdateDate);
}
