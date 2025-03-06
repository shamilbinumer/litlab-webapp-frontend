import { Link, useNavigate } from 'react-router-dom';
import './UserRegister.scss';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const UserRegister = () => {
    // State for form fields
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department, setDepartments] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [couses, setCouses] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [departmentsLoading, setDepartmentsLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        general: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const dropdownRef = useRef(null);

    // Clear errors when user starts typing
    const clearFieldError = (field) => {
        setErrors(prev => ({
            ...prev,
            [field]: '',
            general: ''
        }));
    };

    // Fetch departments
    const fetchAllDepartments = async () => {
        setDepartmentsLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/fetch-department`);
            setDepartments(response.data.data);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                general: "Failed to fetch departments"
            }));
        } finally {
            setDepartmentsLoading(false);
        }
    };

    const fetchCourses = async (departmentId) => {
        if (!departmentId) return;
        setCoursesLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/api/fetch-course/${departmentId}`);
            setCouses(response.data.data);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                general: "Failed to fetch courses"
            }));
        } finally {
            setCoursesLoading(false);
        }
    };

    const colleges = [
        "A.C. Kunhimon Haji Memorial ICA College",
        "A.V. Abdurahiman Haji Arts and Science College",
        "Aashrayam College of Arts & Science",
        "Ability Arts and Science College for Hearing Impaired",
        "Ahalia School of Commerce and Mathematics",
        "Al Irshad Arts and Science College for Women",
        "Al Jamia Arts and Science College",
        "Al Shifa College of Arts and Science",
        "Al-Abrar Oriental Arabic College",
        "Al-Furqan Arabic College",
        "Al-Hidayath Arabic College",
        "Alphonsa Arts and Science College",
        "Alphonsa College Thiruvambady",
        "Amal College of Advanced Studies",
        "Ambedkar College of Arts and Science",
        "AMC Group of Educational Institutions",
        "Ansar Arabic College",
        "Ansar Women's College",
        "Anwarul Islam Arabic College, Kuniyil",
        "Anwarul Islam Arabic College, Thirurkad",
        "Anwarul Islam Women's Arabic College",
        "Aspire College of Advanced Studies",
        "Assabah Arabic College",
        "Assabah Arts and Science College",
        "AWH College of Science & Technology",
        "AWH Special College",
        "Bafakhy Yatheemkhana Arts and Science College for Women",
        "Baithul Izza Arts & Science College",
        "Baithul Izza Women's Arabic College",
        "Bethania Institute of Management Studies",
        "Bharathamatha College of Arts and Science",
        "Blossom Arts & Science College",
        "Busthanul Uloom Arabic College",
        "C.K.G. Memorial Govt. College",
        "C.M College of Arts and Science",
        "C.S.I. Christian Muller Women's College",
        "Calicut University Regional Centre Perambra",
        "CCSIT Pudukad",
        "Centre for Costume and Fashion Designing",
        "CH Mohammed Koya Memorial Government Arts and Science College",
        "CH Muhammed Koya Memorial Govt Arts and Science College",
        "Chembai Memorial Govt Music College",
        "Cherpulassery College of Science and Technology",
        "Chetana College of Media and Performing Arts",
        "Christ College (Autonomous)",
        "Co-operative Arts and Science College",
        "College of Applied Science (IHRD), Kallachi",
        "College of Applied Science (IHRD), Vadakkanchery",
        "College of Applied Science, Ayalur",
        "College of Applied Science, Kiliyanad",
        "College of Applied Science, Malampuzha",
        "College of Applied Science, Thiruvampadi",
        "College of Applied Sciences, Agali",
        "College of Applied Sciences, Chelakkara",
        "College of Applied Sciences, Kodungallur",
        "College of Applied Sciences, Korangad",
        "College of Applied Sciences, Kuzhalmannam",
        "College of Applied Sciences, Muthuvallur",
        "College of Applied Sciences, Nattika",
        "College of Applied Sciences, Vattamkulam",
        "College of Applied Sciences, Vazhakkad",
        "CPA College of Global Studies",
        "Darul Huda Arts & Science College",
        "Darul Ma-Rifa Arabic College",
        "Darul Uloom Arabic College",
        "Dayapuram Arts and Science College for Women",
        "De Paul Institute of Science and Technology DISAT",
        "Devamatha College of Advanced Studies",
        "Dharmagiri College of Arts and Science",
        "Dignity College of Arts and Science",
        "Divine Institute of Media Science",
        "Don Bosco College, Mampetta",
        "Don Bosco College, Mannuthy",
        "Don Bosco College, Sulthan Bathery",
        "Dr. B.R. Ambedkar Memorial Govt. Arts and Science College",
        "Duxford College for Advanced Studies",
        "Educos Arts and Science College",
        "Eldho Mor Baselios College",
        "Elims College of Arts and Science",
        "EMEA College of Arts and Science",
        "Eranad Knowledge City College of Commerce and Sciences",
        "ETCES College for Advanced Studies",
        "Falahiya Arabic College",
        "Farook College (Autonomous)",
        "Fathima Arts and Science College",
        "GEMS Arts and Science College",
        "Golden Hills Arts and Science College",
        "Government Arts and Science College for Women",
        "Government College, Chittur",
        "Government College, Kodenchery",
        "Government College, Madappally",
        "Government College, Malappuram",
        "Government College, Mokeri",
        "Government Victoria College",
        "Grace Valley College of Arts and Science",
        "Gurudeva College of Advanced Studies",
        "Herman Gundert Memorial Women's College",
        "Hidayathul Muslimeem College of Science and Technology",
        "Hikamiyya Arts and Science College",
        "Hi-Tech Arts and Science College",
        "Holy Cross Institute of Management & Technology",
        "Holy Grace Academy of Arts & Science",
        "Ideal Arts and Science College",
        "Ideal College for Advanced Studies",
        "Ideal College of Arts & Science",
        "IES College of Arts & Science",
        "IKT Memorial Arts and Science College",
        "Ilahiya Arabic College",
        "Ilahiya Arts & Science College",
        "Institute of Tribal Studies and Research",
        "Isha-Athul Islam Arabic College",
        "ISS Arts and Science College",
        "Jalaliya Women's Arabic College",
        "Jamia Nadawiyya Arts & Science College",
        "Jamia Nadwiyya Women's Arabic College",
        "Jamiya Islamiya Arts and Science",
        "Jayasree Arts and Science",
        "JDT Islam College of Arts and Science",
        "JM College of Arts and Science for Women",
        "K.K.T.M. Government College",
        "K.M.M.M.O Arabic College",
        "K.M.O. Arts & Science College",
        "K.R. Narayanan College of Higher Learning",
        "K.T.M College of Advanced Studies",
        "K.V Ustad Memorial Darul Hidaya Orphanage Arts and Science College for Women",
        "Kadathanad Arts & Science College",
        "Kappungal Said Alavi Haji Memorial Arts & Science College",
        "KAS College",
        "Khidmath Arts and Science College",
        "KILA College of Decentralisation and Local Governance",
        "KMCT Arts and Science College",
        "Korambayil Ahammed Haji Memorial Unity Women's College",
        "Kottakkal Farook Arts and Science College",
        "KRS Sree Narayana College",
        "Kunnamangalam Govt. Arts & Science College",
        "Lakshmi Narayana Arts and Science College",
        "Lampshare College of Arts and Science",
        "LBS Model Degree College",
        "Le-Ment College of Advanced Studies",
        "Lions Educational Trust College",
        "Little Flower College",
        "Little Flower Institute of Social Sciences and Health",
        "Luminous Arts and Science College",
        "M Dasan Arts and Science College",
        "M.E.S Arts and Science College, Amayur",
        "M.E.S Arts and Science College, Chathamangalam",
        "M.E.S Arts and Science College, Kuttippuram",
        "M.E.S Arts and Science College, Perinthalmanna",
        "M.E.S Asmabi College",
        "M.E.S College (Unaided) Vatakara",
        "M.E.S Keveeyam College",
        "M.E.S Mampad College (Autonomous)",
        "M.E.S Ponnani College",
        "M.E.T Arts and Science College",
        "M.H College of Arts & Science",
        "Ma'din Arts and Science College",
        "Madeenathul Uloom Arabic College",
        "Mahlara Arts and Science College for Women",
        "Majma'a Arts and Science College",
        "Malabar Arts and Science College for Women",
        "Malabar Christian College",
        "Malabar College of Advanced Studies",
        "Malabar College of Arts and Science",
        "Malabar College of Commerce and Science",
        "MAO College of Arts & Science",
        "Mar Dionysius College",
        "Mar Osthatheos College",
        "Marian Arts and Science College",
        "Markaz Arts and Science College",
        "Markaz College of Arts and Science",
        "Markaz Oriental College",
        "Markaz Wayanad Womens College",
        "Marthoma College",
        "Mawlana Abul Kalam Azad College of Social Sciences",
        "Mercy College",
        "MES Kalladi College",
        "MET's College of Advanced Studies",
        "MHES College of Science and Technology",
        "MIC Arts and Science College",
        "Minority Arts and Science College",
        "Model College",
        "Mohamed Abdurahiman Memorial Orphanage College",
        "Mor Ivanian College",
        "Mores College of Arts and Science",
        "Mother Arts & Science College",
        "Moulana College of Arts, Science and Commerce",
        "Mount Seena College of Arts & Science",
        "Muslim Orphanages' College of Arts and Science",
        "N.M.S.M. Government College",
        "N.S.S College, Nemmara",
        "Naipunya Institute of Management & Information Technology",
        "Najath Arts and Science College",
        "Najath College of Science & Technology",
        "Nasra College of Arts and Science",
        "National College of Arts and Science",
        "Nattika Educational Society Arts & Science College",
        "Nethaji Memorial Arts and Science College",
        "Nirmala College of Arts and Science",
        "Noble Women's College",
        "NSS Arts and Science College Kappoor",
        "NSS College Ottappalam",
        "NSS College, Manjeri",
        "Nucleus College of Arts and Science",
        "Oriental College of Hotel Management and Cullinery Arts",
        "Oriental School of Hotel Management",
        "P K Das Liberal College of Arts and Science",
        "P V S College of Arts and Science",
        "Panakkad Mohamedali Shihab Thangal Arts and Science College",
        "Panakkad Pookoya Thangal Memorial Arts and Science College",
        "Panampilly Memorial Govt College",
        "Paramekkavu College of Arts & Science",
        "Pazhassi Raja College",
        "Peekay CICS Arts & Science College",
        "Pocker Sahib Memorial College",
        "Pookkoya Thangal Memorial Government College",
        "Prajyoti Niketan College",
        "Pravasi Arts and Science College",
        "Prayaga Foundation for Excellence and Training",
        "Pristine Valley College of Arts and Sciences",
        "Priyadarshini Arts & Science College",
        "Providence Women's College",
        "R.Sankar Memorial SNDP Yogam Arts and Science College",
        "Rahmaniya Arabic College",
        "Rajiv Gandhi Memorial Govt. Arts & Science College",
        "Regional College of Science and Humanities",
        "Rouzathul Uloom Arabic College",
        "Royal College of Arts and Science",
        "S.M.I Arts and Science College",
        "Sadanam Kumaran College",
        "Safa Arabic College",
        "SAFI Institute of Advanced Study (Autonomous)",
        "Safa College of Arts and Science",
        "Sahrdaya College of Advanced Studies",
        "Sahya Arts and Science College",
        "Salafiyya Arabic College, Karinganad",
        "Salafiyya Arabic College, Meppayur",
        "Salafiyya College, Wandoor",
        "Saqafath Institute of Advanced Studies",
        "Saqafathul Islam Arabic College",
        "Savithri Devi Saboo Memorial Women's College",
        "Sayyid Muhammed Ali Shihab Thangal Memorial Arts and Science Women's College",
        "Schoenstatt Academy Arts and Science College",
        "SEEDAC College of Arts & Science",
        "Sharee-ath College for Women",
        "Silver Arts & Science College",
        "SNDP Yogam MK Raghavan Memorial Arts and Science College",
        "SNDP Yogam Sathabdi Smaraka College",
        "SNES College of Arts Commerce and Management",
        "SNES Kalyani College",
        "Sree Gokulam Arts and Science College",
        "Sree Kerala Varma College",
        "Sree Krishna College",
        "Sree Narayana College, Alathur",
        "Sree Narayana College, Kundalassery",
        "Sree Narayana College, Nattika",
        "Sree Narayana College, Vatakara",
        "Sree Narayana Guru College of Advanced Studies, Alathur",
        "Sree Narayana Guru College of Advanced Studies, Chelannur",
        "Sree Narayana Guru College of Advanced Studies, Nattika",
        "Sree Narayana Guru College of Advanced Studies, Vazhukumpara",
        "Sree Narayana Guru College, Chelannur",
        "Sree Neelakanta Govt Sanskrit College",
        "Sree Rama Varma Govt. College of Music & Performing Arts",
        "Sree Sastha College",
        "Sree Vivekananda College",
        "Sree Vivekananda Padana Kendram Arts and Science College",
        "Sreekrishnapuram V.T Bhattahiripad College",
        "Sreepathy Institute of Advanced Studies",
        "Sri C Achutha Menon Govt College",
        "Sri Vyasa NSS College",
        "St. Aloysius College",
        "St. Benedict's College",
        "St. Joseph's College, Devagiri (Autonomous)",
        "St. Joseph's College, Irinjalakkuda (Autonomous)",
        "St. Joseph's Arts and Science College",
        "St. Mary's College Sulthan Bathery",
        "St. Mary's College, Puthanangadi",
        "St. Teresa's Arts & Science College",
        "St. Thomas' College (Autonomous)",
        "St. Xavier's Arts and Science College",
        "Sullamussalam Arabic College",
        "Sullamussalam Science College",
        "Sunniya Arabic College",
        "Syed Abdul Rahiman Bafakhy Thangal Memorial Govt College",
        "Thaqwa Afzal-ul-Ulama Arabic College",
        "Tharananellur Arts & Science College",
        "The Elegant Arts & Science College",
        "Thunchan Memorial Government College",
        "Thunchath Ezhuthachan College",
        "Unity College of Arts and Science",
        "Universal College of Arts and Science",
        "Vakil P Kumaran Ezhuthachan College",
        "Vanika Vysia College of Science and Technology",
        "Vayalil Kunhali Haji Memorial Orphanage College of Arts & Science for Women",
        "Vedavyasa College of Arts and Science",
        "Vimala College (Autonomous)",
        "W.M.O. Arts & Science College",
        "Womens Islamiya Arts and Science College",
        "Yuvakshetra Institute of Management Studies",
        "Zamorin's Guruvayurappan College"
    ];

    // Filter colleges based on search term
    const filteredColleges = colleges.filter(college =>
        college.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle college selection
    const handleCollegeSelect = (college) => {
        setSelectedCollege(college);
        setSearchTerm(college);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        fetchAllDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchCourses(selectedDepartment);
        } else {
            setCouses([]); // Clear courses when no department is selected
        }
    }, [selectedDepartment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({ email: '', phone: '', general: '' });
        setSuccessMessage('');

        // Existing validation checks
        if (!name || !email || !phone || !selectedCollege || !selectedDepartment || !selectedCourse || !selectedSemester) {
            setErrors(prev => ({
                ...prev,
                general: "Please fill in all required fields"
            }));
            setLoading(false);
            return;
        }

        // Prepare user data
        const userData = {
            name,
            phone,
            email,
            course: selectedCourse,
            collegeName: selectedCollege,
            department: selectedDepartment,
            semester: selectedSemester,
            favourite: [],
            image: "",
            search: name.split('').map((char, i) => name.substring(0, i + 1).toUpperCase())
        };

        try {
            const response = await axios.post(`${baseUrl}/api/user-signup`, userData);
            setLoading(false);
            navigate('/login')
            setSuccessMessage(response.data.message);
            // Clear form after successful registration
            setName('');
            setPhone('');
            setEmail('');
            setSelectedCollege('');
            setSearchTerm('');
            setSelectedDepartment('');
            setSelectedSemester('');
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || "An error occurred";

            // Handle specific error messages
            if (errorMessage.includes("Email already registered")) {
                setErrors(prev => ({
                    ...prev,
                    email: "This email is already registered"
                }));
            } else if (errorMessage.includes("Phone number already registered")) {
                setErrors(prev => ({
                    ...prev,
                    phone: "This phone number is already registered"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: errorMessage
                }));
            }
        }
    };

    return (
        <div className='UserRegisterMainWrapper'>
            <div className="container-fluid main">
                <div className="mobile-header">
                    <div><img src="/Images/Logo P 7.png" alt="" className="mobile-navlogo" /></div>
                    <div className='vector-wrapper'>
                        <img src="/Images/welcompage-image.png" alt="" className="mobile-vector-image" />
                        <img src="/Images/Union.png" alt="" className="mobile-vector-child-image" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 left-side">
                        <div>
                            <h2>Let's Complete Your Profile to <br /> Begin Your Journey!</h2>
                            <div><img src="/Images/regitsrePageImg.png" alt="" /></div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-12 col-md-12 right-side">
                        <form onSubmit={handleSubmit}>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Name</label></div>
                                <div><input
                                    type="text"
                                    placeholder='Enter your full name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                /></div>
                            </div>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Phone</label></div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='Contact number'
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            clearFieldError('phone');
                                        }}
                                        required
                                        maxLength={10}
                                    />
                                    {errors.phone && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</div>}
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Email</label></div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder='Enter your email'
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            clearFieldError('email');
                                        }}
                                        required
                                    />
                                    {errors.email && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</div>}
                                </div>
                            </div>
                            <div className="input-wrapper" ref={dropdownRef}>
                                <div><label htmlFor="">College</label></div>
                                <div className="custom-dropdown">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        placeholder="Search for your college"
                                        className="college-search-input"
                                    />
                                    {isDropdownOpen && (
                                        <div className="college-dropdown">
                                            {filteredColleges.length > 0 ? (
                                                filteredColleges.map((college, index) => (
                                                    <div
                                                        key={index}
                                                        className="college-option"
                                                        onClick={() => handleCollegeSelect(college)}
                                                    >
                                                        {college}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-results">No colleges found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Department</label></div>
                                <div>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => {
                                            setSelectedDepartment(e.target.value);
                                            setSelectedCourse(''); // Clear selected course when department changes
                                        }}
                                        disabled={departmentsLoading}
                                    >
                                        <option value="" disabled>
                                            {departmentsLoading ? "Loading departments..." : "Select your Department"}
                                        </option>
                                        {!departmentsLoading && department && department.length > 0 ? (
                                            department.map((dept, index) => (
                                                <option value={dept.id} key={index}>{dept.department}</option>
                                            ))
                                        ) : (
                                            departmentsLoading ? null : <option value="" disabled>No departments available</option>
                                        )}
                                    </select>
                                    {departmentsLoading && (
                                        <div className="loading-indicator" style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                            Loading departments...
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Course</label></div>
                                <div>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        disabled={!selectedDepartment || coursesLoading} // Disable if no department selected or loading
                                    >
                                        <option value="" disabled>
                                            {!selectedDepartment 
                                                ? "Select a department first" 
                                                : coursesLoading 
                                                    ? "Loading courses..." 
                                                    : "Select your Course"}
                                        </option>
                                        {!coursesLoading && couses && couses.length > 0 ? (
                                            couses.map((course, index) => (
                                                <option value={course.id} key={index}>
                                                    {course.courseTitle}
                                                </option>
                                            ))
                                        ) : (
                                            coursesLoading ? null : selectedDepartment ? 
                                                <option value="" disabled>No courses available</option> : null
                                        )}
                                    </select>
                                    {coursesLoading && (
                                        <div className="loading-indicator" style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                            Loading courses...
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Semester</label></div>
                                <div>
                                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                                        <option value="" disabled>Select your Semester</option>
                                        {[1, 2, 3, 4, 5, 6].map((sem) => (
                                            <option value={sem} key={sem}>{sem} Semester</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button type="submit" disabled={loading || departmentsLoading || coursesLoading}>
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </div>
                            {errors.general && <div style={{ color: 'red', textAlign: "center", paddingTop: "1rem" }}>{errors.general}</div>}
                            {successMessage && <div style={{ color: 'green', textAlign: "center", paddingTop: "1rem" }}>{successMessage}</div>}
                            <div className='login'>You have an account? <Link to='/login' style={{color:"blue"}}>Login</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;