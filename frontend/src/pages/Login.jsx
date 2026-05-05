import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool } from '@fortawesome/free-solid-svg-icons';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const user = await login({ username, password, role });

      switch (user.role) {
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
    } catch (loginError) {
      const message = loginError?.response?.data?.error || 'Login failed. Check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1><FontAwesomeIcon icon={faSchool} /> Smart Classroom</h1>
          <p>Classroom Utilization & Empty Room Finder</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={error && !username.trim() ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={error && !password.trim() ? 'error' : ''}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-footer" style={{ textAlign: 'center', marginTop: '15px' }}>
            <p>Don't have an account? <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link></p>
          </div>
        </form>

        {/* <div className="login-footer">
          <p>Demo Credentials:</p>
          <ul>
            <li>Student: Any username + Student role</li>
            <li>Faculty: Any username + Faculty role</li>
            <li>Admin: Any username + Admin role</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
