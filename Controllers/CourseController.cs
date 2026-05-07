using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseResponseDto>>> GetAll()
        {
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var result = await _courseService.GetAllAsync(role);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CourseResponseDto>> GetById(int id)
        {
            var course = await _courseService.GetByIdAsync(id);
            if (course == null) return NotFound();
            return Ok(course);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<CourseResponseDto>> Create(CreateCourseDto dto)
        {
            var created = await _courseService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> Update(int id, UpdateCourseDto dto)
        {
            var updated = await _courseService.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _courseService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpGet("{courseId}/students")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<ActionResult<IEnumerable<EnrolledStudentDto>>> GetStudents(int courseId)
        {
            var result = await _courseService.GetEnrolledStudentsAsync(courseId);
            return Ok(result);
        }

        [HttpDelete("{courseId}/students/{studentId}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> RemoveStudent(int courseId, int studentId)
        {
            var userIdStr = User.FindFirst("UserId")?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(userRole))
                return Unauthorized();

            int userId = int.Parse(userIdStr);
            var result = await _courseService.RemoveStudentFromCourseAsync(courseId, studentId, userId, userRole);

            if (result == null) return NotFound();
            if (result == false) return Forbid();

            return Ok(new { message = "Student removed successfully" });
        }
    }
}