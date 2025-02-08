import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import './MyCourses.scss';
import { FaArrowLeft } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const MyCourses = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        fetchPurchasedPapers();
    }, []);
    useEffect(() => {
        const checkUserAuthentication = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${baseUrl}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                setError(error.message);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkUserAuthentication();
    }, [navigate]);
    const fetchPurchasedPapers = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${baseUrl}/api/fetch-purchased-papers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch papers');
            }

            const data = await response.json();

            setPapers(data.papers);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="MyCoursesMainWrapper">
            <div className="my-corse-main">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <div className="heading-section">
                        <Link to="/my-profile">
                            <div className="back-btn-container">
                                <FaArrowLeft className="back-btn" />
                            </div>
                        </Link>
                        <h2 className='my-course-heading'>My Courses</h2>
                    </div>
                    <div>
                        <UserProfile />
                    </div>
                    <h1 className='main-heading'>All your purchased papers</h1>

                    {loading && <div className="text-center p-4">Loading your papers...</div>}

                    {error && (
                        <div className="text-red-500 p-4">
                            Error: {error}. Please try again later.
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="cards-main-wrapper">
                            <div className="row">
                                {papers.length > 0 ? (
                                    papers.map((paper, index) => (
                                        <div className="col-lg-6" key={paper.id || index}>
                                                <div className="card">
                                                    <div className="card-header">
                                                        <div>
                                                            <p className="module-subtitle">
                                                                {paper.title || paper.paperTitle}
                                                            </p>
                                                        </div>
                                                        <img src="/Images/Module-icon.png" alt="Module icon" />
                                                    </div>
                                                    <Link to={`/paper-details/${paper.title || paper.paperTitle}`} className="summary-link">
                                                        <button>Learn Now <LuEye /></button>
                                                    </Link>
                                                </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center p-4">
                                        No purchased papers found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;