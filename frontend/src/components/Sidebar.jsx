import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDoorOpen, faClipboardList, faFileAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { path: '/student-dashboard', icon: faHome, label: 'Dashboard' },
          { path: '/student-dashboard', icon: faDoorOpen, label: 'Find Rooms' },
          { path: '/student-dashboard', icon: faClipboardList, label: 'My Bookings' }
        ];
      case 'faculty':
        return [
          { path: '/faculty-dashboard', icon: faHome, label: 'Dashboard' },
          { path: '/faculty-dashboard', icon: faDoorOpen, label: 'My Classrooms' },
          { path: '/faculty-dashboard', icon: faFileAlt, label: 'Booking Requests' }
        ];
      case 'admin':
        return [
          { path: '/admin-dashboard', icon: faHome, label: 'Dashboard' },
          { path: '/admin-dashboard', icon: faChartBar, label: 'Statistics' },
          { path: '/admin-dashboard', icon: faDoorOpen, label: 'Manage Rooms' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon"><FontAwesomeIcon icon={item.icon} /></span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
