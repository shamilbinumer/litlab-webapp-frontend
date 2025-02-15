// PaperCountAlert.jsx
import { useEffect } from 'react';
import './PaperCountAlert.scss';
import { IoWarningOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const PaperCountAlert = ({ 
    isOpen, 
    onClose, 
    cartCount, 
    requiredCount,
    maxCount
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

    const isOverLimit = cartCount > maxCount;
    const isUnderLimit = cartCount < requiredCount;

    return (
        <div className="paper-count-alert-overlay">
            <div className="paper-count-alert">
                <div className="alert-header">
                    <div className="icon-title">
                        <IoWarningOutline className="warning-icon" />
                        <h2>Paper Count Alert</h2>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                <div className="alert-content">
                    <div className="count-info">
                        <div className="count-item">
                            <span>Cart Count:</span>
                            <span className="value">{cartCount}</span>
                        </div>
                        {isOverLimit && (
                            <div className="count-item">
                                <span>Maximum Limit:</span>
                                <span className="value">{maxCount}</span>
                            </div>
                        )}
                        {isUnderLimit && (
                            <div className="count-item">
                                <span>Required Count:</span>
                                <span className="value">{requiredCount}</span>
                            </div>
                        )}
                    </div>

                    <div className="alert-message">
                        {isOverLimit ? (
                            <>
                                <p className="message">Only {maxCount} papers can be purchased at this plan.</p>
                                <p className="action">Please remove {cartCount - maxCount} paper(s) to proceed.</p>
                            </>
                        ) : (
                            <>
                                <p className="message">Minimum {requiredCount} papers required for checkout.</p>
                                <p className="action">Please add {requiredCount - cartCount} more paper(s) to proceed.</p>
                            </>
                        )}
                    </div>

                    <button className="understand-button" onClick={onClose}>
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaperCountAlert;