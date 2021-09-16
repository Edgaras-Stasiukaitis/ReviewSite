using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewAPI.Models;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReviewAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet, Route("GetItem")]
        public object GetItem()
        {
            return new
            {
                Name = "Test",
                Age = 30
            };
        }
    }
}