using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        public int InstructorId { get; set; }
        public User Instructor { get; set; } = null!;

        public ICollection<Enrollment>? Enrollments { get; set; }
    }
}