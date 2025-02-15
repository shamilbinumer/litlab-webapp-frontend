import './AddedToCart.scss';
import { IoCartOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useEffect } from 'react';

const AddedToCart = ({ isVisible, itemName, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className='AddedTocartAlertMainWrapper'>
      <div className='alert-content'>
        <div className='icon-section'>
          <div className='check-icon'>
            <IoCheckmarkCircleOutline />
          </div>
          <div className='cart-icon'>
            <IoCartOutline />
          </div>
        </div>
        <div className='message-section'>
          <h3>Added to Cart!</h3>
          <p>{itemName || 'Item'} has been added to your cart</p>
        </div>
      </div>
      <div className='progress-bar'></div>
    </div>
  );
};

export default AddedToCart;