import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PlanDetailPage.scss';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PlanDetailPage = () => {
    const [searchParams] = useSearchParams();
    const [activePlan, setActivePlan] = useState('silver');
    const [activeSlide, setActiveSlide] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const planFromUrl = searchParams.get('plan');
        // If diamond is accessed directly via URL, redirect to silver
        if (planFromUrl === 'diamond') {
            setActivePlan('silver');
        } else if (planFromUrl) {
            setActivePlan(planFromUrl);
        }
    }, [searchParams]);

    const handleBuyNow = (plan) => {
        // Extract paper count from the period (e.g., "6 Paper" -> "6")
        const paperCount = plan.period.split(' ')[0];
        
        // Create the query string with all required parameters
        const queryParams = new URLSearchParams({
            category: activePlan,
            amount: plan.price,
            paperCount: paperCount
        }).toString();

        // Navigate to cart with query parameters
        navigate(`/cart/${activePlan}/${plan.price}/${paperCount}`);
    };

    const settings = {
        className: "center",
        dots: false,
        infinite: true,
        speed: 900,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
        initialSlide: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        beforeChange: (current, next) => {
            setActiveSlide(next);
        },
        responsive: [
            {
                breakpoint: 993,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '60px',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '40px',
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    centerPadding: '0px',
                }
            }
        ]
    };

    const plans = {
        silver: [
            {
                id: 0,
                price: 99,
                strikedprice:149,
                period: '1 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Ideal for Exam Preparation',
                    'Downloadable and Printable'
                ]
            },
            {
                id: 1,
                price: 249,
                strikedprice:449,
                period: '4 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Ideal for Exam Preparation',
                    'Downloadable and Printable'
                ]
            },
            {
                id: 2,
                price: 129,
                strikedprice:249,
                period: '2 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Ideal for Exam Preparation',
                    'Downloadable and Printable'
                ]
            }
        ],
        gold: [
            {
                id: 0,
                price: 159,
                strikedprice:449,
                period: '1 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live Classes Access',
                    'Downloadable and Printable',
                    'Practice Tests'
                ]
            },
            {
                id: 1,
                price: 569,
                strikedprice:1499,
                period: '4 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live Classes Access',
                    'Downloadable and Printable',
                    'Practice Tests'
                ]
            },
            {
                id: 2,
                price: 289,
                strikedprice:799,
                period: '2 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live Classes Access',
                    'Downloadable and Printable',
                    'Practice Tests'
                ]
            }
        ],
        diamond: [
            {
                id: 0,
                price: 299,
                period: '1 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live & Recorded Classes',
                    'Expert Mentorship',
                    'Practice Tests',
                    'Premium Study Materials'
                ]
            },
            {
                id: 1,
                price: 4999,
                period: '6 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live & Recorded Classes',
                    'Expert Mentorship',
                    'Practice Tests',
                    'Premium Study Materials'
                ]
            },
            {
                id: 2,
                price: 499,
                period: '2 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live & Recorded Classes',
                    'Expert Mentorship',
                    'Practice Tests',
                    'Premium Study Materials'
                ]
            }
        ]
    };

    // Check if a plan is available
    const isPlanAvailable = (planType) => {
        return planType !== 'diamond';
    };

    const getOrderedCards = () => {
        const currentPlanCards = plans[activePlan];
        return [...currentPlanCards];
    };

    // Handle tab click with availability check
    const handleTabClick = (planType) => {
        if (isPlanAvailable(planType)) {
            setActivePlan(planType);
        }
    };

    return (
        <div className="plan-detail-page">
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
                <div className="userprofile">
                    <UserProfile />
                </div>
                <div className="plan-detail-wrapper">
                    <h1>{activePlan.charAt(0).toUpperCase() + activePlan.slice(1)} Plans</h1>

                    <div className="plan-tabs">
                        <button
                            className={`tab ${activePlan === 'silver' ? 'active' : ''}`}
                            onClick={() => handleTabClick('silver')}
                        >
                            Silver
                        </button>
                        <button
                            className={`tab ${activePlan === 'gold' ? 'active' : ''}`}
                            onClick={() => handleTabClick('gold')}
                        >
                            Gold
                        </button>
                        <button
                            className={`tab ${activePlan === 'diamond' ? 'active' : ''} ${!isPlanAvailable('diamond') ? 'disabled' : ''}`}
                            onClick={() => handleTabClick('diamond')}
                        >
                            Diamond
                            {!isPlanAvailable('diamond') && <div className="coming-soon-badge">Coming Soon</div>}
                        </button>
                    </div>

                    {activePlan !== 'diamond' ? (
                        <div className="plan-cards">
                            <Slider {...settings}>
                                {getOrderedCards().map((plan, index) => (
                                    <div key={plan.id} className="slide-wrapper">
                                        <div className='plan-card'>
                                            <div className="price">
                                                <span className="currency">₹</span>
                                                {plan.price}
                                                <span className="period">/{plan.period}</span>
                                            </div>
                                            <div className="price" style={{fontSize:'15px'}}>
                                                <span className="currency" style={{fontSize:'15px'}}>₹</span>
                                               <strike style={{fontSize:'15px'}}> {plan.strikedprice}</strike>
                                                <span className="period" style={{fontSize:'15px'}}>/{plan.period}</span>
                                            </div>

                                            <div className="features">
                                                {plan.features.map((feature, idx) => (
                                                    <div key={idx} className="feature">
                                                        <span className="bullet">•</span> 
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                className="buy-now"
                                                onClick={() => handleBuyNow(plan)}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    ) : (
                        <div className="coming-soon-message">
                            <div className="message-wrapper">
                                <h2>Diamond Plan Coming Soon!</h2>
                                <p>We're working on something special. Our Diamond Plan will be available soon with premium features including:</p>
                                <ul>
                                    {plans.diamond[0].features.map((feature, idx) => (
                                        <li key={idx}><span className="bullet">•</span> {feature}</li>
                                    ))}
                                </ul>
                                <button 
                                    className="return-btn"
                                    onClick={() => setActivePlan('gold')}
                                >
                                    View Available Plans
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanDetailPage;