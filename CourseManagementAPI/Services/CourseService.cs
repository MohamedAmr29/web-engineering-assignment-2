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

        public async Task<IEnumerable<CourseResponseDto>> GetAllAsync()
        {
            return await _context.Courses
                .AsNoTracking()
                .Include(c => c.Instructor)
                .Select(c => new CourseResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Username
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
    }
}