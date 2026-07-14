import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(officerId, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Top Header */}
      <div className="login-top-header">
        <div className="login-header-left">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" 
            alt="Emblem" 
            className="login-header-logo"
          />
          <div className="login-header-text">
            <h1>Government of Tamil Nadu</h1>
            <h2>ALERTGOV AI</h2>
          </div>
        </div>
        <Link to="/" className="back-home-link">← Back to Home</Link>
      </div>

      {/* Gradient Bar */}
      <div className="login-gradient-bar"></div>

      {/* Main Content */}
      <div className="login-main-content">
        <div className="login-card">
          <div className="login-card-header">
            Department Login
          </div>
          <div className="login-card-body">
            <form onSubmit={handleLogin}>
              <div className="form-row">
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="User Name"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="form-row">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <div className="form-actions">
                <Link to="/help" className="login-help-link">Help?</Link>
                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="login-page-footer">
        <span>Copyright {new Date().getFullYear()}. Government of Tamil Nadu</span>
        <span>Version 4.0.0.0</span>
      </div>
    </div>
  );
}
