using Team04_API.Data;
using Microsoft.EntityFrameworkCore;
using Team04_API.Models.Email;
using Team04_API.Models.Users;
using Team04_API.Repositries;
using Team04_API.Models.Ticket;
using Microsoft.Extensions.Logging;

public class DetectBreach : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IMailService _mailService;
    private readonly ILogger<DetectBreach> _logger;
    private const int MaxRetryAttempts = 3;

    public DetectBreach(IServiceProvider serviceProvider, IMailService mailService, ILogger<DetectBreach> logger)
    {
        _serviceProvider = serviceProvider;
        _mailService = mailService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await UpdateTicketStatuses();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating ticket statuses.");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }

    private async Task UpdateTicketStatuses()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<dataDbContext>();

            try
            {

                var priorities = await context.Priority.ToListAsync();
                var breachedStatusId = 5;

                var ticketsToUpdate = await context.Ticket
                    .Include(t => t.Employee)
                    .Include(t => t.Client)
                    .Include(t => t.Priority)
                    .Where(t => t.Ticket_Status_ID != breachedStatusId)
                    .ToListAsync();

                foreach (var ticket in ticketsToUpdate)
                {
                    var breachTime = ticket.Priority.BreachTime;
                    if (ticket.Ticket_Date_Created <= DateTime.UtcNow - breachTime && ticket.isOpen)
                    {
                        ticket.Ticket_Status_ID = breachedStatusId;

                        // Send email to the assigned employee
                        if (ticket.Employee != null && ticket.Client != null)
                        {
                            var mailData = new MailData
                            {
                                EmailToId = ticket.Employee.email,
                                EmailToName = ticket.Employee.User_Name,
                                EmailSubject = "Ticket Breached Notification",
                                EmailBody = $"Dear {ticket.Employee.User_Name},<br><br>The ticket with ID: {ticket.Ticket_ID} has breached its SLA.<br><br>Client: {ticket.Client.User_Name} <br><br> Ticket: {ticket.Ticket_Description}<br><br>Best regards,<br>Team"
                            };

                            await RetryOnFailureAsync(async () => await _mailService.SendMail(mailData));
                        }
                    }
                }

                await context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "A database update error occurred while updating ticket statuses.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while updating ticket statuses.");
                throw; 
            }
        }
    }

    private async Task RetryOnFailureAsync(Func<Task> action, int attempt = 0)
    {
        try
        {
            await action();
        }
        catch (Exception ex)
        {
            if (attempt < MaxRetryAttempts)
            {
                _logger.LogWarning(ex, $"Retrying... Attempt {attempt + 1} of {MaxRetryAttempts}");
                await Task.Delay(TimeSpan.FromSeconds(2 * (attempt + 1))); // Exponential backoff
                await RetryOnFailureAsync(action, attempt + 1);
            }
            else
            {
                _logger.LogError(ex, "Max retry attempts reached. Action failed.");
                throw; 
            }
        }
    }
}
