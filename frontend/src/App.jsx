import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Routes, Route, Link, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import CourseStudentsPage from './pages/CourseStudentsPage';
import api from './api';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Bell,
  ChevronRight,
  User,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Star,
  Download,
  Printer,
  Menu,
  ChevronUp,
  ChevronDown,
  Info,
  Sun,
  Moon,
  Bookmark,
  BookmarkCheck,
  Layout
} from 'lucide-react';

// --- Helper Functions ---
const decodeUser = (token) => {
  try {
    const decoded = jwtDecode(token);
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'Student';
    const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.unique_name || decoded.name || 'User';
    const UserId = decoded.UserId || decoded.id;
    return { name, role, UserId, ...decoded };
  } catch (e) {
    return null;
  }
};

// --- Components ---

// Feature 2: My Courses Page (Student only)
const MyCourses = ({ enrolledCourses, onUnenroll, showToast }) => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Enrolled Courses</h2>
        <p style={{ color: 'var(--text-muted)' }}>Courses you are currently learning.</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Layout size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
          <h3>No enrollments yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Explore the course catalog to start your learning journey!</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {enrolledCourses.map(course => (
            <div key={course.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--primary)15', color: 'var(--primary)', width: 'fit-content', padding: '0.5rem', borderRadius: '8px' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{course.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instructor: {course.instructorName || 'N/A'}</p>
              </div>
              <button 
                onClick={() => onUnenroll(course.id)}
                style={{ width: '100%', background: 'var(--danger)15', color: 'var(--danger)', marginTop: 'auto', boxShadow: 'none' }}
              >
                Unenroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Feature 1: Profile Page
const Profile = ({ user }) => {
  const getPermissions = () => {
    switch(user.role) {
      case 'Admin': return ['Full System Access', 'Manage Users', 'Delete Courses', 'Edit All Courses', 'View All Reports'];
      case 'Instructor': return ['Create New Courses', 'Edit Own Courses', 'Manage Student Enrollment', 'View Statistics'];
      default: return ['View All Courses', 'Enroll in Courses', 'Mark Favorites', 'View Own Progress'];
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Profile</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your account settings and view your permissions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }} className="grid-cols-3">
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px -5px var(--primary)' }}>
            <User size={48} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{user.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '1.5rem' }}>{user.role}</p>
          <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-main)', fontSize: '0.85rem' }}>
            Account ID: #{user.UserId || 'N/A'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} /> Permission & Access
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {getPermissions().map((perm, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', background: 'var(--bg-main)' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{perm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type }) => (
  <div className="toast" style={{ backgroundColor: type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
    {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
    <span>{message}</span>
  </div>
);

const SkeletonRow = () => (
  <tr>
    <td style={{ padding: '1rem 1.5rem' }}><div className="skeleton" style={{ height: '20px', width: '150px' }}></div></td>
    <td style={{ padding: '1rem 1.5rem' }}><div className="skeleton" style={{ height: '20px', width: '100px' }}></div></td>
    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}><div className="skeleton" style={{ height: '20px', width: '80px', marginLeft: 'auto' }}></div></td>
  </tr>
);

const Login = ({ onLogin, showToast }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      return handleRegister(e);
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/Auth/login', { username, password });
      const token = response.data.token || response.data; // Depending on API response structure
      if (typeof token === 'string') {
        localStorage.setItem('token', token);
        onLogin(token);
      } else {
        // If response is an object with token property
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/Auth/register', { username, password });
      showToast('Registration successful! Please login.', 'success');
      setIsRegistering(false);
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white' }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{isRegistering ? 'Create Account' : 'Course Manager'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{isRegistering ? 'Sign up as a student today' : 'Sign in to access your portal'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
            <input 
              type="text" 
              placeholder={isRegistering ? "Choose a username" : "admin, instructor1, or student1"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.8rem' }}>
            {loading ? (isRegistering ? 'Creating Account...' : 'Authenticating...') : (isRegistering ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span 
              onClick={() => setIsRegistering(!isRegistering)}
              style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegistering ? 'Sign In' : 'Register as Student'}
            </span>
          </p>
          {!isRegistering && (
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.75rem' }}>
              Demo credentials: admin / admin123
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, stats, courses, enrolledCourses }) => {
  const cards = [
    { title: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: '#6366f1' },
    { title: 'Active Students', value: stats.totalStudents || '128', icon: Users, color: '#ec4899' },
    { 
      title: user.role === 'Student' ? 'My Enrollments' : 'Completion Rate', 
      value: user.role === 'Student' ? enrolledCourses.length : '84%', 
      icon: user.role === 'Student' ? BookmarkCheck : TrendingUp, 
      color: '#10b981' 
    },
  ];

  // Feature 3: Simple CSS Bar Chart
  const instructorStats = courses.reduce((acc, course) => {
    const name = course.instructorName || `ID: ${course.instructorId}`;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const maxCourses = Math.max(...Object.values(instructorStats), 1);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Welcome back, {user.name}!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your courses today.</p>
      </div>

      <div className="grid-cols-3">
        {cards.map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: `${card.color}15`, color: card.color, padding: '1rem', borderRadius: '12px' }}>
              <card.icon size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{card.title}</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--text-muted)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>New student enrolled in Advanced React</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2 hours ago</p>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--border-color)" />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Courses per Instructor</h3>
          {courses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(instructorStats).map(([name, count], i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: '500' }}>{name}</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${(count / maxCourses) * 100}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '4px',
                        transition: 'width 1s ease-out'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Courses = ({ user, courses, enrolledCourses, onRefresh, onEnroll, onUnenroll, loading, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', instructorId: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Feature 3: Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

  // Feature 6: Favorites State
  const [favorites, setFavorites] = useState(() => getSafeStorage('favorites', []));
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const canEdit = user.role === 'Admin' || user.role === 'Instructor';
  const canDelete = user.role === 'Admin';
  const isStudent = user.role === 'Student';

  const isEnrolled = (courseId) => enrolledCourses.some(c => c.id === courseId);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  // Feature 2: Export CSV Logic
  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Instructor Name'];
    const rows = filteredCourses.map(c => [c.id, c.title, c.instructorName]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'courses_list.csv';
    link.click();
    showToast('Exporting to CSV...', 'success');
  };

  // Feature 5: Print Logic
  const handlePrint = () => {
    window.print();
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Filtering & Sorting Logic
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructorName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = showFavoritesOnly ? favorites.includes(course.id) : true;
      return matchesSearch && matchesFavorite;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valA = (a[sortConfig.key] || '').toString().toLowerCase();
      const valB = (b[sortConfig.key] || '').toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({ title: course.title, instructorId: course.instructorId });
    } else {
      setEditingCourse(null);
      setFormData({ title: '', instructorId: user.UserId || '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    const payload = {
      title: formData.title,
      instructorId: parseInt(formData.instructorId)
    };

    try {
      if (editingCourse) {
        await api.put(`/Course/${editingCourse.id}`, payload);
        showToast('Course updated successfully!', 'success');
      } else {
        await api.post('/Course', payload);
        showToast('Course added successfully!', 'success');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/Course/${id}`);
        showToast('Course deleted successfully!', 'success');
        onRefresh();
      } catch (err) {
        showToast(err.response?.data?.message || err.message, 'error');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="courses-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Courses</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your educational content here.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handlePrint} style={{ background: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={18} /> Print
          </button>
          <button onClick={exportToCSV} style={{ background: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export
          </button>
          {canEdit && (
            <button onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add New Course
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }} className="filters-container">
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Filter by title or instructor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        
        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{ 
            background: showFavoritesOnly ? 'var(--primary)' : 'var(--bg-card)', 
            color: showFavoritesOnly ? 'white' : 'var(--text-main)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Star size={18} fill={showFavoritesOnly ? 'white' : 'transparent'} /> 
          {showFavoritesOnly ? 'Showing Favorites' : 'Favorites Only'}
        </button>
      </div>

      <div className="glass-card table-container" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th 
                style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => handleSort('title')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Course Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th 
                style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => handleSort('instructorName')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Instructor {sortConfig.key === 'instructorName' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {searchQuery ? 'No courses match your search.' : 'No courses found.'}
                </td>
              </tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button 
                        onClick={() => toggleFavorite(course.id)}
                        style={{ background: 'none', boxShadow: 'none', padding: 0, color: favorites.includes(course.id) ? '#fbbf24' : '#cbd5e1' }}
                      >
                        <Star size={18} fill={favorites.includes(course.id) ? '#fbbf24' : 'transparent'} />
                      </button>
                      <div 
                        onClick={() => setSelectedCourse(course)}
                        style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 'bold' }}
                      >
                        {course.title}
                        {isStudent && isEnrolled(course.id) && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <CheckCircle2 size={10} /> Enrolled
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'var(--bg-main)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '500' }}>
                      {course.instructorName || `ID: ${course.instructorId}`}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {isStudent && (
                        isEnrolled(course.id) ? (
                          <button 
                            onClick={() => onUnenroll(course.id)}
                            style={{ background: 'var(--danger)15', color: 'var(--danger)', fontSize: '0.8rem', padding: '0.4rem 0.8rem', boxShadow: 'none' }}
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button 
                            onClick={() => onEnroll(course.id)}
                            style={{ background: 'var(--success)15', color: 'var(--success)', fontSize: '0.8rem', padding: '0.4rem 0.8rem', boxShadow: 'none' }}
                          >
                            Enroll
                          </button>
                        )
                      )}
                      {canEdit && (
                        <button 
                          onClick={() => handleOpenModal(course)}
                          style={{ background: 'var(--bg-main)', color: 'var(--text-main)', padding: '0.5rem', boxShadow: 'none' }}
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(course.id)}
                          style={{ background: 'var(--danger)15', color: 'var(--danger)', padding: '0.5rem', boxShadow: 'none' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Course Details Modal - User Guaranteed Version */}
      {selectedCourse && (
        <div 
          onClick={() => setSelectedCourse(null)}
          style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,0.5)',
            zIndex:9999,
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background:'white',
              borderRadius:'12px',
              padding:'32px',
              width:'400px',
              boxShadow:'0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{marginBottom:'16px', color:'#1e293b'}}>{selectedCourse.title}</h2>
            <p style={{marginBottom:'8px', color:'#666'}}>
              👨‍🏫 Instructor: <strong>{selectedCourse.instructorName || `ID: ${selectedCourse.instructorId}`}</strong>
            </p>
            <p style={{marginBottom:'24px', color:'#666'}}>
              🔢 Course ID: <strong>#{selectedCourse.id}</strong>
            </p>
            <button 
              onClick={() => setSelectedCourse(null)}
              style={{
                background:'#2563eb', color:'white',
                border:'none', borderRadius:'8px',
                padding:'10px 24px', cursor:'pointer',
                fontSize:'14px', fontWeight:'600',
                width: '100%'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', color: '#64748b', boxShadow: 'none', padding: '0.25rem' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Title</label>
                <input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Advanced Web Development"
                  required 
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Instructor ID</label>
                <input 
                  type="number"
                  value={formData.instructorId} 
                  onChange={e => setFormData({...formData, instructorId: e.target.value})} 
                  placeholder="e.g. 2"
                  required 
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Demo IDs: 1 (Admin), 2 (Instructor1)
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2 }}>
                  {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const systemUsers = [
    { username: 'admin', role: 'Admin', status: 'Active' },
    { username: 'instructor1', role: 'Instructor', status: 'Active' },
    { username: 'student1', role: 'Student', status: 'Active' },
  ];

  const permissions = [
    { action: 'View Courses', student: '✓', instructor: '✓', admin: '✓' },
    { action: 'Add Courses', student: '-', instructor: '✓', admin: '✓' },
    { action: 'Edit Courses', student: '-', instructor: '✓', admin: '✓' },
    { action: 'Delete Courses', student: '-', instructor: '-', admin: '✓' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Control Center</h2>
        <p style={{ color: 'var(--text-muted)' }}>System overview and access control policies.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* System Users Table */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--primary)" /> System Users
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem' }}>Username</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{u.username}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#eef2ff', color: 'var(--primary)' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div> {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Permissions Matrix */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--secondary)" /> Role Permissions Matrix
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
                <th style={{ padding: '0.75rem' }}>Student</th>
                <th style={{ padding: '0.75rem' }}>Instructor</th>
                <th style={{ padding: '0.75rem' }}>Admin</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '500', fontSize: '0.9rem' }}>{p.action}</td>
                  <td style={{ padding: '0.75rem', color: p.student === '✓' ? 'var(--success)' : '#cbd5e1' }}>{p.student}</td>
                  <td style={{ padding: '0.75rem', color: p.instructor === '✓' ? 'var(--success)' : '#cbd5e1' }}>{p.instructor}</td>
                  <td style={{ padding: '0.75rem', color: p.admin === '✓' ? 'var(--success)' : '#cbd5e1' }}>{p.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Feature 2 & 4: Toasts, Dark Mode, and Mobile Menu
  const [toasts, setToasts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Decode user on token change
  useEffect(() => {
    if (token) {
      const decoded = decodeUser(token);
      if (decoded) {
        setUser(decoded);
      } else {
        handleLogout();
      }
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      showToast('Failed to load courses', 'error');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    try {
      const res = await api.get('/Enrollment/my-courses');
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error('Failed to load enrollments');
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCourses();
      if (user?.role === 'Student') {
        fetchEnrollments();
      }
    }
  }, [token, fetchCourses, fetchEnrollments, user?.role]);

  const handleEnroll = async (courseId) => {
    try {
      await api.post('/Enrollment', { courseId });
      showToast('Enrolled successfully!', 'success');
      fetchEnrollments();
    } catch (err) {
      showToast(err.response?.data || 'Enrollment failed', 'error');
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      await api.delete(`/Enrollment/${courseId}`);
      showToast('Unenrolled successfully!', 'success');
      fetchEnrollments();
    } catch (err) {
      showToast('Unenrollment failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (!token || !user) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
        <Login onLogin={(t) => { setToken(t); showToast('Login successful!', 'success'); }} showToast={showToast} />
        <div className="toast-container">
          {toasts.map(t => <Toast key={t.id} {...t} />)}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Feature 4: Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900, backdropFilter: 'blur(4px)' }} 
        />
      )}

      {/* Sidebar */}
      <aside className={isMobileMenuOpen ? 'open' : ''} style={{ width: '280px', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '10px' }}>
            <GraduationCap size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>EduManage</span>
        </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem to="/courses" icon={<BookOpen size={20} />} label="Courses" onClick={() => setIsMobileMenuOpen(false)} />
            {user.role === 'Student' && (
              <NavItem to="/my-courses" icon={<Bookmark size={20} />} label="My Courses" onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <NavItem to="/profile" icon={<User size={20} />} label="My Profile" onClick={() => setIsMobileMenuOpen(false)} />
            {user.role === 'Admin' && (
              <NavItem to="/admin" icon={<Settings size={20} />} label="Admin Panel" onClick={() => setIsMobileMenuOpen(false)} />
            )}
          </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ marginBottom: '1.5rem', padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '600', fontSize: '0.9rem' }}
          >
            {isDarkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <User size={20} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', background: 'var(--danger)15', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: 'none' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="hamburger"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div style={{ position: 'relative', width: '300px' }} className="search-container">
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ paddingLeft: '2.5rem', background: 'var(--bg-card)', borderRadius: '12px' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Bell size={20} />
            </div>
          </div>
        </header>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} stats={{ totalCourses: courses.length }} courses={courses} enrolledCourses={enrolledCourses} />} />
            <Route path="/courses" element={<CoursesPage user={user} enrolledCourses={enrolledCourses} onEnroll={handleEnroll} onUnenroll={handleUnenroll} showToast={showToast} />} />
            <Route path="/courses/:courseId/students" element={<CourseStudentsPage showToast={showToast} />} />
            <Route path="/my-courses" element={<MyCourses enrolledCourses={enrolledCourses} onUnenroll={handleUnenroll} showToast={showToast} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/admin" element={user?.role === 'Admin' ? <AdminPanel /> : <Navigate to="/dashboard" replace />} />
          </Routes>
      </main>

      <div className="toast-container">
        {toasts.map(t => <Toast key={t.id} {...t} />)}
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink 
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.85rem 1rem', 
        borderRadius: '12px', 
        cursor: 'pointer',
        background: isActive ? 'var(--primary)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-muted)',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.2s ease',
        textDecoration: 'none'
      })}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
