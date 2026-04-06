using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class CreateCourseDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        public int InstructorId { get; set; }
    }
}