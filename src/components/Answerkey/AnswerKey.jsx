import React, { useEffect, useState } from 'react';
import './AnswerKey.scss';
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const AnswerKey = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const navigate = useNavigate()
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const paperId = searchParams.get('paperId');
                const module = searchParams.get('module');
                const examType = searchParams.get('examType');
    
                if (!paperId || !module) throw new Error('Missing parameters');
    
                const authToken = localStorage.getItem('authToken');
                if (!authToken) throw new Error('No authentication token found');
    
                // Determine API endpoint based on exam type
                const apiEndpoint = examType === 'weekly' 
                    ? `${baseUrl}/api/fetch-weakly-chellange/${paperId}/${module}`
                    : `${baseUrl}/api/fetch-special-exam/${paperId}/${module}`;
    
                const response = await axios.get(
                    apiEndpoint,
                    { headers: { 'Authorization': `Bearer ${authToken}` } }
                );
    
                const data = response.data;
                console.log('API Response:', data);
    
                if (Array.isArray(data) && data.length > 0) {
                    const validQuestions = (data[0]?.questions || []).filter(q => !q.delete);
                    console.log('Valid Questions:', validQuestions);
                    setQuestions(validQuestions);
                    setData(data);
                } else {
                    setQuestions([]);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [searchParams]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (questions.length === 0) return <div>No questions found</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="left-side">
                <SideNave />
            </div>
            <div className="right-side">
                <div className="user-pro">
                    <UserProfile />
                </div>
                <div className="header">
                    <div className="back-button">
                        <Link to='/'>
                            <span className="arrow"><FaArrowLeft /></span>
                            <span>Answer & Solution</span>
                        </Link>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row anser-main-wrapper g-0">
                        <div className="col-lg-7 col-sm-12 col-12 col-md-6">
                            <div className="question-section">
                                <div className="question-wrapper">
                                    <div className="question-number">
                                        {currentQuestionIndex + 1}/{questions.length}
                                    </div>
                                    <h2>
                                        <span className='q-no'>Qs {currentQuestionIndex + 1}:</span>
                                        <span>{currentQuestion.question}</span>
                                    </h2>

                                    <div className="options">
                                        {currentQuestion.options.map((option, idx) => (
                                            <div
                                                key={idx}
                                                className={`option ${option === currentQuestion.correctAnswer ? 'correct' : ''}`}
                                            >
                                                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                                <span className="option-text">{option}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                               

                            </div>
                            <div className="navigation-buttons">
                                    <button
                                        onClick={handlePrevQuestion}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
                                    </button>
                                </div>

                        </div>

                        <div className="col-lg-5 solution-wraper col-sm-12 col-12 col-md-6">
                            <div className="solution-section">
                                <h3>Solution</h3>
                                <div className="solution-content">
                                    <p>{currentQuestion.solution}</p>
                                </div>
                            </div>
                            <div className="feedback">
                                <p>Was the Solution helpful?</p>
                                <div className="feedback-buttons">
                                    <button className="thumbs-down"><IoMdThumbsDown /></button>
                                    <button className="thumbs-up"><IoMdThumbsUp /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnswerKey;