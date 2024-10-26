using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Net.NetworkInformation;
using System.Reflection;
using Team04_API.Data;
using Team04_API.Models.DTOs;
using Team04_API.Models.Email;
using Team04_API.Models.Report;
using Team04_API.Models.Ticket;

namespace Team04_API.Repositries
{
    public class ReportingMethods(dataDbContext dbContext, IMailService mailService) : IReportingMethod
    {
        public async Task<bool> GenerateGroupedReport(List<EmployeeReport> employeeReports)
        {
            var Report1Data = await dbContext.Ticket
                .Where(t => t.Ticket_Status_ID == 1) // Assuming 1 represents "Open" status
                .Select(t => new OpenTicketDTO
                {
                    TicketID = t.Ticket_ID,
                    Title = t.Ticket_Description,
                    CreationDate = t.Ticket_Date_Created,
                    AssignedAgent = dbContext.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                    Priority = dbContext.Priority.Where(p => p.Priority_ID == t.Priority_ID).Select(p => p.Priority_Name).FirstOrDefault()
                }).ToListAsync();

            var Report2Data = await dbContext.Ticket
                .GroupBy(t => t.Ticket_Status_ID)
                .Select(g => new TicketStatusSummaryDTO
                {
                    Status = dbContext.Ticket_Status.Where(ts => ts.Ticket_Status_ID == g.Key).Select(ts => ts.Status_Name).FirstOrDefault(),
                    Tickets = g.Select(t => new TicketDetailsDTO
                    {
                        TicketID = t.Ticket_ID,
                        Title = t.Ticket_Description,
                        Priority = dbContext.Priority.Where(p => p.Priority_ID == t.Priority_ID).Select(p => p.Priority_Name).FirstOrDefault(),
                        DateCreated = t.Ticket_Date_Created,
                        AssignedEmployee = dbContext.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                        Client = dbContext.User.Where(u => u.User_ID == t.Client_ID).Select(u => u.User_Name).FirstOrDefault(),
                        DateResolved = t.Ticket_Date_Resolved,
                        ResolutionTime = t.Ticket_Date_Resolved.HasValue ? (TimeSpan?)(t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created) : null,
                        DateReopened = dbContext.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 4)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => tu.DateOfChange)
                            .FirstOrDefault(),
                        BreachedDate = dbContext.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 5)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => tu.DateOfChange)
                            .FirstOrDefault(),
                        TimeBreachedFor = dbContext.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 5)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => (TimeSpan?)(tu.DateOfChange - t.Ticket_Date_Created))
                            .FirstOrDefault()
                    }).ToList()
                }).ToListAsync();

            var reportsbyEmployee = employeeReports.GroupBy(a => a.Employee_ID);

            foreach (var item in reportsbyEmployee)
            {
                var employee = await dbContext.User.Where(a => a.User_ID == item.Key).FirstOrDefaultAsync();
                string employeename = employee.User_Name + " " + employee.User_Surname;
                var reports = new List<byte[]>();
                foreach(var report in item)
                {
                    switch (report.Report_Type_ID)
                    {
                        case 1:
                            Console.WriteLine("Brev");
                            reports.Add(await GenerateOpenTicketsReport(Report1Data, employeename));
                            break;
                        case 2:
                            Console.WriteLine("This Should be working");
                            reports.Add(await GenerateTicketStatusReport(Report2Data, employeename));
                            break;
                        default:
                            break;
                    }
                    Console.WriteLine($"{report.NextDueDate}");

                    report.NextDueDate = report.NextDueDate.AddDays(report.Report_Interval.Report_Interval_Value);
                }
                await dbContext.SaveChangesAsync();
                Console.WriteLine($"{employee.email}");
                await mailService.SendMail(new MailData { EmailAttachments = reports, EmailBody = "Here are your scheduled reports", EmailSubject = "Email Reports", EmailToId = employee.email, EmailToName = employeename });

                

            }


           return true;
        }

        public async Task<IResult> GernerateReport()
        {
            string aname = "this is a name";
            //var tags = await dbContext.Tag.ToListAsync();
            var data = await dbContext.Ticket
                .GroupBy(t => t.Ticket_Status_ID)
                .Select(g => new TicketStatusSummaryDTO
                {
                    Status = dbContext.Ticket_Status.Where(ts => ts.Ticket_Status_ID == g.Key).Select(ts => ts.Status_Name).FirstOrDefault(),
                    Tickets = g.Select(t => new TicketDetailsDTO
                    {
                        TicketID = t.Ticket_ID,
                        Title = t.Ticket_Description,
                        Priority = dbContext.Priority.Where(p => p.Priority_ID == t.Priority_ID).Select(p => p.Priority_Name).FirstOrDefault(),
                        DateCreated = t.Ticket_Date_Created,
                        AssignedEmployee = dbContext.User.Where(u => u.User_ID == t.Assigned_Employee_ID).Select(u => u.User_Name).FirstOrDefault(),
                        Client = dbContext.User.Where(u => u.User_ID == t.Client_ID).Select(u => u.User_Name).FirstOrDefault(),
                        DateResolved = t.Ticket_Date_Resolved,
                        ResolutionTime = t.Ticket_Date_Resolved.HasValue ? (TimeSpan?)(t.Ticket_Date_Resolved.Value - t.Ticket_Date_Created) : null,
                        DateReopened = dbContext.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 4)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => tu.DateOfChange)
                            .FirstOrDefault(),
                        BreachedDate = dbContext.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 5)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => tu.DateOfChange)
                            .FirstOrDefault(),
                        TimeBreachedFor = dbContext.Ticket_Updates
                            .Where(tu => tu.Ticket_ID == t.Ticket_ID && tu.Ticket_Status_New_ID == 5)
                            .OrderByDescending(tu => tu.DateOfChange)
                            .Select(tu => (TimeSpan?)(tu.DateOfChange - t.Ticket_Date_Created))
                            .FirstOrDefault()
                    }).OrderByDescending(a => a.TicketID).ToList(),
                }).ToListAsync();

            var dummyObject = new TicketDetailsDTO();

            
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A2);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    
                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Verdana));

                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Height(70).Image("./Images/bmwgroup.png");
                        });

                        row.ConstantItem(100).Height(70).Width(70).Image("./Images/bmwlogo-background-removed.png");
                        row.Spacing(1, Unit.Centimetre);
                    });

                    //page.Content().Text("This report provides a detailed view of tickets that have been escalated to higher support levels, indicating complex or challenging issues. It includes Ticket ID, Original Assigned Employee, Escalation Date, Newely Assigned Employee, and Escalation Reason. This report is crucial for identifying recurring issues that may require process improvements or additional training for the support team.");

                    page.Content().Column(column =>
                    {
                        
                        column.Item().AlignCenter().PaddingTop(1, Unit.Centimetre).Text("Tickets by Client Report").FontSize(16).Bold();
                        column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(2);
                                
                            });
                            table.Cell().Text("Generated By: " + $"{aname}").AlignLeft();
                            table.Cell().Text("Date: " + DateTime.Now.ToString("dd/MM/yyyy")).AlignRight();
                        });
                        column.Item().Text("This report provides a detailed view of tickets that have been escalated to higher support levels, indicating complex or challenging issues. It includes Ticket ID, Original Assigned Employee, Escalation Date, Newely Assigned Employee, and Escalation Reason. This report is crucial for identifying recurring issues that may require process improvements or additional training for the support team.");
                        foreach (var aitem in data)
                        {
                            column.Item().Text(aitem.Status);
                            column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                            {

                                table.ColumnsDefinition(columns =>
                                {
                                    foreach (PropertyInfo prop in dummyObject.GetType().GetProperties())
                                    {
                                        columns.RelativeColumn(prop.GetCustomAttribute<DisplayAttribute>().Name.Length);
                                    }
                                });



                                table.Header(header =>
                                {
                                    foreach (PropertyInfo prop in dummyObject.GetType().GetProperties())
                                    {
                                        table.Cell().Element(CellStyle).Text($"{prop.GetCustomAttribute<DisplayAttribute>().Name}").Style(TextStyle.Default.Bold().FontColor(Colors.White));
                                    }

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold()).Padding(0).Border(0).BorderColor(Colors.Grey.Darken1).Background(Colors.Blue.Darken4);
                                    }
                                });

                                foreach (var item in aitem.Tickets)
                                {

                                    foreach (PropertyInfo prop in item.GetType().GetProperties())
                                    {
                                        Console.WriteLine($"{prop.GetValue(item, null)}");
                                        table.Cell().Element(CellStyle).Text($"{prop.GetValue(item, null)}");
                                    }



                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.Border(0.5f).BorderColor(Colors.Grey.Darken1).Padding(2);
                                    }
                                }
                            });

                        }
                    });
                })
                ;
            });

            var documentPDF = document.GeneratePdf();

            //document.ShowInPreviewer();
            //await mailService.SendMail(mailData);
            return Results.File(documentPDF, "application/pdf", "ItWorksBrev.pdf");
        }

        public async Task<byte[]> GenerateTicketStatusReport(List<TicketStatusSummaryDTO> ticketStatusSummaryDTOs, string employeeName)
        {
            
            var data = ticketStatusSummaryDTOs;

            var dummyObject = new TicketDetailsDTO();


            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);

                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Verdana));

                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Height(70).Image("./Images/bmwgroup.png");
                        });

                        row.ConstantItem(100).Height(70).Width(70).Image("./Images/bmwlogo-background-removed.png");
                        row.Spacing(1, Unit.Centimetre);
                    });

                    //page.Content().Text("This report provides a detailed view of tickets that have been escalated to higher support levels, indicating complex or challenging issues. It includes Ticket ID, Original Assigned Employee, Escalation Date, Newely Assigned Employee, and Escalation Reason. This report is crucial for identifying recurring issues that may require process improvements or additional training for the support team.");

                    page.Content().Column(column =>
                    {

                        column.Item().AlignCenter().PaddingTop(1, Unit.Centimetre).Text("Ticket Status Summary Report").FontSize(16).Bold();
                        column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(2);

                            });
                            table.Cell().Text("Generated By: " + $"{employeeName}").AlignLeft();
                            table.Cell().Text("Date: " + DateTime.Now.ToString("dd/MM/yyyy")).AlignRight();
                        });
                        column.Item().Text("This report provides a monthly breakdown of ticket data, categorized by ticket statuses. It includes headings for Ticket ID, Ticket Description and relevant data for the ticket status. This helps in identifying trends and evaluating the efficiency of the support team over time.");

                        foreach (var aitem in data)
                        {
                            column.Item().Text(aitem.Status);
                            column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                            {

                                table.ColumnsDefinition(columns =>
                                {
                                    foreach (PropertyInfo prop in dummyObject.GetType().GetProperties())
                                    {
                                        columns.RelativeColumn(prop.GetCustomAttribute<DisplayAttribute>().Name.Length);
                                    }
                                });



                                table.Header(header =>
                                {
                                    foreach (PropertyInfo prop in dummyObject.GetType().GetProperties())
                                    {
                                        table.Cell().Element(CellStyle).Text($"{prop.GetCustomAttribute<DisplayAttribute>().Name}").Style(TextStyle.Default.Bold().FontColor(Colors.White));
                                    }

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold()).Padding(0).Border(0).BorderColor(Colors.Grey.Darken1).Background(Colors.Blue.Darken4);
                                    }
                                });

                                foreach (var item in aitem.Tickets)
                                {

                                    foreach (PropertyInfo prop in item.GetType().GetProperties())
                                    {
                                        Console.WriteLine($"{prop.GetValue(item, null)}");
                                        table.Cell().Element(CellStyle).Text($"{prop.GetValue(item, null)}");
                                    }



                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.Border(0.5f).BorderColor(Colors.Grey.Darken1).Padding(2);
                                    }
                                }
                            });

                        }
                        
                    });
                })
                ;
            });

            var documentPDF = document.GeneratePdf();
            return documentPDF;
        }

        public async Task<byte[]> GenerateOpenTicketsReport(List<OpenTicketDTO> openTicketDTOs, string employeeName)
        {

            var data = openTicketDTOs;

            var dummyObject = new OpenTicketDTO();


            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);

                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily(Fonts.Verdana));

                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Height(70).Image("./Images/bmwgroup.png");
                        });

                        row.ConstantItem(100).Height(70).Width(70).Image("./Images/bmwlogo-background-removed.png");
                        row.Spacing(1, Unit.Centimetre);
                    });

                    //page.Content().Text("This report provides a detailed view of tickets that have been escalated to higher support levels, indicating complex or challenging issues. It includes Ticket ID, Original Assigned Employee, Escalation Date, Newely Assigned Employee, and Escalation Reason. This report is crucial for identifying recurring issues that may require process improvements or additional training for the support team.");

                    page.Content().Column(column =>
                    {

                        column.Item().AlignCenter().PaddingTop(1, Unit.Centimetre).Text("Open Tickets Report").FontSize(16).Bold();
                        column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(2);

                            });
                            table.Cell().Text("Generated By: " + $"{employeeName}").AlignLeft();
                            table.Cell().Text("Date: " + DateTime.Now.ToString("dd/MM/yyyy")).AlignRight();
                        });
                        column.Item().Text("This report lists all currently open tickets, providing insights into unresolved issues. It includes details such as Ticket ID, Ticket Description, Created Date, Assigned Employee, and Priority helping managers track outstanding tasks and allocate resources effectively.");
                        column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                        {

                            table.ColumnsDefinition(columns =>
                            {
                                foreach (PropertyInfo prop in dummyObject.GetType().GetProperties())
                                {
                                    columns.RelativeColumn(prop.GetCustomAttribute<DisplayAttribute>().Name.Length);
                                }
                            });



                            table.Header(header =>
                            {
                                foreach (PropertyInfo prop in dummyObject.GetType().GetProperties())
                                {
                                    table.Cell().Element(CellStyle).Text($"{prop.GetCustomAttribute<DisplayAttribute>().Name}").Style(TextStyle.Default.Bold().FontColor(Colors.White));
                                }


                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold()).Padding(0).Border(0).BorderColor(Colors.Grey.Darken1).Background(Colors.Blue.Darken4);
                                }
                            });

                            foreach (var item in data)
                            {

                                foreach (PropertyInfo prop in item.GetType().GetProperties())
                                {
                                    Console.WriteLine($"{prop.GetValue(item, null)}");
                                    table.Cell().Element(CellStyle).Text($"{prop.GetValue(item, null)}");
                                }


                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.Border(0.5f).BorderColor(Colors.Grey.Darken1).Padding(2);
                                }
                            }
                        });
                    });
                })
                ;
            });

            var documentPDF = document.GeneratePdf();

            return documentPDF;
        }


        public Task<bool> GenerateGroupedReport()
        {
            throw new NotImplementedException();
        }
    }

}
