import { IoCameraOutline, IoDiamondOutline } from 'react-icons/io5'
import SideNave from '../common/SideNav/SideNave'
import './MyProfile.scss'
import { FaPencilAlt } from 'react-icons/fa'
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { VscFiles } from "react-icons/vsc";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAuthentication = async () => {
            setIsLoading(true);
            setError(null);

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
                setUser(response.data.user);

                if (response.status !== 200) {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                setError(error.message);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAuthentication();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error loading profile: {error}</p>
            </div>
        );
    }

    return (
        <div className='MyProfileMainWRapper'>
            <div className="my-profile-main">
                <div className="my-profile-left"><SideNave /></div>
                <div className="my-profile-right">
                    <div className="row right-main">
                        <div className="col-lg-6 profile-contanet-left">
                            <div className="profile-card">
                                <div className="dp">
                                    <div style={{ overflow: 'hidden', borderRadius: "50%" }}>
                                        <img src={user?.image || '/Images/9385289.png'} alt="" />
                                    </div>
                                    <div className="camera-icon">
                                        <IoCameraOutline className='icon' />
                                    </div>
                                </div>
                                <div className="heading">
                                    <div className='yr-details-text'>Your Details</div>
                                    <div className='edit'><FaPencilAlt /></div>
                                </div>
                                <div className="detsils-container">
                                    <div className="details">
                                        <div><FiUser className='icon' /></div>
                                        <div className='details-text'>{user?.name}</div>
                                    </div>
                                    <div className="details">
                                        <div><MdOutlinePhoneAndroid className='icon' /></div>
                                        <div className='details-text'>{user?.phone}</div>
                                    </div>
                                    <div className="details">
                                        <div><MdOutlineEmail className='icon' /></div>
                                        <div className='details-text'>{user?.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 profile-contanet-right">
                            <div className="row four-card-main">
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <IoBookOutline className="card-icon" />
                                            </div>
                                            <h3 className="card-title">My Courses</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <AiOutlineHeart className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Favourites</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <IoDiamondOutline className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Get Premium</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <Link to='/my-mock-details'>

                                        <div className="four-card">
                                            <div className="card-content">
                                                <div className="icon-wrapper">
                                                    <VscFiles className="card-icon" />
                                                </div>
                                                <h3 className="card-title">Mock Test</h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;