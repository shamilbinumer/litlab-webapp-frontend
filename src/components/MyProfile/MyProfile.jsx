import { IoCameraOutline, IoDiamondOutline } from 'react-icons/io5';
import SideNave from '../common/SideNav/SideNave';
import './MyProfile.scss';
import { FaPencilAlt, FaPowerOff } from 'react-icons/fa';
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { VscFiles } from "react-icons/vsc";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationAlert from '../common/Alerts/ConformationAlert/ConformationAlert';
import BellIcon from '../common/BellIcon/BellIcon';
import Splash from '../common/Splash/Splash';

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [cropImage, setCropImage] = useState(null);
    const [crop, setCrop] = useState({ 
        unit: '%',
        width: 50,
        aspect: 1 
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);


    // Add new functions for logout handling
    const handleLogoutClick = () => {
        setShowLogoutAlert(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleLogoutCancel = () => {
        setShowLogoutAlert(false);
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
                navigate('/welcome');
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
            });

            if (response.status !== 200) {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            setError(error.message);
            navigate('/welcome');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 1);
        });
    };

    const handleCropComplete = async () => {
        if (!completedCrop || !imgRef.current) return;

        try {
            setImageUploadLoading(true);
            const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
            const formData = new FormData();
            formData.append('image', croppedBlob, 'cropped-image.jpg');

            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Authentication token not found');

            const response = await axios.put(
                `${baseUrl}/api/edit-user-image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                setUser(prev => ({
                    ...prev,
                    image: response.data.imageUrl
                }));
                setShowCropModal(false);
                setCropImage(null);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setImageUploadLoading(false);
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
            <div>
               <Splash/>
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
           <div className="mobile-bell">
            <BellIcon/>
           </div>
            <ConfirmationAlert 
                isOpen={showLogoutAlert}
                message="Are you sure you want to logout?"
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageSelect}
            />
            
            {/* Image Crop Modal */}
            <Dialog 
                open={showCropModal} 
                onClose={() => {
                    setShowCropModal(false);
                    setCropImage(null);
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        height: 'auto',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <DialogTitle>Crop Profile Picture</DialogTitle>
                <DialogContent sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '20px'
                }}>
                    {cropImage && (
                        <div style={{ 
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ReactCrop
                                crop={crop}
                                onChange={c => setCrop(c)}
                                onComplete={c => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '50vh'
                                }}
                            >
                                <img
                                    ref={imgRef}
                                    src={cropImage}
                                    style={{ 
                                        maxWidth: '100%',
                                        maxHeight: '50vh',
                                        objectFit: 'contain'
                                    }}
                                    alt="Crop"
                                />
                            </ReactCrop>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            setShowCropModal(false);
                            setCropImage(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCropComplete}
                        variant="contained"
                        color="primary"
                        disabled={!completedCrop || imageUploadLoading}
                    >
                        {imageUploadLoading ? 'Uploading...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

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

            <div className="my-profile-main">
                <div className="mobile-background-img">
                    <img src="/Images/Ellipse 70.png" alt="img" />
                </div>
                <div className="my-profile-left"><SideNave /></div>
                <div className="my-profile-right">
                    <div className="row right-main">
                        <div className="col-lg-6 profile-contanet-left">
                            <div className="profile-card">
                                <div className="dp">
                                    <div className='dpImage'>
                                        {imageUploadLoading ? (
                                            <div className="loading-spinner">
                                                <CircularProgress />
                                            </div>
                                        ) : (
                                            <img src={user?.image || '/Images/9385289.png'} alt="" />
                                        )}
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
                                   <Link to='/my-favourites'>
                                   <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <AiOutlineHeart className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Favourites</h3>
                                        </div>
                                    </div>
                                   </Link>
                                </div>
                                <div className="col-lg-6 col-6">
                                    <Link to='/premium-plans'>
                                        <div className="four-card">
                                            <div className="card-content">
                                                <div className="icon-wrapper">
                                                    <IoDiamondOutline className="card-icon" />
                                                    </div>
                                                <h3 className="card-title">Get Premium</h3>
                                            </div>
                                        </div>
                                    </Link>
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