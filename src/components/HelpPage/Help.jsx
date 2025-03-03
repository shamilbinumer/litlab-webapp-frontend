import { useEffect } from "react";
import "./Help.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SideNave from "../common/SideNav/SideNave";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { Link, useNavigate } from "react-router-dom";

const Help = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const checkUserAuthentication = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/welcome');
                    return;
                }

                const response = await axios.get(`${baseUrl}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    navigate('/welcome');
                }
            } catch (error) {
                navigate('/welcome');
            }
        };

        checkUserAuthentication();
    }, [navigate]);
    return (
        <div className="help-form-container">
            <div className="sub-wrapper">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">
                    <div className="mobile-round-image">
                        <img src="/Images/backgroundRond.png" alt="" />
                    </div>
                    <div className="help-wrapper">
                        <Link to='/' style={{display:'flex',alignItems:'center'}}>
                        <button className="back-button">
                            <FaArrowLeft />
                        </button>
                        <h2>Help</h2></Link>
                    </div>
                    <form className="help-form">
                        <label>Type of issue</label>
                        <select>
                            <option>Choose at least one option</option>
                            <option>Bug Report</option>
                            <option>Feature Request</option>
                            <option>Other</option>
                        </select>

                        <label>Description</label>
                        <textarea placeholder="Describe your issue..."></textarea>

                        <label>Upload files </label>
                        <div className="upload-box">
                            <p>upload File</p>  <img src="/Images/upload.png" alt="" />
                            <input type="file" />
                        </div>

                        <button type="submit" className="submit-button">
                            Submit  <FaArrowRight />
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Help;
