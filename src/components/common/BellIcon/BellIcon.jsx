import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { RiBookLine } from "react-icons/ri";
import { IoHelpCircleOutline } from "react-icons/io5";
import { MdOutlineChecklist } from "react-icons/md";
import { IoIosPower } from "react-icons/io";
import { IoClose } from "react-icons/io5"; // Added close icon import
import "./BellIcon.scss";
import ConfirmationAlert from "../Alerts/ConformationAlert/ConformationAlert";
import { Link, useNavigate } from "react-router-dom";


const BellIcon = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  const handleConfirmLogout = () => {
  localStorage.removeItem('authToken');
  navigate('/login');
    setShowLogoutAlert(false);
    setIsSidebarOpen(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutAlert(false);
  };

  return (
    <div className="BellNavWrapper">
     <Link to='/notification'><div className="bell-icon">
        <FaRegBell className="icon" />
      </div></Link>
      <div className="menu-icon" onClick={toggleSidebar}>
        <HiOutlineBars3BottomLeft className="icon" />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="close-icon" onClick={toggleSidebar}>
            <IoClose className="icon" />
          </div>
        </div>
        <div className="sidebar-content">
        <Link to='/my-course-details'>
            <div className="sidebar-item">
              <RiBookLine className="sidebar-icon" />
              <span>My Courses</span>
            </div>
          </Link>

          {/* <a href="https://wa.me/918137851545?text=Hello%2C%20I%20need%20help" target="_blank" rel="noopener noreferrer"> */}
          <div className="sidebar-item" onClick={() => {
  const phone = '918137851545';
  const message = encodeURIComponent('Hello, I need help');
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}}>
  <IoHelpCircleOutline className="sidebar-icon" />
  <span>Help</span>
</div>
{/* </a> */}

         {/* <Link to='/notification'> <div className="sidebar-item">
            <FaRegBell className="sidebar-icon" />
            <span>Notifications</span>
          </div></Link> */}
          <Link to='/terms-and-conditions'>
            <div className="sidebar-item">
              <MdOutlineChecklist className="sidebar-icon" />
              <span>Terms & conditions</span>
            </div>
 </Link>
          <div className="sidebar-divider"></div>
          <div className="sidebar-item logout" onClick={handleLogoutClick}>
            <IoIosPower className="sidebar-icon logout-icon" />
            <span className="logout-text">Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Confirmation Alert */}
      <ConfirmationAlert
        isOpen={showLogoutAlert}
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default BellIcon;