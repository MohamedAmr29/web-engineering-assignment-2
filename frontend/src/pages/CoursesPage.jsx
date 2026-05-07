import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  MoreVertical,
  Star,
  Users2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoursesPage = ({ user, enrolledCourses, onEnroll, onUnenroll, showToast }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', status: 'Active' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Course');
      setCourses(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course = null) => {
    setEditingCourse(course);
    setFormData(course ? { title: course.title, status: course.status || 'Active' } : { title: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingCourse) {
        await api.put(`/Course/${editingCourse.id}`, { ...formData, instructorId: editingCourse.instructorId });
        showToast('Course updated successfully');
      } else {
        await api.post('/Course', { ...formData, instructorId: user.UserId });
        showToast('Course created successfully');
      }
      fetchCourses();
      setIsModalOpen(false);
    } catch (err) {
      showToast('Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    console.log('Delete requested for course:', courseId);
    console.log('Current user role:', user?.role);
    
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      // Using the api instance which already has the Bearer token interceptor
      console.log('Sending DELETE request to /Course/' + courseId);
      const res = await api.delete(`/Course/${courseId}`);
      console.log('Delete response:', res);
      
      // Update local state immediately for a smooth experience
      setCourses(prev => prev.filter(c => c.id !== courseId));
      showToast('Course deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete course. You may not have permission.';
      alert(errorMsg);
    }
  };

  const isEnrolled = (courseId) => enrolledCourses?.some(c => c.id === courseId);
  const isStudent = user?.role === 'Student';

  const filters = ['All', 'Active', 'Draft', 'Archived'];

  const filteredCourses = courses.filter(course => {
    if (activeFilter === 'All') return true;
    return course.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
      <h2>Error</h2>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Courses</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track all your courses</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Instructor') && (
          <button onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Add Course
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{ 
              background: activeFilter === filter ? 'var(--primary)' : 'var(--bg-card)', 
              color: activeFilter === filter ? 'white' : 'var(--text-main)',
              border: `1px solid ${activeFilter === filter ? 'transparent' : 'var(--border-color)'}`,
              padding: '0.5rem 1.25rem',
              boxShadow: 'none',
              fontSize: '0.9rem'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary)15', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '100px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  background: course.status?.toLowerCase() === 'active' ? 'var(--success)15' : 'var(--text-muted)15',
                  color: course.status?.toLowerCase() === 'active' ? 'var(--success)' : 'var(--text-muted)'
                }}>
                  {course.status}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{course.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Instructor: {course.instructorName || `ID: ${course.instructorId}`}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{course.students} Students</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{course.completionRate}% Done</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  <span>Completion Rate</span>
                  <span>{course.completionRate}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${course.completionRate}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '100px' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                {isStudent ? (
                  isEnrolled(course.id) ? (
                    <button 
                      onClick={() => onUnenroll(course.id)}
                      style={{ flex: 1, background: 'var(--danger)15', color: 'var(--danger)', boxShadow: 'none' }}
                    >
                      Unenroll
                    </button>
                  ) : (
                    <button 
                      onClick={() => onEnroll(course.id)}
                      style={{ flex: 1, background: 'var(--success)15', color: 'var(--success)', boxShadow: 'none' }}
                    >
                      Enroll Now
                    </button>
                  )
                ) : (
                  <>
                    <button onClick={() => handleOpenModal(course)} style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>Edit Course</button>
                    <button 
                      onClick={() => navigate(`/courses/${course.id}/students`)} 
                      style={{ flex: 1, background: 'var(--primary)15', color: 'var(--primary)', padding: '0.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: 'none' }}
                    >
                      <Users2 size={16} /> Students
                    </button>
                    {user?.role === 'Admin' && (
                      <button onClick={() => handleDelete(course.id)} style={{ background: 'var(--danger)15', color: 'var(--danger)', padding: '0.5rem', boxShadow: 'none' }}>
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No courses found for this filter.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="flex-center" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px', background: 'var(--bg-card)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Course Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Advanced Web Development"
                  required
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'var(--bg-main)', color: 'var(--text-main)', boxShadow: 'none' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ flex: 2 }}>
                  {actionLoading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
