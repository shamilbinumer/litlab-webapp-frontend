import React, { useEffect, useState } from 'react';
import './AnswerKey.scss'
import SideNave from '../common/SideNav/SideNave';
import UserProfile from '../common/UserProfile/UserProfile';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
const AnswerKey = () => {

    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const paperId = searchParams.get('paperId');
          const module = searchParams.get('module');
  
          if (!paperId || !module) {
            throw new Error('Missing required parameters: paperId or module');
          }
  
          const response = await axios.get(
            `http://localhost:8000/api/fetch-weakly-chellange/${paperId}/${module}`
          );
  
          setData(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [searchParams]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>No data found</div>;
    const options = [
        { id: 'A', text: 'Consumers buy more of the good as it\'s relatively cheaper' },
        { id: 'B', text: 'Consumers save more of their income' },
        { id: 'C', text: 'Demand remains unchanged' },
        { id: 'D', text: 'The good becomes a Giffen good' }
    ];

    const solution = [
        'When the When the price of a good decreases, the substitution effect causes consumers to buy more of that good as it becomes relatively cheaper than alternatives. Consumers substitute the cheaper good for other, more expensive options. This effect illustrates how changes in relative prices influence consumer choices, even if their overall income remains unchanged. The substitution effect is essential for understanding consumer behavior and demand patterns. It does not apply to Giffen goods, which exhibit unusual demand behavior'
    ];

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
                       <Link to='/'> <span className="arrow"><FaArrowLeft />
                        </span>
                        <span>Answer & Solution</span></Link>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row anser-main-wrapper g-0">
                        <div className="col-lg-7 col-sm-12 col-12 col-md-6">
                            <div className=" question-section">
                                <div className="question-number">1/50</div>
                                <div className="question">
                                    <h2><div className='q-no'>Qs 1:</div> <span>What happens when a good's price decreases, according to the substitution effect?</span></h2>

                                    <div className="options">
                                        {options.map(option => (
                                            <div
                                                key={option.id}
                                                className={`option ${option.id === 'A' ? 'correct' : option.id === 'C' ? 'incorrect' : ''}`}
                                            >
                                                <span className="option-letter">{option.id}</span>
                                                <span className="option-text">{option.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5 solution-wraper col-sm-12 col-12 col-md-6">
                            <div className="solution-section">
                                <h3>Solution</h3>
                                <div className="solution-content">
                                    {solution.map((point, index) => (
                                        <p key={index}>{point}</p>
                                    ))}
                                </div>

                          
                            </div>
                            <div className="feedback">
                                    <p>Was the Solution helpful?</p>
                                    <div className="feedback-buttons">
                                        <button className="thumbs-down"><IoMdThumbsDown />
                                        </button>
                                        <button className="thumbs-up"><IoMdThumbsUp />
                                        </button>
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