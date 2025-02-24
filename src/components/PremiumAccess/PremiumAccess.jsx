import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import './PremiumAccess.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PremiumAccess = () => {
    const [activeCard, setActiveCard] = useState('silver');
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const NextArrow = ({ onClick }) => (
        <button 
            className="nav-button next" 
            onClick={onClick}
            aria-label="Next slide"
        >
            <ChevronRight className="nav-icon" />
        </button>
    );

    const PrevArrow = ({ onClick }) => (
        <button 
            className="nav-button prev" 
            onClick={onClick}
            aria-label="Previous slide"
        >
            <ChevronLeft className="nav-icon" />
        </button>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 900,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        Autoplay: false,
        centerPadding: '0',
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: '60px',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                    centerPadding: '0px',
                }
            }
        ]
    };

    const cards = [
        {
            id: 'silver',
            title: 'Silver',
            features: ['Access to High Quality Notes'],
            price: 249,
            originalPrice: 449,
            isAvailable: true
        },
        {
            id: 'diamond',
            title: 'Diamond',
            features: ['Access to High Quality Notes', 'Video Classes', 'Practice Tests','Model Question Papers','Mentorship','AI Assistance'],
            price: 4999,
            originalPrice: 6999,
            discount: 'Launching Soon',
            isAvailable: false
        },
        {
            id: 'gold',
            title: 'Gold',
            features: ['Access to High Quality Notes', 'Video Classes','Practice Tests'],
            price: 569,
            originalPrice: 1499,
            isAvailable: true
        },
    ];

    const handleCardClick = (cardId) => {
        if (cardId === 'diamond' || cardId === activeCard || isAnimating) return;
        setActiveCard(cardId);
    };

    const handleExploreMore = (card) => {
        if (card.isAvailable) {
            navigate(`/plan-detail-page?plan=${card.id}`);
        }
    };

    return (
        <div className="premium-access">
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
                <div className="user-pro">
                    <UserProfile />
                </div>
                <div className="header">
                    <h1>Unlock Premium Access</h1>
                    <p>Experience the best learning journey with premium resources and expert support.</p>
                </div>
                <div className='pricing-cards'>
                    <Slider {...settings}>
                        {cards.map((card) => (
                            <div key={card.id} className="slide-item">
                                <div
                                    className={`card ${card.id === activeCard ? 'active' : ''} ${!card.isAvailable ? 'disabled' : ''}`}
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    {card.discount && (
                                        <div className="discount-badge">{card.discount}</div>
                                    )}
                                    <h2>{card.title}</h2>
                                    <div className="features">
                                        {card.features.map((feature, index) => (
                                            <div className="feature" key={index}>
                                                <span className="bullet">•</span> {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="price-container">
                                      {card.isAvailable ? (
                                         <>
                                          <div className="price">
                                          <span className="currency">₹</span>{card.price}
                                          <span className="period">/4 Papers</span>
                                      </div>
                                      <div className="original-price">
                                          <span className="strike">₹{card.originalPrice}/6 Papers</span>
                                      </div>
                                         </>
                                      ) : (<>Coming Soon</>)}
                                    </div>
                                    {card.isAvailable ? (
                                        <div 
                                            className="explore-btn"
                                            onClick={() => handleExploreMore(card)}
                                        >
                                            Explore More
                                        </div>
                                    ) : (
                                        <div className="explore-btn disabled">
                                            Coming Soon
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default PremiumAccess;