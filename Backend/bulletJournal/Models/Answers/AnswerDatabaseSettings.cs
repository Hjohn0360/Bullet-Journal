namespace Backend.bulletJournal.Models{
    public class AnswerDatabaseSettings{
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string AnswerCollectionName { get; set; } = null!;
    }
}