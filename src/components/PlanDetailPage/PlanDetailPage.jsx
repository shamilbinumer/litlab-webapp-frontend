import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PlanDetailPage.scss'
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const PlanDetailPage = () => {
    const [searchParams] = useSearchParams();
    const [activePlan, setActivePlan] = useState('silver');
    const [activePeriod, setActivePeriod] = useState(1);
    const [activeSlide, setActiveSlide] = useState(1);

    useEffect(() => {
        const planFromUrl = searchParams.get('plan');
        if (planFromUrl) {
            setActivePlan(planFromUrl);
        }
    }, [searchParams]);

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
        autoplay: true,
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
                period: '1 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Ideal for Exam Preparation',
                    'Downloadable and Printable'
                ]
            },
            {
                id: 1,
                price: 369,
                period: '6 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Ideal for Exam Preparation',
                    'Downloadable and Printable'
                ]
            },
            {
                id: 2,
                price: 129,
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
                price: 199,
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
                price: 999,
                period: '6 Paper',
                features: [
                    'Access to High-Quality Notes',
                    'Live Classes Access',
                    'Downloadable and Printable',
                    'Practice Tests'
                ]
            },
            {
                id: 2,
                price: 299,
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

    // const getOrderedCards = () => {
    //     const currentPlanCards = plans[activePlan];
    //     const result = [...currentPlanCards];

    //     if (activePeriod !== 1) {
    //         const temp = result[1];
    //         result[1] = result[activePeriod];
    //         result[activePeriod] = temp;
    //     }

    //     return result;
    // };
    const getOrderedCards = () => {
        const currentPlanCards = plans[activePlan];
        return [...currentPlanCards];
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
                        onClick={() => setActivePlan('silver')}
                    >
                        Silver
                    </button>
                    <button
                        className={`tab ${activePlan === 'gold' ? 'active' : ''}`}
                        onClick={() => setActivePlan('gold')}
                    >
                        Gold
                    </button>
                    <button
                        className={`tab ${activePlan === 'diamond' ? 'active' : ''}`}
                        onClick={() => setActivePlan('diamond')}
                    >
                        Diamond
                    </button>
                </div>

                <div className="plan-cards">
                    <Slider {...settings}>
                        {getOrderedCards().map((plan, index) => (
                            <div key={plan.id} className="slide-wrapper">
                                <div
                                    className='plan-card'
                                        //  ${index === activeSlide ? 'active' : ''}
                                         
                                        
                                >
                                    <div className="price">
                                        <span className="currency">₹</span>
                                        {plan.price}
                                        <span className="period">/{plan.period}</span>
                                    </div>

                                    <div className="features">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="feature">
                                                <span className="bullet">•</span> 
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="buy-now">Buy Now</button>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    </div>
    );
};

export default PlanDetailPage;