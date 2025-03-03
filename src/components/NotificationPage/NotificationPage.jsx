import { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { BsCheck2All, BsBell } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import SideNave from '../common/SideNav/SideNave';
import './NotificationPage.scss';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNotifications, setHasNotifications] = useState(false);
  
  // Sample notification data (replace with actual API call)
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Toggle this value to test both states
      const mockHasNotifications = false; // Set to false to test "No Notifications" state
      
      setHasNotifications(mockHasNotifications);
      
      if (mockHasNotifications) {
        setNotifications([
          {
            id: 1,
            title: 'New course material available',
            message: 'Check out the latest learning materials for your Quantum Physics course',
            time: '2 hours ago',
            read: false
          },
          {
            id: 2,
            title: 'Assignment deadline approaching',
            message: 'You have an assignment due in the next 48 hours. Don\'t forget to submit it on time!',
            time: '1 day ago',
            read: true
          },
          {
            id: 3,
            title: 'System maintenance',
            message: 'LitLab will be undergoing maintenance this weekend. Services may be temporarily unavailable.',
            time: '3 days ago',
            read: false
          },
          {
            id: 4,
            title: 'Course registration open',
            message: 'Spring semester course registration is now open. Register early to secure your spot!',
            time: '1 week ago',
            read: true
          }
        ]);
      } else {
        setNotifications([]);
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({...notif, read: true})));
  };

  // Delete notification
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    if (updatedNotifications.length === 0) {
      setHasNotifications(false);
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setHasNotifications(false);
  };

  return (
    <div className='NotificationPageMainWrapper'>
      <div className="notification-main">
        <div className="left-side"><SideNave/></div>
        <div className="right-side">
          <div className="notification-container">
            <header className="notification-header">
              <h1>Notifications</h1>
              {hasNotifications && notifications.length > 0 && (
                <div className="notification-actions">
                  <button className="mark-read-btn" onClick={markAllAsRead}>
                    <BsCheck2All /> Mark all as read
                  </button>
                  <button className="clear-all-btn" onClick={clearAllNotifications}>
                    <MdOutlineDelete /> Clear all
                  </button>
                </div>
              )}
            </header>

            <div className="notifications-list">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : !hasNotifications || notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <IoNotificationsOutline />
                  </div>
                  <h3>No Notifications</h3>
                  <p>You're all caught up! Check back later for new notifications.</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <div className="notification-icon-wrapper">
                        <BsBell className="notification-icon" />
                      </div>
                      <div className="notification-details">
                        <h3 className="notification-title">{notification.title}</h3>
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      {!notification.read && (
                        <button className="mark-read-btn" onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}>
                          <BsCheck2All />
                        </button>
                      )}
                      <button className="delete-btn" onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}>
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;