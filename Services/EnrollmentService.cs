using CourseManagementAPI.Data;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementAPI.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly AppDbContext _context;

        public EnrollmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseResponseDto>> GetMyCoursesAsync(int studentId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => new CourseResponseDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    InstructorId = e.Course.InstructorId,
                    InstructorName = e.Course.Instructor.Username,
                    Students = e.Course.Enrollments.Count,
                    CompletionRate = 85, // Dummy data
                    Status = "active"
                })
                .ToListAsync();
        }

        public async Task<bool> EnrollAsync(int studentId, int courseId)
        {
            var alreadyEnrolled = await _context.Enrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (alreadyEnrolled) return true;

            var enrollment = new Enrollment
            {
                StudentId = studentId,
                CourseId = courseId
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnenrollAsync(int studentId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (enrollment == null) return true;

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
