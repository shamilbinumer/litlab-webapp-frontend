import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './UserLogin.scss';
import baseUrl from '../../baseUrl';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${baseUrl}/api/user-signin`, {
        email,
        password
      });

      const { success, token, message } = response.data;

      if (success) {
        localStorage.setItem('authToken', token);
        navigate('/'); // Redirect to dashboard after login
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-otp-page-main-wrapper">
      <div className="container-fluid main">
        <div className="row">
          <div className="col-lg-6 left">
            <img src="/Images/loginPageImg.png" alt="Login" />
          </div>
          <div className="col-lg-6 right">
            <div>
              <h2>Log In to Your Account</h2>
              <form onSubmit={handleLogin}>
                <div>
                  <input
                    type="text"
                    placeholder="Email or Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                <div className="register-link">
                  Don't have an account? <Link to="/signup">Register here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
