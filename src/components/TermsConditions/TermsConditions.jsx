// TermsConditions.jsx
import React from 'react';
import './TermsConditions.scss';
import SideNave from '../common/SideNav/SideNave';
import { BiLeftArrow } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
    const navigate = useNavigate();
  const handleBack = () => {
    // Add navigation logic here
    navigate('/')
  };

  return (
    <div className="terms-container">
        <div className="left-side">
            <SideNave/>
        </div>
        <div className="right-side">
        <header className="terms-header">
        <button className="back-button" onClick={handleBack}>
         <FaArrowLeft/> Terms & Conditions
        </button>
      </header>
      
      <main className="terms-content">
        <p>
          By using the Lit Lab app, you agree to our terms, which include maintaining the security of your account and ensuring ethical learning practices. Access to premium resources like notes, mentorship, and video classes requires a subscription, and payments for these subscriptions are final and non-refundable unless stated otherwise. Your data will be used to improve your experience and is protected under our privacy policy. Redistribution of app resources is prohibited. We may update these terms as necessary, and any changes will be communicated to users promptly.
        </p>
      </main>
        </div>
 
    </div>
  );
};

export default TermsConditions;