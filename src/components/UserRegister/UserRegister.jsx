import { Link, useNavigate } from 'react-router-dom';
import './UserRegister.scss';
import { useState, useRef } from 'react';

const UserRegister = () => {
    // State for form fields
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        general: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const dropdownRef = useRef(null);

    // Static data for colleges, departments, and courses
    const colleges = [
        "A.C. Kunhimon Haji Memorial ICA College",
        "A.V. Abdurahiman Haji Arts and Science College",
        "Aashrayam College of Arts & Science",
        // Add more colleges as needed
    ];

    const departments = [
        { id: 1, department: "Computer Science" },
        { id: 2, department: "Mathematics" },
        { id: 3, department: "Physics" },
        // Add more departments as needed
    ];

    const courses = [
        { id: 1, courseTitle: "B.Sc Computer Science" },
        { id: 2, courseTitle: "B.Sc Mathematics" },
        { id: 3, courseTitle: "B.Sc Physics" },
        // Add more courses as needed
    ];

    // Filter colleges based on search term
    const filteredColleges = colleges.filter(college =>
        college.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle click outside dropdown to close it
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.removeEventListener('mousedown', handleClickOutside);

    // Handle college selection
    const handleCollegeSelect = (college) => {
        setSelectedCollege(college);
        setSearchTerm(college);
        setIsDropdownOpen(false);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({ email: '', phone: '', general: '' });
        setSuccessMessage('');

        // Basic validation
        if (!name || !email || !phone || !selectedCollege || !selectedDepartment || !selectedCourse || !selectedSemester) {
            setErrors(prev => ({
                ...prev,
                general: "Please fill in all required fields"
            }));
            setLoading(false);
            return;
        }

        // Simulate a successful registration
        setLoading(false);
        setSuccessMessage("Registration successful!");
        navigate('/otp-send');

        // Clear form after successful registration
        setName('');
        setPhone('');
        setEmail('');
        setSelectedCollege('');
        setSearchTerm('');
        setSelectedDepartment('');
        setSelectedSemester('');
    };

    return (
        <div className='UserRegisterMainWrapper'>
            <div className="container-fluid main">
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
                                        onChange={(e) => setPhone(e.target.value)}
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
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                    >
                                        <option value="" disabled>Select your Department</option>
                                        {departments.map((data, index) => (
                                            <option value={data.id} key={index}>{data.department}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <div><label htmlFor="">Course</label></div>
                                <div>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                    >
                                        <option value="" disabled>Select your Course</option>
                                        {courses.map((data, index) => (
                                            <option value={data.id} key={index}>{data.courseTitle}</option>
                                        ))}
                                    </select>
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
                                <button type="submit" disabled={loading}>
                                    {loading ? "Registering" : "Register"}
                                </button>
                            </div>
                            {errors.general && <div style={{ color: 'red', textAlign: "center", paddingTop: "1rem" }}>{errors.general}</div>}
                            {successMessage && <div style={{ color: 'green', textAlign: "center", paddingTop: "1rem" }}>{successMessage}</div>}
                            <div className='login'>You have an account? <Link to='/login'>Login</Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;