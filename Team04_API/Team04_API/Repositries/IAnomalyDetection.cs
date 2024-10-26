using Microsoft.ML;
using Team04_API.Models.Ticket;

namespace Team04_API.Repositries
{
    public interface IAnomalyDetection
    {
        public void CheckAnomaly();

        public void ReportAnomaly(List<AnomalyReport> anomalyReport);
        
    }
}
