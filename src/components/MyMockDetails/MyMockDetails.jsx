import { FaArrowLeft } from 'react-icons/fa';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye } from 'react-icons/lu';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import baseUrl from '../../baseUrl';
import './MyMockDetails.scss';
import axios from 'axios';

const MyMockDetails = () => {
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const TIME_LIMIT = 300; // 5 minutes for the quiz
    const [activeCategory, setActiveCategory] = useState('Mock Test');
    const [activeSubCategory, setActiveSubCategory] = useState('Weekly Challenge');
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedModule, setSelectedModule] = useState(null);
    const [quizData, setQuizData] = useState([]);
    const [selectedSpecialExam, setSelectedSpecialExam] = useState(null);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [selectedAssessmentModule, setSelectedAssessmentModule] = useState(null);
    const [selectedWeeklyChallenge, setSelectedWeeklyChallenge] = useState(null);
    const [selectedWeeklyModule, setSelectedWeeklyModule] = useState(null);
    const [paperModules, setPaperModules] = useState([]);
    const [loadingModules, setLoadingModules] = useState(false);
    const [moduleError, setModuleError] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [ignoredQuestions, setIgnoredQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [purchasedPapers, setPurchasedPapers] = useState([]);
    const [selectedSpecialExamModule, setSelectedSpecialExamModule] = useState(null);
    const [loadingPapers, setLoadingPapers] = useState(true);
    const [paperError, setPaperError] = useState(null);
    const navigate = useNavigate();

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

                if (response.status !== 200) {
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            }
        };

        checkUserAuthentication();
    }, [navigate]);
    // Timer Effect
    useEffect(() => {
        if (quizData && quizData.length > 0) {
            setStartTime(Date.now());

            const timer = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const remainingTime = TIME_LIMIT - elapsedTime;

                if (remainingTime <= 0) {
                    clearInterval(timer);
                    handleIgnore();
                } else {
                    setCurrentTime(elapsedTime);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizData, startTime]);

    // Fetch purchased papers
    useEffect(() => {
        const fetchPurchasedPapers = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) throw new Error('No authentication token found');

                const response = await fetch(`${baseUrl}/api/fetch-purchased-papers`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch purchased papers');
                const data = await response.json();
                setPurchasedPapers(data.papers || []);
            } catch (err) {
                setPaperError(err.message);
            } finally {
                setLoadingPapers(false);
            }
        };

        fetchPurchasedPapers();
    }, []);

    const formatRemainingTime = () => {
        if (!startTime) return "5:00";
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = Math.max(0, TIME_LIMIT - elapsedTime);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const fetchModules = async (paperId) => {
        setLoadingModules(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error('No authentication token found');

            const response = await fetch(`${baseUrl}/api/fetch-modules/${paperId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch modules');
            const data = await response.json();
            setPaperModules(data || []);
        } catch (err) {
            setModuleError(err.message);
        } finally {
            setLoadingModules(false);
        }
    };

    const fetchWeeklyQuestions = async (paperId, moduleNumber) => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error('No authentication token found');

            const response = await fetch(`${baseUrl}/api/fetch-weakly-chellange/${paperId}/${moduleNumber}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch questions');
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error fetching questions:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchspecialExamQuestions = async (paperId, moduleNumber) => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error('No authentication token found');

            const response = await fetch(`${baseUrl}/api/fetch-special-exam/${paperId}/${moduleNumber}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch questions');
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error fetching questions:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAssessmentQuestions = async (paperId, moduleNumber) => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error('No authentication token found');

            const response = await fetch(`${baseUrl}/api/fetch-assessment/${paperId}/${moduleNumber}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch questions');
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error fetching questions:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleWeeklyChallengeSelect = async (paper) => {
        setSelectedWeeklyChallenge(paper.id);
        await fetchModules(paper.id);
    };

    const handleSpecialExamSelect = async (paper) => {
        setSelectedSpecialExam(paper.id);
        await fetchModules(paper.id);
    };

    const handleAssessmentSelect = async (paper) => {
        setSelectedAssessment(paper.id);
        await fetchModules(paper.id);
    };

    const handleWeeklyModuleSelect = async (module) => {
        try {
            setSelectedWeeklyModule(module);
            const moduleNumber = module.module;
            const questions = await fetchWeeklyQuestions(selectedWeeklyChallenge, moduleNumber);
            if (questions && questions.length > 0) {
                setQuizData(questions[0].questions);
            }
        } catch (err) {
            console.error('Error loading questions:', err);
        }
    };

    const handleSpecialExamModuleSelect = async (module) => {
        try {
            setSelectedSpecialExamModule(module);
            const moduleNumber = module.module;
            const questions = await fetchspecialExamQuestions(selectedSpecialExam, moduleNumber);
            if (questions && questions.length > 0) {
                setQuizData(questions[0].questions);
            }
        } catch (err) {
            console.error('Error loading special exam questions:', err);
        }
    };

    const handleAssessmentModuleSelect = async (module) => {
        try {
            setSelectedAssessmentModule(module);
            const moduleNumber = module.module;
            const questions = await fetchAssessmentQuestions(selectedAssessment, moduleNumber);
            if (questions && questions.length > 0) {
                setQuizData(questions[0].questions);
            }
        } catch (err) {
            console.error('Error loading assessment questions:', err);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setAnswered(false);
        }
    };

    const handleIgnore = () => {
        setIgnoredQuestions([...ignoredQuestions, currentQuestionIndex]);
        handleNextQuestion();
    };

    const handleOptionSelect = (option, index) => {
        if (!answered) {
            setSelectedOption(option);
            setAnswered(true);

            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = {
                selected: option,
                correct: option === quizData[currentQuestionIndex].correctAnswer,
                ignored: false,
                solution: quizData[currentQuestionIndex].solution
            };
            setAnswers(newAnswers);
        }
    };

    const getOptionStyle = (option) => {
        if (!answered) {
            return {
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            };
        }

        const isSelected = selectedOption === option;
        const isCorrect = option === quizData[currentQuestionIndex].correctAnswer;

        if (isSelected) {
            return {
                backgroundColor: isCorrect ? '#e6ffe6' : '#ffe6e6',
                borderColor: isCorrect ? '#00cc00' : '#ff0000',
                color: isCorrect ? '#006600' : '#cc0000',
                cursor: 'default',
                transition: 'all 0.3s ease'
            };
        }

        if (isCorrect) {
            return {
                backgroundColor: '#e6ffe6',
                borderColor: '#00cc00',
                color: '#006600',
                cursor: 'default',
                transition: 'all 0.3s ease'
            };
        }

        return {
            cursor: 'default',
            transition: 'all 0.3s ease'
        };
    };

    const renderQuiz = () => (
        <div className="quiz-container">
            <div className="quiz-content">
                <div className="quiz-header">
                    <span>{currentQuestionIndex + 1}/{quizData.length}</span>
                    <span>{formatRemainingTime()}</span>
                </div>
                <div className="question">
                    <h3>
                        <span>Qs {currentQuestionIndex + 1} : </span>
                        <p>{quizData[currentQuestionIndex]?.question}</p>
                    </h3>
                    <div className="options">
                        {quizData[currentQuestionIndex]?.options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => !answered && handleOptionSelect(option, index)}
                                className="option"
                                style={getOptionStyle(option)}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                    {answered && (
                        <div className="solution">
                            <h4>Solution:</h4>
                            <p>{quizData[currentQuestionIndex]?.solution}</p>
                        </div>
                    )}
                </div>
                <div className="buttons">
                    <button
                        className="ignore"
                        onClick={handleIgnore}
                        style={{
                            opacity: answered ? 0.5 : 1,
                            cursor: answered ? 'not-allowed' : 'pointer'
                        }}
                        disabled={answered}
                    >
                        Ignore
                    </button>
                    {currentQuestionIndex < quizData.length - 1 ? (
                        <button
                            className="next"
                            onClick={handleNextQuestion}
                            style={{
                                opacity: !answered ? 0.5 : 1,
                                cursor: !answered ? 'not-allowed' : 'pointer'
                            }}
                            disabled={!answered}
                        >
                            Next
                        </button>
                    ) : (
                        <Link
                            to={`/quiz-analysis?total=${quizData.length}&correct=${answers.filter(a => a?.correct).length}&wrong=${answers.filter(a => !a?.correct && !a?.ignored).length}&ignored=${ignoredQuestions.length}`}
                            className="next"
                            style={{
                                opacity: !answered ? 0.5 : 1,
                                pointerEvents: !answered ? 'none' : 'auto'
                            }}
                        >
                            Finish
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="MyMockDetailsMainWrapper">
            <UserProfile />
            <div className="detail-page-main">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <Link to="/">
                        <div className="back-btn-container">
                            <FaArrowLeft className="back-btn" />
                        </div>
                    </Link>

                    <h2 className="paper-title">Courses You're Enrolled In</h2>

                    <div className="small-screen-banner">
                        <img src="/Images/image 11.png" alt="" />
                    </div>
                    <div className="contents-main-wrapper row">
                        <div className="col-lg-6 content-left">
                            {activeCategory === 'Mock Test' && (
                                <div>
                                    {activeSubCategory === 'Weekly Challenge' ? (
                                        selectedWeeklyChallenge ? (
                                            <div>
                                                {selectedWeeklyModule && quizData ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => {
                                                                        setSelectedWeeklyModule(null);
                                                                        setQuizData([]);
                                                                    }}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedWeeklyModule.title}</h4>
                                                        </div>
                                                        {renderQuiz()}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => setSelectedWeeklyChallenge(null)}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>
                                                                {paperModules.length > 0 ? paperModules[0].paperType || 'Common' : ''} : {paperModules.length > 0 ? paperModules[0].title || paperModules[0].paperTitle : ''}
                                                            </h4>
                                                        </div>
                                                        {loadingModules ? (
                                                            <div>Loading modules...</div>
                                                        ) : moduleError ? (
                                                            <div>Error loading modules: {moduleError}</div>
                                                        ) : paperModules.length > 0 ? (
                                                            paperModules.map((module, index) => (
                                                                <div
                                                                    className="module-card"
                                                                    id='submoduleCard'
                                                                    key={module.id || index}
                                                                    onClick={() => handleWeeklyModuleSelect(module)}
                                                                >
                                                                    <div className="module-card-left">
                                                                        <h4 className="module-title">Module {index + 1} : {module.title}</h4>
                                                                        <p>{module.course} - {module.department}</p>
                                                                    </div>
                                                                    <div className="module-card-right">
                                                                        <img src="/Images/Module-icon.png" alt="" />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>No modules available for this paper.</div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {loadingPapers ? (
                                                    <div>Loading papers...</div>
                                                ) : paperError ? (
                                                    <div>Error loading papers: {paperError}</div>
                                                ) : purchasedPapers.length > 0 ? (
                                                    purchasedPapers.map((paper) => (
                                                        <div
                                                            className="module-card"
                                                            key={paper.id}
                                                            onClick={() => handleWeeklyChallengeSelect(paper)}
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{paper.title || paper.paperTitle}</h4>
                                                                <p>Weekly Challenge Series</p>
                                                                <div className="button-heart">
                                                                    <button>
                                                                        Start Challenge <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="module-card-right">
                                                                <img src="/Images/Module-icon.png" alt="" />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>No purchased papers available.</div>
                                                )}
                                            </div>
                                        )
                                    ) : activeSubCategory === 'Special Exam' ? (
                                        selectedSpecialExam ? (
                                            <div>
                                                {selectedSpecialExamModule && quizData ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => {
                                                                        setSelectedSpecialExamModule(null);
                                                                        setQuizData([]);
                                                                    }}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedSpecialExamModule.title}</h4>
                                                        </div>
                                                        {renderQuiz()}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => setSelectedSpecialExam(null)}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>
                                                                {paperModules.length > 0 ? paperModules[0].paperType : ''} : {paperModules.length > 0 ? paperModules[0].title : ''}
                                                            </h4>
                                                        </div>
                                                        {loadingModules ? (
                                                            <div>Loading modules...</div>
                                                        ) : moduleError ? (
                                                            <div>Error loading modules: {moduleError}</div>
                                                        ) : paperModules.length > 0 ? (
                                                            paperModules.map((module, index) => (
                                                                <div
                                                                    className="module-card"
                                                                    id='submoduleCard'
                                                                    key={module.id || index}
                                                                    onClick={() => handleSpecialExamModuleSelect(module)}
                                                                >
                                                                    <div className="module-card-left">
                                                                        <h4 className="module-title">Module {index + 1} : {module.title}</h4>
                                                                        <p>{module.course} - {module.department}</p>
                                                                    </div>
                                                                    <div className="module-card-right">
                                                                        <img src="/Images/Module-icon.png" alt="" />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>No modules available for this paper.</div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {loadingPapers ? (
                                                    <div>Loading papers...</div>
                                                ) : paperError ? (
                                                    <div>Error loading papers: {paperError}</div>
                                                ) : purchasedPapers.length > 0 ? (
                                                    purchasedPapers.map((paper) => (
                                                        <div
                                                            className="module-card"
                                                            key={paper.id}
                                                            onClick={() => handleSpecialExamSelect(paper)}
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{paper.title || paper.paperTitle}</h4>
                                                                <p>Special Exam</p>
                                                                <div className="button-heart">
                                                                    <button>
                                                                        Start Exam <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="module-card-right">
                                                                <img src="/Images/Module-icon.png" alt="" />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>No purchased papers available.</div>
                                                )}
                                            </div>
                                        )
                                    ) : activeSubCategory === 'Assessment Test' ? (
                                        selectedAssessment ? (
                                            <div>
                                                {selectedAssessmentModule && quizData ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => {
                                                                        setSelectedAssessmentModule(null);
                                                                        setQuizData([]);
                                                                    }}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedAssessmentModule.title}</h4>
                                                        </div>
                                                        {renderQuiz()}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => setSelectedAssessment(null)}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>Assessment Modules</h4>
                                                        </div>
                                                        {loadingModules ? (
                                                            <div>Loading modules...</div>
                                                        ) : moduleError ? (
                                                            <div>Error loading modules: {moduleError}</div>
                                                        ) : paperModules.length > 0 ? (
                                                            paperModules.map((module, index) => (
                                                                <div
                                                                    className="module-card"
                                                                    id='submoduleCard'
                                                                    key={module.id || index}
                                                                    onClick={() => handleAssessmentModuleSelect(module)}
                                                                >
                                                                    <div className="module-card-left">
                                                                        <h4 className="module-title">Module {index + 1} : {module.title}</h4>
                                                                        <p>{module.course} - {module.department}</p>
                                                                    </div>
                                                                    <div className="module-card-right">
                                                                        <img src="/Images/Module-icon.png" alt="" />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>No modules available for this paper.</div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {loadingPapers ? (
                                                    <div>Loading papers...</div>
                                                ) : paperError ? (
                                                    <div>Error loading papers: {paperError}</div>
                                                ) : purchasedPapers.length > 0 ? (
                                                    purchasedPapers.map((paper) => (
                                                        <div
                                                            className="module-card"
                                                            key={paper.id}
                                                            onClick={() => handleAssessmentSelect(paper)}
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{paper.title || paper.paperTitle}</h4>
                                                                <p>Assessment Test</p>
                                                                <div className="button-heart">
                                                                    <button>
                                                                        Start Assessment <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="module-card-right">
                                                                <img src="/Images/Module-icon.png" alt="" />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>No purchased papers available.</div>
                                                )}
                                            </div>
                                        )
                                    ) : null}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 content-right">
                            <div className="boxes-container row">
                                {['Mock Test'].map((category) => (
                                    <div className="col-lg-12 col-sm-12 col-12" key={category}>
                                        <div
                                            className={`box ${activeCategory === category ? 'active-box' : ''}`}
                                            onClick={() => {
                                                setActiveCategory(category);
                                                if (category === 'Mock Test') {
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
                                {activeCategory === 'Mock Test' && (
                                    <>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Weekly Challenge' ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveSubCategory('Weekly Challenge');
                                                setCurrentQuestionIndex(0);
                                                setSelectedOption(null);
                                            }}
                                        >
                                            <img src="/Images/weeklychallange.png" alt="" />
                                            <span>Weekly Challenge</span>
                                        </div>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Special Exam' ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveSubCategory('Special Exam');
                                                setCurrentQuestionIndex(0);
                                                setSelectedOption(null);
                                            }}
                                        >
                                            <img src="/Images/special exam.png" alt="" />
                                            <span>Special Exam</span>
                                        </div>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Assessment Test' ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveSubCategory('Assessment Test');
                                                setCurrentQuestionIndex(0);
                                                setSelectedOption(null);
                                            }}
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

export default MyMockDetails;