using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class InstructorProfile
    {
        public int Id { get; set; }

        [MaxLength(1000)]
        public string? Bio { get; set; }

        public int InstructorId { get; set; }
        public User Instructor { get; set; } = null!;
    }
}