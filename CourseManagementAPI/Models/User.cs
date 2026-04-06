using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CourseManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = null!;

        [Required]
        [MaxLength(256)]
        public string Password { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = null!;

        public InstructorProfile? InstructorProfile { get; set; }
        public ICollection<Course>? Courses { get; set; }
        public ICollection<Enrollment>? Enrollments { get; set; }
    }
}