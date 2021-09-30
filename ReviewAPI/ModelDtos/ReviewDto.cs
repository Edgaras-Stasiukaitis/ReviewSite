using System;

namespace ReviewAPI.ModelDtos
{
    public record ReviewDto(int Id, string Description, int Rating, DateTime CreationDate);
}
