import BellIcon from '../../common/BellIcon/BellIcon';
import './MobileIndexPage.scss';
import { IoIosSearch } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SideNave from '../../common/SideNav/SideNave';
import { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import Splash from '../../common/Splash/Splash';

const MobileIndexPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [banners, setBanners] = useState([]);
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
     // Fetch banners
     const fetchBanners = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/fetch-banners`);
            if (response.status === 200) {
                setBanners(response.data);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    // Banner slider settings
    const bannerSliderSettings = {
        dots: true,
        speed: 900,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        infinite: true
    };

    // Settings for all paper types with fixed card width
    const getSliderSettings = (type, itemCount) => {
        // Base settings
        const settings = {
            dots: false,
            speed: 500,
            slidesToScroll: 1,
            infinite: false,
            variableWidth: true,
            centerMode: false,
            slidesToShow: itemCount === 1 ? 1 : 2,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: itemCount === 1 ? 1 : 2
                    }
                }
            ]
        };

        return settings;
    };

    // Fetch functions for each paper type
    const fetchPapers = async (type) => {
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
                    fetchBanners(),
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

    const renderPaperSection = (type, items) => {
        // Get dynamic settings based on item count
        const dynamicSettings = getSliderSettings(type, items.length);
        
        return (
            <div className="category-carousel-wrapper">
                <div className="carousel-titile">
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                </div>

                <div className={`slider-container ${items.length === 1 ? 'single-item' : ''}`}>
                    <Slider {...dynamicSettings}>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <Link key={item.id || index} to={`/paper-details/${item.title || item.paperTitle}/${item.id}`}>
                                    <div className="card-wrapper">
                                        <div className="category-card fixed-width">
                                            <div className="category-img">
                                                <img src={item.imageUrl || "/Images/image 6.png"} alt={item.title} />
                                            </div>

                                            <div className="card-description">
                                                <div className="main-description">
                                                    <h6>{item.title}</h6>
                                                </div>
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
            </div>
        );
    };

    if (loading) {
        return <Splash />;
    }

    // Default banner to display if no banners from API
    const defaultBanner = {
        id: 0,
        title: "Master Your Grades with LitLab",
        buttonText: "Explore more",
        buttonLink: "/see-all-mobile-indexpage",
        imageUrl: null // Will use the default blue background color
    };

    // Use banners from API or fallback to default banner
    const displayBanners = banners.length > 0 ? banners : [defaultBanner];

    return (
        <div className='MobileIndexPageMainWrapper'>
            <SideNave />
            <div className="mobile-index-page">
                <header className="header">
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
                        </button>
                    </div>
                    
                    {/* Banner Carousel Section */}
                    <div className="banner-carousel">
                        <Slider {...bannerSliderSettings}>
                            {displayBanners.map((banner, index) => (
                                <div key={banner.id} className="banner-slide">
                                    <div 
                                        className="promo-card"
                                       
                                    >
                                        <img src={banner.imageUrl} alt="" />
                                    </div>
                                </div>
                            ))}
                        </Slider>
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