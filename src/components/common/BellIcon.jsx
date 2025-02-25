import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { RiBookLine } from "react-icons/ri";
import { IoHelpCircleOutline } from "react-icons/io5";
import { MdOutlineChecklist } from "react-icons/md";
import { IoIosPower } from "react-icons/io";
import "./BellIcon.scss";

const BellIcon = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="bell-icon">
        <FaRegBell className="icon" />
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <HiOutlineBars3BottomLeft className="icon" />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header"></div>
        <div className="sidebar-content">
          <div className="sidebar-item">
            <RiBookLine className="sidebar-icon" />
            <span>My Courses</span>
          </div>
          <div className="sidebar-item">
            <FaRegBell className="sidebar-icon" />
            <span>Notifications</span>
          </div>
          <div className="sidebar-item">
            <IoHelpCircleOutline className="sidebar-icon" />
            <span>Help</span>
          </div>
          <div className="sidebar-item">
            <MdOutlineChecklist className="sidebar-icon" />
            <span>Terms & conditions</span>
          </div>
          <div className="sidebar-divider"></div>
          <div className="sidebar-item logout">
            <IoIosPower
            className="sidebar-icon logout-icon" />
            <span className="logout-text">Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default BellIcon;