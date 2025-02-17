import { MdOutlineKeyboardVoice } from 'react-icons/md';
import BellIcon from '../../common/BellIcon';
import './MobileIndexPage.scss';
import { IoIosSearch } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const MobileIndexPage = () => {
    const settings = {
        dots: false,
        speed: 500,
        slidesToShow: 1.2,
        slidesToScroll: 1
    };

    const carouselItems = [
        {
            id: 1,
            title: "Budget Analysis",
            lessons: "7 Lessons",
            image: "/Images/user.jpg"
        },
        {
            id: 2,
            title: "Marketing Strategies",
            lessons: "5 Lessons",
            image: "/Images/user.jpg"
        },
        {
            id: 3,
            title: "Data Science Basics",
            lessons: "10 Lessons",
            image: "/Images/user.jpg"
        }
    ];

    return (
        <div className='MobileIndexPageMainWrapper'>
            <div className="mobile-index-page">
                <header className="header">
                    <button className="menu-button">
                        <BiMenuAltLeft />
                    </button>
                    <div className="bell-icon">
                        <BellIcon />
                    </div>
                </header>

                <main className="main-content">
                    <div className="welcome-content">
                        <h6>Welcome to <span>LitLab</span></h6>
                    </div>
                    <h1 className="title">
                        What You Want<br />
                        To Learn Today?
                    </h1>

                    <div className="search-container">
                        <div className="search-icon">
                            <IoIosSearch />
                        </div>
                        <input
                            type="search"
                            placeholder="Search live classes, recorded, modules"
                            className="search-input"
                        />
                        <button className="voice-search-button">
                            <span className="voice-icon"><MdOutlineKeyboardVoice /></span>
                        </button>
                    </div>

                    <div className="promo-card">
                        <div className="promo-content">
                            <h2 className="promo-title">Master Your Grades<br />with Lit Lab</h2>
                            <button className="explore-button">Explore more</button>
                        </div>
                        <div className="phone-mockup"></div>
                    </div>
                </main>

                <div className="PaperCategories">
                    <div className="cat-main-heading">
                        <h6>Popular Papers</h6> <Link>See all</Link>
                    </div>
                    <div className="category-carousel-wrapper">
                        <div className="carousel-titile">
                            <h3>Major</h3>
                        </div>

                        <Slider {...settings}>
                            {carouselItems.map((item) => (
                                <div key={item.id}>
                                    <div className="category-card">
                                        <div className="category-img">
                                            <img src={item.image} alt={item.title} />
                                        </div>

                                        <div className="card-description">
                                            <div className="main-description">
                                                <h6>{item.title}</h6>
                                            </div>
                                            <div className="sub-description">
                                                <p>{item.lessons}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileIndexPage;
