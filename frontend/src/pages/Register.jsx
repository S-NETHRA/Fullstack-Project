import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter an email');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // TODO: Replace with actual API call - POST /api/auth/register
    // For now, store user info and auto-login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      setError('Username already exists');
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    // Add new user
    users.push({
      username: formData.username,
      email: formData.email,
      password: formData.password, // In production, this should be hashed on backend
      role: formData.role,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem('users', JSON.stringify(users));
    
    setSuccess('Registration successful! Redirecting...');
    
    // Auto-login after registration
    setTimeout(() => {
      login(formData.username, formData.role);
      
      // Navigate to appropriate dashboard
      switch (formData.role) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'faculty':
          navigate('/faculty-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1><FontAwesomeIcon icon={faSchool} /> Smart Classroom</h1>
          <p>Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="login-btn">
            Register
          </button>

          <div className="login-footer" style={{ textAlign: 'center', marginTop: '15px' }}>
            <p>Already have an account? <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
