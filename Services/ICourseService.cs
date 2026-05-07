using CourseManagementAPI.DTOs;

namespace CourseManagementAPI.Services
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseResponseDto>> GetAllAsync(string? role = null);
        Task<CourseResponseDto?> GetByIdAsync(int id);
        Task<CourseResponseDto> CreateAsync(CreateCourseDto dto);
        Task<bool> UpdateAsync(int id, UpdateCourseDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<EnrolledStudentDto>> GetEnrolledStudentsAsync(int courseId);
        Task<bool?> RemoveStudentFromCourseAsync(int courseId, int studentId, int currentUserId, string currentUserRole);
    }
}