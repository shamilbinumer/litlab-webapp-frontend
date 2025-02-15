import React, { useState, useEffect } from 'react';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BellIcon from '../../common/BellIcon';
import baseUrl from '../../../baseUrl';
import './SeeAllContent.scss';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AddedToCart from '../../common/Alerts/AddedTocart/AddedToCart';
import SideNave from '../../common/SideNav/SideNave';

const SeeAllContent = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Major');
    const [searchTerm, setSearchTerm] = useState('');
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [loadingCartItems, setLoadingCartItems] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [showCartAlert, setShowCartAlert] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');

    // Fetch cart items
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

            if (response.status === 200) {
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    // Check if item is in cart
    const isInCart = (paperId) => {
        return cartItems.some(item => item.id === paperId);
    };

    // Handle add to cart
    const handleAddToCart = async (e, paperId, paperTitle) => {
        e.preventDefault(); // Prevent navigation from Link
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
                await fetchCartItems();
                setAddedItemName(paperTitle);
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

    // Fetch papers based on category
    const fetchPapers = async (category) => {
        setLoadingPapers(true);
        const endpoints = {
            Major: '/api/fetch-major-paper',
            Minor: '/api/fetch-minor-paper',
            Common: '/api/fetch-common-paper'
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}${endpoints[category]}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                setPapers(response.data);
                setFilteredPapers(response.data);
            } else {
                console.error(`Error fetching ${category.toLowerCase()} papers`);
            }
        } catch (error) {
            console.error(`Error fetching ${category.toLowerCase()} papers:`, error);
        } finally {
            setLoadingPapers(false);
        }
    };

    // Handle category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        fetchPapers(category);
    };

    // Handle search
    useEffect(() => {
        const filtered = papers.filter(paper =>
            paper.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPapers(filtered);
    }, [searchTerm, papers]);

    // Initial fetch on component mount
    useEffect(() => {
        fetchPapers(activeCategory);
        fetchCartItems(); // Fetch cart items when component mounts
    }, []);

    return (
        <div className="SeeAllIndexDataMainWrapper">
            <SideNave/>
            <AddedToCart
                isVisible={showCartAlert}
                itemName={addedItemName}
                onClose={() => setShowCartAlert(false)}
            />
            <BellIcon />
            <div className="head-section">
                <h1>What you want to learn today?</h1>
                <div className="search-bar">
                    <div><IoSearchOutline className="search-icon" /></div>
                    <div>
                        <input
                            type="text"
                            placeholder="Search Live Classes, Recorded, Modules"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="category-section">
                <div className="row">
                    {['Major', 'Minor', 'Common'].map((category) => (
                        <div className="col-4" key={category}>
                            <div
                                className={`category-card ${activeCategory === category ? 'active-category-card' : ''}`}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="paper-card-section">
                {loadingPapers ? (
                    <div className="loading">
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="no-papers">No papers found for {activeCategory} category</div>
                ) : (
                    filteredPapers.map(paper => (
                        <Link to={`/paper-details/${paper.courseTitle || paper.title}/${paper.id}`} key={paper._id || paper.id}>
                            <div className="paper-card">
                                <div className="paper-card-left">
                                    <div className="paper-image">
                                        <img
                                            src={paper.image || "/Images/image 6.png"}
                                            alt={paper.title}
                                        />
                                    </div>
                                </div>
                                <div className="paper-card-right">
                                    <h3>{paper.title}</h3>
                                    {isInCart(paper.id) ? (
                                        <button 
                                            className="goto-cart-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/cart');
                                            }}
                                        >
                                            Go to Cart <IoCartOutline className='cart-icon' />
                                        </button>
                                    ) : (
                                        <button
                                            className={loadingCartItems[paper.id] ? 'loading-btn' : ''}
                                            onClick={(e) => handleAddToCart(e, paper.id, paper.title)}
                                            disabled={loadingCartItems[paper.id]}
                                        >
                                            {loadingCartItems[paper.id] ? (
                                                'Adding...'
                                            ) : (
                                                <>Add to Cart <IoCartOutline className='cart-icon' /></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default SeeAllContent;