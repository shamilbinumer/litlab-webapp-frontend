import { useEffect } from 'react';
import './OrderPlacedAlert.scss';
import { Link, useNavigate } from 'react-router-dom';

const OrderPlacedAlert = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBrownMorePaper = () => {
        navigate('/');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="order-placed-overlay">
            <div className="order-placed-alert">
                <div className="success-animation">
                    <svg
                        className="animated-check"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="check-circle"
                            fill="none"
                            stroke="#4CAF50"
                            strokeWidth="2"
                            cx="20"
                            cy="20"
                            r="19"
                        />
                        <circle
                            className="check-background"
                            fill="#4CAF50"
                            cx="20"
                            cy="20"
                            r="19"
                        />
                        <path
                            className="check-mark"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="3"
                            d="M12,20 l6,6 l12,-12"
                        />
                    </svg>
                </div>

                <div className="success-content">
                    <h2>Order Placed Successfully!</h2>
                    <p>Your papers are now ready for access.</p>

                    <div className="action-buttons">
                        {/* <button 
                            className="view-orders-btn"
                            onClick={handleViewOrders}
                        >
                            View Orders
                        </button> */}
                        <Link to='/'>
                            <button
                                className="back-to-browse-btn"
                            >
                                Browse More Papers
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPlacedAlert;