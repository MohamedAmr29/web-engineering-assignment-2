namespace CourseManagementAPI.DTOs
{
    public class EnrolledStudentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime EnrollmentDate { get; set; }
        public int Progress { get; set; }
    }
}
