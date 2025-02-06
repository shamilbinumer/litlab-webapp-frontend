import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.scss';
import baseUrl from '../../../baseUrl';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);

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
        <div className="user-container">
          <div className="user-profile">
            <img src={user?.image || "/Images/9385289.png"} alt="profile" />
          </div>
          <p>{user?.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserProfile;
