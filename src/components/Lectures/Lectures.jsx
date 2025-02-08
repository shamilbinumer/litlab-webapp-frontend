import { Link } from 'react-router-dom'
import SideNave from '../common/SideNav/SideNave'
import './Lectures.scss'
import { FaArrowLeft } from 'react-icons/fa'
import UserProfile from '../common/UserProfile/UserProfile'
import { IoPlayCircleSharp, IoSearchOutline } from 'react-icons/io5'
import { LuEye, LuHeart } from 'react-icons/lu'
const Lectures = () => {
  return (
    <div className='LecturesMainWrapper'>
      <div className="lecture-main">
        <div className="left-side">
          <SideNave />
        </div>
        <div className="right-side">
          <UserProfile />
          <div></div>
          <Link to='/'>
            <div className="back-btn-container">
              <FaArrowLeft className='back-btn' />
            </div></Link>
          <div className="content-wrapper">
            <div><img src="/Images/Group 1000004455.png" alt="" className='header-image' /></div>
            <div><h1>Lit Lab’s Recorded Classes</h1></div>
            <div className="main-content">
              <div className="row">
                <div className="col-lg-7 main-content-left">
                  <div className="search-bar">
                    <IoSearchOutline className='search-icon' />
                    <input type="text" placeholder='Search Live Classes, Recorded, Modules' />
                  </div>
                  <div className="vedio-card">
                    <div className="vedio-container">
                      <img src="/Images/playicon.png" alt="" className="play-image" />
                      <img src="/Images/teacher.jpg" className='main-img' alt="" />
                      <div className="vedio-details">
                        <div>  <h1>Budget Analysis</h1>
                          <p>Description : evaluating income, expenses, and resource allocation to achieve financial efficiency.</p></div>
                        <div>
                          <LuHeart className='fav-icon' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 main-content-right">
                  <h3>10 Topics in this video</h3>
                  <div className="vedio-list-wrapper">
                    <div className="vedio-item row">
                      <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                        <div className="vedio-item-left">
                          <div className="thumbnile">
                            <img src="/Images/teacher.jpg" className='thumbnile-image' alt="" />
                            <IoPlayCircleSharp className='play-icon' />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-7 col-sm-7 col-7">
                        <div className="vedio-item-right">
                          <h1>Introduction to Budgeting</h1>
                          <div className="teacer-name">Dr. Muhammed Rayis </div>
                          <p className='vedio-description'>Definition and Importance of Budgeting , and Importance of Budgeting ,</p>
                          <div className="button-icon">
                            <button>Watch now <LuEye /></button>
                            <LuHeart className='heart-icon' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vedio-item row">
                      <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                        <div className="vedio-item-left">
                          <div className="thumbnile">
                            <img src="/Images/teacher.jpg" className='thumbnile-image' alt="" />
                            <IoPlayCircleSharp className='play-icon' />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-7 col-sm-7 col-7">
                        <div className="vedio-item-right">
                          <h1>Introduction to Budgeting</h1>
                          <div className="teacer-name">Dr. Muhammed Rayis </div>
                          <p className='vedio-description'>Definition and Importance of Budgeting , and Importance of Budgeting ,</p>
                          <div className="button-icon">
                            <button>Watch now <LuEye /></button>
                            <LuHeart className='heart-icon' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vedio-item row">
                      <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                        <div className="vedio-item-left">
                          <div className="thumbnile">
                            <img src="/Images/teacher.jpg" className='thumbnile-image' alt="" />
                            <IoPlayCircleSharp className='play-icon' />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-7 col-sm-7 col-7">
                        <div className="vedio-item-right">
                          <h1>Introduction to Budgeting</h1>
                          <div className="teacer-name">Dr. Muhammed Rayis </div>
                          <p className='vedio-description'>Definition and Importance of Budgeting , and Importance of Budgeting ,</p>
                          <div className="button-icon">
                            <button>Watch now <LuEye /></button>
                            <LuHeart className='heart-icon' />
                          </div>
                        </div>
                      </div>
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

export default Lectures
