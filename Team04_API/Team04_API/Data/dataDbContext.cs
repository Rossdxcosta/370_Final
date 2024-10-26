using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models.Chatbot;
using Team04_API.Models.Company;
using Team04_API.Models.Department;
using Team04_API.Models.Feedback;
using Team04_API.Models.Location;
using Team04_API.Models.Software;
using Team04_API.Models.Ticket;
using Team04_API.Models.Ticket.To_do_List;
using Team04_API.Models.Users;
using Team04_API.Models.VDI;
using Team04_API.Models.Users.Role;
using Team04_API.Models.Report;
using Team04_API.Models.FAQ;
using System;
using Team04_API.Models.Audit;
using Team04_API.Models;
using Team04_API.Models.Users.Account_Requests;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Team04_API.Models.DTOs;
using Microsoft.EntityFrameworkCore.Storage;
using System.Composition;
using System.Security.Claims;
using Team04_API.Models.DTOs.ScheduledReportsDTOs;
using Newtonsoft.Json;
using Npgsql;
using NpgsqlTypes;



namespace Team04_API.Data
{
    public class dataDbContext : DbContext
    {
        private readonly IHttpContextAccessor _contextAccessor;
        public dataDbContext(DbContextOptions options, IHttpContextAccessor httpContextAccessor) : base(options) {
            _contextAccessor = httpContextAccessor;
        }

        //CHATBOT
        public DbSet<Chatbot_Log> Chatbot_Log { get; set; }

        //COMPANY
        public DbSet<Company> Company { get; set; }
        public DbSet<Company_Request> Company_Request { get; set; }

        //public DbSet<CompanyLocation> CompanyLocation { get; set; }

        //DEPARTMENT
        public DbSet<Department> Department { get; set; }
        //public DbSet<DepartmentLocation> DepartmentLocation { get; set; }

        //Feedback
        public DbSet<Client_Feedback> Client_Feedback { get; set; }

