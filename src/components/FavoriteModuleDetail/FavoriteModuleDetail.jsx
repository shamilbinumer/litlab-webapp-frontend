import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { BsMicFill } from 'react-icons/bs';
import './FavoriteModuleDetail.scss';
import SideNave from '../common/SideNav/SideNave';
import { useNavigate, useParams } from 'react-router-dom';
import UserProfile from '../common/UserProfile/UserProfile';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const FavoriteModuleDetail = () => {
    const navigate = useNavigate();
    const { moduleId } = useParams();
    const [moduleDetails, setModuleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModuleDetails = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/fetch-module-details/${moduleId}`);
                setModuleDetails(response.data.data);
                console.log(response.data,'hjvjh');
                
            } catch (err) {
                setError('Failed to fetch module details');
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) {
            fetchModuleDetails();
        }
    }, [moduleId]);

    const handleBackBtn = () => {
        navigate('/');
    };

    return (
        <div className="module-detail-container">
            {/* Left Side Navigation */}
            <div className="left-side">
                <SideNave />
            </div>

            {/* Right Side Content */}
            <div className="right-side">
                <div className="user-icon">
                    <UserProfile />
                </div>

                {/* Header */}
                <div className="header">
                    <button onClick={handleBackBtn} className="back-button">
                        <FaArrowLeft />
                        <span>{moduleDetails?.title || 'Module'}</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="search" placeholder="Search live cases, recorded, modules" />
                        <button className="mic-button">
                            <BsMicFill />
                        </button>
                    </div>
                </div>

                {/* Module Details */}
                {loading ? (
                    <p>Loading module details...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        {/* Module Title Card */}
                        <div className="module-title-card">
                            <div className="title-content">
                                <div>
                                    <h2>{moduleDetails?.title || 'No Title'}</h2>
                                    <p>{moduleDetails?.description || 'No Description Available'}</p>
                                </div>
                                <div className="book-icon">
                                    <img src="/Images/myfavDetalBook.png" alt="Book Icon" />
                                </div>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="summary-card">
                            <div className="summary-tag">Summary</div>
                            <p className="summary-content">
                                {moduleDetails?.summary || 'No summary available'}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FavoriteModuleDetail;
