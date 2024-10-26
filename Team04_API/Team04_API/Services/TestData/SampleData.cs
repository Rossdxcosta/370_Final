using System.Collections.Concurrent;

namespace Team04_API.Services.TestData
{
    public class SampleData
    {
        public ConcurrentBag<string> Data { get; set; } = new();
    }
}