        //Location
        public DbSet<Country> Country { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<Location> Location { get; set; }

        //Software
        public DbSet<Software> Software { get; set; }
        public DbSet<Software_Request> Software_Request { get; set; }
        public DbSet<Software_VDI> Software_VDI { get; set; }

        /*-------------------------------------------------------------------------------
         FAQs
        -------------------------------------------------------------------------------*/
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<FAQ_Category> FAQ_Categories { get; set; }

        /*-------------------------------------------------------------------------------
         Ticket
        -------------------------------------------------------------------------------*/
        public DbSet<Anomaly> Anomaly { get; set; }
        public DbSet<Priority> Priority { get; set; }
        public DbSet<Tag> Tag { get; set; }
        public DbSet<Ticket> Ticket { get; set; }
        public DbSet<Ticket_Status> Ticket_Status { get; set; }
        public DbSet<Ticket_Updates> Ticket_Updates { get; set; }
        public DbSet<TicketGroup> TicketGroup { get; set; }
        public DbSet<TicketEscalation> TicketEscalation { get; set; }
        public DbSet<TicketTicketGroup> ticketTicketGroups { get; set; }

        //Ticket To-do List
        public DbSet<To_do_List> To_do_List { get; set; }
        public DbSet<To_do_List_Items> To_do_List_Items { get; set; }

        //Users
        public DbSet<Credential> Credential { get; set; }
        public DbSet<Language> Language { get; set; }
        public DbSet<Login_Status> Login_Status { get; set; }
        public DbSet<OTP> OTP { get; set; }
        //Role
        public DbSet<Role> Role { get; set; }
        public DbSet<Title> Title { get; set; }
        public DbSet<User> User { get; set; }
        //Requests
        public DbSet<User_Account_Requests> User_Account_Requests { get; set; }
        public DbSet<Request_Type> Request_Type { get; set; }

        //VDI
        public DbSet<Client_VDI> Client_VDI { get; set; }
        public DbSet<VDI> VDI { get; set; }
        public DbSet<VDI_Request> VDI_Request { get; set; }
        public DbSet<VDI_Type> VDI_Type { get; set; }

        //CLIENT
        public DbSet<Client_Feedback> ClientFeedbacks { get; set; }
        public DbSet<Chatbot_Log> ChatbotLogs { get; set; }
        public DbSet<Audit> AuditLogs { get; set; }

        //Report
        public DbSet<EmployeeReport> employeeReports { get; set; }
        public DbSet<Report_Interval> Report_Interval { get; set; }
        public DbSet<Report_Type> Report_Type { get; set; }
     

        public virtual async Task<int> SaveChangesAsync(string userId = null!)
        {
            
            OnBeforeSaveChanges(userId);
            var result = await base.SaveChangesAsync();
            return result;
        }
        private void OnBeforeSaveChanges(string userId)
        {
            ChangeTracker.DetectChanges();

            var auditEntries = new List<AuditEntry>();
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is Audit || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;
                var auditEntry = new AuditEntry(entry);
                auditEntry.TableName = entry.Entity.GetType().Name;
                auditEntry.UserId = _contextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                auditEntry.UserId = _contextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value;
                auditEntries.Add(auditEntry);
                foreach (var property in entry.Properties)
                {
                    string propertyName = property.Metadata.Name;
                    if (property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[propertyName] = property.CurrentValue!;
                        continue;
                    }
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            auditEntry.AuditType = AuditType.Create;
                            auditEntry.NewValues[propertyName] = property.CurrentValue!;
                            break;
                        case EntityState.Deleted:
                            auditEntry.AuditType = AuditType.Delete;
                            auditEntry.OldValues[propertyName] = property.OriginalValue!;
                            break;
                        case EntityState.Modified:
                            if (property.IsModified)
                            {
                                auditEntry.ChangedColumns.Add(propertyName);
                                auditEntry.AuditType = AuditType.Update;
                                auditEntry.OldValues[propertyName] = property.OriginalValue!;
                                auditEntry.NewValues[propertyName] = property.CurrentValue!;
                            }
                            break;
                    }
                }
            }
            foreach (var auditEntry in auditEntries)
            {
                AuditLogs.Add(auditEntry.ToAudit());
            }
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            //Time zone fixing for postgres
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                            v => v.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(v, DateTimeKind.Utc) : v,
                            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)));
                    }
                }
            }

            //REPORTING
            //FAQ ONLY
            modelBuilder.Entity<FAQ>().ToTable("FAQ");
            modelBuilder.Entity<FAQ_Category>().ToTable("FAQ_Category");
            //FAQ ONLY
            //DEFINE PK|FK RELATIONSHIPS BELOW BEFORE RUNNING

            //Ticket Updates
            modelBuilder.Entity<Ticket_Updates>()
                .HasOne(tu => tu.ticket)
                .WithMany(t => t.Ticket_Updates)
                .HasForeignKey(tu => tu.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket_Updates>()
                .HasOne(c => c.ticket_status)
                .WithMany()
                .HasForeignKey(c => c.Ticket_Status_Old_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket_Updates>()
                .HasOne(c => c.ticket_status)
                .WithMany()
                .HasForeignKey(c => c.Ticket_Status_New_ID)
                .OnDelete(DeleteBehavior.SetNull);

            // Priority configuration
            modelBuilder.Entity<Priority>()
               .Property(p => p.BreachTime)
               .HasDefaultValue(TimeSpan.FromDays(365));

            // User Relationships
            modelBuilder.Entity<Credential>()
                .HasOne(c => c.User)
                .WithOne(c => c.Credential)
                .HasForeignKey<Credential>(c => c.User_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Credential>()
                .HasOne(c => c.uOTP)
                .WithOne(c => c.userC)
                .HasForeignKey<OTP>(c => c.userID)
                .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<User>()
                .HasOne(c => c._status)
                .WithMany(c => c.Users)
                .HasForeignKey(c => c.Login_Status_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>()
                .HasOne(c => c.title)
                .WithMany(c => c.Users)
                .HasForeignKey(c => c.Title_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>()
                .HasOne(c => c.language)
                .WithMany(c => c.Users)
                .HasForeignKey(c => c.Language_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>()
                .HasOne(c => c.role)
                .WithMany()
                .HasForeignKey(c => c.Role_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FAQ>()
                .HasOne(c => c.User)
                .WithMany(c => c.FAQs)
                .HasForeignKey(c => c.User_ID)
                .OnDelete(DeleteBehavior.SetNull);



            modelBuilder.Entity<User_Account_Requests>()
                .HasOne(c => c.Role)
                .WithMany()
                .HasForeignKey(c => c.Role_ID)
                .OnDelete(DeleteBehavior.Restrict)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User_Account_Requests>()
                .HasOne(c => c.user)
                .WithMany()
                .HasForeignKey(c => c.User_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User_Account_Requests>()
                .HasOne(c => c.request_type)
                .WithMany()
                .HasForeignKey(c => c.Request_Type_ID)
                .OnDelete(DeleteBehavior.Restrict);

            //Client
            modelBuilder.Entity<Ticket>()
               .HasOne(c => c.Client)
               .WithMany()
               .HasForeignKey(c => c.Client_ID)
               .OnDelete(DeleteBehavior.SetNull);

            //FAQ
            modelBuilder.Entity<FAQ>()
                .HasOne(c => c.FAQ_Category)
                .WithMany(c => c.FAQs)
                .HasForeignKey(c => c.FAQ_Category_ID)
                .OnDelete(DeleteBehavior.SetNull);

            //Chatbot

            modelBuilder.Entity<Chatbot_Log>()
                .HasOne(c => c.Client)
                .WithMany()
                .HasForeignKey(c => c.Client_ID)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Client_Feedback>()
                .HasOne(c => c.Chatbot_Log)
                .WithOne(c => c.Client_Feedback)
                .HasForeignKey<Client_Feedback>(c => c.Chatbot_Log_ID)
                .OnDelete(DeleteBehavior.SetNull);

            //Country

            modelBuilder.Entity<State>()
                .HasOne(c => c.Country)
                .WithMany(c => c.states)
                .HasForeignKey(c => c.Country_ID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<City>()
                .HasOne(c => c.State)
                .WithMany(c => c.Cities)
                .HasForeignKey(c => c.State_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Location>()
                .HasOne(c => c.Company)
                .WithOne(c => c.Location)
                .HasForeignKey<Location>(c => c.Location_ID)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Company_Request>()
                .HasOne(c => c.Client)
                .WithMany()
                .HasForeignKey(c => c.Client_ID)
                .OnDelete(DeleteBehavior.SetNull);

            //Department

            modelBuilder.Entity<DepartmentLocation>()
            .HasKey(cl => new { cl.Department_ID, cl.Location_ID});

            modelBuilder.Entity<DepartmentLocation>()
                .HasOne(cl => cl.Department)
                .WithMany()
                .HasForeignKey(cl => cl.Department_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<DepartmentLocation>()
                .HasOne(cl => cl.Location)
                .WithMany()
                .HasForeignKey(cl => cl.Location_ID)
                .OnDelete(DeleteBehavior.SetNull);

            //Report

            modelBuilder.Entity<EmployeeReport>()
            .HasKey(r => new { r.Report_ID});

            modelBuilder.Entity<EmployeeReport>()
                .HasOne(er => er.Employee)
                .WithMany(em => em.EmployeeReports)
                .HasForeignKey(er => er.Employee_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<EmployeeReport>()
                .HasOne(er => er.Report_Interval)
                .WithMany(ri => ri.EmployeeReports)
                .HasForeignKey(er => er.Report_Interval_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<EmployeeReport>()
                .HasOne(er => er.Report_Type)
                .WithMany(ri => ri.EmployeeReports)
                .HasForeignKey(er => er.Report_Type_ID)
                .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<Client_Feedback>()
                .HasOne(cf => cf.User)
                .WithMany()
                .HasForeignKey(cf => cf.Client_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Client_Feedback>()
                .HasOne(cf => cf.Ticket)
                .WithOne(t => t.ClientFeedback)
                .HasForeignKey<Client_Feedback>(cf => cf.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Employee)
                .WithMany()
                .HasForeignKey(t => t.Assigned_Employee_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Client)
                .WithMany()
                .HasForeignKey(t => t.Client_ID)
                .OnDelete(DeleteBehavior.SetNull);



            base.OnModelCreating(modelBuilder);

            //Software

            modelBuilder.Entity<Software_VDI>()
            .HasKey(cl => new { cl.Software_ID, cl.VDI_ID});

            modelBuilder.Entity<Software_VDI>()
                .HasOne(cl => cl.Software)
                .WithMany()
                .HasForeignKey(cl => cl.Software_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Software_VDI>()
                .HasOne(cl => cl.VDI)
                .WithMany()
                .HasForeignKey(cl => cl.VDI_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Software_Request>()
                .HasOne(c => c.Software)
                .WithMany(c => c.Software_Requests)
                .HasForeignKey(c => c.Software_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Software_Request>()
                .HasOne(c => c.Client)
                .WithMany()
                .HasForeignKey(c => c.Client_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Software>()
               .HasMany(c => c.Users)
               .WithMany(a => a.Software);

            //VDI
            modelBuilder.Entity<Client_VDI>()
            .HasKey(cl => new { cl.Client_ID, cl.VDI_ID});

            modelBuilder.Entity<Client_VDI>()
                .HasOne(cl => cl.Client)
                .WithMany()
                .HasForeignKey(cl => cl.Client_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Client_VDI>()
                .HasOne(cl => cl.VDI)
                .WithMany()
                .HasForeignKey(cl => cl.VDI_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<VDI_Request>()
                .HasOne(c => c.Client)
                .WithMany()
                .HasForeignKey(c => c.Client_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<VDI_Request>()
                .HasOne(vr => vr.VDI) 
                .WithMany() 
                .HasForeignKey(vr => vr.VDI_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<VDI>()
                .HasOne(c => c.VDI_Type)
                .WithMany(c => c.VDIs)
                .HasForeignKey(c => c.VDI_Type_ID)
                .OnDelete(DeleteBehavior.SetNull);



            /*-----------------------------------------------------------------------------------
                                                Ticket
            -----------------------------------------------------------------------------------*/
            modelBuilder.Entity<Anomaly>()
                .HasMany(a => a.Ticket)
                .WithOne(t => t.Anomaly)
                .HasForeignKey(t => t.Anomaly_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
                .HasMany(t => t.ToDoLists)
                .WithOne(t => t.Ticket)
                .HasForeignKey(t => t.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.ClientFeedback)
                .WithOne(cf => cf.Ticket)
                .HasForeignKey<Client_Feedback>(cf => cf.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);



            modelBuilder.Entity<Ticket>()
                .HasMany(t => t.ToDoListItems)
                .WithOne(i => i.Ticket)
                .HasForeignKey(i => i.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
                .HasOne(c => c.Chatbot_Log)
                .WithOne(c => c.Ticket)
                .HasForeignKey<Chatbot_Log>(c => c.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
               .HasOne(c => c.Priority)
               .WithMany()
               .HasForeignKey(c => c.Priority_ID)
               .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
               .HasOne(c => c.Tag)
               .WithMany()
               .HasForeignKey(c => c.Tag_ID)
               .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
               .HasOne(c => c.Ticket_Status)
               .WithMany()
               .HasForeignKey(c => c.Ticket_Status_ID)
               .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<To_do_List>()
               .HasKey(t => t.To_do_List_ID);

            modelBuilder.Entity<To_do_List>()
            .HasOne(t => t.Ticket)
            .WithMany(t => t.ToDoLists)
            .HasForeignKey(t => t.Ticket_ID)
            .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<To_do_List_Items>()
                .HasOne(i => i.Ticket)
                .WithMany(t => t.ToDoListItems)
                .HasForeignKey(i => i.Ticket_ID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<TicketTicketGroup>()
               .HasKey(ttg => new { ttg.Ticket_ID, ttg.TicketGroup_ID });

            modelBuilder.Entity<TicketTicketGroup>()
               .HasOne(ttg => ttg.Ticket)
               .WithMany()
               .HasForeignKey(ttg => ttg.Ticket_ID)
               .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<TicketTicketGroup>()
               .HasOne(ttg => ttg.TicketGroup)
               .WithMany()
               .HasForeignKey(ttg => ttg.TicketGroup_ID)
               .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Ticket>()
               .HasMany(t => t.TicketGroups)
               .WithMany(tg => tg.Tickets)
               .UsingEntity<TicketTicketGroup>(
                    j => j
                       .HasOne(ttg => ttg.TicketGroup)
                       .WithMany()
                       .HasForeignKey(ttg => ttg.TicketGroup_ID),
                    j => j
                       .HasOne(ttg => ttg.Ticket)
                       .WithMany()
                       .HasForeignKey(ttg => ttg.Ticket_ID),
                    j =>
                    {
                       j.HasKey(t => new { t.Ticket_ID, t.TicketGroup_ID });
                    });



            // Seed data for Priority
            modelBuilder.Entity<Priority>().HasData(
                new Priority { Priority_ID = 1, Priority_Name = "Low", Priority_Description = "Low priority" },
                new Priority { Priority_ID = 2, Priority_Name = "Medium", Priority_Description = "Medium priority" },
                new Priority { Priority_ID = 3, Priority_Name = "High", Priority_Description = "High priority" }
            );

            // Seed data for Ticket_Status
            modelBuilder.Entity<Ticket_Status>().HasData(
                new Ticket_Status { Ticket_Status_ID = 1, Status_Name = "Open", Status_Description = "Ticket is open" },
                new Ticket_Status { Ticket_Status_ID = 2, Status_Name = "In Progress", Status_Description = "Ticket is being worked on" },
                new Ticket_Status { Ticket_Status_ID = 3, Status_Name = "Closed", Status_Description = "Ticket is closed" },
                new Ticket_Status { Ticket_Status_ID = 4, Status_Name = "Reopened", Status_Description = "Ticket has been re-opened" },
                new Ticket_Status { Ticket_Status_ID = 5, Status_Name = "Breached", Status_Description = "Ticket has been breached" }
            );

            // Seed data for Request_Type
            modelBuilder.Entity<Request_Type>().HasData(
                new Request_Type { Request_Type_ID = 1, Description = "New Acount" },
                new Request_Type { Request_Type_ID = 2, Description = "Delete Account" }
            );

            // Seed data for role
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Guest", Role_Description = "Basic rights role granted to new user accounts"},
                new Role { Id = 2, Name = "Client", Role_Description = "Clients who have access to our proprietary chatbot and our VDI services" },
                new Role { Id = 3, Name = "Employee", Role_Description = "Basic rights role granted to employees to handle tickets and support issues"},
                new Role { Id = 4, Name = "Admin", Role_Description = "Second highest access role for reserved personnel who oversee the activities of other employees" },
                new Role { Id = 5, Name = "SuperAdmin", Role_Description = "Highest level of access, oversee the activities of Administrators"}
            );

            // Seed data for login status
            modelBuilder.Entity<Login_Status>().HasData(
                new Login_Status { Login_Status_ID = 1, Login_Description = "Logged in", Users = [] },
                new Login_Status { Login_Status_ID = 2, Login_Description = "Logged out", Users = [] }
            );

            // Seed data for Title
            modelBuilder.Entity<Title>().HasData(
                new Title { Title_ID = 1, Title_Description = "Mr", Users = [] },
                new Title { Title_ID = 2, Title_Description = "Mrs", Users = [] },
                new Title { Title_ID = 3, Title_Description = "Ms", Users = [] },
                new Title { Title_ID = 4, Title_Description = "Miss", Users = [] },
                new Title { Title_ID = 5, Title_Description = "Dr", Users = [] },
                new Title { Title_ID = 6, Title_Description = "Prof", Users = [] }
            );

            // Seed data for Language
            modelBuilder.Entity<Language>().HasData(
                new Language { Language_ID = 1, Description = "English", Users = [] },
                new Language { Language_ID = 2, Description = "Afrikaans", Users = [] },
                new Language { Language_ID = 3, Description = "German", Users = [] },
                new Language { Language_ID = 4, Description = "Xhosa", Users = [] },
                new Language { Language_ID = 5, Description = "Venda", Users = [] }
            );

            // Seed data for users
            modelBuilder.Entity<User>().HasData(
                new User { User_ID = Guid.NewGuid(), User_Name = "Rico", User_Surname = "Mentz", email = "ricomentz@example.com", User_DOB = new DateTime(2001, 3, 17), User_LastLogin = DateTime.UtcNow.AddMonths(-1), Language_ID = 2, Title_ID = 1, Login_Status_ID = 1, Credential_ID = Guid.NewGuid(), Role_ID = 5, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Alexander", User_Surname = "Brown", email = "alexander.brown@example.com", User_DOB = new DateTime(1987, 5, 25), User_LastLogin = DateTime.UtcNow.AddMonths(-2), Language_ID = 2, Title_ID = 2, Login_Status_ID = 2, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Sophia", User_Surname = "Miller", email = "sophia.miller@example.com", User_DOB = new DateTime(1984, 9, 3), User_LastLogin = DateTime.UtcNow.AddMonths(-3), Language_ID = 3, Title_ID = 3, Login_Status_ID = 1, Credential_ID = Guid.NewGuid(), Role_ID = 3, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "William", User_Surname = "Davis", email = "william.davis@example.com", User_DOB = new DateTime(1989, 11, 20), User_LastLogin = DateTime.UtcNow.AddMonths(-4), Language_ID = 1, Title_ID = 2, Login_Status_ID = 2, Credential_ID = Guid.NewGuid(), Role_ID = 3, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Isabella", User_Surname = "Wilson", email = "isabella.wilson@example.com", User_DOB = new DateTime(1986, 7, 8), User_LastLogin = DateTime.UtcNow.AddMonths(-5), Language_ID = 2, Title_ID = 3, Login_Status_ID = 1, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Ethan", User_Surname = "Taylor", email = "ethan.taylor@example.com", User_DOB = new DateTime(1983, 4, 15), User_LastLogin = DateTime.UtcNow.AddMonths(-6), Language_ID = 3, Title_ID = 1, Login_Status_ID = 2, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Olivia", User_Surname = "Martinez", email = "olivia.martinez@example.com", User_DOB = new DateTime(1988, 1, 30), User_LastLogin = DateTime.UtcNow.AddMonths(-7), Language_ID = 1, Title_ID = 2, Login_Status_ID = 1, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Liam", User_Surname = "Garcia", email = "liam.garcia@example.com", User_DOB = new DateTime(1992, 10, 5), User_LastLogin = DateTime.UtcNow.AddMonths(-8), Language_ID = 2, Title_ID = 3, Login_Status_ID = 2, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Ava", User_Surname = "Rodriguez", email = "ava.rodriguez@example.com", User_DOB = new DateTime(1991, 12, 18), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 3, Title_ID = 1, Login_Status_ID = 1, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Noah", User_Surname = "Lopez", email = "noah.lopez@example.com", User_DOB = new DateTime(1987, 8, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-10), Language_ID = 1, Title_ID = 2, Login_Status_ID = 2, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.NewGuid(), User_Name = "Connor", User_Surname = "Kruger", email = "connorguest@gmail.com", User_DOB = new DateTime(2003, 3, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, Credential_ID = Guid.NewGuid(), Role_ID = 1, Department_ID = 1, isActive = true },
                new User { User_ID = Guid.Parse("aeb5df83-20ea-42a2-a9bb-d6901d466312"), User_Name = "Morris", User_Surname = "Mofamadi", email = "tiyiselani@duck.com", User_DOB = new DateTime(2004, 6, 16), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, isActive = true, Credential_ID = Guid.Parse("2bfc5dbd-92e0-4494-80f2-24d94db41629"), Role_ID = 5, Department_ID = 1 },
                new User { User_ID = Guid.Parse("0fd2cb56-1a32-40a9-8f92-10f72dce0e52"), User_Name = "Informatics", User_Surname = "Quintet", email = "iqguest@gmail.com", User_DOB = new DateTime(2003, 3, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, isActive = true, Credential_ID = Guid.Parse("8bbb3c8a-041e-4bac-8874-f0c5b5785540"), Role_ID = 1, Department_ID = 1 },
                new User { User_ID = Guid.Parse("17b26952-20d4-4765-afc8-f930c77f210a"), User_Name = "Informatics", User_Surname = "Quintet", email = "iqclient@gmail.com", User_DOB = new DateTime(2003, 3, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, isActive = true, Credential_ID = Guid.Parse("9d66d7c0-86c1-437c-9cb4-45704de68597"), Role_ID = 2, Department_ID = 1 },
                new User { User_ID = Guid.Parse("401b3bf7-3455-463f-a4ea-8915e1d08812"), User_Name = "Informatics", User_Surname = "Quintet", email = "iqemployee@gmail.com", User_DOB = new DateTime(2003, 3, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, isActive = true, Credential_ID = Guid.Parse("c26d6afd-2551-4580-b823-0813ced69c66"), Role_ID = 3, Department_ID = 1 },
                new User { User_ID = Guid.Parse("4d21fc01-68d3-41c1-ba92-3ff32d56873b"), User_Name = "Informatics", User_Surname = "Quintet", email = "iqadmin@gmail.com", User_DOB = new DateTime(2003, 3, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, isActive = true, Credential_ID = Guid.Parse("db67e15b-c794-403e-b4e8-cdf0ab9d75c6"), Role_ID = 4, Department_ID = 1 },
                new User { User_ID = Guid.Parse("75f7fb8d-f2b8-4467-9211-d41eafac411b"), User_Name = "Informatics", User_Surname = "Quintet", email = "iqsadmin@gmail.com", User_DOB = new DateTime(2003, 3, 28), User_LastLogin = DateTime.UtcNow.AddMonths(-9), Language_ID = 1, Title_ID = 1, Login_Status_ID = 1, isActive = true, Credential_ID = Guid.Parse("eb8ea636-2249-41dc-bd81-8f2e520650e2"), Role_ID = 5, Department_ID = 1 }

            );

            modelBuilder.Entity<Credential>().HasData(
                new Credential { Credential_ID = Guid.Parse("aeb5df83-20ea-42a2-a9bb-d6901d466312"), Username = "tiyiselani@duck.com", User_ID = Guid.Parse("aeb5df83-20ea-42a2-a9bb-d6901d466312"), Password = "XAd24P75cXfVDvyN8uB8eA==;TtNcVixk0ldLs4ZEx5RQAn9aNvGbgD5hhjI29LxZtcM=" },
                new Credential { Credential_ID = Guid.Parse("8bbb3c8a-041e-4bac-8874-f0c5b5785540"), Username = "iqguest@gmail.com", User_ID = Guid.Parse("0fd2cb56-1a32-40a9-8f92-10f72dce0e52"), Password = "JNy7krGpmezH/YcOE6MY6w==;9Msvw8lxFOtbjzcVkIK2OyjP7EyID3Du3FU5AAgVz8c=" },
                new Credential { Credential_ID = Guid.Parse("9d66d7c0-86c1-437c-9cb4-45704de68597"), Username = "iqclient@gmail.com", User_ID = Guid.Parse("17b26952-20d4-4765-afc8-f930c77f210a"), Password = "bptNJ3orpX0znUx3LsXadw==;qXZQzJ0HUK8ukVQwK+C/Z52jaDzvtx304kcK7Q7M3nk=" },
                new Credential { Credential_ID = Guid.Parse("c26d6afd-2551-4580-b823-0813ced69c66"), Username = "iqemployee@gmail.com", User_ID = Guid.Parse("401b3bf7-3455-463f-a4ea-8915e1d08812"), Password = "7Mh49OpV9aZad1kjS6iQuw==;S1wZaQtOl7Xeq2Rzbld6UJtO6cRAiFKjyAQzDBjzVx8=" },
                new Credential { Credential_ID = Guid.Parse("db67e15b-c794-403e-b4e8-cdf0ab9d75c6"), Username = "iqadmin@gmail.com", User_ID = Guid.Parse("4d21fc01-68d3-41c1-ba92-3ff32d56873b"), Password = "s5ve0UXhZ2XU8FLV/863Og==;a3S93Im45LYpumyCZK83zgtgS2Z4WKY0bTLSC3IfcvQ=" },
                new Credential { Credential_ID = Guid.Parse("eb8ea636-2249-41dc-bd81-8f2e520650e2"), Username = "iqsadmin@gmail.com", User_ID = Guid.Parse("75f7fb8d-f2b8-4467-9211-d41eafac411b"), Password = "rLqMvRB/VQQZ3TOegUJCoQ==;cQYyTBlDGuoTE89XTAZUKV38vwTwr7enxAfBymJk5pI=" }
                );

            //aeb5df83-20ea-42a2-a9bb-d6901d466312

            // Seed data for companies
            modelBuilder.Entity<Company>().HasData(
                new Company { Company_ID = 1, Company_Name = "Mini" },
                new Company { Company_ID = 2, Company_Name = "Rolce Royce" }
            );

            // Seed data for Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { Department_ID = 1, Department_Name = "Infrastructure", Department_Description = "Handles infrastructure related issues", Tag = [] },
                new Department { Department_ID = 2, Department_Name = "Connectivity", Department_Description = "Handles connectivity related issues", Tag = [] },
                new Department { Department_ID = 3, Department_Name = "General Support", Department_Description = "Handles general support related issues", Tag = [] }
            );

            // Seed data for tags
            modelBuilder.Entity<Tag>().HasData(
                new Tag { Tag_ID = 1, Department_ID = 1, Tag_Name = "Infrastructure", Tag_Description = "Infrastructure related issues" },
                new Tag { Tag_ID = 2, Department_ID = 1, Tag_Name = "Connectivity", Tag_Description = "Connectivity related issues" },
                new Tag { Tag_ID = 3, Department_ID = 1, Tag_Name = "General Support", Tag_Description = "General support related issues" }
            );

            //Seed data for reports
            modelBuilder.Entity<Report_Interval>().HasData(
                new Report_Interval { Report_Interval_ID = 1, Report_Interval_Name = "Daily", Report_Interval_Value = 1, Report_Interval_Description = " Reports will be scheduled daily" },
                new Report_Interval { Report_Interval_ID = 2, Report_Interval_Name = "Weekly", Report_Interval_Value = 7, Report_Interval_Description = " Reports will be scheduled weekly" },
                new Report_Interval { Report_Interval_ID = 3, Report_Interval_Name = "Bi-weekly", Report_Interval_Value = 14, Report_Interval_Description = " Reports will be scheduled Bi-weekly" },
                new Report_Interval { Report_Interval_ID = 4, Report_Interval_Name = "Monthly", Report_Interval_Value = 31, Report_Interval_Description = " Reports will be scheduled Monthly" });

            modelBuilder.Entity<Report_Type>().HasData(
                new Report_Type { Report_Type_ID = 1, Report_Type_Name = "Open Tickets Reports", Report_Type_Description = "This report lists all currently open tickets, providing insights into unresolved issues. It includes details such as Ticket ID, Ticket Description, Created Date, Assigned Employee, and Priority helping managers track outstanding tasks and allocate resources effectively." },
                new Report_Type { Report_Type_ID = 2, Report_Type_Name = "Ticket Status Summary Report", Report_Type_Description = "This report provides a monthly breakdown of ticket data, categorized by ticket statuses. It includes headings for Ticket ID, Ticket Description and relevant data for the ticket status. This helps in identifying trends and evaluating the efficiency of the support team over time." });

            // Seed data for anomaly for ticket testing purposes
            

            modelBuilder.Entity<Chatbot_Log>().OwnsOne(
                log => log.chat,
                builder =>
                {
                    builder.ToJson();
                    builder.OwnsMany(chat => chat.Messages);
                });

            modelBuilder.Entity<Anomaly>().OwnsMany(
                log => log.anomalyReports,
                builder =>
                {
                    builder.ToJson();
                });

            modelBuilder.Entity<Anomaly>().OwnsOne(
                log => log.IntervalRecord,
                builder =>
                {
                    builder.ToJson();
                });

            /*modelBuilder.Entity<Chatbot_Log>().HasData(
                new Chatbot_Log { Chatbot_Log_ID = 1, chat = new Chat { Chat_ID = 1, Messages = new List<Message> { new Message { senderID = Guid.NewGuid(), messageText = "Hello daar", message_ID = 1 } } }, Client_ID = Guid.NewGuid(), Conversation_Date = DateTime.UtcNow, Conversation_Title = "Something" });
*/
        }
        public DbSet<Team04_API.Models.FAQ.FAQ> FAQ { get; set; } = default!;

        //This is anomaly retrieval stuff
        

        public async Task<List<IntervalRecord>> GetIntervalRecords()
        {
            try
            {
                var intervalRecords = await Database.SqlQuery<IntervalRecord>($"SELECT * FROM count_records_last_24h()").ToListAsync();

                return intervalRecords;
            }
            catch (Exception)
            {
                

                throw;
            }
            // Using FromSqlRaw for stored procedure call
           
        }

        public async Task<List<AnomalyReport>> GetAnomalyReport()
        {
            var anomalyreport = await Database.SqlQuery<AnomalyReport>($"Select * FROM get_recent_submissions()").ToListAsync();
            return anomalyreport;
        }

        public async Task<List<AnomalyReports>> GetTicketIntervalReportsAsync()
        {
            var startDateParam = new NpgsqlParameter("start_date", NpgsqlDbType.TimestampTz)
            {
                Value = DateTime.UtcNow.AddDays(-2)
            };
            var endDateParam = new NpgsqlParameter("end_date", NpgsqlDbType.TimestampTz)
            {
                Value = DateTime.UtcNow
            };

            var result = await this.Database.SqlQueryRaw<AnomalyReports>(
         "SELECT interval_start, interval_end, total_tickets, tag_counts::text as tag_counts FROM count_tickets_by_interval(@start_date, @end_date)",
         startDateParam,
         endDateParam)
         .ToListAsync();

            foreach (var item in result)
            {
                // Assuming TagCounts is a string property in AnomalyReports
                item.tag_counts_list = JsonConvert.DeserializeObject<List<Tag_Counts>>(item.tag_counts);
            }

            return result;
        }

        public async Task<List<ReportingCountDTO>> getopentickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var report = await Database.SqlQueryRaw<ReportingCountDTO>("SELECT getopentickets({0}::timestamp, {1}::timestamp) AS Count", start, end).ToListAsync();
            return report;
        }

        public async Task<List<ReportingCountDTO>> getclosedtickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var report = await Database.SqlQueryRaw<ReportingCountDTO>("SELECT getclosedtickets({0}::timestamp, {1}::timestamp) AS Count", start, end).ToListAsync();
            return report;
        }

        public async Task<List<ReportingCountDTO>> getbreachedtickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var report = await Database.SqlQueryRaw<ReportingCountDTO>("SELECT getbreachedtickets({0}::timestamp, {1}::timestamp) AS Count", start, end).ToListAsync();
            return report;
        }

        public async Task<List<ReportingCountDTO>> getlowprioritytickets(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var report = await Database.SqlQueryRaw<ReportingCountDTO>("SELECT getlowprioritytickets({0}::timestamp, {1}::timestamp) AS Count", start, end).ToListAsync();
            return report;
        }

        public async Task<List<ReportingCountDTO>> get_tickets_reopened(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var report = await Database.SqlQueryRaw<ReportingCountDTO>("SELECT get_tickets_reopened({0}, {1}) AS Count", start, end).ToListAsync();
            return report;
        }

        public async Task<List<ReportingCountDTO>> get_total_tickets_created(DateTime? startDate, DateTime? endDate)
        {
            var start = startDate?.ToUniversalTime() ?? DateTime.MinValue.ToUniversalTime();
            var end = endDate?.ToUniversalTime() ?? DateTime.MaxValue.ToUniversalTime();
            var report = await Database.SqlQueryRaw<ReportingCountDTO>("SELECT get_total_tickets_created({0}::timestamp, {1}::timestamp) AS Count", start, end).ToListAsync();
            return report;
        }

        /*public DbSet<TicketStatistics> ClosedTicketCount { get; set; }
        public DbSet<ReportingCountDTO> ReportingCountDTOs { get; set; }
        public DbSet<TicketStatusCount> TicketStatusCounts { get; set; }
        public DbSet<TicketsCreatedResolvedOverTime> TicketsCreatedResolvedOverTime { get; set; }
        public DbSet<AverageResolutionTime> AverageResolutionTime { get; set; }
        public DbSet<TicketsByPriority> TicketsByPriority { get; set; }
        public DbSet<TicketsByTag> TicketsByTag { get; set; }
        public DbSet<TicketsAssignedToEmployees> TicketsAssignedToEmployees { get; set; }
        public DbSet<TicketsByClient> TicketsByClient { get; set; }
        public DbSet<TicketsCreatedOverTime> TicketsCreatedOverTime { get; set; }*/

        public async Task<List<TicketStatistics>> GetClosedTicketsPastWeek()
        {
            var report = await Database.SqlQuery<TicketStatistics>($"SELECT * FROM GetClosedTicketsPastWeek()").ToListAsync();
            return report;
        }

        public async Task<List<TicketStatusCount>> GetTicketStatusCounts()
        {
            var report = await Database.SqlQuery<TicketStatusCount>($"SELECT * FROM GetTicketStatusCounts()").ToListAsync();
            return report;
        }

        public async Task<List<TicketsCreatedResolvedOverTime>> getTicketsCreatedResolvedOverTime()
        {
            var report = await Database.SqlQuery<TicketsCreatedResolvedOverTime>($"SELECT * FROM getTicketsCreatedResolvedOverTime()").ToListAsync();
            return report;
        }
        public async Task<List<AverageResolutionTime>> getAverageResolutionTime()
        {
            var report = await Database.SqlQuery<AverageResolutionTime>($"SELECT * FROM getAverageResolutionTime()").ToListAsync();
            return report;
        }
        public async Task<List<TicketsByPriority>> getTicketsByPriority()
        {
            var report = await Database.SqlQuery<TicketsByPriority>($"SELECT * FROM getTicketsByPriority()").ToListAsync();
            return report;
        }
        public async Task<List<TicketsByTag>> getTicketsByTag()
        {
            var report = await Database.SqlQuery<TicketsByTag>($"SELECT * FROM getTicketsByTag()").ToListAsync();
            return report;
        }
        public async Task<List<TicketsAssignedToEmployees>> getticketsassignedtoemployees()
        {
            var report = await Database.SqlQuery<TicketsAssignedToEmployees>($"SELECT * FROM getticketsassignedtoemployees()").ToListAsync();
            return report;
        }
        public async Task<List<TicketsByClient>> getTicketsByClient()
        {
            var report = await Database.SqlQuery<TicketsByClient>($"SELECT * FROM getTicketsByClient()").ToListAsync();
            return report;
        }
        public async Task<List<TicketsCreatedOverTime>> getTicketsCreatedOverTime()
        {
            var report = await Database.SqlQuery<TicketsCreatedOverTime>($"SELECT * FROM getTicketsCreatedOverTime()").ToListAsync();
            return report;
        }

        public async Task<List<AvgResolutionTimeLastWeek>> getAvgResolutionTimeLastWeek()
        {
            var report = await Database.SqlQuery<AvgResolutionTimeLastWeek>($"SELECT * FROM get_avg_resolution_time_last_week()").ToListAsync();
            return report;
        }

        public async Task<List<EscalatedTicketsLastWeek>> getEscalatedTicketsLastWeek()
        {
            var report = await Database.SqlQuery<EscalatedTicketsLastWeek>($"SELECT * FROM get_escalated_ticket_count_last_month()").ToListAsync();
            return report;
        }
    }
}
