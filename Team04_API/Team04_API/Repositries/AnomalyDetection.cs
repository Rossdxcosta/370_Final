using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Npgsql;
using System.Drawing.Text;
using Team04_API.Data;
using Team04_API.Models.Email;
using Team04_API.Models.Ticket;

namespace Team04_API.Repositries
{
    public class AnomalyDetection(dataDbContext _DbContext, IMailService mailService) : IAnomalyDetection
    {
        private readonly dataDbContext dbContext = _DbContext;
        private readonly IMailService mailService = mailService;
        MLContext mLContext = new MLContext();

        public async Task<List<IntervalRecord>> FetchTicketDataAsync()
        {
            try
            {
                var endDate = DateTime.UtcNow;
                var startDate = endDate.AddDays(-5);

                var intervalRecords = await dbContext.Ticket
                    .Where(t => t.Ticket_Date_Created >= startDate && t.Ticket_Date_Created <= endDate)
                    .GroupBy(t => new
                    {
                        IntervalStart = new DateTime(
                            t.Ticket_Date_Created.Year,
                            t.Ticket_Date_Created.Month,
                            t.Ticket_Date_Created.Day,
                            t.Ticket_Date_Created.Hour,
                            t.Ticket_Date_Created.Minute / 10 * 10,
                            0
                        )
                    })
                    .OrderBy(g => g.Key.IntervalStart)
                    .Select(g => new IntervalRecord
                    {
                        interval_start = g.Key.IntervalStart,
                        interval_end = g.Key.IntervalStart.AddMinutes(10),
                        record_count = g.Count()
                    })
                    .ToListAsync();

                return intervalRecords;
            }
            catch (NpgsqlException npgsqlEx)
            {
                // Log Npgsql-specific errors
                Console.WriteLine($"Npgsql error: {npgsqlEx.Message}");
                return new List<IntervalRecord>(); // Return empty list on failure
            }
            catch (IOException ioEx)
            {
                // Log I/O-related errors
                Console.WriteLine($"I/O error: {ioEx.Message}");
                return new List<IntervalRecord>();
            }
            catch (Exception ex)
            {
                // Log any other exceptions
                Console.WriteLine($"An error occurred: {ex.Message}");
                return new List<IntervalRecord>();
            }
        }


        public async void CheckAnomaly()
        {



            IDataView CreateEmptyDataView(MLContext mlContext)
            {
                // Create empty DataView. We just need the schema to call Fit() for the time series transformspppppp
                IEnumerable<IntervalRecord> enumerableData = new List<IntervalRecord>();
                return mlContext.Data.LoadFromEnumerable(enumerableData);
            }

            var intervalRecords = await FetchTicketDataAsync();

            if (intervalRecords.Any())
            {
                var ticketsReopened = intervalRecords;

                //var docSize = ticketsReopened.Count + 1;

                var data = mLContext.Data.LoadFromEnumerable(ticketsReopened);

                var docSize = Math.Max(ticketsReopened.Count, 20);  // Ensures at least 20 data points
                var pvalueHistoryLengths = Math.Max(docSize / 4, 20); // Ensure a minimum history length of 20


                var iidSpikeEstimator = mLContext.Transforms.DetectIidSpike(outputColumnName: nameof(AnomalyPrediction.Prediction), inputColumnName: nameof(IntervalRecord.record_count), confidence: 95d, pvalueHistoryLength: pvalueHistoryLengths);

                ITransformer iidSpikeTransform = iidSpikeEstimator.Fit(CreateEmptyDataView(mLContext));

                IDataView transformedData = iidSpikeTransform.Transform(data);

                var predictions = mLContext.Data.CreateEnumerable<AnomalyPrediction>(transformedData, reuseRowObject: false);



                if (predictions.Last().Prediction[0] == 1)
                {
                    //Console.WriteLine("Anomaly detected");

                    //Console.WriteLine(_DbContext.GetAnomalyReport());

                    ReportAnomaly(_DbContext.GetAnomalyReport().Result);

                }
            }



            /* List<AnomalyReport> anomalyReport = new List<AnomalyReport> { 
                 new AnomalyReport { TagID = 1, submission_count = 25, last_submission_time = DateTime.UtcNow },
             new AnomalyReport { TagID = 2, submission_count = 25, last_submission_time = DateTime.UtcNow },
             new AnomalyReport { TagID = 3, submission_count = 25, last_submission_time = DateTime.UtcNow },};

             string json = JsonConvert.SerializeObject(anomalyReport);

             await StartChat($"Can you pleas give me a statistical breakdown of this data{json}");*/

            //ReportAnomaly(_DbContext.GetAnomalyReport().Result);

            //Console.WriteLine(_DbContext.GetAnomalyReport());


            /*foreach (var p in predictions)
            {
                if (p.Prediction is not null)
                {
                    var results = $"{p.Prediction[0]}\t{p.Prediction[1]:f2}\t{p.Prediction[2]:F2}";

                    if (p.Prediction[0] == 1)
                    {
                        results += " <-- Spike detected";
                    }

                    Console.WriteLine(results);
                }
            }
            Console.WriteLine("");*/
            //return Ok(ticketsReopened.FirstOrDefault()?.Count ?? 0);
        }

        

