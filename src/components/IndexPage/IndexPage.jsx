import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import MobileIndexPage from './MobileIndexPage/MobileIndexPage';
import './IndexPage.scss';
import { TbShoppingCartCopy } from 'react-icons/tb';
import AddedToCart from '../common/Alerts/AddedTocart/AddedToCart';
import Splash from '../common/Splash/Splash';

const IndexPage = () => {
    const navigate = useNavigate();
    const [activePaperType, setActivePaperType] = useState('minor');
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingCartItems, setLoadingCartItems] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [showCartAlert, setShowCartAlert] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState({});
    const [wishlistAlert, setWishlistAlert] = useState({ show: false, message: '' });

    const settings = {
        dots: false,
        speed: 500,
        slidesToShow: 1.2,
        slidesToScroll: 1
    };

    // Fetch Wishlist Items
    const fetchWishlistItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-wishlist-items`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setWishlistItems(response.data.wishlist);
            }
        } catch (error) {
            console.error("Error fetching wishlist items:", error);
        }
    };

    // Check if item is in wishlist
    const isInWishlist = (paperId) => {
        return wishlistItems.some(item => item.id === paperId);
    };

    // Handle Wishlist Toggle
    const handleWishlist = async (paperId) => {
        setLoadingWishlist(prev => ({ ...prev, [paperId]: true }));

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            if (isInWishlist(paperId)) {
                // Remove from wishlist
                const response = await axios.delete(`${baseUrl}/api/delete-wishlist-item/${paperId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    await fetchWishlistItems();
                    setWishlistAlert({
                        show: true,
                        message: 'Item removed from wishlist'
                    });
                }
            } else {
                // Add to wishlist
                const response = await axios.post(
                    `${baseUrl}/api/add-to-wishlist`,
                    {
                        id: paperId,
                        category:'paper'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    await fetchWishlistItems();
                    setWishlistAlert({
                        show: true,
                        message: 'Item added to wishlist'
                    });
                }
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            setWishlistAlert({
                show: true,
                message: 'Error updating wishlist'
            });
        } finally {
            setLoadingWishlist(prev => ({ ...prev, [paperId]: false }));
            setTimeout(() => {
                setWishlistAlert({ show: false, message: '' });
            }, 3000);
        }
    };

    // Fetch Cart Items
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-cart-items`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const isInCart = (paperId) => {
        return cartItems.some(item => item.id === paperId);
    };

    // Fetch Papers based on type
    const fetchPapers = async (type) => {
        setLoadingPapers(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-${type}-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPapers(response.data);
                setFilteredPapers(response.data);
            }
        } catch (error) {
            console.error(`Error fetching ${type} papers:`, error);
        } finally {
            setLoadingPapers(false);
        }
    };

    // Handle Add to Cart
    const handleAddToCart = async (paperId) => {
        setLoadingCartItems(prev => ({ ...prev, [paperId]: true }));
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.post(
                `${baseUrl}/api/add-to-cart`,
                { paperId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                await fetchCartItems();
                setShowCartAlert(true);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setLoadingCartItems(prev => ({ ...prev, [paperId]: false }));
        }
    };

    // Initial Load Effects
    useEffect(() => {
        const checkUserAuthentication = async () => {
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
                    navigate('/welcome');
                }
            } catch (error) {
                navigate('/welcome');
            }
        };

        checkUserAuthentication();
        fetchCartItems();
        fetchWishlistItems();
    }, [navigate]);

    // Effect for Paper Type Change
    useEffect(() => {
        fetchPapers(activePaperType);
    }, [activePaperType]);

    // Effect for Search
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPapers(papers);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = papers.filter((paper) =>
                (paper.courseTitle || paper.title).toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredPapers(filtered);
        }
    }, [searchTerm, papers]);

    if (loadingPapers) {
        return <Splash />;
    }

    return (
        <div className="IndexPageMainWrapper">
            {/* Cart Alert */}
            <AddedToCart
                isVisible={showCartAlert}
                itemName={addedItemName}
                onClose={() => setShowCartAlert(false)}
            />

            {/* Wishlist Alert */}
            {wishlistAlert.show && (
                <div className="wishlist-alert">
                    {wishlistAlert.message}
                </div>
            )}

            <div className="desktopVersion">
                <div className="home-main">
                    <div className="home-left">
                        <SideNave />
                    </div>
                    <div className="home-right">
                        <div className="desktop-user-profile">
                            <UserProfile />
                        </div>
                        <h3 className="welcome-heading">
                            Welcome to <span>LitLab</span>
                        </h3>
                        <h1 className="main-heading">What you want to learn today?</h1>
                        <div className="search-bar">
                            <div>
                                <IoSearchOutline className="search-icon" />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search Live Classes, Recorded, Modules"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="paper-types-wrapper">
                            <div
                                className={`paper-type ${activePaperType === 'major' ? 'active-paper-type' : ''}`}
                                onClick={() => setActivePaperType('major')}
                            >
                                <span>Major</span>
                                <div className="icon-wrapper">
                                    <img src="/Images/major.png" alt="" />
                                </div>
                            </div>
                            <div
                                className={`paper-type ${activePaperType === 'minor' ? 'active-paper-type' : ''}`}
                                onClick={() => setActivePaperType('minor')}
                            >
                                <span>Minor</span>
                                <div className="icon-wrapper">
                                    <img src="/Images/minor.png" alt="" />
                                </div>
                            </div>
                            <div
                                className={`paper-type ${activePaperType === 'common' ? 'active-paper-type' : ''}`}
                                onClick={() => setActivePaperType('common')}
                            >
                                <span>Common</span>
                                <div className="icon-wrapper">
                                    <img src="/Images/common.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="paper-cards-section">
                            {loadingPapers ? (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            ) : (
                                <div className="cards-main row">
                                    {filteredPapers.length > 0 ? (
                                        filteredPapers.map((paper) => (
                                            <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12" key={paper.id}>
                                                <div className="paper-card">
                                                    <Link to={`/paper-details/${paper.courseTitle || paper.title}/${paper.id}`}>
                                                        <div className="paper-image">
                                                            <img src={paper.imageUrl || '/Images/image 6.png'} alt="" />
                                                        </div>
                                                        <div className="card-details">
                                                            <h2>{paper.courseTitle || paper.title}</h2>
                                                        </div>
                                                    </Link>
                                                    <div className="buttons">
                                                        <div>
                                                            {isInCart(paper.id) ? (
                                                                <Link to='/cart'>
                                                                    <button className='add-cart-btn'>
                                                                        Go to cart <TbShoppingCartCopy />
                                                                    </button>
                                                                </Link>
                                                            ) : (
                                                                <button
                                                                    className='add-cart-btn'
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleAddToCart(paper.id);
                                                                    }}
                                                                    disabled={loadingCartItems[paper.id]}
                                                                >
                                                                    {loadingCartItems[paper.id] ? (
                                                                        'Adding...'
                                                                    ) : (
                                                                        <>Add to Cart <IoCartOutline /></>
                                                                    )}
                                                                </button>
                                                            )}
                                                            {/* <button className='buy-now-btn'>Buy Now</button> */}
                                                        </div>
                                                        <div>
                                                            <div
                                                                className="wishlist-btn"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleWishlist(paper.id, activePaperType);
                                                                }}
                                                                disabled={loadingWishlist[paper.id]}
                                                            >
                                                                {loadingWishlist[paper.id] ? (
                                                                   <span className="loading-wishlist">
                                                                   <Box sx={{ display: 'flex' }}>
                                                                       <CircularProgress size={22} /> 
                                                                   </Box>
                                                               </span>
                                                               
                                                                ) : isInWishlist(paper.id) ? (
                                                                    <IoIosHeart className="heart-icon active" />
                                                                ) : (
                                                                    <IoIosHeartEmpty className="heart-icon" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className='no-result'>No papers found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mobileVersion">
                <MobileIndexPage />
            </div>
        </div>
    );
};

export default IndexPage;