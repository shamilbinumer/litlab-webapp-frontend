import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import './MyFavorites.scss';
import { FaArrowLeft } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import { IoIosHeart } from 'react-icons/io';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import Splash from '../common/Splash/Splash';

const MyFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.get(`${baseUrl}/api/fetch-wishlist-items-details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setFavorites(response.data.wishlist);
                setError(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUserAuthentication = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/welcome');
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
                navigate('/welcome');
            }
        };

        checkUserAuthentication();
        fetchFavorites();
    }, [navigate]);

    const handleRemoveFromWishlist = async (itemId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.delete(`${baseUrl}/api/delete-wishlist-item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Refresh the favorites list
                fetchFavorites();
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const getItemTitle = (item) => {
        switch (item.category) {
            case 'paper':
                return item.title || item.paperTitle;
            case 'module':
                return `Module ${item.module}: ${item.title}`;
            case 'video':
                return item.title || 'Video Lecture';
            case 'slide':
                return item.title || 'Slide Presentation';
            default:
                return 'Untitled Item';
        }
    };

    const getItemLink = (item) => {
        switch (item.category) {
            case 'paper':
                return `/paper-details/${item.title || item.paperTitle}/${item.id}`;
            case 'module':
                return `/module-summery/${item.id}`;
            case 'video':
                return `/lectures/${item.paperTitle}/${item.paperId}/${item.id}`;
            case 'slide':
                return `/paper-details/${item.paperTitle}/${item.paperId}`;
            default:
                return '#';
        }
    };

    if (loading) {
        return <Splash />;
    }

    if (error) {
        return (
            <div className="MyFavoritesMainWrapper">
                <div className="error-message">
                    Error: {error}. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="MyFavoritesMainWrapper">
            <div className="my-favorites-main">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <div className='user-pro'>
                        <UserProfile />
                    </div>
                    <div className="heading-section">
                        <Link to="/" onClick={() => navigate(-1)}>
                            <div className="back-btn-container">
                                <FaArrowLeft className="back-btn" />
                            </div>
                        </Link>
                        <h2 className='my-favorites-heading'>My Favorites</h2>
                    </div>
                    <h1 className='main-heading'>All your favorite items</h1>

                    <div className="cards-main-wrapper">
                        <div className="row">
                            {favorites.length > 0 ? (
                                favorites.map((item, index) => (
                                    <div className="col-lg-6" key={item.id || index}>
                                        <div className="card">
                                            <div className="card-header">
                                                <div>
                                                    <p className="module-subtitle">
                                                        {getItemTitle(item)}
                                                    </p>
                                                  
                                                </div>
                                                <img src="/Images/Module-icon.png" alt="Module icon" />
                                            </div>
                                            <div className="button-group">
                                                <Link to={getItemLink(item)}>
                                                    <button className="learn-now-btn">
                                                        Learn Now <LuEye />
                                                    </button>
                                                </Link>
                                                <span className="category-tag">
                                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                                    </span>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => handleRemoveFromWishlist(item.id)}
                                                >
                                                    <IoIosHeart style={{ color: '#ff0000' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="no-favorites">
                                        <p>No favorites found. Start adding items to your wishlist!</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyFavorites;