import React, { useState } from 'react';
import axios from 'axios';
import './UserLogin.scss';
import baseUrl from '../../baseUrl';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const UserLogin = () => {

  return (
    <div className="send-otp-page-main-wrapper">
      <div className="container-fluid main">
        <div className="row">
          <div className="col-lg-6 left">
            <img src="/Images/loginPageImg.png" alt="" />
          </div>
          <div className="col-lg-6 right">
            <div>

              <h2>Log In to Your Account</h2>
              <form >
                <div>
                  <input
                    type="text"
                    placeholder='Email or Username'
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder='Password'
                    required
                  />
                </div>
                <div>
                  <button>Login</button>
                </div>
                <div className="register-link">
                  Don't have an account? <Link to="/signup">Register here</Link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;