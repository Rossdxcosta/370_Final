using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Team04_API.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Anomaly",
                columns: table => new
                {
                    Anomaly_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Anomaly_Description = table.Column<string>(type: "text", nullable: true),
                    Anomaly_Status = table.Column<string>(type: "text", nullable: true),
                    Anomaly_DateTime_Started = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    anomalyReports = table.Column<string>(type: "jsonb", nullable: true),
                    IntervalRecord = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anomaly", x => x.Anomaly_ID);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    TableName = table.Column<string>(type: "text", nullable: true),
                    DateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OldValues = table.Column<string>(type: "text", nullable: true),
                    NewValues = table.Column<string>(type: "text", nullable: true),
                    AffectedColumns = table.Column<string>(type: "text", nullable: true),
                    PrimaryKey = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    Company_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Company_Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Location_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.Company_ID);
                });

            migrationBuilder.CreateTable(
                name: "Country",
                columns: table => new
                {
                    Country_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Country_Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Region = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    SubRegion = table.Column<string>(type: "text", nullable: true),
                    iso3Code = table.Column<string>(type: "text", nullable: true),
                    phone_code = table.Column<string>(type: "text", nullable: true),
                    native = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.Country_ID);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Department_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Department_Name = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Department_Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Department_ID);
                });

            migrationBuilder.CreateTable(
                name: "FAQ_Category",
                columns: table => new
                {
                    FAQ_Category_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FAQ_Category_Name = table.Column<string>(type: "text", nullable: false),
                    FAQ_Category_Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQ_Category", x => x.FAQ_Category_ID);
                });

            migrationBuilder.CreateTable(
                name: "Language",
                columns: table => new
                {
                    Language_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Language", x => x.Language_ID);
                });

            migrationBuilder.CreateTable(
                name: "Login_Status",
                columns: table => new
                {
                    Login_Status_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Login_Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Login_Status", x => x.Login_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "Priority",
                columns: table => new
                {
                    Priority_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Priority_Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Priority_Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    BreachTime = table.Column<TimeSpan>(type: "interval", nullable: false, defaultValue: new TimeSpan(365, 0, 0, 0, 0))
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Priority", x => x.Priority_ID);
                });

            migrationBuilder.CreateTable(
                name: "Report_Interval",
                columns: table => new
                {
                    Report_Interval_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Report_Interval_Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Report_Interval_Value = table.Column<int>(type: "integer", nullable: false),
                    Report_Interval_Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report_Interval", x => x.Report_Interval_ID);
                });

            migrationBuilder.CreateTable(
                name: "Report_Type",
                columns: table => new
                {
                    Report_Type_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Report_Type_Name = table.Column<string>(type: "text", nullable: false),
                    Report_Type_Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report_Type", x => x.Report_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "Request_Type",
                columns: table => new
                {
                    Request_Type_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Request_Type", x => x.Request_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Role_Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Software",
                columns: table => new
                {
                    Software_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Software_Name = table.Column<string>(type: "text", nullable: true),
                    Software_Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Software", x => x.Software_ID);
                });

            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Tag_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Department_ID = table.Column<int>(type: "integer", nullable: true),
                    Tag_Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Tag_Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Tag_ID);
                });

            migrationBuilder.CreateTable(
                name: "Ticket_Status",
                columns: table => new
                {
                    Ticket_Status_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Status_Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status_Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ticket_Status", x => x.Ticket_Status_ID);
                });

            migrationBuilder.CreateTable(
                name: "TicketGroup",
                columns: table => new
                {
                    TicketGroup_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketGroup", x => x.TicketGroup_ID);
                });

            migrationBuilder.CreateTable(
                name: "Title",
                columns: table => new
                {
                    Title_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title_Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Title", x => x.Title_ID);
                });

            migrationBuilder.CreateTable(
                name: "VDI_Type",
                columns: table => new
                {
                    VDI_Type_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VDI_Type_Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    VDI_Type_Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VDI_Type", x => x.VDI_Type_ID);
                });

            migrationBuilder.CreateTable(
                name: "States",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    State_Code = table.Column<string>(type: "text", nullable: false),
                    Country_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_States", x => x.Id);
                    table.ForeignKey(
                        name: "FK_States_Country_Country_ID",
                        column: x => x.Country_ID,
                        principalTable: "Country",
                        principalColumn: "Country_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DepartmentTag",
                columns: table => new
                {
                    Department_ID = table.Column<int>(type: "integer", nullable: false),
                    Tag_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentTag", x => new { x.Department_ID, x.Tag_ID });
                    table.ForeignKey(
                        name: "FK_DepartmentTag_Department_Department_ID",
                        column: x => x.Department_ID,
                        principalTable: "Department",
                        principalColumn: "Department_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DepartmentTag_Tag_Tag_ID",
                        column: x => x.Tag_ID,
                        principalTable: "Tag",
                        principalColumn: "Tag_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    User_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    User_Name = table.Column<string>(type: "text", nullable: false),
                    User_Surname = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    profile_icon = table.Column<string>(type: "text", nullable: false),
                    isHod = table.Column<bool>(type: "boolean", nullable: false),
                    User_DOB = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    User_LastLogin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Department_ID = table.Column<int>(type: "integer", nullable: true),
                    Language_ID = table.Column<int>(type: "integer", nullable: true),
                    Title_ID = table.Column<int>(type: "integer", nullable: true),
                    Login_Status_ID = table.Column<int>(type: "integer", nullable: true),
                    Credential_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Role_ID = table.Column<int>(type: "integer", nullable: false),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    Company_ID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.User_ID);
                    table.ForeignKey(
                        name: "FK_User_Company_Company_ID",
                        column: x => x.Company_ID,
                        principalTable: "Company",
                        principalColumn: "Company_ID");
                    table.ForeignKey(
                        name: "FK_User_Department_Department_ID",
                        column: x => x.Department_ID,
                        principalTable: "Department",
                        principalColumn: "Department_ID");
                    table.ForeignKey(
                        name: "FK_User_Language_Language_ID",
                        column: x => x.Language_ID,
                        principalTable: "Language",
                        principalColumn: "Language_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_User_Login_Status_Login_Status_ID",
                        column: x => x.Login_Status_ID,
                        principalTable: "Login_Status",
                        principalColumn: "Login_Status_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_User_Role_Role_ID",
                        column: x => x.Role_ID,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_User_Title_Title_ID",
                        column: x => x.Title_ID,
                        principalTable: "Title",
                        principalColumn: "Title_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "VDI",
                columns: table => new
                {
                    VDI_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VDI_Type_ID = table.Column<int>(type: "integer", nullable: false),
                    VDI_Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VDI", x => x.VDI_ID);
                    table.ForeignKey(
                        name: "FK_VDI_VDI_Type_VDI_Type_ID",
                        column: x => x.VDI_Type_ID,
                        principalTable: "VDI_Type",
                        principalColumn: "VDI_Type_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "City",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    State_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.Id);
                    table.ForeignKey(
                        name: "FK_City_States_State_ID",
                        column: x => x.State_ID,
                        principalTable: "States",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Company_Request",
                columns: table => new
                {
                    Company_Request_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Company_Name = table.Column<string>(type: "text", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    Request_Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    isActive = table.Column<bool>(type: "boolean", nullable: false),
                    Company_ID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company_Request", x => x.Company_Request_ID);
                    table.ForeignKey(
                        name: "FK_Company_Request_Company_Company_ID",
                        column: x => x.Company_ID,
                        principalTable: "Company",
                        principalColumn: "Company_ID");
                    table.ForeignKey(
                        name: "FK_Company_Request_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Credential",
                columns: table => new
                {
                    Credential_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true),
                    Otp = table.Column<int>(type: "integer", nullable: true),
                    Security_Answer = table.Column<string>(type: "text", nullable: true),
                    User_ID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credential", x => x.Credential_ID);
                    table.ForeignKey(
                        name: "FK_Credential_User_User_ID",
                        column: x => x.User_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "employeeReports",
                columns: table => new
                {
                    Report_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Report_Title = table.Column<string>(type: "text", nullable: false),
                    Report_Description = table.Column<string>(type: "text", nullable: false),
                    Report_Date_Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Employee_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Report_Type_ID = table.Column<int>(type: "integer", nullable: false),
                    Report_Interval_ID = table.Column<int>(type: "integer", nullable: false),
                    NextDueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employeeReports", x => x.Report_ID);
                    table.ForeignKey(
                        name: "FK_employeeReports_Report_Interval_Report_Interval_ID",
                        column: x => x.Report_Interval_ID,
                        principalTable: "Report_Interval",
                        principalColumn: "Report_Interval_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_employeeReports_Report_Type_Report_Type_ID",
                        column: x => x.Report_Type_ID,
                        principalTable: "Report_Type",
                        principalColumn: "Report_Type_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_employeeReports_User_Employee_ID",
                        column: x => x.Employee_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "FAQ",
                columns: table => new
                {
                    FAQ_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FAQ_Question = table.Column<string>(type: "text", nullable: false),
                    FAQ_Answer = table.Column<string>(type: "text", nullable: false),
                    FAQ_Category_ID = table.Column<int>(type: "integer", nullable: false),
                    User_ID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQ", x => x.FAQ_ID);
                    table.ForeignKey(
                        name: "FK_FAQ_FAQ_Category_FAQ_Category_ID",
                        column: x => x.FAQ_Category_ID,
                        principalTable: "FAQ_Category",
                        principalColumn: "FAQ_Category_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_FAQ_User_User_ID",
                        column: x => x.User_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Software_Request",
                columns: table => new
                {
                    Software_Request_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Software_ID = table.Column<int>(type: "integer", nullable: false),
                    Request_Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Software_Request", x => x.Software_Request_ID);
                    table.ForeignKey(
                        name: "FK_Software_Request_Software_Software_ID",
                        column: x => x.Software_ID,
                        principalTable: "Software",
                        principalColumn: "Software_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Software_Request_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "SoftwareUser",
                columns: table => new
                {
                    Software_ID = table.Column<int>(type: "integer", nullable: false),
                    UsersUser_ID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoftwareUser", x => new { x.Software_ID, x.UsersUser_ID });
                    table.ForeignKey(
                        name: "FK_SoftwareUser_Software_Software_ID",
                        column: x => x.Software_ID,
                        principalTable: "Software",
                        principalColumn: "Software_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SoftwareUser_User_UsersUser_ID",
                        column: x => x.UsersUser_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ticket",
                columns: table => new
                {
                    Ticket_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Assigned_Employee_ID = table.Column<Guid>(type: "uuid", nullable: true),
                    Chatbot_Log_ID = table.Column<int>(type: "integer", nullable: true),
                    Tag_ID = table.Column<int>(type: "integer", nullable: false),
                    Priority_ID = table.Column<int>(type: "integer", nullable: false),
                    Anomaly_ID = table.Column<int>(type: "integer", nullable: true),
                    Ticket_Status_ID = table.Column<int>(type: "integer", nullable: false),
                    Ticket_Description = table.Column<string>(type: "text", nullable: false),
                    Ticket_Date_Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ticket_Date_Resolved = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Ticket_Subscription = table.Column<bool>(type: "boolean", nullable: false),
                    isOpen = table.Column<bool>(type: "boolean", nullable: false),
                    Client_Feedback_ID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ticket", x => x.Ticket_ID);
                    table.ForeignKey(
                        name: "FK_Ticket_Anomaly_Anomaly_ID",
                        column: x => x.Anomaly_ID,
                        principalTable: "Anomaly",
                        principalColumn: "Anomaly_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Ticket_Priority_Priority_ID",
                        column: x => x.Priority_ID,
                        principalTable: "Priority",
                        principalColumn: "Priority_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Ticket_Tag_Tag_ID",
                        column: x => x.Tag_ID,
                        principalTable: "Tag",
                        principalColumn: "Tag_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Ticket_Ticket_Status_Ticket_Status_ID",
                        column: x => x.Ticket_Status_ID,
                        principalTable: "Ticket_Status",
                        principalColumn: "Ticket_Status_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Ticket_User_Assigned_Employee_ID",
                        column: x => x.Assigned_Employee_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Ticket_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "User_Account_Requests",
                columns: table => new
                {
                    Request_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Role_ID = table.Column<int>(type: "integer", nullable: false),
                    User_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Request_Type_ID = table.Column<int>(type: "integer", nullable: false),
                    Request_Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Account_Requests", x => x.Request_ID);
                    table.ForeignKey(
                        name: "FK_User_Account_Requests_Request_Type_Request_Type_ID",
                        column: x => x.Request_Type_ID,
                        principalTable: "Request_Type",
                        principalColumn: "Request_Type_ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_User_Account_Requests_Role_Role_ID",
                        column: x => x.Role_ID,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_User_Account_Requests_User_User_ID",
                        column: x => x.User_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Client_VDI",
                columns: table => new
                {
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    VDI_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client_VDI", x => new { x.Client_ID, x.VDI_ID });
                    table.ForeignKey(
                        name: "FK_Client_VDI_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Client_VDI_VDI_VDI_ID",
                        column: x => x.VDI_ID,
                        principalTable: "VDI",
                        principalColumn: "VDI_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Software_VDI",
                columns: table => new
                {
                    VDI_ID = table.Column<int>(type: "integer", nullable: false),
                    Software_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Software_VDI", x => new { x.Software_ID, x.VDI_ID });
                    table.ForeignKey(
                        name: "FK_Software_VDI_Software_Software_ID",
                        column: x => x.Software_ID,
                        principalTable: "Software",
                        principalColumn: "Software_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Software_VDI_VDI_VDI_ID",
                        column: x => x.VDI_ID,
                        principalTable: "VDI",
                        principalColumn: "VDI_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "VDI_Request",
                columns: table => new
                {
                    VDI_Request_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Request_Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VDI_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VDI_Request", x => x.VDI_Request_ID);
                    table.ForeignKey(
                        name: "FK_VDI_Request_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_VDI_Request_VDI_VDI_ID",
                        column: x => x.VDI_ID,
                        principalTable: "VDI",
                        principalColumn: "VDI_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Location_ID = table.Column<int>(type: "integer", nullable: false),
                    City_ID = table.Column<int>(type: "integer", nullable: false),
                    Street_Address = table.Column<string>(type: "text", nullable: false),
                    PostalCode = table.Column<int>(type: "integer", nullable: false),
                    Company_ID = table.Column<int>(type: "integer", nullable: false),
                    CityId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Location_ID);
                    table.ForeignKey(
                        name: "FK_Location_City_CityId",
                        column: x => x.CityId,
                        principalTable: "City",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Location_Company_Location_ID",
                        column: x => x.Location_ID,
                        principalTable: "Company",
                        principalColumn: "Company_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OTP",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userID = table.Column<Guid>(type: "uuid", nullable: true),
                    email = table.Column<string>(type: "text", nullable: false),
                    pin = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OTP", x => x.id);
                    table.ForeignKey(
                        name: "FK_OTP_Credential_userID",
                        column: x => x.userID,
                        principalTable: "Credential",
                        principalColumn: "Credential_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Chatbot_Log",
                columns: table => new
                {
                    Chatbot_Log_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Conversation_Title = table.Column<string>(type: "text", nullable: true),
                    isBotConcluded = table.Column<bool>(type: "boolean", nullable: false),
                    isBotHandedOver = table.Column<bool>(type: "boolean", nullable: false),
                    isDismissed = table.Column<bool>(type: "boolean", nullable: false),
                    Conversation_Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ticket_ID = table.Column<int>(type: "integer", nullable: true),
                    Agent_ID = table.Column<Guid>(type: "uuid", nullable: true),
                    ChatUUID = table.Column<Guid>(type: "uuid", nullable: true),
                    chat = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chatbot_Log", x => x.Chatbot_Log_ID);
                    table.ForeignKey(
                        name: "FK_Chatbot_Log_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Chatbot_Log_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ticket_Updates",
                columns: table => new
                {
                    Ticket_Update_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ticket_ID = table.Column<int>(type: "integer", nullable: false),
                    Ticket_Status_Old_ID = table.Column<int>(type: "integer", nullable: true),
                    Ticket_Status_New_ID = table.Column<int>(type: "integer", nullable: true),
                    DateOfChange = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    hasBeenDismissed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ticket_Updates", x => x.Ticket_Update_ID);
                    table.ForeignKey(
                        name: "FK_Ticket_Updates_Ticket_Status_Ticket_Status_New_ID",
                        column: x => x.Ticket_Status_New_ID,
                        principalTable: "Ticket_Status",
                        principalColumn: "Ticket_Status_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Ticket_Updates_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "TicketEscalation",
                columns: table => new
                {
                    Escalation_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ticket_ID = table.Column<int>(type: "integer", nullable: false),
                    Previous_Employee_ID = table.Column<Guid>(type: "uuid", nullable: true),
                    New_Employee_ID = table.Column<Guid>(type: "uuid", nullable: true),
                    ReasonForEscalation = table.Column<string>(type: "text", nullable: false),
                    HasBeenEscalated = table.Column<bool>(type: "boolean", nullable: false),
                    Date_of_Escalation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketEscalation", x => x.Escalation_ID);
                    table.ForeignKey(
                        name: "FK_TicketEscalation_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketEscalation_User_New_Employee_ID",
                        column: x => x.New_Employee_ID,
                        principalTable: "User",
                        principalColumn: "User_ID");
                    table.ForeignKey(
                        name: "FK_TicketEscalation_User_Previous_Employee_ID",
                        column: x => x.Previous_Employee_ID,
                        principalTable: "User",
                        principalColumn: "User_ID");
                });

            migrationBuilder.CreateTable(
                name: "ticketTicketGroups",
                columns: table => new
                {
                    Ticket_ID = table.Column<int>(type: "integer", nullable: false),
                    TicketGroup_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ticketTicketGroups", x => new { x.Ticket_ID, x.TicketGroup_ID });
                    table.ForeignKey(
                        name: "FK_ticketTicketGroups_TicketGroup_TicketGroup_ID",
                        column: x => x.TicketGroup_ID,
                        principalTable: "TicketGroup",
                        principalColumn: "TicketGroup_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ticketTicketGroups_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "To_do_List",
                columns: table => new
                {
                    To_do_List_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ticket_ID = table.Column<int>(type: "integer", nullable: false),
                    Item_Description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Is_Completed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_To_do_List", x => x.To_do_List_ID);
                    table.ForeignKey(
                        name: "FK_To_do_List_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "To_do_List_Items",
                columns: table => new
                {
                    To_Do_Note_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ticket_ID = table.Column<int>(type: "integer", nullable: false),
                    Note_Description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_To_do_List_Items", x => x.To_Do_Note_ID);
                    table.ForeignKey(
                        name: "FK_To_do_List_Items_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "DepartmentLocation",
                columns: table => new
                {
                    Department_ID = table.Column<int>(type: "integer", nullable: false),
                    Location_ID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepartmentLocation", x => new { x.Department_ID, x.Location_ID });
                    table.ForeignKey(
                        name: "FK_DepartmentLocation_Department_Department_ID",
                        column: x => x.Department_ID,
                        principalTable: "Department",
                        principalColumn: "Department_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DepartmentLocation_Location_Location_ID",
                        column: x => x.Location_ID,
                        principalTable: "Location",
                        principalColumn: "Location_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Client_Feedback",
                columns: table => new
                {
                    Client_Feedback_ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Client_ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Client_Feedback_Detail = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Chatbot_Log_ID = table.Column<int>(type: "integer", nullable: true),
                    Feedback_Date_Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Ticket_ID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client_Feedback", x => x.Client_Feedback_ID);
                    table.ForeignKey(
                        name: "FK_Client_Feedback_Chatbot_Log_Chatbot_Log_ID",
                        column: x => x.Chatbot_Log_ID,
                        principalTable: "Chatbot_Log",
                        principalColumn: "Chatbot_Log_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Client_Feedback_Ticket_Ticket_ID",
                        column: x => x.Ticket_ID,
                        principalTable: "Ticket",
                        principalColumn: "Ticket_ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Client_Feedback_User_Client_ID",
                        column: x => x.Client_ID,
                        principalTable: "User",
                        principalColumn: "User_ID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Company",
                columns: new[] { "Company_ID", "Company_Name", "Location_ID" },
                values: new object[,]
                {
                    { 1, "Mini", 0 },
                    { 2, "Rolce Royce", 0 }
                });

            migrationBuilder.InsertData(
                table: "Department",
                columns: new[] { "Department_ID", "Department_Description", "Department_Name" },
                values: new object[,]
                {
                    { 1, "Handles infrastructure related issues", "Infrastructure" },
                    { 2, "Handles connectivity related issues", "Connectivity" },
                    { 3, "Handles general support related issues", "General Support" }
                });

            migrationBuilder.InsertData(
                table: "Language",
                columns: new[] { "Language_ID", "Description" },
                values: new object[,]
                {
                    { 1, "English" },
                    { 2, "Afrikaans" },
                    { 3, "German" },
                    { 4, "Xhosa" },
                    { 5, "Venda" }
                });

            migrationBuilder.InsertData(
                table: "Login_Status",
                columns: new[] { "Login_Status_ID", "Login_Description" },
                values: new object[,]
                {
                    { 1, "Logged in" },
                    { 2, "Logged out" }
                });

            migrationBuilder.InsertData(
                table: "Priority",
                columns: new[] { "Priority_ID", "BreachTime", "Priority_Description", "Priority_Name" },
                values: new object[,]
                {
                    { 1, new TimeSpan(365, 0, 0, 0, 0), "Low priority", "Low" },
                    { 2, new TimeSpan(365, 0, 0, 0, 0), "Medium priority", "Medium" },
                    { 3, new TimeSpan(365, 0, 0, 0, 0), "High priority", "High" }
                });

            migrationBuilder.InsertData(
                table: "Report_Interval",
                columns: new[] { "Report_Interval_ID", "Report_Interval_Description", "Report_Interval_Name", "Report_Interval_Value" },
                values: new object[,]
                {
                    { 1, " Reports will be scheduled daily", "Daily", 1 },
                    { 2, " Reports will be scheduled weekly", "Weekly", 7 },
                    { 3, " Reports will be scheduled Bi-weekly", "Bi-weekly", 14 },
                    { 4, " Reports will be scheduled Monthly", "Monthly", 31 }
                });

            migrationBuilder.InsertData(
                table: "Report_Type",
                columns: new[] { "Report_Type_ID", "Report_Type_Description", "Report_Type_Name" },
                values: new object[,]
                {
                    { 1, "This report lists all currently open tickets, providing insights into unresolved issues. It includes details such as Ticket ID, Ticket Description, Created Date, Assigned Employee, and Priority helping managers track outstanding tasks and allocate resources effectively.", "Open Tickets Reports" },
                    { 2, "This report provides a monthly breakdown of ticket data, categorized by ticket statuses. It includes headings for Ticket ID, Ticket Description and relevant data for the ticket status. This helps in identifying trends and evaluating the efficiency of the support team over time.", "Ticket Status Summary Report" }
                });

            migrationBuilder.InsertData(
                table: "Request_Type",
                columns: new[] { "Request_Type_ID", "Description" },
                values: new object[,]
                {
                    { 1, "New Acount" },
                    { 2, "Delete Account" }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "Name", "Role_Description" },
                values: new object[,]
                {
                    { 1, "Guest", "Basic rights role granted to new user accounts" },
                    { 2, "Client", "Clients who have access to our proprietary chatbot and our VDI services" },
                    { 3, "Employee", "Basic rights role granted to employees to handle tickets and support issues" },
                    { 4, "Admin", "Second highest access role for reserved personnel who oversee the activities of other employees" },
                    { 5, "SuperAdmin", "Highest level of access, oversee the activities of Administrators" }
                });

            migrationBuilder.InsertData(
                table: "Tag",
                columns: new[] { "Tag_ID", "Department_ID", "Tag_Description", "Tag_Name" },
                values: new object[,]
                {
                    { 1, 1, "Infrastructure related issues", "Infrastructure" },
                    { 2, 1, "Connectivity related issues", "Connectivity" },
                    { 3, 1, "General support related issues", "General Support" }
                });

            migrationBuilder.InsertData(
                table: "Ticket_Status",
                columns: new[] { "Ticket_Status_ID", "Status_Description", "Status_Name" },
                values: new object[,]
                {
                    { 1, "Ticket is open", "Open" },
                    { 2, "Ticket is being worked on", "In Progress" },
                    { 3, "Ticket is closed", "Closed" },
                    { 4, "Ticket has been re-opened", "Reopened" },
                    { 5, "Ticket has been breached", "Breached" }
                });

            migrationBuilder.InsertData(
                table: "Title",
                columns: new[] { "Title_ID", "Title_Description" },
                values: new object[,]
                {
                    { 1, "Mr" },
                    { 2, "Mrs" },
                    { 3, "Ms" },
                    { 4, "Miss" },
                    { 5, "Dr" },
                    { 6, "Prof" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "User_ID", "Company_ID", "Credential_ID", "Department_ID", "Language_ID", "Login_Status_ID", "Role_ID", "Title_ID", "User_DOB", "User_LastLogin", "User_Name", "User_Surname", "email", "isActive", "isHod", "phone", "profile_icon" },
                values: new object[,]
                {
                    { new Guid("0fd2cb56-1a32-40a9-8f92-10f72dce0e52"), null, new Guid("8bbb3c8a-041e-4bac-8874-f0c5b5785540"), 1, 1, 1, 1, 1, new DateTime(2003, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7288), "Informatics", "Quintet", "iqguest@gmail.com", true, false, "", "" },
                    { new Guid("125afbf7-72ec-4ad3-b784-0e72b260d7ed"), null, new Guid("0fe1d4ea-3c34-48a4-ab14-69524ab0d055"), 1, 1, 1, 1, 2, new DateTime(1988, 1, 30, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 2, 29, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7257), "Olivia", "Martinez", "olivia.martinez@example.com", true, false, "", "" },
                    { new Guid("17b26952-20d4-4765-afc8-f930c77f210a"), null, new Guid("9d66d7c0-86c1-437c-9cb4-45704de68597"), 1, 1, 1, 2, 1, new DateTime(2003, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7291), "Informatics", "Quintet", "iqclient@gmail.com", true, false, "", "" },
                    { new Guid("2ea64422-cf1d-4c68-817d-df6a706b77b3"), null, new Guid("85f9db40-a25f-4e28-bd8e-a29f13971932"), 1, 2, 2, 1, 3, new DateTime(1992, 10, 5, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 1, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7260), "Liam", "Garcia", "liam.garcia@example.com", true, false, "", "" },
                    { new Guid("379049e3-bd53-4728-84eb-9272b7cb8a2a"), null, new Guid("4c88e07a-7e86-4648-a942-25acd64b3d54"), 1, 3, 1, 3, 3, new DateTime(1984, 9, 3, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 6, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7242), "Sophia", "Miller", "sophia.miller@example.com", true, false, "", "" },
                    { new Guid("3ae82869-0cf6-4231-8a7b-3f52f933e251"), null, new Guid("e991c15a-54b2-4968-9570-b863af79ebe9"), 1, 2, 1, 5, 1, new DateTime(2001, 3, 17, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 8, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7218), "Rico", "Mentz", "ricomentz@example.com", true, false, "", "" },
                    { new Guid("401b3bf7-3455-463f-a4ea-8915e1d08812"), null, new Guid("c26d6afd-2551-4580-b823-0813ced69c66"), 1, 1, 1, 3, 1, new DateTime(2003, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7294), "Informatics", "Quintet", "iqemployee@gmail.com", true, false, "", "" },
                    { new Guid("4d21fc01-68d3-41c1-ba92-3ff32d56873b"), null, new Guid("db67e15b-c794-403e-b4e8-cdf0ab9d75c6"), 1, 1, 1, 4, 1, new DateTime(2003, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7298), "Informatics", "Quintet", "iqadmin@gmail.com", true, false, "", "" },
                    { new Guid("6b8dd43e-5718-4751-b0f5-b6b625116430"), null, new Guid("7b344d78-11d8-432b-9a17-2101116e9eb7"), 1, 1, 1, 1, 1, new DateTime(2003, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7272), "Connor", "Kruger", "connorguest@gmail.com", true, false, "", "" },
                    { new Guid("75f7fb8d-f2b8-4467-9211-d41eafac411b"), null, new Guid("eb8ea636-2249-41dc-bd81-8f2e520650e2"), 1, 1, 1, 5, 1, new DateTime(2003, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7301), "Informatics", "Quintet", "iqsadmin@gmail.com", true, false, "", "" },
                    { new Guid("83906aff-1532-44b4-8ce0-fa2065d670a5"), null, new Guid("0d1074a8-05b3-4602-b824-bd94c1b17c86"), 1, 3, 1, 1, 1, new DateTime(1991, 12, 18, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7265), "Ava", "Rodriguez", "ava.rodriguez@example.com", true, false, "", "" },
                    { new Guid("98fac29e-8040-47f5-912e-e9217d78fbe8"), null, new Guid("69eb3b54-f3ed-48ac-a494-0e90ce1a8cd1"), 1, 1, 2, 1, 2, new DateTime(1987, 8, 28, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 11, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7269), "Noah", "Lopez", "noah.lopez@example.com", true, false, "", "" },
                    { new Guid("aeb5df83-20ea-42a2-a9bb-d6901d466312"), null, new Guid("2bfc5dbd-92e0-4494-80f2-24d94db41629"), 1, 1, 1, 5, 1, new DateTime(2004, 6, 16, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2023, 12, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7284), "Morris", "Mofamadi", "tiyiselani@duck.com", true, false, "", "" },
                    { new Guid("c528dbdd-a79c-4485-929a-4e48f26ec2aa"), null, new Guid("e5113098-4c89-4a52-80a8-4eb4842bf15d"), 1, 1, 2, 3, 2, new DateTime(1989, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 5, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7245), "William", "Davis", "william.davis@example.com", true, false, "", "" },
                    { new Guid("d698b5d7-f393-4a0e-8b9d-918ee092a8cb"), null, new Guid("f92a60ac-e881-4cbd-accb-472be138be8c"), 1, 2, 2, 1, 2, new DateTime(1987, 5, 25, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 7, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7231), "Alexander", "Brown", "alexander.brown@example.com", true, false, "", "" },
                    { new Guid("f034a712-9788-4137-a748-dc026c07adaa"), null, new Guid("7ea62e1e-4599-47a5-ae10-2183a11849cb"), 1, 3, 2, 1, 1, new DateTime(1983, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 3, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7254), "Ethan", "Taylor", "ethan.taylor@example.com", true, false, "", "" },
                    { new Guid("ffd75dcb-544a-413d-9339-bf191c6f12cb"), null, new Guid("590b62d1-1235-43b2-9a38-dffe55e394ee"), 1, 2, 1, 1, 3, new DateTime(1986, 7, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 4, 30, 16, 18, 31, 700, DateTimeKind.Utc).AddTicks(7251), "Isabella", "Wilson", "isabella.wilson@example.com", true, false, "", "" }
                });

            migrationBuilder.InsertData(
                table: "Credential",
                columns: new[] { "Credential_ID", "Otp", "Password", "Security_Answer", "User_ID", "Username" },
                values: new object[,]
                {
                    { new Guid("8bbb3c8a-041e-4bac-8874-f0c5b5785540"), null, "JNy7krGpmezH/YcOE6MY6w==;9Msvw8lxFOtbjzcVkIK2OyjP7EyID3Du3FU5AAgVz8c=", null, new Guid("0fd2cb56-1a32-40a9-8f92-10f72dce0e52"), "iqguest@gmail.com" },
                    { new Guid("9d66d7c0-86c1-437c-9cb4-45704de68597"), null, "bptNJ3orpX0znUx3LsXadw==;qXZQzJ0HUK8ukVQwK+C/Z52jaDzvtx304kcK7Q7M3nk=", null, new Guid("17b26952-20d4-4765-afc8-f930c77f210a"), "iqclient@gmail.com" },
                    { new Guid("aeb5df83-20ea-42a2-a9bb-d6901d466312"), null, "XAd24P75cXfVDvyN8uB8eA==;TtNcVixk0ldLs4ZEx5RQAn9aNvGbgD5hhjI29LxZtcM=", null, new Guid("aeb5df83-20ea-42a2-a9bb-d6901d466312"), "tiyiselani@duck.com" },
                    { new Guid("c26d6afd-2551-4580-b823-0813ced69c66"), null, "7Mh49OpV9aZad1kjS6iQuw==;S1wZaQtOl7Xeq2Rzbld6UJtO6cRAiFKjyAQzDBjzVx8=", null, new Guid("401b3bf7-3455-463f-a4ea-8915e1d08812"), "iqemployee@gmail.com" },
                    { new Guid("db67e15b-c794-403e-b4e8-cdf0ab9d75c6"), null, "s5ve0UXhZ2XU8FLV/863Og==;a3S93Im45LYpumyCZK83zgtgS2Z4WKY0bTLSC3IfcvQ=", null, new Guid("4d21fc01-68d3-41c1-ba92-3ff32d56873b"), "iqadmin@gmail.com" },
                    { new Guid("eb8ea636-2249-41dc-bd81-8f2e520650e2"), null, "rLqMvRB/VQQZ3TOegUJCoQ==;cQYyTBlDGuoTE89XTAZUKV38vwTwr7enxAfBymJk5pI=", null, new Guid("75f7fb8d-f2b8-4467-9211-d41eafac411b"), "iqsadmin@gmail.com" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chatbot_Log_Client_ID",
                table: "Chatbot_Log",
                column: "Client_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Chatbot_Log_Ticket_ID",
                table: "Chatbot_Log",
                column: "Ticket_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_City_State_ID",
                table: "City",
                column: "State_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Client_Feedback_Chatbot_Log_ID",
                table: "Client_Feedback",
                column: "Chatbot_Log_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Client_Feedback_Client_ID",
                table: "Client_Feedback",
                column: "Client_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Client_Feedback_Ticket_ID",
                table: "Client_Feedback",
                column: "Ticket_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Client_VDI_VDI_ID",
                table: "Client_VDI",
                column: "VDI_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Company_Request_Client_ID",
                table: "Company_Request",
                column: "Client_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Company_Request_Company_ID",
                table: "Company_Request",
                column: "Company_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Credential_User_ID",
                table: "Credential",
                column: "User_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentLocation_Location_ID",
                table: "DepartmentLocation",
                column: "Location_ID");

            migrationBuilder.CreateIndex(
                name: "IX_DepartmentTag_Tag_ID",
                table: "DepartmentTag",
                column: "Tag_ID");

            migrationBuilder.CreateIndex(
                name: "IX_employeeReports_Employee_ID",
                table: "employeeReports",
                column: "Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_employeeReports_Report_Interval_ID",
                table: "employeeReports",
                column: "Report_Interval_ID");

            migrationBuilder.CreateIndex(
                name: "IX_employeeReports_Report_Type_ID",
                table: "employeeReports",
                column: "Report_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_FAQ_FAQ_Category_ID",
                table: "FAQ",
                column: "FAQ_Category_ID");

            migrationBuilder.CreateIndex(
                name: "IX_FAQ_User_ID",
                table: "FAQ",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Location_CityId",
                table: "Location",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_OTP_userID",
                table: "OTP",
                column: "userID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Software_Request_Client_ID",
                table: "Software_Request",
                column: "Client_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Software_Request_Software_ID",
                table: "Software_Request",
                column: "Software_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Software_VDI_VDI_ID",
                table: "Software_VDI",
                column: "VDI_ID");

            migrationBuilder.CreateIndex(
                name: "IX_SoftwareUser_UsersUser_ID",
                table: "SoftwareUser",
                column: "UsersUser_ID");

            migrationBuilder.CreateIndex(
                name: "IX_States_Country_ID",
                table: "States",
                column: "Country_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Anomaly_ID",
                table: "Ticket",
                column: "Anomaly_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Assigned_Employee_ID",
                table: "Ticket",
                column: "Assigned_Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Client_ID",
                table: "Ticket",
                column: "Client_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Priority_ID",
                table: "Ticket",
                column: "Priority_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Tag_ID",
                table: "Ticket",
                column: "Tag_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Ticket_Status_ID",
                table: "Ticket",
                column: "Ticket_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Updates_Ticket_ID",
                table: "Ticket_Updates",
                column: "Ticket_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_Updates_Ticket_Status_New_ID",
                table: "Ticket_Updates",
                column: "Ticket_Status_New_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TicketEscalation_New_Employee_ID",
                table: "TicketEscalation",
                column: "New_Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TicketEscalation_Previous_Employee_ID",
                table: "TicketEscalation",
                column: "Previous_Employee_ID");

            migrationBuilder.CreateIndex(
                name: "IX_TicketEscalation_Ticket_ID",
                table: "TicketEscalation",
                column: "Ticket_ID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ticketTicketGroups_TicketGroup_ID",
                table: "ticketTicketGroups",
                column: "TicketGroup_ID");

            migrationBuilder.CreateIndex(
                name: "IX_To_do_List_Ticket_ID",
                table: "To_do_List",
                column: "Ticket_ID");

            migrationBuilder.CreateIndex(
                name: "IX_To_do_List_Items_Ticket_ID",
                table: "To_do_List_Items",
                column: "Ticket_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Company_ID",
                table: "User",
                column: "Company_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Department_ID",
                table: "User",
                column: "Department_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Language_ID",
                table: "User",
                column: "Language_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Login_Status_ID",
                table: "User",
                column: "Login_Status_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_ID",
                table: "User",
                column: "Role_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Title_ID",
                table: "User",
                column: "Title_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Account_Requests_Request_Type_ID",
                table: "User_Account_Requests",
                column: "Request_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Account_Requests_Role_ID",
                table: "User_Account_Requests",
                column: "Role_ID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Account_Requests_User_ID",
                table: "User_Account_Requests",
                column: "User_ID");

            migrationBuilder.CreateIndex(
                name: "IX_VDI_VDI_Type_ID",
                table: "VDI",
                column: "VDI_Type_ID");

            migrationBuilder.CreateIndex(
                name: "IX_VDI_Request_Client_ID",
                table: "VDI_Request",
                column: "Client_ID");

            migrationBuilder.CreateIndex(
                name: "IX_VDI_Request_VDI_ID",
                table: "VDI_Request",
                column: "VDI_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Client_Feedback");

            migrationBuilder.DropTable(
                name: "Client_VDI");

            migrationBuilder.DropTable(
                name: "Company_Request");

            migrationBuilder.DropTable(
                name: "DepartmentLocation");

            migrationBuilder.DropTable(
                name: "DepartmentTag");

            migrationBuilder.DropTable(
                name: "employeeReports");

            migrationBuilder.DropTable(
                name: "FAQ");

            migrationBuilder.DropTable(
                name: "OTP");

            migrationBuilder.DropTable(
                name: "Software_Request");

            migrationBuilder.DropTable(
                name: "Software_VDI");

            migrationBuilder.DropTable(
                name: "SoftwareUser");

            migrationBuilder.DropTable(
                name: "Ticket_Updates");

            migrationBuilder.DropTable(
                name: "TicketEscalation");

            migrationBuilder.DropTable(
                name: "ticketTicketGroups");

            migrationBuilder.DropTable(
                name: "To_do_List");

            migrationBuilder.DropTable(
                name: "To_do_List_Items");

            migrationBuilder.DropTable(
                name: "User_Account_Requests");

            migrationBuilder.DropTable(
                name: "VDI_Request");

            migrationBuilder.DropTable(
                name: "Chatbot_Log");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "Report_Interval");

            migrationBuilder.DropTable(
                name: "Report_Type");

            migrationBuilder.DropTable(
                name: "FAQ_Category");

            migrationBuilder.DropTable(
                name: "Credential");

            migrationBuilder.DropTable(
                name: "Software");

            migrationBuilder.DropTable(
                name: "TicketGroup");

            migrationBuilder.DropTable(
                name: "Request_Type");

            migrationBuilder.DropTable(
                name: "VDI");

            migrationBuilder.DropTable(
                name: "Ticket");

            migrationBuilder.DropTable(
                name: "City");

            migrationBuilder.DropTable(
                name: "VDI_Type");

            migrationBuilder.DropTable(
                name: "Anomaly");

            migrationBuilder.DropTable(
                name: "Priority");

            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DropTable(
                name: "Ticket_Status");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "States");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "Language");

            migrationBuilder.DropTable(
                name: "Login_Status");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "Title");

            migrationBuilder.DropTable(
                name: "Country");
        }
    }
}
