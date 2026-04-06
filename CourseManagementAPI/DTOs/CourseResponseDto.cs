namespace CourseManagementAPI.DTOs
{
    public class CourseResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public int InstructorId { get; set; }
        public string InstructorName { get; set; } = null!;
    }
}