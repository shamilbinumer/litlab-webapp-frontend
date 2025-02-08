import { useState } from 'react'
import './QuizAnalysis.scss'
import { Activity, AlertCircle, Clock } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import UserProfile from '../common/UserProfile/UserProfile';
import SideNave from '../common/SideNav/SideNave';
import { Link } from 'react-router-dom';
const QuizAnalysis = () => {
    const [showSolution, setShowSolution] = useState(false);

    // Sample data - replace with actual data from your application
    const analyticsData = {
        correct: 90,
        wrong: 5,
        unanswered: 5,
        score: "9/50",
        timePerQuestion: "2s",
        totalTime: "16s"
    };

    const totalQuestions = analyticsData.correct + analyticsData.wrong + analyticsData.unanswered;
    const correctPercentage = (analyticsData.correct / totalQuestions) * 100;

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
            <UserProfile />

            <div className="quiz-analyticsMain-Wrapper">
                <div className="left-side">
                    <SideNave />
                </div>

                <div className="right-side">
                    <div className="heaing-section">    <Link to='/'>  <img src="/Images/arrow-back.png" alt="" /><h1>Quiz Analytics</h1></Link></div>

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
                                            <div className="number" id='number1'>{analyticsData.correct}</div>
                                            <div className="label correct">Correct</div>
                                        </div>
                                        <div className="stat-item" id='stat-item2'>
                                            <div className="number" id='number2'>{analyticsData.wrong}</div>
                                            <div className="label wrong">Wrong</div>
                                        </div>
                                        <div className="stat-item" id='stat-item3'>
                                            <div className="number" id='number3'>{analyticsData.unanswered}</div>
                                            <div className="label unanswered">Unanswered</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 analytics">
                                <h2>Analytics</h2>
                                <div className="stat-cards">
                                    <StatCard
                                        image={`/Images/analysis1 (2).png`}
                                        value={analyticsData.score}
                                        label="Score"
                                    />
                                    <StatCard
                                        image={`/Images/clock-exclamation_svgrepo.com.png`}
                                        value={analyticsData.timePerQuestion}
                                        label="Per Question"
                                    />
                                    <StatCard
                                        image={`/Images/totaltime.png`}
                                        value={analyticsData.totalTime}
                                        label="Total Time"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

              <Link className='Answer-Key-btn'>Answer Key & Solution</Link>  </div>


            </div>

        </div>
    )
}

export default QuizAnalysis