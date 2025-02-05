import { FaArrowLeft } from 'react-icons/fa'
import SideNave from '../SideNav/SideNave'
import UserProfile from '../UserProfile/UserProfile'
import './PaperDetailPage.scss'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { LuHeart } from 'react-icons/lu'

const PaperDetailPage = () => {
    const [activeCategory,setActiveCategory]=useState('Study Notes')
  return (
    <div className='PaperDetailPageMainWrapper'>
        <UserProfile/>
        <div className="detail-page-main">
        <div className="left-side">
            <SideNave/>
        </div>
        <div className="right-side">
           <Link to='/'>
           <div className="back-btn-container">
            <FaArrowLeft className='back-btn' />
            </div></Link>
            <h2 className='paper-title'>Budget Analysis</h2>

            <div className="contents-main-wrapper row">
                <div className="col-lg-6 content-left">
                    <div className="module-card">
                        <div className="module-card-left">
                            <h4 className="module-title">Module 1 : Love Across Time </h4>
                            <p>22nd September 2024</p>
                            <div className="button-heart">
                                <button>Read Summary</button>
                                <LuHeart className='hear-icon' />
                            </div>
                        </div>
                        <div className="module-card-right">
                            <img src="/Images/Module-icon.png" alt="" />
                        </div>
                    </div>
                    <div className="module-card">
                        <div className="module-card-left">
                            <h4 className="module-title">Module 1 : Love Across Time </h4>
                            <p>22nd September 2024</p>
                            <div className="button-heart">
                                <button>Read Summary</button>
                                <LuHeart className='hear-icon' />
                            </div>
                        </div>
                        <div className="module-card-right">
                            <img src="/Images/Module-icon.png" alt="" />
                        </div>
                    </div>
                    <div className="module-card">
                        <div className="module-card-left">
                            <h4 className="module-title">Module 1 : Love Across Time </h4>
                            <p>22nd September 2024</p>
                            <div className="button-heart">
                                <button>Read Summary</button>
                                <LuHeart className='hear-icon' />
                            </div>
                        </div>
                        <div className="module-card-right">
                            <img src="/Images/Module-icon.png" alt="" />
                        </div>
                    </div>
                    <div className="module-card">
                        <div className="module-card-left">
                            <h4 className="module-title">Module 1 : Love Across Time </h4>
                            <p>22nd September 2024</p>
                            <div className="button-heart">
                                <button>Read Summary</button>
                                <LuHeart className='hear-icon' />
                            </div>
                        </div>
                        <div className="module-card-right">
                            <img src="/Images/Module-icon.png" alt="" />
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 content-right">
                    <div className="boxes-container row">
                        <div className="col-lg-4">
                            <div className={`box ${activeCategory=='Study Notes'?'active-box':''}`} onClick={()=>setActiveCategory('Study Notes')}>Study Notes</div>
                        </div>
                        <div className="col-lg-4">
                            <div className={`box ${activeCategory=='Video Class'?'active-box':''}`} onClick={()=>setActiveCategory('Video Class')}>Video Class</div>
                        </div>
                        <div className="col-lg-4">
                            <div className={`box ${activeCategory=='Mock Test'?'active-box':''}`} onClick={()=>setActiveCategory('Mock Test')}>Mock Test</div>
                        </div>
                    </div>
                    <div className="content-details">
                        {
                            activeCategory=='Study Notes'&&(
                                <>
                                <div className="study-note-card">
                                    <img src="/Images/study note.png" alt="" />
                                    <span>Study Notes</span>
                                </div>
                                <div className="study-note-card">
                                    <img src="/Images/model qstn.png" alt="" />
                                    <span>Model Question Paper</span>
                                </div>
                                <div className="study-note-card">
                                    <img src="/Images/sample qstn.png" alt="" />
                                    <span>Sample Question Paper</span>
                                </div>
                                </>
                            )
                        }
                        {
                              activeCategory=='Video Class'&&(
                                <>
                                    <div className="vedio-clas-card">
                                       <img src="/Images/lecture.png" alt="" /> 
                                       <span>Lectures</span>
                                    </div>
                                </>
                              )
                        }
                    </div>
                </div>

            </div>
        </div>
        </div>

    </div>
  )
}

export default PaperDetailPage
