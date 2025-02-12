import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { BsMicFill } from 'react-icons/bs';
import { PiBooks } from 'react-icons/pi';
import './FavoriteModuleDetail.scss'
import SideNave from '../common/SideNav/SideNave';
import { Navigate, useNavigate } from 'react-router-dom';
import UserProfile from '../common/UserProfile/UserProfile';
const FavoriteModuleDetail = () => {
   const navigate = useNavigate();
    const handleBackBtn = () => {
        navigate('/')
    }
    return (
        <div className="module-detail-container">
            {/* Header Section */}
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
            <div className="user-icon">
                        <UserProfile />
                    </div>
                <div className="header">
                    <button onClick={handleBackBtn} className="back-button">
                        <FaArrowLeft />
                        <span>Module 1</span>
                    </button>
                </div>

                {/* Search Section */}
                <div className="search-container">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="search"
                            placeholder="Search live cases, recorded, modules"
                        />
                        <button className="mic-button">
                            <BsMicFill />
                        </button>
                    </div>
                </div>

                {/* Module Title Card */}
                <div className="module-title-card">
                    <div className="title-content">
                        <div>
                            <h2>Microeconomic Theory</h2>
                            <p>Micro economics</p>
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
                        how economies decide what to produce, how to produce, and for whom to produce. Key concepts such as demand, supply, and market equilibrium are introduced. The paper also touches on national income, including GDP and GNP, to explain economic performance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FavoriteModuleDetail;