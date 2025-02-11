import { useEffect, useState } from 'react'
import './SideNav.scss'
import UserProfile from '../UserProfile/UserProfile'
import { Link } from 'react-router-dom'
import { ImHome3 } from 'react-icons/im'
import { MdOutlineFileDownload } from "react-icons/md";
import { GrDiamond } from "react-icons/gr";
import { TbBook2 } from "react-icons/tb";
import { LuUserRound } from "react-icons/lu";


const SideNave = () => {
    const [activePath, setActivePath] = useState('')
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        setActivePath(window.location.pathname)
    }, [activePath])

    const navItems = [
        {
            id: 'home',
            icon: (
                <ImHome3 />

            ),
            label: 'Home'
        },
        {
            id: 'downloads',
            icon: (
                <MdOutlineFileDownload />

            ),
            label: 'Downloads'
        },
        {
            id: 'Get Premium',
            icon: (
                <GrDiamond />

            ),
            label: 'Get Premium'
        },


        {
            id: 'courses',
            icon: (
                <TbBook2 />

            ),
            label: 'My courses'
        },

        {
            id: 'Profile',
            icon: (
                <LuUserRound />


            ),
            label: 'Profile'
        },
    
   
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
                            <div className={`nav-item ${activePath == '/' ? 'active' : ''}`}><img src="/Images/Group 1000004529.png" alt="" /></div>
                            <div className={`nav-item`}><img src="/Images/Group 1000004528.png" alt="" /></div>
                            <div className={`nav-item`}><img src="/Images/Vector (1).png" alt="" /></div>
                            <div className={`nav-item`}><img src="/Images/Group 1000004528 (1).png" alt="" /></div>
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
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <div className="icon">{item.icon}</div>
                                <span className="label">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default SideNave
