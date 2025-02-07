import { IoCameraOutline, IoDiamondOutline } from 'react-icons/io5'
import SideNave from '../common/SideNav/SideNave'
import './MyProfile.scss'
import { FaPencilAlt } from 'react-icons/fa'
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail, MdOutlinePhoneAndroid } from 'react-icons/md';
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { VscFiles } from "react-icons/vsc";

const MyProfile = () => {
    return (
        <div className='MyProfileMainWRapper'>
            <div className="my-profile-main">
                <div className="my-profile-left"><SideNave /></div>
                <div className="my-profile-right">
                    <div className="row right-main">
                        <div className="col-lg-6 profile-contanet-left">
                            <div className="profile-card">
                                <div className="dp">
                                    <div style={{ overflow: 'hidden', borderRadius: "50%" }}>
                                        <img src="/Images/9385289.png" alt="" />
                                    </div>
                                    <div className="camera-icon">
                                        <IoCameraOutline className='icon' />
                                    </div>
                                </div>
                                <div className="heading">
                                    <div className='yr-details-text'>Your Details</div>
                                    <div className='edit'><FaPencilAlt /></div>
                                </div>
                                <div className="detsils-container">
                                    <div className="details">
                                        <div><FiUser className='icon' /></div>
                                        <div className='details-text'>Shamil KK</div>
                                    </div>
                                    <div className="details">
                                        <div><MdOutlinePhoneAndroid className='icon' /></div>
                                        <div className='details-text'>+91 9876543212</div>
                                    </div>
                                    <div className="details">
                                        <div><MdOutlineEmail className='icon' /></div>
                                        <div className='details-text'>shamil@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 profile-contanet-right">
                            <div className="row four-card-main">
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <IoBookOutline className="card-icon" />
                                            </div>
                                            <h3 className="card-title">My Courses</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <AiOutlineHeart className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Favourites</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <IoDiamondOutline className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Get Premium</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="four-card">
                                        <div className="card-content">
                                            <div className="icon-wrapper">
                                                <VscFiles className="card-icon" />
                                            </div>
                                            <h3 className="card-title">Mock Test</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile
