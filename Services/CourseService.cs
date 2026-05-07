using CourseManagementAPI.Data;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementAPI.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseResponseDto>> GetAllAsync(string? role = null)
        {
            var query = _context.Courses
                .AsNoTracking()
                .Include(c => c.Instructor)
                .AsQueryable();

            if (role == "Student")
            {
                // Only show active courses created by an Admin
                query = query.Where(c => c.Status == "Active" && c.Instructor.Role == "Admin");
            }

            return await query
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Username,
                    Students = c.Enrollments != null ? c.Enrollments.Count : 0,
                    CompletionRate = 85,
                    Status = c.Status
                })
                .ToListAsync();
        }

        public async Task<CourseResponseDto?> GetByIdAsync(int id)
        {
            return await _context.Courses
                .AsNoTracking()
                .Include(c => c.Instructor)
                .Where(c => c.Id == id)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Username
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CourseResponseDto> CreateAsync(CreateCourseDto dto)
        {
            var course = new Course
            {
                Title = dto.Title,
                InstructorId = dto.InstructorId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var instructor = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == course.InstructorId);
            return new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                InstructorId = course.InstructorId,
                InstructorName = instructor?.Username ?? string.Empty
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateCourseDto dto)
        {
            var existing = await _context.Courses.FindAsync(id);
            if (existing == null) return false;

            existing.Title = dto.Title;
            existing.InstructorId = dto.InstructorId;

            _context.Courses.Update(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Courses.FindAsync(id);
            if (existing == null) return false;

            _context.Courses.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EnrolledStudentDto>> GetEnrolledStudentsAsync(int courseId)
        {
            return await _context.Enrollments
                .Where(e => e.CourseId == courseId)
                .Select(e => new EnrolledStudentDto
                {
                    Id = e.StudentId,
                    Name = e.Student.Username,
                    Email = $"{e.Student.Username}@edumanage.com", // Mock email since User model doesn't have it
                    EnrollmentDate = DateTime.Now.AddDays(-7), // Mock date
                    Progress = 45 // Mock progress
                })
                .ToListAsync();
        }

        public async Task<bool?> RemoveStudentFromCourseAsync(int courseId, int studentId, int currentUserId, string currentUserRole)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return null; // 404 Course not found

            // Permission Check: Admin or the Course Instructor
            if (currentUserRole != "Admin" && course.InstructorId != currentUserId)
            {
                return false; // 403 Forbidden
            }

            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.CourseId == courseId && e.StudentId == studentId);
            
            if (enrollment == null) return null; // 404 Enrollment not found

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}