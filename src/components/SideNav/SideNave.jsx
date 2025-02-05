import { useEffect, useState } from 'react'
import './SideNav.scss'

const SideNave = () => {
    const [activePath,setActivePath]=useState('')
    useEffect(()=>{
        setActivePath(window.location.pathname)
    },[activePath])
    
  return (
    <div className='SideNavMainWrapper'>
        <div className="desktopSideNavWrapper">
            <div className="sideNav">
                <div className="nav-logo">
                    <img src="/Images/Logo P 7.png" alt="" />
                </div>
                <div className='second-icon'>
                    <img src="/Images/Frame 1261153187.png" alt="" />
                </div>
                <div className="nav-items">
                    <div className={`nav-item ${activePath=='/'?'active':''}`}><img src="/Images/Group 1000004529.png" alt="" /></div>
                    <div className={`nav-item`}><img src="/Images/Group 1000004528.png" alt="" /></div>
                    <div className={`nav-item`}><img src="/Images/Vector (1).png" alt="" /></div>
                    <div className={`nav-item`}><img src="/Images/Group 1000004496.png" alt="" /></div>
                    <div className={`nav-item`}><img src="/Images/Group 1000004528 (1).png" alt="" /></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SideNave
