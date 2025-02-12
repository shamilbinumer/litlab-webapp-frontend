import React, { useState } from 'react';
import './YourFavorite.scss';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';
import { BsMicFill } from 'react-icons/bs'; // For the microphone icon
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { CiSearch } from "react-icons/ci";
import { Link, Navigate, useNavigate } from 'react-router-dom';


const YourFavorite = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function inside the handler

    const modules = [
        {
            id: 1,
            title: 'Module 1',
            subtitle: 'Microeconomic Theory II'
        },
        {
            id: 2,
            title: 'Module 2',
            subtitle: 'Indian Economic Development'
        },
        {
            id: 3,
            title: 'Module 3',
            subtitle: 'Quantitative Methods for Economics'
        },
        {
            id: 4,
            title: 'Module 4',
            subtitle: 'Public Finance'
        }
    ];

    const filteredModules = modules.filter(module =>
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleBackBtn = () => {
        navigate('/'); // Redirect to home page
    };

    return (
        <div className="YourFavorite-container">
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
                <div className="cart-header">
                    <button onClick={handleBackBtn} className="back-button"><FaArrowLeft />Your Favorites</button>
                    <div className="user-icon">
                        <UserProfile />
                    </div>
                </div>

                <div className="search-container">
                    <div className="search-box">
                        <CiSearch className="search-icon" />
                        <input
                            type="search"
                            placeholder="Search live classes, recorded, modules"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="mic-button">
                            <BsMicFill />
                        </button>
                    </div>
                </div>

                <div className="modules-grid">
                    {filteredModules.map(module => (
                        <div key={module.id}>
                            <Link to={`/fav-module${module.id}`}>
                                <div className="module-card">
                                    <div className="module-content">
                                        <div className="module-text">
                                            <div className="module-title">{module.title}</div>
                                            <div className="module-subtitle">{module.subtitle}</div>
                                            <div className="read-more-btn">
                                                <button>Read Summary <FiEye /></button>
                                            </div>
                                        </div>
                                        <div className="checklist-icon">
                                            <img src="/Images/pad-simplem.png" alt="" />
                                        </div>
                                    </div>
                                </div></Link>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default YourFavorite;