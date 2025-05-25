namespace Backend.bulletJournal.Models{
    public class UserDatabaseSettings{
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string QuestionCollectionName { get; set; } = null!;
    }
}