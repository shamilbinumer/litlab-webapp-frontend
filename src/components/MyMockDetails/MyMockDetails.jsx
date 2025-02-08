import { FaArrowLeft } from 'react-icons/fa';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye } from 'react-icons/lu';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './MyMockDetails.scss';

const MyMockDetails = () => {
    // Set default category and sub-category
    const [activeCategory, setActiveCategory] = useState('Mock Test');
    const [activeSubCategory, setActiveSubCategory] = useState('Weekly Challenge');
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
      const currentQuestion = questions[currentQuestionIndex];

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
                    <div className="contents-main-wrapper row">
                        <div className="col-lg-6 content-left">
                            {activeCategory === 'Video Class' ? (
                                activeSubCategory === 'Slides' ? (
                                    <div className="slides-wrapper">
                                        {[...Array(4)].map((_, index) => (
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
                                        ))}
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
                                    ) : activeSubCategory === 'Special Exam' ? (
                                       
                                            <div className="module-card"i id='special-exam-wrapper'>
                                                <div className="module-card-left">
                                                    <h4 className="module-title">Module: Love Across Time</h4>
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
                                       
                                    ) : activeSubCategory === 'Assessment Test' ? (
                                        <div className="quiz-container">
                                            <div className="quiz-content">
                                                <div className="quiz-header">
                                                    <span>1/50</span>
                                                    <span>00:00:00</span>
                                                </div>
                                                <div className="question">
                                                    <h3>
                                                        <span>Qs 1 : </span>
                                                        <p>What happens when a good's price decreases, according to the substitution effect?</p>
                                                    </h3>
                                                    <div className="options">
                                                        {options.map((option) => (
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
                                                    <button className="next">Next</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>Select a Mock Test type</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 content-right">
                            <div className="boxes-container row">
                                {['Study Notes', 'Video Class', 'Mock Test'].map((category) => (
                                    <div className="col-lg-4" key={category}>
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

export default MyMockDetails;