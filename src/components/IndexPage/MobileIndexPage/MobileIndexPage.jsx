import { MdOutlineKeyboardVoice } from 'react-icons/md';
import BellIcon from '../../common/BellIcon/BellIcon';
import './MobileIndexPage.scss';
import { IoIosSearch } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SideNave from '../../common/SideNav/SideNave';
import { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import PreLoader from '../../common/PreLoader/PreLoader';

const MobileIndexPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [papers, setPapers] = useState({
        major: [],
        minor: [],
        common: []
    });
    const [filteredPapers, setFilteredPapers] = useState({
        major: [],
        minor: [],
        common: []
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Separate settings for each paper type
    const sliderSettings = {
        major: {
            dots: false,
            speed: 500,
            slidesToShow: 1.5,  // Show more items for major papers
            slidesToScroll: 1,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1.2
                    }
                }
            ]
        },
        minor: {
            dots: false,
            speed: 500,
            slidesToShow: 2.2,  // Show even more items for minor papers
            slidesToScroll: 1,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1.5
                    }
                }
            ]
        },
        common: {
            dots: false,
            speed: 500,
            slidesToShow: 2.5,  // Show most items for common papers
            slidesToScroll: 1,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1.8
                    }
                }
            ]
        }
    };

    // Fetch functions for each paper type
    const fetchPapers = async (type) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-${type}-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPapers(prev => ({
                    ...prev,
                    [type]: response.data
                }));
                setFilteredPapers(prev => ({
                    ...prev,
                    [type]: response.data
                }));
            }
        } catch (error) {
            console.error(`Error fetching ${type} papers:`, error);
        }
    };

    // Search functionality
    const handleSearch = (value) => {
        setSearchTerm(value);
        
        if (!value.trim()) {
            setFilteredPapers(papers);
            return;
        }

        const searchValue = value.toLowerCase();
        const filtered = {
            major: papers.major.filter(paper => 
                paper.title?.toLowerCase().includes(searchValue) ||
                paper.description?.toLowerCase().includes(searchValue)
            ),
            minor: papers.minor.filter(paper => 
                paper.title?.toLowerCase().includes(searchValue) ||
                paper.description?.toLowerCase().includes(searchValue)
            ),
            common: papers.common.filter(paper => 
                paper.title?.toLowerCase().includes(searchValue) ||
                paper.description?.toLowerCase().includes(searchValue)
            )
        };
        
        setFilteredPapers(filtered);
    };

    useEffect(() => {
        const fetchAllPapers = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchPapers('major'),
                    fetchPapers('minor'),
                    fetchPapers('common')
                ]);
            } catch (error) {
                console.error('Error fetching papers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPapers();
    }, []);

    const renderPaperSection = (type, items) => (
        <div className="category-carousel-wrapper">
            <div className="carousel-titile">
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            </div>

            <Slider {...sliderSettings[type]}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                       <Link  key={item.id || index} to={`/paper-details/${item.title || item.paperTitle}/${item.id}`}>
                        <div>
                            <div className="category-card">
                                <div className="category-img">
                                    <img src={item.image || "/Images/image 6.png"} alt={item.title} />
                                </div>

                                <div className="card-description">
                                    <div className="main-description">
                                        <h6>{item.title}</h6>
                                    </div>
                                    {/* <div className="sub-description">
                                        <p>{item.lessons || '0 Lessons'}</p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                       </Link>
                    ))
                ) : (
                    <div className="no-papers-found">
                        <p>No {type} papers found</p>
                    </div>
                )}
            </Slider>
        </div>
    );

    if (loading) {
        return <PreLoader />;
    }

    return (
        <div className='MobileIndexPageMainWrapper'>
            <SideNave />
            <div className="mobile-index-page">
                <header className="header">
                    {/* <button className="menu-button">
                        <BiMenuAltLeft />
                    </button> */}
                    <div className="bell-icon">
                        <BellIcon />
                    </div>
                </header>

                <main className="main-content">
                    <div className="welcome-content">
                        <h6>Welcome to <span>LitLab</span></h6>
                    </div>
                    <h1 className="title">
                        What You Want<br />
                        To Learn Today?
                    </h1>

                    <div className="search-container">
                        <div className="search-icon">
                            <IoIosSearch />
                        </div>
                        <input
                            type="search"
                            placeholder="Search live classes, recorded, modules"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <button className="voice-search-button">
                            {/* <span className="voice-icon"><MdOutlineKeyboardVoice /></span> */}
                        </button>
                    </div>

                    <div className="promo-card">
                        <div className="promo-content">
                            <h2 className="promo-title">Master Your Grades<br />with LitLab</h2>
                           <Link to='/see-all-mobile-indexpage'><button className="explore-button">Explore more</button></Link>
                        </div>
                        <div className="phone-mockup"></div>
                    </div>
                </main>

                <div className="PaperCategories">
                    <div className="cat-main-heading">
                        <h6>Popular Papers</h6>
                        <Link to='/see-all-mobile-indexpage'>See all</Link>
                    </div>
                    
                    {/* Render all paper sections with their specific settings */}
                    {renderPaperSection('major', filteredPapers.major)}
                    {renderPaperSection('minor', filteredPapers.minor)}
                    {renderPaperSection('common', filteredPapers.common)}
                </div>
            </div>
        </div>
    );
}

export default MobileIndexPage;