import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom' // ✅ Import useLocation
import './SideNav.scss'
import UserProfile from '../UserProfile/UserProfile'
import { ImHome3 } from 'react-icons/im'
import { GrDiamond } from 'react-icons/gr'
import { TbBook2 } from 'react-icons/tb'
import { LuUserRound } from 'react-icons/lu'

const SideNave = () => {
    const location = useLocation(); // ✅ Get current route
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        const pathToTab = {
            '/': 'home',
            '/premium-access': 'premium',
            '/my-course-details': 'courses',
            '/my-profile': 'profile'
        };
        setActiveTab(pathToTab[location.pathname] || 'home'); // ✅ Update activeTab based on URL
    }, [location.pathname]); // ✅ Re-run effect when pathname changes

    const navItems = [
        { id: 'home', icon: <ImHome3 />, label: 'Home', path: '/' },
        { id: 'premium', icon: <GrDiamond />, label: 'Get Premium', path: '/premium-access' },
        { id: 'courses', icon: <TbBook2 />, label: 'My courses', path: '/my-course-details' },
        { id: 'profile', icon: <LuUserRound />, label: 'Profile', path: '/my-profile' }
    ];

    return (
        <div className='SideNavMainWrapper'>
            <div className="desktopSideNavWrapper">
                <div className="sideNav">
                    <div>
                        <Link to='/'>
                            <div className="nav-logo">
                                <img src="/Images/Logo P 7.png" alt="" />
                            </div>
                        </Link>
                        <div className='second-icon'>
                            <img src="/Images/Frame 1261153187.png" alt="" />
                        </div>
                        <div className="nav-items">
                            <Link to='/'>
                                <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}>
                                    <img src="/Images/Group 1000004529.png" alt="" />
                                </div>
                            </Link>
                            <Link to='/my-course-details'>
                                <div className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}>
                                    <img src="/Images/Group 1000004528.png" alt="" />
                                </div>
                            </Link>
                            <Link to='/premium-access'>
                                <div className={`nav-item ${activeTab === 'premium' ? 'active' : ''}`}>
                                    <img src="/Images/Vector (1).png" alt="" />
                                </div>
                            </Link>
                            <Link to='/my-course-details'>
                                <div className={`nav-item notification ${activeTab === 'notification' ? 'active' : ''}`}>
                                    <img src="/Images/Group 1000004528 (1).png" alt="" />
                                    <div className="count">4</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="phone-user-profile">
                        <UserProfile />
                    </div>
                </div>
            </div>

            <div className="mobile-sideNav">
                <nav className="bottom-navbar">
                    <div className="bottom-navbar-container">
                        {navItems.map((item) => (
                            <Link
                                to={item.path}
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            >
                                <div className="icon">{item.icon}</div>
                                <span className="label">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default SideNave
