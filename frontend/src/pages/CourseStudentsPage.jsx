import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Users, 
  UserMinus, 
  ArrowLeft, 
  Mail, 
  Calendar, 
  TrendingUp,
  Search
} from 'lucide-react';

const CourseStudentsPage = ({ showToast }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/Course/${courseId}/students`);
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch enrolled students.');
        showToast('Error loading students', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, showToast]);

  const handleRemoveStudent = async (studentId, studentName) => {
    if (!window.confirm(`Remove ${studentName} from this course?`)) return;
    
    try {
      const res = await api.delete(`/Course/${courseId}/students/${studentId}`);

      setStudents(prev => prev.filter(s => s.id !== studentId));
      showToast(`Student ${studentName} removed successfully`, 'success');
    } catch (err) {
      console.error('Remove error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to remove student. You may not have permission.';
      alert(errorMsg);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
      <ArrowLeft 
        size={24} 
        style={{ cursor: 'pointer', marginBottom: '1rem' }} 
        onClick={() => navigate('/courses')} 
      />
      <h2>Error</h2>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <button 
          onClick={() => navigate('/courses')} 
          style={{ 
            background: 'none', 
            color: 'var(--text-muted)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: 0, 
            boxShadow: 'none',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={18} /> Back to Courses
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Manage Students</h1>
            <p style={{ color: 'var(--text-muted)' }}>Viewing enrollment for Course #{courseId}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>
            <Users size={24} />
            <span style={{ fontSize: '1.25rem' }}>{students.length} Enrolled</span>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', background: 'var(--bg-main)' }}
          />
        </div>
      </div>

      <div className="table-container glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Student</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Enrollment Date</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Progress</th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)15', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{student.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Mail size={12} /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Calendar size={16} color="var(--text-muted)" />
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ width: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: '700' }}>
                        <span>{student.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${student.progress}%`, height: '100%', background: 'var(--success)', borderRadius: '100px' }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleRemoveStudent(student.id, student.name)}
                      style={{ 
                        background: 'var(--danger)15', 
                        color: 'var(--danger)', 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.85rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.4rem',
                        boxShadow: 'none',
                        marginLeft: 'auto'
                      }}
                    >
                      <UserMinus size={16} /> Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseStudentsPage;
