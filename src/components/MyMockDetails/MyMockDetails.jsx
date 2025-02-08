import { FaArrowLeft } from 'react-icons/fa';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye } from 'react-icons/lu';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdOutlineRemoveRedEye } from "react-icons/md";

import './MyMockDetails.scss';

const MyMockDetails = () => {
    // Set default category and sub-category
    const [activeCategory, setActiveCategory] = useState('Mock Test');
    const [activeSubCategory, setActiveSubCategory] = useState('Weekly Challenge');
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedModule, setSelectedModule] = useState(null);
    const [quizData, setQuizData] = useState([]);
    const [selectedSpecialExam, setSelectedSpecialExam] = useState(null); // Selected exam/module
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [selectedAssessmentModule, setSelectedAssessmentModule] = useState(null);
    const [selectedWeeklyChallenge, setSelectedWeeklyChallenge] = useState(null);
    const [selectedWeeklyModule, setSelectedWeeklyModule] = useState(null);

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
            correctAnswer: 'A' // Optional: For future use (e.g., validation)
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
        },
        // Add more questions as needed
    ];


    // Function to handle "Next" button click
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null); // Reset selected option for the next question
        }
    };

    const handleModuleSelect = (module) => {
        setSelectedModule(module);
        // Initialize quiz data when module is selected
        setQuizData(questions); // You might want to load specific questions for each module
    };

    const handleAssessmentModuleSelect = (module) => {
        setSelectedAssessmentModule(module);
        setQuizData(questions);
    };

    const handleAssessmentModuleBack = () => {
        setSelectedAssessmentModule(null);
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

    const handleWeeklyModuleSelect = (module) => {
        setSelectedWeeklyModule(module);
        setQuizData(questions);
    };

    const handleWeeklyModuleBack = () => {
        setSelectedWeeklyModule(null);
        setQuizData([]);
    };

    const handleModuleBack = () => {
        setSelectedModule(null);
        setQuizData([]);
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


                    <h2 className="paper-title">Budget Analysis</h2>

                    <div className="small-screen-banner">
                        <img src="/Images/image 11.png" alt="" />
                    </div>
                    <div className="contents-main-wrapper row">
                        <div className="col-lg-6 content-left">
                            {activeCategory === 'Video Class' ? (
                                activeSubCategory === 'Slides' ? (
                                    <div className="slides-wrapper">
                                        {/* {[...Array(4)].map((_, index) => (
                                            <div className="slide-item" key={index}>
                                                <div className="slide-preview">
                                                    <img src="/Images/slides.png" alt={`Slide ${index + 1}`} />
                                                    <h3>Chapter {index + 1}: Budgeting Basics</h3>
                                                    <p>Last updated: 20 Feb 2024</p>
                                                    <div className="slide-actions">
                                                        <button>View Slides</button>
                                                        <LuHeart className="heart-icon" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))} */}
                                        <div>this is slides</div>
                                    </div>
                                ) : (
                                    <div className="videoMainWrapper">
                                        <div className="video-content-wrapper">
                                            <div className="main-content-right">
                                                <div className="vedio-list-wrapper">
                                                    {[...Array(3)].map((_, index) => (
                                                        <Link to='/lectures' key={index}>
                                                            <div className="vedio-item row">
                                                                <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                                                                    <div className="vedio-item-left">
                                                                        <div className="thumbnile">
                                                                            <img src="/Images/teacher.jpg" className="thumbnile-image" alt="" />
                                                                            <IoPlayCircleSharp className="play-icon" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-7 col-md-7 col-sm-7 col-7">
                                                                    <div className="vedio-item-right">
                                                                        <h1>Introduction to Budgeting</h1>
                                                                        <div className="teacer-name">Dr. Muhammed Rayis</div>
                                                                        <p className="vedio-description">Definition and Importance of Budgeting</p>
                                                                        <div className="button-icon">
                                                                            <button>Watch now <LuEye /></button>
                                                                            <LuHeart className="heart-icon" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : activeCategory === 'Study Notes' ? (
                                activeSubCategory === 'Study Notes' ? (
                                    [...Array(4)].map((_, index) => (
                                        <div className="module-card" key={index}>
                                            <div className="module-card-left">
                                                <h4 className="module-title">Module {index + 1}: Love Across Time</h4>
                                                <p>22nd September 2024</p>
                                                <div className="button-heart">
                                                    <button>Read Summary</button>
                                                    <LuHeart className="hear-icon" />
                                                </div>
                                            </div>
                                            <div className="module-card-right">
                                                <img src="/Images/Module-icon.png" alt="" />
                                            </div>
                                        </div>
                                    ))
                                ) : activeSubCategory === 'Model Question Paper' ? (
                                    <div>Model Question Paper Content</div>
                                ) : (
                                    <div>Sample Question Paper Content</div>
                                )
                            ) : (
                                <div>
                                    {activeSubCategory === 'Weekly Challenge' ? (
                                              <div>
                                              {selectedWeeklyChallenge ? (
                                                  selectedWeeklyModule ? (
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
                                                                      onClick={() => setSelectedWeeklyChallenge(null)}
                                                                  />
                                                              </div>
                                                              <h4 style={{ margin: '0', padding: '0' }}>{selectedWeeklyChallenge}</h4>
                                                          </div>
                                                          {weeklyChallengeModules[selectedWeeklyChallenge].map((module, index) => (
                                                              <div className="module-card" id='submoduleCard' key={index} onClick={() => handleWeeklyModuleSelect(module)}>
                                                                  <div className="module-card-left">
                                                                      <h4 className="module-title">{module.title}</h4>
                                                                      <p>{module.description}</p>
                                                                  </div>
                                                                  <div className="module-card-right">
                                                                      <img src={module.icon} alt="" />
                                                                  </div>
                                                              </div>
                                                          ))}
                                                      </>
                                                  )
                                              ) : (
                                                  <div>
                                                      <div className="module-card" onClick={() => setSelectedWeeklyChallenge('quantitative-methods')}>
                                                          <div className="module-card-left">
                                                              <h4 className="module-title">Quantitative Methods</h4>
                                                              <p>Weekly Challenge Series 1</p>
                                                              <div className="button-heart">
                                                                  <button>Start Challenge <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} /></button>
                                                              </div>
                                                          </div>
                                                          <div className="module-card-right">
                                                              <img src="/Images/Module-icon.png" alt="" />
                                                          </div>
                                                      </div>
                                                      <div className="module-card" onClick={() => setSelectedWeeklyChallenge('development-economics')}>
                                                          <div className="module-card-left">
                                                              <h4 className="module-title">Development Economics</h4>
                                                              <p>Weekly Challenge Series 2</p>
                                                              <div className="button-heart">
                                                                  <button>Start Challenge <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} /></button>
                                                              </div>
                                                          </div>
                                                          <div className="module-card-right">
                                                              <img src="/Images/Module-icon.png" alt="" />
                                                          </div>
                                                      </div>
                                                      <div className="module-card" onClick={() => setSelectedWeeklyChallenge('financial-economics')}>
                                                          <div className="module-card-left">
                                                              <h4 className="module-title">Financial Economics</h4>
                                                              <p>Weekly Challenge Series 3</p>
                                                              <div className="button-heart">
                                                                  <button>Start Challenge <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} /></button>
                                                              </div>
                                                          </div>
                                                          <div className="module-card-right">
                                                              <img src="/Images/Module-icon.png" alt="" />
                                                          </div>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                    ) : activeSubCategory === 'Special Exam' ? (
                                        selectedSpecialExam ? (
                                            selectedModule ? (
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
                                            ) :
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' }}>
                                                        <div className="">
                                                            <FaArrowLeft
                                                                className="back-btn"
                                                                onClick={() => setSelectedSpecialExam(null)}
                                                            />
                                                        </div>
                                                        <h4 style={{ margin: '0', padding: '0' }}>{selectedSpecialExam}</h4>
                                                    </div>
                                                    {specialExamModules[selectedSpecialExam].map((module, index) => (
                                                        <div className="module-card" id='submoduleCard' key={index} onClick={() => handleModuleSelect(module)}>
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">{module.title}</h4>
                                                                <p>{module.description}</p>
                                                            </div>
                                                            <div className="module-card-right">
                                                                <img src={module.icon} alt="" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                        ) : (
                                            <div>
                                                <div className={`module-card ${selectedSpecialExam === 'microeconomics' ? 'active-mudule-card' : ''}`} onClick={() => setSelectedSpecialExam('microeconomics')} >
                                                    <div className="module-card-left">
                                                        <h4 className="module-title">Major : Microeconomic Theory II</h4>
                                                        <p>22nd September 2024</p>
                                                        <div className="button-heart">
                                                            <button>Read Summary <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="module-card-right">
                                                        <img src="/Images/Module-icon.png" alt="" />
                                                    </div>
                                                </div>
                                                <div className="module-card" onClick={() => setSelectedSpecialExam('fiscal')}>
                                                    <div className="module-card-left">
                                                        <h4 className="module-title">Minor : Fiscal Policy</h4>
                                                        <p>22nd September 2024</p>
                                                        <div className="button-heart">
                                                            <button>Read Summary <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="module-card-right">
                                                        <img src="/Images/Module-icon.png" alt="" />
                                                    </div>
                                                </div>
                                                <div className="module-card" onClick={() => setSelectedSpecialExam('arabic')}>
                                                    <div className="module-card-left">
                                                        <h4 className="module-title">Common : Arabic</h4>
                                                        <p>22nd September 2024</p>
                                                        <div className="button-heart">
                                                            <button>Read Summary <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="module-card-right">
                                                        <img src="/Images/Module-icon.png" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ) : activeSubCategory === 'Assessment Test' ? (
                                        <div>
                                            {selectedAssessment ? (
                                                selectedAssessmentModule ? (
                                                    // Quiz view when module is selected
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
                                                    // Module selection view
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
                                                )
                                            ) : (
                                                // Initial assessment selection view
                                                <div>
                                                    {['economics', 'mathematics', 'english'].map((assessment) => (
                                                        <div
                                                            className="module-card"
                                                            key={assessment}
                                                            onClick={() => setSelectedAssessment(assessment)}
                                                        >
                                                            <div className="module-card-left">
                                                                <h4 className="module-title">
                                                                    {assessment.charAt(0).toUpperCase() + assessment.slice(1)} Assessment
                                                                </h4>
                                                                <p>
                                                                    {assessment === 'economics' && 'Comprehensive Economic Theory and Practice'}
                                                                    {assessment === 'mathematics' && 'Advanced Mathematical Concepts'}
                                                                    {assessment === 'english' && 'Language Proficiency and Literature'}
                                                                </p>
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
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>Select a Mock Test type</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 content-right">
                            <div className="boxes-container row ">
                                {['Study Notes', 'Video Class', 'Mock Test'].map((category) => (
                                    <div className="col-lg-4 col-sm-4 col-4" key={category}>
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
                                            onClick={() => {
                                                setActiveSubCategory('Weekly Challenge');
                                                setCurrentQuestionIndex(0); // Reset question index
                                                setSelectedOption(null); // Clear selected option
                                            }}
                                        >
                                            <img src="/Images/weeklychallange.png" alt="" />
                                            <span>Weekly Challenge</span>
                                        </div>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Special Exam' ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveSubCategory('Special Exam');
                                                setCurrentQuestionIndex(0); // Reset question index
                                                setSelectedOption(null); // Clear selected option
                                            }}
                                        >
                                            <img src="/Images/special exam.png" alt="" />
                                            <span>Special Exam</span>
                                        </div>
                                        <div
                                            className={`weekly-Challange ${activeSubCategory === 'Assessment Test' ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveSubCategory('Assessment Test');
                                                setCurrentQuestionIndex(0); // Reset question index
                                                setSelectedOption(null); // Clear selected option
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