import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-glow-bar" />

      <div className="footer-inner">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="logo-area light">
              <div className="logo-box">🔧</div>
              <span className="logo-name">FixIT</span>
            </div>
            <p>Connecting you with trusted home service professionals in Gujranwala.</p>
            <div className="footer-socials">
              <a href="#" className="social-btn">f</a>
              <a href="#" className="social-btn">in</a>
              <a href="#" className="social-btn">𝕏</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/register">Become a Provider</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/">Home</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-links">
            <h4>Contact</h4>
            <div className="contact-item"><span>📧</span> support@fixit.com</div>
            <div className="contact-item"><span>📞</span> +92 300-1234567</div>
            <div className="contact-item"><span>📍</span> Gujranwala, Pakistan</div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 FixIT. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}