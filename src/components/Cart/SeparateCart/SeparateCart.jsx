import { useState, useEffect } from 'react';
import './SeparateCart.scss';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiEye } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { RiDeleteBinLine } from 'react-icons/ri';
import ConfirmationAlert from '../..//common/Alerts/ConformationAlert/ConformationAlert';
import PaperCountAlert from '../../common/Alerts/PaperCountAlert/PaperCountAlert';
import OrderPlacedAlert from '../../common/Alerts/OrderPlacedAlert/OrderPlacedAlert';
import axios from 'axios';
import SideNave from '../../common/SideNav/SideNave';
import baseUrl from '../../../baseUrl';
import Splash from '../../common/Splash/Splash';

const SeparateCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showCheckoutAlert, setShowCheckoutAlert] = useState(false);
    const [showPaperCountAlert, setShowPaperCountAlert] = useState(false);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [userdetails,setUserDetails]=useState(null)
    const navigate = useNavigate();
    const { category, amount, paperCount } = useParams();
    const finalAmount = Number(amount);

    useEffect(() => {
        fetchCartItems();
        checkUserAuthentication();
    }, []);

    const checkUserAuthentication = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserDetails(response.data.user)
            if (response.status !== 200) {
                navigate('/welcome');
            }
        } catch (error) {
            navigate('/welcome');
        }
    };

    const fetchCartItems = async () => {
        try {
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                navigate('/welcome');
                return;
            }

            const response = await fetch(`${baseUrl}/api/fetch-cart-items`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/welcome');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data.cart);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            setPaymentProcessing(true);
            const { data } = await axios.post(`${baseUrl}/api/create-order`, {
                amount: 1
            });

            const options = {
                key: "rzp_live_ZtcR56CZecXtng",
                amount: data.amount,
                currency: 'INR',
                name: 'Litlab Learning',
                description: `${category} Plan - ${paperCount} Papers`,
                order_id: data.id,
                handler: async (response) => {
                    try {
                        const verifyResponse = await axios.post(`${baseUrl}/api/verify-payment`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyResponse.data.status === 'success') {
                            await processCheckout();
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        setError('Payment verification failed. Please try again.');
                        setPaymentProcessing(false);
                    }
                },
                prefill: {
                    name: `${userdetails.name}`,
                    email: `${userdetails.emil}`,
                    contact:`${userdetails.phone}`
                },
                theme: {
                    color: '#6BCCE5'
                },
                modal: {
                    ondismiss: function() {
                        setPaymentProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                setError('Payment failed. Please try again.');
                setPaymentProcessing(false);
            });
            razorpay.open();
        } catch (error) {
            setError('Failed to initiate payment. Please try again.');
            setPaymentProcessing(false);
        }
    };

    const handleCheckout = () => {
        if (cartItems.length > paperCount) {
            setShowPaperCountAlert(true);
            return;
        }
        
        if (cartItems.length < parseInt(paperCount)) {
            setShowPaperCountAlert(true);
            return;
        }
        
        setShowCheckoutAlert(true);
    };

    const initiateDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteAlert(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteAlert(false);
        setItemToDelete(null);
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;

        try {
            setDeleteLoading(true);
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                navigate('/welcome');
                return;
            }

            const response = await fetch(`${baseUrl}/api/delete-cart-item/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/welcome');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to delete cart item');
            }

            setCartItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
            setShowDeleteAlert(false);
            setItemToDelete(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const processCheckout = async () => {
        try {
            setCheckoutLoading(true);
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                navigate('/welcome');
                return;
            }

            const courseIds = cartItems.map(item => item.id);

            const response = await fetch(`${baseUrl}/api/place-order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseIds,
                    plan: category
                })
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/welcome');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order');
            }

            const data = await response.json();
            if (data.success) {
                setCartItems([]);
                setShowCheckoutAlert(false);
                setShowOrderSuccess(true);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setCheckoutLoading(false);
            setPaymentProcessing(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleOrderSuccessClose = () => {
        setShowOrderSuccess(false);
        navigate('/orders');
    };

    if (loading) {
        return (
            <div>
                <Splash/>
            </div>
        );
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <div className="sepparateCartContainer">
            <div className="cart-container">
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
                <div className="cart-header">
                    <button className="back-button" onClick={handleBackClick}>
                        <FaArrowLeft /> Cart
                    </button>
                    <div className="cart-icon">
                        <span className="cart-count">{cartItems.length}</span>
                        <img src="/Images/cartIcon.png" alt="" />
                    </div>
                </div>

                <div className="modules-grid">
                    {cartItems.map(item => (
                        <div key={item.id}>
                            <div className="module-card">
                                <div className="module-content">
                                    <div className="module-text">
                                        <div className="module-title">{item.title}</div>
                                        <div className="module-subtitle">
                                            {item.course} - {item.semester} Semester
                                        </div>
                                        <div className="module-details">
                                            <span>Paper Type: {item.paperType}</span>
                                        </div>
                                        <div className="read-more-btn">
                                            <button>
                                                Read Summary <FiEye />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="checklist-icon">
                                        <img src="/Images/pad-simplem.png" alt="" />
                                        <div>
                                            <RiDeleteBinLine 
                                                className='delete-btn' 
                                                onClick={() => initiateDelete(item)}
                                                style={{ 
                                                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                                    opacity: deleteLoading ? 0.5 : 1
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <button onClick={() => navigate('/')}>Browse Papers</button>
                    </div>
                ) : (
                    <div className="checkout-section">
                      
                        <div className="checkout-button">
                          <Link to='/premium-plans'><button>Check out</button></Link>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationAlert 
                isOpen={showDeleteAlert}
                message={`Are you sure you want to remove "${itemToDelete?.title}" from your cart?`}
                onConfirm={handleDeleteItem}
                onCancel={handleCancelDelete}
            />

            <ConfirmationAlert 
                isOpen={showCheckoutAlert}
                message={`Proceed to payment for ${cartItems.length} papers (₹${finalAmount})?`}
                onConfirm={handlePayment}
                onCancel={() => setShowCheckoutAlert(false)}
                paymentProcessing={paymentProcessing}
            />

            <PaperCountAlert 
                isOpen={showPaperCountAlert}
                onClose={() => setShowPaperCountAlert(false)}
                cartCount={cartItems.length}
                requiredCount={parseInt(paperCount)}
                maxCount={paperCount}
            />

            <OrderPlacedAlert 
                isOpen={showOrderSuccess}
                onClose={handleOrderSuccessClose}
            />
        </div>
        </div>
    );
};

export default SeparateCart;