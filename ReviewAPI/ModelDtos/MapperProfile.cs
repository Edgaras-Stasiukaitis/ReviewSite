using AutoMapper;
using ReviewAPI.ModelDtos;
using ReviewAPI.Models;

namespace ReviewAPI
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Category, CategoryDto>();
            CreateMap<Item, ItemDto>();
            CreateMap<Review, ReviewDto>();
            CreateMap<Reaction, ReactionDto>();
            CreateMap<User, UserDto>();
        }
    }
}
