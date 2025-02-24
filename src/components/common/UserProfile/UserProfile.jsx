import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.scss';
import baseUrl from '../../../baseUrl';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get token from localStorage
        if (!token) {
          console.error('No token found, please login.');
          return;
        }

        const response = await axios.get(`${baseUrl}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user); // Set user data
      } catch (error) {
        console.error('Error fetching user profile:', error.response?.data?.message || error.message);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) return <div></div>;

  return (
    <div className='userProfileMainWrapper'>
      <Link to='/my-profile'>
        <div
        className="user-container"
        // id="basic-button"
        // aria-controls={open ? 'basic-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        // onClick={handleClick}
        >
          <div className="user-profile">
            <img src={user?.image || "/Images/9385289.png"} alt="profile" />
          </div>
          <p>{user?.name}</p>
        </div>
      </Link>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserProfile;
