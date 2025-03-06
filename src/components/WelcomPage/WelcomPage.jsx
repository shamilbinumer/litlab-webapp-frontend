import { Link } from 'react-router-dom'
import './WelcomPage.scss'

const WelcomPage = () => {
  return (
    <div className='WelcomPageMainWrapper'>
      <div className='welcome-page'>
        <div className="mobile-header">
        <div>  <img src="/Images/Logo P 7.png" alt="" /></div>
          <div className="mobile-top-image">
            <img src="/Images/welcompage-image.png" className='welcome welcom-nav-image-deskotop' alt="" />
            <img src="/Images/Union.png" alt="" className='cap' />
          </div>
        </div>
      <div className="top-image">
      <img src="/Images/welcompage-image.png" className='welcome welcom-nav-image-deskotop' alt="" />
      <img src="/Images/Union.png" alt="" className='cap' />
      </div>
        <h1>Welcome to Your Learning Hub</h1>
        <img src="/Images/welcome-e7aDyISq44.png" alt="" className="glob-image" />
        <Link to='/signup'><button>Get Started</button></Link>
      </div>
    </div>
  )
}

export default WelcomPage
