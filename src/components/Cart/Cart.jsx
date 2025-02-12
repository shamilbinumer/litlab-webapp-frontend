import React from 'react';
import './Cart.scss';
import { FaArrowLeft, FaEye } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';

const Cart = () => {
    const modules = [
        {
            id: 1,
            title: 'Module 1',
            subtitle: 'Microeconomic Theory II'
        },
        {
            id: 2,
            title: 'Module 2',
            subtitle: 'Indian Economic Development'
        },
        {
            id: 3,
            title: 'Module 3',
            subtitle: 'Quantitative Methods for Economics'
        },
        {
            id: 4,
            title: 'Module 4',
            subtitle: 'Public Finance'
        }
    ];

    return (
        <div className="cart-container">
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
                {/* <div className="user-pro">
                    <UserProfile/>
                </div> */}
                <div className="cart-header">
                    <button className="back-button"><FaArrowLeft /> Cart</button>
                    <div className="cart-icon">
                        <span className="cart-count">1</span>
                        <img src="/Images/cartIcon.png" alt="" />
                    </div>
                </div>

                <div className="modules-grid">
                    {modules.map(module => (
                        <div key={module.id}>
                            <div className="module-card">
                                <div className="module-content">
                                    <div className="module-text">
                                        <div className="module-title">{module.title}</div>
                                        <div className="module-subtitle">{module.subtitle}</div>
                                        <div className="read-more-btn">
                                            <button>Read Summary <FiEye />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="checklist-icon">
                                        <img src="/Images/pad-simplem.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="checkout-button">
                    <button className="">Check out</button>
                </div>            </div>
        </div>
    );
};

export default Cart;