
using Team04_API.Services.TestData;

namespace Team04_API.Services
{
    public sealed class BackgroundService : IHostedService, IDisposable
    {

        private Timer? _timer;
        private readonly SampleData _Data;

        public BackgroundService(SampleData data)
        {
            _Data = data;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            return Task.CompletedTask;
        }

        private void DoWork(object? state)
        {
            _Data.Data.Add("hey hey");
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
