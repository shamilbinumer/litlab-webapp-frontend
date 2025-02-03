import SideNave from '../SideNav/SideNave'
import './IndexPage.scss'

const IndexPage = () => {
    return (
        <div className='IndexPageMainWrapper'>
            <div className="home-main">
                <div className="home-left">
                    <SideNave />
                </div>
                <div className="home-right">
                    right
                </div>
            </div>
        </div>
    )
}

export default IndexPage
