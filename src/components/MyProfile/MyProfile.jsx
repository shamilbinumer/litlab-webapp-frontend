import { IoCameraOutline, IoDiamondOutline } from 'react-icons/io5';
import SideNave from '../common/SideNav/SideNave';
import './MyProfile.scss';
import { FaPencilAlt } from 'react-icons/fa';
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { VscFiles } from "react-icons/vsc";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const handleCameraClick = () => {
        fileInputRef.current.click();
    };
    useEffect(() => {
        checkUserAuthentication();
    }, [navigate]);

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
            setEditFormData({
                name: response.data.user.name || '',
                phone: response.data.user.phone || '',
                email: response.data.user.email || '',
            });

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

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setUpdateError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.put(
                `${baseUrl}/api/edit-user-details`,
                editFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setUser(prev => ({
                    ...prev,
                    ...editFormData
                }));
                handleCloseModal();
                // Refresh user data
                checkUserAuthentication();
            }
        } catch (error) {
            setUpdateError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

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
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
            />
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
                                    <div 
                                        className="camera-icon"
                                        onClick={handleCameraClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <IoCameraOutline className='icon' />
                                    </div>
                                </div>
                                <div className="heading">
                                    <div className='yr-details-text'>Your Details</div>
                                    <div className='edit' onClick={handleEditClick}>
                                        <FaPencilAlt className='edit-icon' />
                                    </div>
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
                        {/* Edit Profile Modal */}
                        <Dialog open={isEditModalOpen} onClose={handleCloseModal}>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <form onSubmit={handleSubmit}>
                                <DialogContent>
                                    {updateError && (
                                        <div className="error-message mb-3 text-red-500">
                                            {updateError}
                                        </div>
                                    )}
                                    <TextField
                                        margin="dense"
                                        label="Name"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Phone"
                                        type="tel"
                                        fullWidth
                                        variant="outlined"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleInputChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </DialogActions>
                            </form>
                        </Dialog>
                        <div className="col-lg-6 profile-contanet-right">
                            <div className="row four-card-main">
                                <div className="col-lg-6 col-6">
                                    <Link to='/my-course-details'>
                                        <div className="four-card">
                                            <div className="card-content">
                                                <div className="icon-wrapper">
                                                    <IoBookOutline className="card-icon" />
                                                </div>
                                                <h3 className="card-title">My Courses</h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <AiOutlineHeart className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Favourites</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <IoDiamondOutline className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Get Premium</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-6">
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