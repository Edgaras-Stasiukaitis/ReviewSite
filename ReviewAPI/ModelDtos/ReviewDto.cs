using System;

namespace ReviewAPI.ModelDtos
{
    public record ReviewDto(int Id, string Title, string Description, int Rating, DateTime CreationDate, DateTime UpdateDate);
}
