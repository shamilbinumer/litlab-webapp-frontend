import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './SideNav.scss'
import UserProfile from '../UserProfile/UserProfile'
import { ImHome3 } from 'react-icons/im'
import { GrDiamond } from 'react-icons/gr'
import { TbBook2 } from 'react-icons/tb'
import { LuUserRound } from 'react-icons/lu'
import { TiShoppingCart } from 'react-icons/ti'
import baseUrl from '../../../baseUrl'

const SideNave = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const pathToTab = {
            '/': 'home',
            '/premium-plans': 'premium',
            '/my-course-details': 'courses',
            '/my-profile': 'profile',
            '/cart': 'cart',
        };
        setActiveTab(pathToTab[location.pathname] || 'home');
    }, [location.pathname]);

    const navItems = [
        { id: 'home', icon: <ImHome3 />, label: 'Home', path: '/' },
        { id: 'premium', icon: <GrDiamond />, label: 'Get Premium', path: '/premium-plans' },
        { id: 'courses', icon: <TbBook2 />, label: 'My courses', path: '/my-course-details' },
        { id: 'cart', icon: <TiShoppingCart />, label: 'Cart', path: '/cart' },
        { id: 'profile', icon: <LuUserRound />, label: 'Profile', path: '/my-profile' },
    ];

    const fetchCartItems = async () => {
        setIsLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${baseUrl}/api/fetch-cart-items`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data.cart);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

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
                            <Link to='/premium-plans'>
                                <div className={`nav-item ${activeTab === 'premium' ? 'active' : ''}`}>
                                    <img src="/Images/Vector (1).png" alt="" />
                                </div>
                            </Link>
                            <Link to='/cart'>
                                <div className={`nav-item notification ${activeTab === 'cart' ? 'active' : ''}`}>
                                    <TiShoppingCart style={{fontSize:'20px'}} />
                                    {!isLoading && cartItems.length > 0 && (
                                        <div className="count">{cartItems.length}</div>
                                    )}
                                </div>
                            </Link>
                            <Link to='/'>
                                <div className={`nav-item notification ${activeTab === '' ? 'active' : ''}`}>
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
                                <div className="icon">
                                    {item.icon}
                                    {item.id === 'cart' && !isLoading && cartItems.length > 0 && (
                                        <div className="mobile-count">{cartItems.length}</div>
                                    )}
                                </div>
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