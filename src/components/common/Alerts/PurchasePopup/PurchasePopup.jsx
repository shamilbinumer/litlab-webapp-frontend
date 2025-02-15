import React, { useEffect } from 'react';
import './PurchasePopup.scss';
import { LuLock } from 'react-icons/lu';
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';

const PurchasePopup = ({ onClose }) => {
  useEffect(() => {
    // Save current scroll position and lock body scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    // Cleanup: Restore scroll position and unlock body scroll
    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className='PleasePurchasePopupMainWrapper'>
      <div className='popup-backdrop' onClick={onClose}></div>
      <div className='popup-content'>
        <button className='close-button' onClick={onClose}>
          <IoClose />
        </button>
        <div className='popup-icon'>
          <LuLock />
        </div>
        <h1>Purchase to unlock more papers</h1>
        <p>Get access to all study materials and features</p>
        <Link to='/premium-plans'> 
          <button className='purchase-button'>Unlock Premium Access</button>
        </Link>
      </div>
    </div>
  );
};

export default PurchasePopup;