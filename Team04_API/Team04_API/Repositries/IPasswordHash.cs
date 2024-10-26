namespace Team04_API.Repositries
{
    public interface IPasswordHash
    {
        public string Hash(string password);
        public bool Verify(string passwordHash, string inputPassword);
    }
}
