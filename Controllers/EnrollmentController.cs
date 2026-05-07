using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Student")]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return int.TryParse(userIdClaim, out var id) ? id : 0;
        }

        [HttpGet("my-courses")]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetMyCourses()
        {
            var userId = GetCurrentUserId();
            var result = await _enrollmentService.GetMyCoursesAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Enroll(EnrollmentRequestDto request)
        {
            var userId = GetCurrentUserId();
            var success = await _enrollmentService.EnrollAsync(userId, request.CourseId);
            if (!success) return BadRequest("Enrollment failed.");
            return Ok();
        }

        [HttpDelete("{courseId}")]
        public async Task<IActionResult> Unenroll(int courseId)
        {
            var userId = GetCurrentUserId();
            var success = await _enrollmentService.UnenrollAsync(userId, courseId);
            if (!success) return BadRequest("Unenrollment failed.");
            return Ok();
        }
    }
}
