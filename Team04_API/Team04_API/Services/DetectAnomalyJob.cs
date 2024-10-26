using Team04_API.Repositries;
using Quartz;
using Team04_API.Models.Email;
using Microsoft.Extensions.Logging;

namespace Team04_API.Services
{
    [DisallowConcurrentExecution]
    public class DetectAnomalyJob : IJob
    {

        private readonly ILogger<DetectAnomalyJob> _logger;
        private readonly IMailService _mailService;
        private readonly IAnomalyDetection anomalyDetection;
        DateTime testTime = new DateTime(2024,7,17,18,9,42);
        public DetectAnomalyJob(ILogger<DetectAnomalyJob> logger, IMailService mailService, IAnomalyDetection anomalyDetection)
        {
            _logger = logger;
            _mailService = mailService;
            this.anomalyDetection = anomalyDetection;
        }

        public Task Execute(IJobExecutionContext context)
        {
            _logger.LogInformation("{Now}"+ testTime.ToString(), DateTime.Now);
            try
            {
                anomalyDetection.CheckAnomaly();
            }
            catch (Exception)
            {

                Console.WriteLine("anomaly detection failed");
            }
            


            

            return Task.CompletedTask;
        }
    }
}
