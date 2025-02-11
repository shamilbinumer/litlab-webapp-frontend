import { FaArrowLeft } from 'react-icons/fa';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye } from 'react-icons/lu';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import baseUrl from '../../baseUrl';
import './MyMockDetails.scss';

const MyMockDetails = () => {
    // Set default category and sub-category
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
    // New states for purchased papers
    const [purchasedPapers, setPurchasedPapers] = useState([]);
    const [selectedSpecialExamModule, setSelectedSpecialExamModule] = useState(null);
    const [loadingPapers, setLoadingPapers] = useState(true);
    const [paperError, setPaperError] = useState(null);

    // Fetch purchased papers
    useEffect(() => {
        const fetchPurchasedPapers = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${baseUrl}/api/fetch-purchased-papers`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch purchased papers');
                }

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
    const fetchModules = async (paperId) => {
        console.log(paperId);

        setLoadingModules(true);
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
            console.log(data, "module");

            setPaperModules(data || []);
        } catch (err) {
            setModuleError(err.message);
        } finally {
            setLoadingModules(false);
        }
    };
    const fetchWeeklyQuestions = async (paperId, moduleNumber) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${baseUrl}/api/fetch-weakly-chellange/${paperId}/${moduleNumber}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();

            return data;
        } catch (err) {
            console.error('Error fetching questions:', err);
            throw err;
        }
    };
    const fetchspecialExamQuestions = async (paperId, moduleNumber) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${baseUrl}/api/fetch-special-exam/${paperId}/${moduleNumber}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();

            return data;
        } catch (err) {
            console.error('Error fetching questions:', err);
            throw err;
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
    const handleSpecialExamModuleSelect = async (module) => {
        try {
            setSelectedSpecialExamModule(module);
            const moduleNumber = module.module;
            const questions = await fetchspecialExamQuestions(selectedSpecialExam, moduleNumber);
            setQuizData(questions);
        } catch (err) {
            console.error('Error loading special exam questions:', err);
        }
    };
    const handleSpecialExamModuleBack = () => {
        setSelectedSpecialExamModule(null);
        setQuizData([]);
    };
    

    const options = [
        { id: 'A', text: "Consumers buy more of the good as it's relatively cheaper" },
        { id: 'B', text: "Consumers save more of their income" },
        { id: 'C', text: "Demand remains unchanged" },
        { id: 'D', text: "The good becomes a Giffen good" }
    ];

    const questions = [
        {
            id: 1,
            question: "What happens when a good's price decreases, according to the substitution effect?",
            options: [
                { id: 'A', text: "Consumers buy more of the good as it's relatively cheaper" },
                { id: 'B', text: "Consumers save more of their income" },
                { id: 'C', text: "Demand remains unchanged" },
                { id: 'D', text: "The good becomes a Giffen good" }
            ],
            correctAnswer: 'A'
        },
        {
            id: 2,
            question: "What is the primary purpose of a budget?",
            options: [
                { id: 'A', text: "To track income and expenses" },
                { id: 'B', text: "To increase debt" },
                { id: 'C', text: "To reduce savings" },
                { id: 'D', text: "To avoid financial planning" }
            ],
            correctAnswer: 'A'
        },
        {
            id: 3,
            question: "Which of the following is a fixed expense?",
            options: [
                { id: 'A', text: "Groceries" },
                { id: 'B', text: "Rent" },
                { id: 'C', text: "Entertainment" },
                { id: 'D', text: "Clothing" }
            ],
            correctAnswer: 'B'
        },
        {
            id: 4,
            question: "What is the primary purpose of a budget?",
            options: [
                { id: 'A', text: "To track income and expenses" },
                { id: 'B', text: "To increase debt" },
                { id: 'C', text: "To reduce savings" },
                { id: 'D', text: "To avoid financial planning" }
            ],
            correctAnswer: 'A'
        }
    ];

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setAnswered(false);
        }
    };

    const handleModuleSelect = (module) => {
        setSelectedModule(module);
        setQuizData(questions);
    };

    const handleAssessmentModuleSelect = (module) => {
        setSelectedAssessmentModule(module);
        setQuizData(questions);
    };

    const handleAssessmentModuleBack = () => {
        setSelectedAssessmentModule(null);
        setQuizData([]);
    };

    const handleWeeklyModuleSelect = async (module) => {
        try {
            setSelectedWeeklyModule(module);
            // Assuming module number is in the title string "Module : 1" - extract the number
            const moduleNumber = module.module;
            const questions = await fetchWeeklyQuestions(selectedWeeklyChallenge, moduleNumber);
            setQuizData(questions);
        } catch (err) {
            console.error('Error loading questions:', err);
            // Handle error appropriately
        }
    };
    const handleSpeciaExamModuleSelect = async (module) => {
        try {
            setSelectedWeeklyModule(module);
            // Assuming module number is in the title string "Module : 1" - extract the number
            const moduleNumber = module.module;
            const questions = await fetchspecialExamQuestions(selectedWeeklyChallenge, moduleNumber);
            setQuizData(questions);
        } catch (err) {
            console.error('Error loading questions:', err);
            // Handle error appropriately
        }
    };

    const handleWeeklyModuleBack = () => {
        setSelectedWeeklyModule(null);
        setQuizData([]);
    };

    const handleModuleBack = () => {
        setSelectedModule(null);
        setQuizData([]);
    };

    const currentQuestion = questions[currentQuestionIndex];

    const specialExamModules = {
        microeconomics: [
            { title: 'Module : 1', description: 'Intertemporal Choice and Capital Decisions', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Module : 2', description: 'General Equilibrium and Welfare Economics', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Module : 3', description: "Asymmetric Information and Market Failure", icon: '/Images/papers_svgrepo.com.png' }
        ],
        fiscal: [
            { title: 'Module 1: Fiscal Policy Framework', date: '22nd September 2024' },
            { title: 'Module 2: Government Expenditure and Revenue', description: '' },
            { title: 'Module 3: Public Debt Management', date: '24th September 2024' }
        ],
        arabic: [
            { title: 'Module 1: Advanced Grammar and Syntax', date: '22nd September 2024' },
            { title: 'Module 2: Classical Arabic Literature', description: '' },
            { title: 'Module 3: Modern Arabic Communication', date: '24th September 2024' }
        ]
    };

    const assessmentModules = {
        economics: [
            { title: 'Production and Cost', description: 'Basic Economic Concepts and Theories', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Consumer Behavior', description: 'Supply, Demand, and Market Equilibrium', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Market Structures', description: 'Monetary and Fiscal Policy', icon: '/Images/papers_svgrepo.com.png' }
        ],
        mathematics: [
            { title: 'Module 1: Calculus', description: 'Differentiation and Integration', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Module 2: Statistics', description: 'Probability and Statistical Analysis', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Module 3: Linear Algebra', description: 'Matrices and Vector Spaces', icon: '/Images/papers_svgrepo.com.png' }
        ],
        english: [
            { title: 'Module 1: Grammar', description: 'Advanced English Grammar', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Module 2: Writing', description: 'Essay and Academic Writing', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Module 3: Literature', description: 'Literary Analysis', icon: '/Images/papers_svgrepo.com.png' }
        ]
    };

    const weeklyChallengeModules = {
        'quantitative-methods': [
            { title: 'Module : 1', description: 'Statistical Analysis and Probability', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Module : 2', description: 'Advanced Economic Modeling', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Module : 3', description: 'Research Design and Analysis', icon: '/Images/papers_svgrepo.com.png' }
        ],
        'development-economics': [
            { title: 'Module : 1', description: 'Theories of Economic Development', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Module : 2', description: 'Development Policy and Planning', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Module : 3', description: 'Global Economic Relations', icon: '/Images/papers_svgrepo.com.png' }
        ],
        'financial-economics': [
            { title: 'Module : 1', description: 'Market Structure and Operations', icon: '/Images/education-book-learn-school-library_svgrepo.com.png' },
            { title: 'Module : 2', description: 'Portfolio Theory and Management', icon: '/Images/Layer_x0020_1.png' },
            { title: 'Module : 3', description: 'Financial Risk Assessment', icon: '/Images/papers_svgrepo.com.png' }
        ]
    };

    const handleIgnore = () => {
        setIgnoredQuestions([...ignoredQuestions, currentQuestionIndex]);
        handleNextQuestion();
    };
    const handleOptionSelect = (option, index) => {
        if (!answered) {
            setSelectedOption(option);
            setAnswered(true);
            
            // Save the answer
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = {
                selected: option,
                correct: option === quizData[currentQuestionIndex].correctAnswer,
                ignored: false
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
                                            // Existing selected challenge view...
                                            <div>
                                                {selectedWeeklyModule && quizData ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={handleWeeklyModuleBack}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedWeeklyModule.title}</h4>
                                                        </div>
                                                        <div className="quiz-container">
                                                            <div className="quiz-content">
                                                                <div className="quiz-header">
                                                                    <span>{currentQuestionIndex + 1}/{quizData.length}</span>
                                                                    <span>00:00:00</span>
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
                                                                                className={`option`}
                                                                                style={getOptionStyle(option)}
                                                                            >
                                                                                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                                                                <span>{option}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
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
                                            // Initial purchased papers view for Weekly Challenge
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
                                                            onClick={() => handleWeeklyChallengeSelect(paper)}  // Changed here
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{paper.title}</h4>
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
                                            // Existing special exam view...
                                            <div>
                                                {selectedModule ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div className="">
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={handleModuleBack}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedModule.title}</h4>
                                                        </div>
                                                        <div className="quiz-container">
                                                            <div className="quiz-content">
                                                                <div className="quiz-header">
                                                                    <span>{currentQuestionIndex + 1}/{questions.length}</span>
                                                                    <span>00:00:00</span>
                                                                </div>
                                                                <div className="question">
                                                                    <h3>
                                                                        <span>Qs {currentQuestion.id} : </span>
                                                                        <p>{currentQuestion.question}</p>
                                                                    </h3>
                                                                    <div className="options">
                                                                        {currentQuestion.options.map((option) => (
                                                                            <div
                                                                                key={option.id}
                                                                                onClick={() => setSelectedOption(option.id)}
                                                                                className={`option ${selectedOption === option.id ? 'selected' : ''}`}
                                                                            >
                                                                                <span className="option-letter">{option.id}</span>
                                                                                <span>{option.text}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="buttons">
                                                                    <button className="ignore">Ignore</button>
                                                                    {currentQuestionIndex < questions.length - 1 ? (
                                                                        <button className="next" onClick={handleNextQuestion}>Next</button>
                                                                    ) : (
                                                                        <Link to='/quiz-analysis' className="next">Finish</Link>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                                onClick={() => handleSpeciaExamModuleSelect(module)}
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
                                            // Initial purchased papers view for Special Exam
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
                                                            onClick={() => handleSpecialExamSelect(paper)}  // Changed here
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{paper.title}</h4>
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
                                            // Existing assessment view...
                                            <div>
                                                {selectedAssessmentModule ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div>
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={handleAssessmentModuleBack}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedAssessmentModule.title}</h4>
                                                        </div>
                                                        <div className="quiz-container">
                                                            <div className="quiz-content">
                                                                <div className="quiz-header">
                                                                    <span>{currentQuestionIndex + 1}/{questions.length}</span>
                                                                    <span>00:00:00</span>
                                                                </div>
                                                                <div className="question">
                                                                    <h3>
                                                                        <span>Qs {currentQuestion.id} : </span>
                                                                        <p>{currentQuestion.question}</p>
                                                                    </h3>
                                                                    <div className="options">
                                                                        {currentQuestion.options.map((option) => (
                                                                            <div
                                                                                key={option.id}
                                                                                onClick={() => setSelectedOption(option.id)}
                                                                                className={`option ${selectedOption === option.id ? 'selected' : ''}`}
                                                                            >
                                                                                <span className="option-letter">{option.id}</span>
                                                                                <span>{option.text}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="buttons">
                                                                    <button className="ignore">Ignore</button>
                                                                    {currentQuestionIndex < questions.length - 1 ? (
                                                                        <button className="next" onClick={handleNextQuestion}>Next</button>
                                                                    ) : (
                                                                        <Link to='/quiz-analysis' className="next">Finish</Link>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                            <div>
                                                                <FaArrowLeft
                                                                    className="back-btn"
                                                                    onClick={() => setSelectedAssessment(null)}
                                                                />
                                                            </div>
                                                            <h4 style={{ margin: '0', padding: '0' }}>{selectedAssessment}</h4>
                                                        </div>
                                                        {assessmentModules[selectedAssessment].map((module, index) => (
                                                            <div
                                                                className="module-card"
                                                                id='submoduleCardAssistment'
                                                                key={index}
                                                                onClick={() => handleAssessmentModuleSelect(module)}
                                                            >
                                                                <div className="module-card-left">
                                                                    <h4 className="module-title">{module.title}</h4>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            // Initial purchased papers view for Assessment Test
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
                                                            onClick={() => handleAssessmentSelect(paper)}  // Changed here
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{paper.title}</h4>
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
                                    ) : (
                                        <div>Select a Mock Test type</div>
                                    )}
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