import { useEffect } from 'react'
import SideNave from '../common/SideNav/SideNave'
import './Instructions.scss'
import { FaArrowLeft } from 'react-icons/fa6'
import axios from 'axios'
import baseUrl from '../../baseUrl'
import { useNavigate } from 'react-router-dom'

const Instructions = () => {
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
    return (
        <div className='InstructionMainWrapper'>
            <div className="InstructionSubWrapper">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <div className="container">
                        <button className="back-button"><FaArrowLeft/></button>
                        <div className="card">
                            <div className="instructions-section">
                                <h2>Instructions</h2>
                                <ul>
                                    <li>This test comprises multiple-choice questions (MCQs).</li>
                                    <li>Earn 1.0 mark per correct answer, with a 0.33 mark deduction for each wrong answer</li>
                                    <li>No marks will be deducted for un-attempted questions.</li>
                                    <li>Each question will have only 1 of the given options as the correct answer.</li>
                                </ul>
                            </div>

                            <div className="details-section">
                                <h2>Details</h2>
                                <ul>
                                    <li>50 Questions</li>
                                    <li>50 Marks</li>
                                    <li>35 Minutes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Instructions