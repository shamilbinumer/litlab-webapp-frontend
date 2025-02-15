import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import { IoIosHeartEmpty } from 'react-icons/io';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import MobileIndexPage from './MobileIndexPage/MobileIndexPage';
import SeeAllContent from './SeeAllContent/SeeAllContent';
import './IndexPage.scss';
import { TbShoppingCartCopy } from 'react-icons/tb';
import AddedToCart from '../common/Alerts/AddedTocart/AddedToCart';

const IndexPage = () => {
    const [activePaperType, setActivePaperType] = useState('major');
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingCartItems, setLoadingCartItems] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [showCartAlert, setShowCartAlert] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-cart-items`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);

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

    const fetchMajorPapers = async () => {
        setLoadingPapers(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-major-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log(response.data);
                setPapers(response.data);
                setFilteredPapers(response.data);
                console.log(response.data, 'this is paper response');
            } else {
                console.error("Error fetching major papers");
            }
        } catch (error) {
            console.error("Error fetching major papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const fetchMinorPapers = async () => {
        setLoadingPapers(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-minor-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPapers(response.data);
                setFilteredPapers(response.data);
            } else {
                console.error("Error fetching minor papers");
            }
        } catch (error) {
            console.error("Error fetching minor papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const fetchCommonPapers = async () => {
        setLoadingPapers(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-common-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPapers(response.data);
                console.log(response.data, 'this is common paper response');
                setFilteredPapers(response.data);
            } else {
                console.error("Error fetching common papers");
            }
        } catch (error) {
            console.error("Error fetching common papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const handleAddToCart = async (paperId) => {
        setLoadingCartItems(prev => ({ ...prev, [paperId]: true }));

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.post(`${baseUrl}/api/add-to-cart`,
                { paperId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                await fetchCartItems(); // Refresh cart items after successful addition
                // setAddedItemName(paperName);
                setShowCartAlert(true);
            } else {
                alert('Failed to add to cart. Please try again.');
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setLoadingCartItems(prev => ({ ...prev, [paperId]: false }));
        }
    };

    useEffect(() => {
        const checkUserAuthentication = async () => {
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
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            }
        };

        checkUserAuthentication();
        fetchCartItems(); // Fetch cart items when component mounts
    }, [navigate]);

    useEffect(() => {
        if (activePaperType === 'major') {
            fetchMajorPapers();
        } else if (activePaperType === 'minor') {
            fetchMinorPapers();
        } else if (activePaperType === 'common') {
            fetchCommonPapers();
        }
    }, [activePaperType]);

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

    return (
        <div className="IndexPageMainWrapper">
            <AddedToCart
                isVisible={showCartAlert}
                itemName={addedItemName}
                onClose={() => setShowCartAlert(false)}
            />
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
                                                            <img src="/Images/image 6.png" alt="" />
                                                        </div>
                                                        <div className="card-details">
                                                            <h2>{paper.courseTitle || paper.title}</h2>
                                                            <p>{paper.description || 'Description'}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="buttons">
                                                        <div>
                                                            {isInCart(paper.id) ? (
                                                                <button
                                                                    className='add-cart-btn'
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        navigate('/cart');
                                                                    }}
                                                                >
                                                                    Item In Cart <TbShoppingCartCopy />
                                                                </button>
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
                                                                        <>Adding...</>
                                                                    ) : (
                                                                        <>Add to Cart <IoCartOutline /></>
                                                                    )}
                                                                </button>
                                                            )}
                                                            <button className='buy-now-btn'>Buy Now</button>
                                                        </div>
                                                        <div>
                                                            <IoIosHeartEmpty className='heart-icon' />
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
                <SeeAllContent />
            </div>
        </div>
    );
};

export default IndexPage;