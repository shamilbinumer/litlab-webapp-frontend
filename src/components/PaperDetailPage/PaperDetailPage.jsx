import { FaArrowLeft } from 'react-icons/fa';
import { LuHeart, LuLock } from 'react-icons/lu';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PaperDetailPage.scss';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { format } from "date-fns";
import WeeklyChallenge from './WeaklyChellangeComponent/WeaklyChellangeComponent';
import SpecialExam from './SpecialExamComponent/SpecialExamComponent';
import VideoClasses from './VedioClass/VideoClass';
import Slides from './Slides';
import AssessmentTest from './AssistmentTest/AssistmentTest';
import axios from 'axios';
import ModalQuestanPaper from './ModalQuestanPaper';
import PurchasePopup from '../common/Alerts/PurchasePopup/PurchasePopup';
import PreLoader from '../common/PreLoader/PreLoader';

const PaperDetailPage = () => {
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

    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${baseUrl}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserDetails(response.data.user);

                // Check if user has purchased the paper
                const isPurchased = response.data.user?.purchases?.some(
                    purchase => purchase.courseId === paperId
                );
                setHasPurchased(isPurchased);

            } catch (error) {
                navigate('/login');
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
        return hasPurchased || index < 2;
    };
    console.log('purchased',hasPurchased);
    

   

    if (loading) {
        return (
            <div>
                               <PreLoader/>

            </div>
        );
    }

    if (error) {
        return <div className="error-message">Error loading modules: {error}</div>;
    }
    if (modules.message === 'No modules found for this paper in your semester and course.' ||
        modules.message === 'No modules found.') {
        return (
            <div className="PaperDetailPageMainWrapper">
                <div className="detail-page-main">
                    <div className="left-side">
                        <SideNave />
                    </div>
                    <div className="right-side">
                        <div className='user-profilee'>
                            <UserProfile />
                        </div>
                        <Link to="/">
                            <div className="back-btn-container">
                                <FaArrowLeft className="back-btn" />
                            </div>
                        </Link>
                        <h2 className="paper-title">{paperTitle}</h2>
                        <div className="small-screen-banner">
                            <img src="/Images/image 11.png" alt="" />
                        </div>
                        <div className="no-modules-message">
                            No modules found for this paper in your semester and course.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    const ModuleCard = ({ module, index }) => {
        const isAccessible = isModuleAccessible(index);
        let formattedDate = "22nd September 2024";

        if (module.createTime?._seconds) {
            const date = new Date(module.createTime._seconds * 1000);
            formattedDate = format(date, "do MMMM yyyy");
        }

        return (
            <div className={`module-card ${!isAccessible ? 'disabled' : ''}`}>
              

                <div className="module-card-left">
                    <h4 className="module-title">
                        Module {module.module} : {module.title}
                    </h4>
                    <p>{formattedDate}</p>
                    <div className="button-heart">
                        {isAccessible ? (
                            <Link to={`/module-summery/${module.id}`}>
                                <button>Read Summary</button>
                            </Link>
                        ) : (
                            <button className="locked-content" onClick={()=>setShowPurchasePopup(true)}>
                                <LuLock className="lock-icon" />
                                <span>Purchase to unlock</span>
                            </button>
                        )}
                        <LuHeart className="heart-icon" />
                    </div>
                </div>
                <div className="module-card-right">
                    <img src="/Images/Module-icon.png" alt="" />
                </div>
                {showPurchasePopup && (
                    <PurchasePopup onClose={() => setShowPurchasePopup(false)} />
                )}
            </div>
        );
    };

    return (
        <div className="PaperDetailPageMainWrapper">
            <div className="detail-page-main">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <div className='user-profilee'>
                        <UserProfile />
                    </div>
                    <Link to="/">
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
                                        <Slides paperId={paperId} paperTitle={paperTitle} isAccessible={hasPurchased}/>
                                    </div>
                                ) : (
                                    <VideoClasses paperId={paperId} paperTitle={paperTitle} isAccessible={hasPurchased} />
                                )
                            ) : activeCategory === 'Study Notes' ? (
                                activeSubCategory === 'Study Notes' ? (
                                    modules?.map((module, index) => (
                                        <ModuleCard
                                            key={module.id || index}
                                            module={module}
                                            index={index}
                                        />
                                    ))
                                ) : activeSubCategory === 'Model Question Paper' ? (
                                    <div>
                                        <ModalQuestanPaper paperId={paperId}  isAccessible={hasPurchased} />
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center" }}>
                                        No Sample Question Paper Available
                                    </div>
                                )
                            ) : (
                                <div>
                                    {activeSubCategory === 'Weekly Challenge' ? (
                                        <WeeklyChallenge paperId={paperId} userDetails={userDetails}  isAccessible={hasPurchased}/>
                                    ) : activeSubCategory === 'Special Exam' ? (
                                        <SpecialExam paperId={paperId} userDetails={userDetails}  isAccessible={hasPurchased}/>
                                    ) : activeSubCategory === 'Assessment Test' ? (
                                        <AssessmentTest paperId={paperId} userDetails={userDetails}  isAccessible={hasPurchased}/>
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