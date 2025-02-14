import React from 'react';
import './PurchasePopup.scss';
import { LuLock } from 'react-icons/lu';
import { IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';

const PurchasePopup = ({ onClose }) => {
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
       <Link to='/premium-plans'> <button className='purchase-button'>Purchase Now</button></Link>
      </div>
    </div>
  );
};

export default PurchasePopup;