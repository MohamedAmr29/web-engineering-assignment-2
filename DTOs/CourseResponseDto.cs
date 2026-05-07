namespace CourseManagementAPI.DTOs
{
    public class CourseResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public int InstructorId { get; set; }
        public string InstructorName { get; set; } = null!;
        public string Instructor => InstructorName; 
        public int Students { get; set; } = 42; // Simulated data
        public int CompletionRate { get; set; } = 75; // Simulated data
        public string Status { get; set; } = "active";
    }
}