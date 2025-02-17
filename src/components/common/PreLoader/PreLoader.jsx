import React from 'react';
import './PreLoader.scss';

const PreLoader = () => {
  return (
    <div className='PreLoaderMainWrapper'>
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
      <div className="loading-text">
        Loading<span>.</span><span>.</span><span>.</span>
      </div>
    </div>
  );
};

export default PreLoader;