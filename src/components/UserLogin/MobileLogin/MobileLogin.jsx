import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../baseUrl';
import './MobileLogin.scss';

const MobileLogin = () => {
    const [otpPageIsVisible, setOtpPageIsVisible] = useState(false);
    const [mobile, setMobile] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    
    const navigate = useNavigate();

    // Timer effect to countdown from 30 seconds
    useEffect(() => {
        let interval;
        if (otpPageIsVisible && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [otpPageIsVisible, timer]);

    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOTP(otp);
        return otp;
    };

    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setMobile(value);
            setError('');
        }
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        
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
            // Reset timer and disable resend button
            setTimer(30);
            setCanResend(false);
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

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value !== '' && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    const handleSendOTP = async () => {
        if (!canResend) return;
        
        setOtp(['', '', '', '', '', '']);
        setError('');
        setIsLoading(true);
        const newOtp = generateOTP();

        try {
            await axios.post(`${baseUrl}/api/otp-send`, { 
                phoneNo: mobile, 
                otp: newOtp 
            });
            // Reset timer and disable resend button
            setTimer(30);
            setCanResend(false);
        } catch (error) {
            setError('Failed to send OTP. Please try again.');
            console.error('OTP send failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async () => {
        const enteredOTP = otp.join('');
        
        if (enteredOTP.length !== 6) {
            setError('Please enter complete OTP');
            return;
        }

        if (enteredOTP === generatedOTP) {
            setIsLoading(true);
            try {
                const response = await axios.post(`${baseUrl}/api/verify-otp`, {
                    mobile,
                    otp: enteredOTP
                });
                
                localStorage.setItem('authToken', response.data.token);
                navigate('/');
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

    return (
        <div className='MobileLoginPageMainWrapper'>
            <div className="mobile-header">
                <div><img src="/Images/Logo P 7.png" alt="" className="mobile-navlogo" /></div>
                <div className='vector-wrapper'>
                    <img src="/Images/welcompage-image.png" alt="" className="mobile-vector-image" />
                    <img src="/Images/Union.png" alt="" className="mobile-vector-child-image" />
                </div>
            </div>
            
            <div><img src="/Images/loginPageImg.png" className='baner-image' alt="" /></div>
            
            <div className="content">
                {otpPageIsVisible ? (
                    <>
                        <h1>OTP Verification</h1>
                        <p style={{ width: '90%', margin: 'auto' }}>
                            We have sent you a one time password on this <strong>Mobile Number</strong>
                        </p>
                        <div className='number'>+91 {mobile}</div>
                        <div className="otp-inputs">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <div key={index}>
                                    <input
                                        ref={inputRefs[index]}
                                        className="otp"
                                        type="text"
                                        maxLength={1}
                                        value={otp[index]}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={isLoading}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='recent-otp'>
                            {canResend ? (
                                <>Do not send OTP? <span onClick={handleSendOTP} style={{ cursor: 'pointer' }}>Send OTP</span></>
                            ) : (
                                <>Resend OTP in <span>{timer}</span> seconds</>
                            )}
                        </div>
                        {error && <p className="error">{error}</p>}
                        <div>
                            <button 
                                onClick={verifyOTP}
                                disabled={isLoading || otp.join('').length !== 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Enter Your Mobile Number</h1>
                        <p>We will send you a confirmation code</p>
                        <form onSubmit={sendOTP}>
                            <div className="input-section">
                                <div>+91</div>
                                <div>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={handleMobileChange}
                                        disabled={isLoading}
                                        placeholder='Phone number'
                                        pattern="^[0-9]{10}$"
                                        title="Please enter exactly 10 digits"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            {error && <p className="error">{error}</p>}
                            <div>
                                <button 
                                    type="submit"
                                    disabled={isLoading || mobile.length !== 10}
                                >
                                    {isLoading ? 'Sending...' : 'Get OTP'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileLogin;