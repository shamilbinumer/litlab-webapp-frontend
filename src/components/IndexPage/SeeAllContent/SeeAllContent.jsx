import React, { useState, useEffect } from 'react';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BellIcon from '../../common/BellIcon';
import baseUrl from '../../../baseUrl';
import './SeeAllContent.scss'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const SeeAllContent = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Major');
    const [searchTerm, setSearchTerm] = useState('');
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loadingPapers, setLoadingPapers] = useState(false);

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
                console.log(`${category} papers:`, response.data);
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
    }, []);

    return (
        <div className="SeeAllIndexDataMainWrapper">
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
                        </Box></div>
                ) : filteredPapers.length === 0 ? (
                    <div className="no-papers">No papers found for {activeCategory} category</div>
                ) : (
                    filteredPapers.map(paper => (
                        <Link to={`/paper-details/${paper.courseTitle || paper.title}/${paper.id}`} key={paper._id || paper.id}>
                        <div className="paper-card" >
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
                                <button>
                                    Add to Cart <IoCartOutline className='cart-icon' />
                                </button>
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