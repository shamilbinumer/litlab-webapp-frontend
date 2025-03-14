import { FaArrowLeft } from 'react-icons/fa';
import { LuHeart, LuLock } from 'react-icons/lu';
import { IoIosHeart } from 'react-icons/io';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PaperDetailPage.scss';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import WeeklyChallenge from './WeaklyChellangeComponent/WeaklyChellangeComponent';
import SpecialExam from './SpecialExamComponent/SpecialExamComponent';
import VideoClasses from './VedioClass/VideoClass';
import Slides from './Slides';
import AssessmentTest from './AssistmentTest/AssistmentTest';
import axios from 'axios';
import ModalQuestanPaper from './ModalQuestanPaper';
import PurchasePopup from '../common/Alerts/PurchasePopup/PurchasePopup';
import CircularProgress from '@mui/material/CircularProgress';

import Splash from '../common/Splash/Splash';

const PaperDetailPage = () => {
    const [purchasedPlan, setPurchasedPlan] = useState('');
    const [activeCategory, setActiveCategory] = useState('Study Notes');
    const [activeSubCategory, setActiveSubCategory] = useState('Study Notes');
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { paperId, paperTitle } = useParams();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState({});
    const [wishlistAlert, setWishlistAlert] = useState({ show: false, message: '' });

    // Check if video content is accessible based on plan and video index
    const isVideoAccessible = (videoIndex = 0) => {
        // Silver plan users can only access the first video (index 0)
        if (hasPurchased && purchasedPlan === 'silver') {
            return videoIndex === 0; // Only first video is accessible
        }
        // Gold and Diamond plans can access all videos
        return hasPurchased;
    };

    // Fetch wishlist items
    const fetchWishlistItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-wishlist-items`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setWishlistItems(response.data.wishlist);
            }
        } catch (error) {
            console.error("Error fetching wishlist items:", error);
        }
    };

    // Check if module is in wishlist
    const isInWishlist = (moduleId) => {
        return wishlistItems.some(item => item.id === moduleId);
    };

    // Handle wishlist toggle
    const handleWishlist = async (moduleId, e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoadingWishlist(prev => ({ ...prev, [moduleId]: true }));

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/welcome');
                return;
            }

            if (isInWishlist(moduleId)) {
                // Remove from wishlist
                const response = await axios.delete(`${baseUrl}/api/delete-wishlist-item/${moduleId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    await fetchWishlistItems();
                    setWishlistAlert({
                        show: true,
                        message: 'Module removed from wishlist'
                    });
                }
            } else {
                // Add to wishlist
                const response = await axios.post(
                    `${baseUrl}/api/add-to-wishlist`,
                    {
                        id: moduleId,
                        category: 'module'
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    await fetchWishlistItems();
                    setWishlistAlert({
                        show: true,
                        message: 'Module added to wishlist'
                    });
                }
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            setWishlistAlert({
                show: true,
                message: 'Error updating wishlist'
            });
        } finally {
            setLoadingWishlist(prev => ({ ...prev, [moduleId]: false }));
            setTimeout(() => {
                setWishlistAlert({ show: false, message: '' });
            }, 3000);
        }
    };

    useEffect(() => {
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

                setUserDetails(response.data.user);
                console.log('User data:', response.data.user);

                // Check in purchases array
                const purchaseItem = response.data.user?.purchases?.find(
                    purchase => purchase.courseId === paperId
                );

                // Check in purchasedCourses array if not found in purchases
                const purchasedCourseItem = !purchaseItem && response.data.user?.purchasedCourses?.find(
                    course => course.courseId === paperId
                );

                // Determine which item to use for plan checking
                const itemToCheck = purchaseItem || purchasedCourseItem;

                // Set purchased status
                setHasPurchased(!!itemToCheck);

                // Set plan type if a purchase was found
                if (itemToCheck) {
                    let planName = '';
                    switch (itemToCheck.plan) {
                        case 0:
                            planName = 'diamond';
                            break;
                        case 1:
                            planName = 'gold';
                            break;
                        case 2:
                            planName = 'silver';
                            break;
                        default:
                            planName = 'unknown';
                    }
                    setPurchasedPlan(planName);
                    console.log(`User has purchased this paper with ${planName} plan`);
                } else {
                    console.log('User has not purchased this paper');
                }

                await fetchWishlistItems();

            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/welcome');
            }
        };

        checkUserAuthentication();
    }, [navigate, paperId]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${baseUrl}/api/fetch-modules/${paperId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch modules');
                }

                const data = await response.json();
                console.log(data);

                setModules(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchModules();
    }, [paperId]);

    const isModuleAccessible = (index) => {
        return hasPurchased || index < 1;
    };

    const ModuleCard = ({ module, index }) => {
        const isAccessible = isModuleAccessible(index);

        return (
            <>
                 <Link to={`/pdf/${module.id}`}>
                    <div className={`module-card ${!isAccessible ? 'disabled' : ''}`}>
                        <div className="module-card-left">
                            <h4 className="module-title">
                                Module {module.module} : {module.title}
                            </h4>
                            <div className="button-heart">
                                {isAccessible ? (
                                    <Link to={`/module-summery/${module.id}`}>
                                        <button>Read Summary</button>
                                    </Link>
                                ) : (
                                    <button
                                        className="locked-content"
                                        onClick={() => setShowPurchasePopup(true)}
                                    >
                                        <LuLock className="lock-icon" />
                                        <span>Purchase to unlock</span>
                                    </button>
                                )}
                                <button
                                    className="wishlist-btn"
                                    onClick={(e) => handleWishlist(module.id, e)}
                                    disabled={loadingWishlist[module.id]}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {loadingWishlist[module.id] ? (
                                        <span className="loading-wishlist" style={{ fontSize: '25px' }}><Box sx={{ display: 'flex' }}>
                                            <CircularProgress size={22} />
                                        </Box></span>
                                    ) : isInWishlist(module.id) ? (
                                        <IoIosHeart
                                            className="heart-icon active"
                                            style={{
                                                fontSize: '25px',
                                                color: '#ff0000',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    ) : (
                                        <LuHeart
                                            className="heart-icon"
                                            style={{
                                                fontSize: '25px',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="module-card-right">
                            <img src="/Images/Module-icon.png" alt="" />
                        </div>
                    </div>
                </Link>
            </>
        );
    };

    if (loading) {
        return <Splash />;
    }

    if (error) {
        return <div className="error-message">Error loading modules: {error}</div>;
    }

    return (
        <div className="PaperDetailPageMainWrapper">
            {/* Wishlist Alert */}
            {wishlistAlert.show && (
                <div className="wishlist-alert"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        borderRadius: '4px',
                        zIndex: 1000,
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                >
                    {wishlistAlert.message}
                </div>
            )}

            {showPurchasePopup && (
                <PurchasePopup onClose={() => setShowPurchasePopup(false)} />
            )}

            <div className="detail-page-main">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <div className='user-profilee'>
                        <UserProfile />
                    </div>
                    <Link to='/'>
                        <div className="back-btn-container">
                            <FaArrowLeft className="back-btn" />
                        </div>
                    </Link>
                    <h2 className="paper-title">{paperTitle}</h2>
                    <div className="small-screen-banner">
                        <img src="/Images/image 11.png" alt="" />
                    </div>
                    <div className="contents-main-wrapper row">
                        <div className="col-lg-6 content-left">
                            {activeCategory === 'Video Class' ? (
                                activeSubCategory === 'Slides' ? (
                                    <div className="slides-wrapper">
                                        <Slides
                                            paperId={paperId}
                                            paperTitle={paperTitle}
                                            isAccessible={purchasedPlan == 'silver' ? false : isVideoAccessible()}
                                            planType={purchasedPlan}
                                        />
                                    </div>
                                ) : (
                                    <VideoClasses
                                        paperId={paperId}
                                        paperTitle={paperTitle}
                                        isAccessible={purchasedPlan == 'silver' ? false : isVideoAccessible()}
                                        // planType={purchasedPlan}
                                        hasPurchased={hasPurchased}
                                        onPurchaseClick={() => setShowPurchasePopup(true)}
                                    />
                                )
                            ) : activeCategory === 'Study Notes' ? (
                                activeSubCategory === 'Study Notes' ? (
                                    modules.length > 0 ? (
                                        modules?.map((module, index) => (
                                            <ModuleCard
                                                key={module.id || index}
                                                module={module}
                                                index={index}
                                            />
                                        ))
                                    ) : (
                                        <div className="no-modules-message" style={{
                                            padding: '20px',
                                            backgroundColor: '#f9f9f9',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            marginBottom: '20px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            <p>No Study Notes Available for this Paper in Your Semester and Course.</p>
                                            <p>Please check other categories like Video Classes or Mock Tests.</p>
                                        </div>
                                    )
                                ) : activeSubCategory === 'Model Question Paper' ? (
                                    <div>
                                        <ModalQuestanPaper paperId={paperId} isAccessible={hasPurchased} />
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center" }}>
                                        No Sample Question Paper Available
                                    </div>
                                )
                            ) : (
                                <div>
                                    {activeSubCategory === 'Weekly Challenge' ? (
                                        <WeeklyChallenge paperId={paperId} userDetails={userDetails} isAccessible={hasPurchased} />
                                    ) : activeSubCategory === 'Special Exam' ? (
                                        <SpecialExam paperId={paperId} userDetails={userDetails} isAccessible={hasPurchased} />
                                    ) : activeSubCategory === 'Assessment Test' ? (
                                        <AssessmentTest paperId={paperId} userDetails={userDetails} isAccessible={hasPurchased} />
                                    ) : (
                                        <div>Select a Mock Test type</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 content-right">
                            <div className="boxes-container row">
                                {['Study Notes', 'Video Class', 'Mock Test'].map((category) => (
                                    <div className="col-lg-4 col-md-4 col-sm-4 col-4" key={category}>
                                        <div
                                            className={`box ${activeCategory === category ? 'active-box' : ''}`}
                                            onClick={() => {
                                                setActiveCategory(category);
                                                if (category === 'Study Notes') {
                                                    setActiveSubCategory('Study Notes');
                                                } else if (category === 'Video Class') {
                                                    setActiveSubCategory('Lectures');
                                                } else if (category === 'Mock Test') {
                                                    setActiveSubCategory('Weekly Challenge');
                                                }
                                            }}
                                        >
                                            {category}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="content-details">
                                {activeCategory === 'Study Notes' && (
                                    <>
                                        <div
                                            className={`study-note-card ${activeSubCategory === 'Study Notes' ? 'active' : ''}`}
                                            onClick={() => setActiveSubCategory('Study Notes')}
                                        >
                                            <img src="/Images/study note.png" alt="" />
                                            <span>Study Notes</span>
                                        </div>
                                        <div
                                            className={`study-note-card ${activeSubCategory === 'Model Question Paper' ? 'active' : ''}`}
                                            onClick={() => setActiveSubCategory('Model Question Paper')}
                                        >
                                            <img src="/Images/model qstn.png" alt="" />
                                            <span>Model Question Paper</span>
                                        </div>
                                        <div
                                            className={`study-note-card ${activeSubCategory === 'Sample Question Paper' ? 'active' : ''}`}
                                            onClick={() => setActiveSubCategory('Sample Question Paper')}
                                        >
                                            <img src="/Images/sample qstn.png" alt="" />
                                            <span>Sample Question Paper</span>
                                        </div>
                                    </>
                                )}
                                {activeCategory === 'Video Class' && (
                                    <>
                                        {purchasedPlan === 'silver' && hasPurchased ? (
                                            <>
                                                <div className="limited-access-message" style={{
                                                    padding: '15px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '5px',
                                                    textAlign: 'center',
                                                    margin: '10px 0',
                                                    border: '1px dashed #ccc'
                                                }}>
                                                    <p><strong>Silver Plan:</strong> Access to first video only</p>
                                                    <p style={{ fontSize: '0.9em', color: '#666' }}>Upgrade to Gold or Diamond plan for full access</p>
                                                    <button
                                                        className="upgrade-btn"
                                                        onClick={() => setShowPurchasePopup(true)}
                                                        style={{
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            marginTop: '10px'
                                                        }}
                                                    >
                                                        Upgrade Plan
                                                    </button>
                                                </div>
                                                <div
                                                    className={`vedio-clas-card ${activeSubCategory === 'Lectures' ? 'active' : ''}`}
                                                    onClick={() => setActiveSubCategory('Lectures')}
                                                >
                                                    <img src="/Images/lecture.png" alt="" />
                                                    <span>Lectures</span>
                                                </div>
                                                <div
                                                    className={`vedio-clas-card ${activeSubCategory === 'Slides' ? 'active' : ''}`}
                                                    onClick={() => setActiveSubCategory('Slides')}
                                                >
                                                    <img src="/Images/slides.png" alt="" />
                                                    <span>Slides</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`vedio-clas-card ${activeSubCategory === 'Lectures' ? 'active' : ''}`}
                                                    onClick={() => setActiveSubCategory('Lectures')}
                                                >
                                                    <img src="/Images/lecture.png" alt="" />
                                                    <span>Lectures</span>
                                                </div>
                                                <div
                                                    className={`vedio-clas-card ${activeSubCategory === 'Slides' ? 'active' : ''}`}
                                                    onClick={() => setActiveSubCategory('Slides')}
                                                >
                                                    <img src="/Images/slides.png" alt="" />
                                                    <span>Slides</span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                                {activeCategory === 'Mock Test' && (
                                    <>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Weekly Challenge' ? 'active' : ''}`}
                                            onClick={() => setActiveSubCategory('Weekly Challenge')}
                                        >
                                            <img src="/Images/weeklychallange.png" alt="" />
                                            <span>Weekly Challenge</span>
                                        </div>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Special Exam' ? 'active' : ''}`}
                                            onClick={() => setActiveSubCategory('Special Exam')}
                                        >
                                            <img src="/Images/special exam.png" alt="" />
                                            <span>Special Exam</span>
                                        </div>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Assessment Test' ? 'active' : ''}`}
                                            onClick={() => setActiveSubCategory('Assessment Test')}
                                        >
                                            <img src="/Images/assistmenttest.png" alt="" />
                                            <span>Assessment Test</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaperDetailPage;