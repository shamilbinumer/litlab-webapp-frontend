import { Link } from 'react-router-dom'
import './WelcomPage.scss'

const WelcomPage = () => {
  return (
    <div className='WelcomPageMainWrapper'>
      <div className='welcome-page'>
      <div className="top-image">
      <img src="/Images/welcompage-image.png" className='welcome' alt="" />
      <img src="/Images/Union.png" alt="" className='cap' />
      </div>
        <h1>Welcome to Your Learning Hub</h1>
        <img src="/Images/welcome-e7aDyISq44.png" alt="" className="glob-image" />
        <Link to='/'><button>Get Started</button></Link>
      </div>
    </div>
  )
}

export default WelcomPage
