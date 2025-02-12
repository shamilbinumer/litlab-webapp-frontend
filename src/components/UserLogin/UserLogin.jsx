import React, { useState } from 'react';
import axios from 'axios';
import './UserLogin.scss';
import baseUrl from '../../baseUrl';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const UserLogin = () => {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpPageIsVisible, setOtpPageIsVisible] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
   const location = useLocation();
      const navigate = useNavigate();
      const params = new URLSearchParams(location.search);
      const price = params.get('price');
      const couponApplied = params.get('couponApplied');
      const ogPrice = params.get('ogPrice');
      const forSem = params.get('forSem');
    console.log(ogPrice);
    
  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    return otp;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setMobile(value);
      setError('');
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');
    const otp = generateOTP();

    try {
      await axios.post(`${baseUrl}/api/otp-send`, { 
        phoneNo: mobile, 
        otp 
      });
      setOtpPageIsVisible(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('No account found with this number. Please register first.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
      console.error('OTP send failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!enteredOTP) {
      setError('Please enter OTP');
      return;
    }

    if (enteredOTP === generatedOTP) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/api/verify-otp`, {
          mobile,
          otp: enteredOTP
        });
        console.log(response.data,'this is response');
        
        localStorage.setItem('authToken', response.data.token);
        if (response.data.user) {
          // localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        
        navigate(`/`);
      } catch (error) {
        setError('Verification failed. Please try again.');
        console.error('Verification error', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Incorrect OTP');
    }
  };

  const handleResendOTP = () => {
    setEnteredOTP('');
    setError('');
    sendOTP();
  };

  return (
    <div className="send-otp-page-main-wrapper">
      <div className="container-fluid main">
        <div className="row">
          <div className="col-lg-6 left">
            <img src="/undraw_happy_announcement_re_tsm0 1.png" alt="" />
          </div>
          <div className="col-lg-6 right">
            <div>
              {otpPageIsVisible ? (
                <>
                  <h2>Log In to Your Account</h2>
                  <div>
                    <input
                      type="text"
                      value={mobile}
                      disabled={true}
                      readOnly
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={enteredOTP}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 6) {
                          setEnteredOTP(value);
                          setError('');
                        }
                      }}
                      disabled={isLoading}
                      placeholder='Enter OTP'
                      maxLength="6"
                    />
                  </div>
                  {error && <p className="error">{error}</p>}
                  <div>
                    <button 
                      onClick={verifyOTP} 
                      disabled={isLoading || !enteredOTP}
                    >
                      {isLoading ? 'Verifying...' : 'LOG IN'}
                    </button>
                  </div>
                  <div className="resend-otp">
                    Didn't receive OTP? 
                    <button 
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="resend-btn"
                    >
                      Resend OTP
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>Log In to Your Account</h2>
                  <form onSubmit={sendOTP}>
                    <div>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={handleMobileChange}
                        disabled={isLoading}
                        placeholder='Mobile Number'
                        pattern="^[0-9]{10}$"
                        title="Please enter exactly 10 digits"
                        required
                      />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div>
                      <button 
                        type="submit" 
                        disabled={isLoading || mobile.length !== 10}
                      >
                        {isLoading ? 'Sending...' : 'SEND OTP'}
                      </button>
                    </div>
                    <div className="register-link">
                      Don't have an account? <Link to="/signup">Register here</Link>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;