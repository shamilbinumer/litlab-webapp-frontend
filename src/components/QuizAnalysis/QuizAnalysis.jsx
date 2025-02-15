import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './QuizAnalysis.scss';
import UserProfile from '../common/UserProfile/UserProfile';
import SideNave from '../common/SideNav/SideNave';

const QuizAnalysis = () => {
    const [showSolution, setShowSolution] = useState(false);
    const [searchParams] = useSearchParams();

    // Get values from URL query parameters
    const totalQuestions = parseInt(searchParams.get('total') || '0');
    const correctAnswers = parseInt(searchParams.get('correct') || '0');
    const wrongAnswers = parseInt(searchParams.get('wrong') || '0');
    const ignoredQuestions = parseInt(searchParams.get('ignored') || '0');
    const totalTime = parseInt(searchParams.get('totalTime') || '0');
    const avgTime = parseInt(searchParams.get('avgTime') || '0');
    const paperId = searchParams.get('paperId') || '0';
    const module = searchParams.get('module') || '0';
    const examType = searchParams.get('examType') || '0';
    const tutorialTitle = searchParams.get('tutorialTitle') || '0';


    // Calculate additional statistics
    const correctPercentage = (correctAnswers / totalQuestions) * 100;
    const score = `${correctAnswers}/${totalQuestions}`;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    useEffect(() => {
        console.log("Query Parameters:", searchParams.toString());
        console.log("Total Questions:", totalQuestions);
        console.log("Correct Answers:", correctAnswers);
        console.log("Wrong Answers:", wrongAnswers);
        console.log("Ignored Questions:", ignoredQuestions);
        console.log("Total Time:", totalTime);
        console.log("Average Time:", avgTime);
        console.log("Paper ID:", paperId);
    }, [searchParams]);

    const StatCard = ({ image, value, label }) => (
        <div className="stat-card">
            <div className="icon-wrapper">
                <img src={image} alt={label} />
            </div>
            <div className="value">{value}</div>
            <div className="label">{label}</div>
        </div>
    );

    return (
        <div className="quiz-analytics">
            <div className="userProfile">
                <UserProfile />
            </div>

            <div className="quiz-analyticsMain-Wrapper">
                <div className="left-side">
                    <SideNave />
                </div>

                <div className="right-side">
                    <div className="heaing-section">
                        <Link to={`/paper-details/${paperId}`}>
                            <img src="/Images/arrow-back.png" alt="" />
                            <h1>Quiz Analytics</h1>
                        </Link>
                    </div>

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 chart-main-wrapper">
                                <h1>Overview</h1>
                                <div className="chart-container">
                                    <div className="donut-chart-container">
                                        <div className="donut-chart">
                                            <svg viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    className="background-circle"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    className="progress-circle"
                                                    style={{
                                                        strokeDasharray: `${correctPercentage * 2.51327} ${251.327 - correctPercentage * 2.51327}`
                                                    }}
                                                />
                                            </svg>
                                            <div className="percentage">{correctPercentage.toFixed(1)}%</div>
                                        </div>
                                    </div>

                                    <div className="stats-grid">
                                        <div className="stat-item" id='stat-item1'>
                                            <div className="number" id='number1'>{correctAnswers}</div>
                                            <div className="label correct">Correct</div>
                                        </div>
                                        <div className="stat-item" id='stat-item2'>
                                            <div className="number" id='number2'>{wrongAnswers}</div>
                                            <div className="label wrong">Wrong</div>
                                        </div>
                                        <div className="stat-item" id='stat-item3'>
                                            <div className="number" id='number3'>{ignoredQuestions}</div>
                                            <div className="label unanswered">Ignored</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 analytics">
                                <h2>Analytics</h2>
                                <div className="stat-cards">
                                    <StatCard
                                        image="/Images/analysis1 (2).png"
                                        value={score}
                                        label="Score"
                                    />
                                    <StatCard
                                        image="/Images/clock-exclamation_svgrepo.com.png"
                                        value={formatTime(avgTime)}
                                        label="Avg Time/Question"
                                    />
                                    <StatCard
                                        image="/Images/totaltime.png"
                                        value={formatTime(totalTime)}
                                        label="Total Time"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link
                        to={`/answer-key?paperId=${paperId}&module=${module}&examType=${examType}&tutorialTitle=${tutorialTitle}`}
                        className='Answer-Key-btn'
                    >
                        Answer Key & Solution
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuizAnalysis;