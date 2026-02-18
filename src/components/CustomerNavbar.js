import { Link } from 'react-router-dom';
import './customernavbar.css';
const CustomerNavbar = ({ role }) => {
  return (
    <nav className="navbar">
      <div className="logo-area">
        <div className="logo-box">🔧</div>
        <span className="logo-name">FixIT</span>
      </div>

      <div className={`nav-links ${role === "customer" ? "customer-links" : ""}`}>
        <Link to="/">Home</Link>

        {!role && <Link to="/services">Services</Link>}

        {role === "customer" && (
          <>
            <Link to="/customer/dashboard">Dashboard</Link>
            <Link to="/customer/bookings">My Bookings</Link>
            <Link to="/customer/profile">Profile</Link>
          </>
        )}
      </div>

      {!role && (
        <div className="nav-auth">
          <Link to="/login">
            <button className="login-link">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      )}
    </nav>
  );
};
export default CustomerNavbar;