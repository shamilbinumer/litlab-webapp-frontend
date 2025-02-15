// ConfirmationAlert.jsx
import { useEffect } from 'react';
import './ConformationAlert.scss'
import { PiWarningCircleLight } from 'react-icons/pi';

const ConfirmationAlert = ({ 
    message = "Are you sure you want to proceed?",
    onConfirm,
    onCancel,
    isOpen = false,
    paymentProcessing
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="confirmation-alert-overlay">
            <div className="confirmation-alert">
                {/* <div className="alert-icon">
                    <PiWarningCircleLight />
                </div> */}
                
                <div className="alert-content">
                    <p className="alert-message">{message}</p>
                    
                    <div className="alert-buttons">
                        <button 
                            className="cancel-button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            className="confirm-button"
                            onClick={onConfirm}
                        >
                            {paymentProcessing?'Loading':'Yes, proceed'}
                            {/* Yes, proceed */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationAlert;