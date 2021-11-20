using Microsoft.EntityFrameworkCore.Migrations;

namespace ReviewAPI.Migrations
{
    public partial class Final : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Items");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Reviews",
                type: "nvarchar(256)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Reviews");

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Items",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
