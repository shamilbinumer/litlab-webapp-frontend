import React from "react";
import "./Help.scss";
import { FaArrowLeft, FaArrowRight, FaUpload } from "react-icons/fa";
import SideNave from "../common/SideNav/SideNave";

const Help = () => {
    return (
        <div className="help-form-container">
            <div className="sub-wrapper">
                <div className="left-side">
                    <SideNave />
                </div>
                <div className="right-side">

                    <div className="help-wrapper">
                        <button className="back-button">
                            <FaArrowLeft />
                        </button>
                        <h2>Help</h2>
                    </div>
                    <form className="help-form">
                        <label>Type of issue</label>
                        <select>
                            <option>Choose at least one option</option>
                            <option>Bug Report</option>
                            <option>Feature Request</option>
                            <option>Other</option>
                        </select>


                        <textarea placeholder="Describe your issue..."></textarea>


                        <div className="upload-box">
                            <p>upload File</p>  <img src="/Images/upload.png" alt="" />
                            <input type="file" />
                        </div>

                        <button type="submit" className="submit-button">
                            Submit  <FaArrowRight/>
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Help;
