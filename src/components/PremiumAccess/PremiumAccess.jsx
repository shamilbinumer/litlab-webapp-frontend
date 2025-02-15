import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import './PremiumAccess.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PremiumAccess = () => {
    const [activeCard, setActiveCard] = useState('diamond');
    const [cardOrder, setCardOrder] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        Autoplay:false,
        centerPadding: '0',
        // beforeChange: (current, next) => {
        //     const cardId = cards[next] ? cards[next].id : '';
        //     setActiveCard(cardId);
        // },
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
            features: ['Study Notes'],
            price: 369,
            originalPrice: 599,
        },
        {
            id: 'diamond',
            title: 'Diamond',
            features: ['Study Notes', 'Recorded & Audio Classes', 'Expert Mentorship'],
            price: 4999,
            originalPrice: 6999,
            discount: 'For you 50% OFF',
        },
        {
            id: 'gold',
            title: 'Gold',
            features: ['Study Notes', 'Recorded Classes'],
            price: 999,
            originalPrice: 2000,
        },
    ];



    const updateCardOrder = (newActiveId, isInitial = false) => {
        if (!isInitial && isAnimating) return;

        const currentIndex = cards.findIndex(card => card.id === newActiveId);
        let newOrder = [];

        // Calculate the new order based on the clicked card
        for (let i = 0; i < cards.length; i++) {
            const index = (currentIndex - 1 + i + cards.length) % cards.length;
            newOrder.push(cards[index].id);
        }

        if (!isInitial) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 600); // Match this with your CSS transition duration
        }

        setCardOrder(newOrder);
    };

    const handleCardClick = (cardId) => {
        if (cardId === activeCard || isAnimating) return;

        setActiveCard(cardId);
        updateCardOrder(cardId);
    };

    const getCardPosition = (index) => {
        const positions = ['left', 'center', 'right'];
        return positions[index];
    };

    const handleContinue = () => {
        navigate(`/plan-detail-page?plan=${activeCard}`);
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
                        {cards.map((card, index) => (
                            <div key={card.id} className="slide-item">
                                <div
                                    className={`card ${card.id === activeCard ? 'active' : ''}`}
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
                                        <div className="price">
                                            <span className="currency">₹</span>{card.price}
                                            <span className="period">/6 Papers</span>
                                        </div>
                                        <div className="original-price">
                                            <span className="strike">₹{card.originalPrice}/6 Papers</span>
                                        </div>
                                    </div>
                                    <Link to="" className="explore-btn">Explore More</Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
                <button className="continue-btn" onClick={handleContinue}>Continue</button>
            </div>
        </div>
    );
};

export default PremiumAccess;