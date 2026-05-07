using CourseManagementAPI.DTOs;

namespace CourseManagementAPI.Services
{
    public interface IEnrollmentService
    {
        Task<IEnumerable<CourseResponseDto>> GetMyCoursesAsync(int studentId);
        Task<bool> EnrollAsync(int studentId, int courseId);
        Task<bool> UnenrollAsync(int studentId, int courseId);
    }
}
