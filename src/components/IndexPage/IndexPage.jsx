import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import SideNave from '../common/SideNav/SideNave';
import './IndexPage.scss';
import { IoIosHeartEmpty } from 'react-icons/io';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import UserProfile from '../common/UserProfile/UserProfile';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const IndexPage = () => {
    const [activePaperType, setActivePaperType] = useState('major');
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [papers, setPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]); // State for filtered papers
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const navigate = useNavigate();

    const fetchMajorPapers = async () => {
        setLoadingPapers(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-major-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log(response.data);
                
                setPapers(response.data);
                setFilteredPapers(response.data); 
                console.log(response.data,'this is paper response');
                // Initialize filtered papers with all fetched papers
            } else {
                console.error("Error fetching major papers");
            }
        } catch (error) {
            console.error("Error fetching major papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const fetchMinorPapers = async () => {
        setLoadingPapers(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-minor-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPapers(response.data);
                setFilteredPapers(response.data); // Initialize filtered papers with all fetched papers
            } else {
                console.error("Error fetching minor papers");
            }
        } catch (error) {
            console.error("Error fetching minor papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const fetchCommonPapers = async () => {
        setLoadingPapers(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${baseUrl}/api/fetch-common-paper`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setPapers(response.data); // Assuming the API returns an array of papers
                console.log(response.data,'this is common paper response');

                
                setFilteredPapers(response.data);
            } else {
                console.error("Error fetching common papers");
            }
        } catch (error) {
            console.error("Error fetching common papers:", error);
        } finally {
            setLoadingPapers(false);
        }
    };

    useEffect(() => {
        const checkUserAuthentication = async () => {

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${baseUrl}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            } 
        };

        checkUserAuthentication();
    }, [navigate]);

    useEffect(() => {
        if (activePaperType === 'major') {
            fetchMajorPapers();
        } else if (activePaperType === 'minor') {
            fetchMinorPapers();
        } else if (activePaperType === 'common') {
            fetchCommonPapers();
        }
    }, [activePaperType]);

    useEffect(() => {
        // Filter papers based on search term
        if (searchTerm.trim() === '') {
            setFilteredPapers(papers); // If no search term, show all papers
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = papers.filter((paper) =>
                (paper.courseTitle || paper.title).toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredPapers(filtered);
        }
    }, [searchTerm, papers]); // Re-run filtering when search term or papers change

    return (
        <div className="IndexPageMainWrapper">
            <div className="home-main">
                <div className="home-left">
                    <SideNave />
                </div>
                <div className="home-right">
                    <div className="desktop-user-profile"><UserProfile /></div>
                    <h3 className="welcome-heading">
                        Welcome to <span>LitLab</span>
                    </h3>
                    <h1 className="main-heading">What you want to learn today?</h1>
                    <div className="search-bar">
                       <div> <IoSearchOutline className="search-icon" /></div>
                        <div><input
                            type="text"
                            placeholder="Search Live Classes, Recorded, Modules"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
                        /></div>
                    </div>
                    <div className="paper-types-wrapper">
                        <div
                            className={`paper-type ${activePaperType === 'major' ? 'active-paper-type' : ''}`}
                            onClick={() => setActivePaperType('major')}
                        >
                            <span>Major</span>
                            <div className="icon-wrapper">
                                <img src="/Images/major.png" alt="" />
                            </div>
                        </div>
                        <div
                            className={`paper-type ${activePaperType === 'minor' ? 'active-paper-type' : ''}`}
                            onClick={() => setActivePaperType('minor')}
                        >
                            <span>Minor</span>
                            <div className="icon-wrapper">
                                <img src="/Images/minor.png" alt="" />
                            </div>
                        </div>
                        <div
                            className={`paper-type ${activePaperType === 'common' ? 'active-paper-type' : ''}`}
                            onClick={() => setActivePaperType('common')}
                        >
                            <span>Common</span>
                            <div className="icon-wrapper">
                                <img src="/Images/common.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="paper-cards-section">
                        {loadingPapers ? (
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        ) : (
                            <div className="cards-main row">
                                {filteredPapers.length > 0 ? (
                                    filteredPapers.map((paper) => (
                                        <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12" key={paper.id}>
                                                <div className="paper-card">
                                                    <IoIosHeartEmpty className="heart-icon" />
                                                    <img
                                                        src={paper.image || '/Images/Group 1000004522.png'}
                                                        alt=""
                                                        className="paper-image"
                                                    />
                                                    <h1 className="paper-title">
                                                        {paper.courseTitle || paper.title}
                                                    </h1>
                                                    <p className="paper-description">{paper.description}</p>
                                                    <Link to={`/paper-details/${paper.courseTitle || paper.title}/${paper.id}`}> <button>Learn Now</button></Link>
                                                </div>
                                            
                                        </div>
                                    ))
                                ) : (
                                    <p className='no-result'>No papers found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