        class AnomalyPrediction
        {
            [VectorType(3)]
            public double[]? Prediction { get; set; }
        }

        

        static string apiKey = "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";

        static string chatgpturl = "https://api.groq.com/openai/v1/chat/completions";

        static readonly HttpClient client = new HttpClient();

        

            JArray messages = new JArray();

        static class CHatGPTMOdels
        {
            public static string verstion35 = "llama3-8b-8192";
        }

        static class CHatGPTRoles
        {
            public static string System = "system";
            public static string User = "user";
            public static string Assistant = "assistant";
            public static string Function = "function";
        }

        static async Task<String> SendCompletionRequest(string model, object messages, object functions = null)
        {
            var json = new
            {
                model = model,
                messages = messages,
                functions = functions
            };

            var jsonString = JsonConvert.SerializeObject(json, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
            var data = new StringContent(jsonString, System.Text.Encoding.UTF8, "application/json");
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            Console.WriteLine(jsonString);

            try
            {
                var response = await client.PostAsync(chatgpturl, data);
                var result = response.Content.ReadAsStringAsync().Result;
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine("There is a error brev");

                Console.WriteLine(e);
                throw;
            }
        }

        static public async Task StartChat(string question)
        {
            var result = await SendCompletionRequest(
                CHatGPTMOdels.verstion35,
                new[] { new { role = CHatGPTRoles.User, content = question } },
                null);
            Console.WriteLine(result);
        }

        public async void ReportAnomaly(List<AnomalyReport> anomalyReport)
        {

            var anomaly = new Anomaly { 
                anomalyReports = anomalyReport,
                IntervalRecord = dbContext.GetIntervalRecords().Result.LastOrDefault(), 
                Anomaly_DateTime_Started = DateTime.UtcNow, 
                Ticket = dbContext.Ticket.Where(a => 
                a.Ticket_Date_Created >= _DbContext.GetIntervalRecords().Result.LastOrDefault().interval_start && 
                a.Ticket_Date_Created <= _DbContext.GetIntervalRecords().Result.LastOrDefault().interval_end).ToList(), };

            await dbContext.Anomaly.AddAsync(anomaly);
            dbContext.SaveChanges();

            string[] anomalyTable = [];

            var tags = dbContext.Tag;

            string finalTable = "";

            int totalTickets = 0;

            foreach (var item in anomalyReport)
            {
                string tag = tags.Where(e => e.Tag_ID == item.TagID).FirstOrDefault().Tag_Name;
                string row = "<tr>" +
                    "<td>" +
                    tag +
                    "</td>" +
                    "<td>" +
                    item.submission_count +
                    "</td>" +
                    "<td>" +
                    item.last_submission_time +
                    "</td>" +
                    "</tr>";

                totalTickets += item.submission_count;

                anomalyTable.Append(row);
                Console.WriteLine(row);

                finalTable += row;



            }
            Console.WriteLine(string.Concat(anomalyTable));

            MailData mailData = new MailData { EmailToId = "tiyiselani@duck.com", EmailSubject = "Anomaly is detected", EmailToName = "Tiyiselani Mofamadi", EmailBody = 
                "<html>" +
                "<head>" +
                "</head>" +
                "<body>" +
                "<p></p>"+
                "Total Amount of tickets: " + totalTickets +
                "</br>" +
                "<table  align=\"center\" width=\"300\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"border:1px solid #ccc;\">" +
                "<tr>" +
                "<th>Tag Name</th>" +
                "<th>Amount of tickets</th>" +
                "<th>Last submission</th>" +
                "</tr>" +
                "<tr>" +
                "<td>Tag Name</td>" +
                "<td>Amount of tickets</td>" +
                "<td>Last submission</td>" +
                "</tr>" +
                "" +
                finalTable +
                "" +
                "</table>" +
                "</body></html>"};

            mailService.SendMail(mailData);
            Console.WriteLine("Email Sent");
        }
    }
}