import React, { useState } from 'react';
import './PremiumAccess.scss';
import { Link, useNavigate } from 'react-router-dom';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';

const PremiumAccess = () => {
    const [activeCard, setActiveCard] = useState('diamond');
    const navigate = useNavigate(); // Hook for navigation

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

    // Reorder cards to ensure active card is in the middle
    const getOrderedCards = () => {
        const activeIndex = cards.findIndex(card => card.id === activeCard);
        const result = [...cards];

        if (activeIndex !== 1) { // If active card is not in middle
            // Swap active card with middle card
            const temp = result[1];
            result[1] = result[activeIndex];
            result[activeIndex] = temp;
        }

        return result;
    };

    // Handle continue button click
    const handleContinue = () => {
        // Navigate to the plan detail page with the active plan name as a query parameter
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
                <div className="pricing-cards">
                    {getOrderedCards().map((card) => (
                        <div
                            key={card.id}
                            className={`card ${card.id} ${activeCard === card.id ? 'active' : ''}`}
                            onClick={() => setActiveCard(card.id)}
                        >
                            {card.discount && <div className="discount-badge">{card.discount}</div>}
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
                            <Link to='' className="explore-btn">Explore More</Link>
                        </div>
                    ))}
                </div>
                <button className="continue-btn" onClick={handleContinue}>Continue</button>
            </div>
        </div>
    );
};

export default PremiumAccess;