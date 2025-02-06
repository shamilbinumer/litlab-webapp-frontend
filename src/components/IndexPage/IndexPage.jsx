import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import SideNave from '../common/SideNav/SideNave';
import './IndexPage.scss';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link } from 'react-router-dom';
import axios from 'axios';

const IndexPage = () => {
    const [activePaperType, setActivePaperType] = useState('major');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Get token from localStorage
                if (!token) {
                    navigate('/login'); // Redirect if no token
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    navigate('/login'); // Redirect if response is not OK
                }
            } catch (error) {
                navigate('/login'); // Redirect if an error occurs
            } finally {
                setLoading(false);
            }
        };

        checkUserAuthentication();
    }, [navigate]);

    if (loading) {
        return <div className="loading">Checking authentication...</div>;
    }

    return (
        <div className='IndexPageMainWrapper'>
            <div className="home-main">
                <div className="home-left">
                    <SideNave />
                </div>
                <div className="home-right">
                    <UserProfile />
                    <h3 className='welcome-heading'>Welcome to <span>LitLab</span></h3>
                    <h1 className='main-heading'>What you want to learn today?</h1>
                    <div className="search-bar">
                        <IoSearchOutline className='search-icon' />
                        <input type="text" placeholder='Search Live Classes, Recorded, Modules' />
                    </div>
                    <div className="paper-types-wrapper">
                        <div className={`paper-type ${activePaperType === 'major' ? "active-paper-type" : ''}`} onClick={() => setActivePaperType('major')}>
                            <span>Major</span>
                            <div className="icon-wrapper">
                                <img src="/Images/major.png" alt="" />
                            </div>
                        </div>
                        <div className={`paper-type ${activePaperType === 'minor' ? "active-paper-type" : ''}`} onClick={() => setActivePaperType('minor')}>
                            <span>Minor</span>
                            <div className="icon-wrapper">
                                <img src="/Images/minor.png" alt="" />
                            </div>
                        </div>
                        <div className={`paper-type ${activePaperType === 'common' ? "active-paper-type" : ''}`} onClick={() => setActivePaperType('common')}>
                            <span>Common</span>
                            <div className="icon-wrapper">
                                <img src="/Images/common.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="paper-cards-section">
                        {activePaperType === 'major' && (
                            <div className="cards-main row">
                                <div className="col-lg-4">
                                    <Link to='/paper-details/123'>
                                        <div className="paper-card">
                                            <IoIosHeartEmpty className='heart-icon' />
                                            <img src="/Images/Group 1000004522.png" alt="" className='paper-image' />
                                            <div className="lesson-container">
                                                <div className="lesson-icon">
                                                    <FaFileInvoiceDollar className='icon' />
                                                </div>
                                                <span>7 Lessons</span>
                                            </div>
                                            <h1 className="paper-title">Budget Analysis</h1>
                                            <p className="paper-description">Budget Analysis examines income, expenses, and goals for efficient resource allocation.</p>
                                            <button>Learn Now</button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
