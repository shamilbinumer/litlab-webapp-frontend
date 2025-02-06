import { IoCameraOutline } from 'react-icons/io5'
import SideNave from '../common/SideNav/SideNave'
import './MyProfile.scss'
import { FaPencilAlt } from 'react-icons/fa'

const MyProfile = () => {
    return (
        <div className='MyProfileMainWRapper'>
            <div className="my-profile-main">
                <div className="my-profile-left"><SideNave /></div>
                <div className="my-profile-right">
                    <div className="row">
                        <div className="col-lg-6 profile-contanet-left">
                            <div className="profile-card">
                                <div className="dp">
                                    <div style={{overflow: 'hidden',borderRadius:"50%"}}>
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
                            </div>
                        </div>
                        <div className="col-lg-6 profile-contanet-right"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile
