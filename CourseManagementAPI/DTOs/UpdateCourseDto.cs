using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.DTOs
{
    public class UpdateCourseDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        public int InstructorId { get; set; }
    }
}