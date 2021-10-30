using ReviewAPI.Models;

namespace ReviewAPI
{
    public interface IUserOwnedResource
    {
        User User { get; }
    }
}
