import { useEffect, useState } from 'react';
import { MdOutlinePersonOutline, MdOutlineLockPerson, MdOutlineMailOutline } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import 'src/index.css';
import api from '../../../config/AxiosInterceptor';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Container, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const navigate = useNavigate();
    const steps = ['registration', 'login', 'subscription', 'configure'];
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        email: '',
        password: '',
        confirm: ''
    });
    const banner = ["src/assets/login1.jpeg", "src/assets/logIn3.jpg", "src/assets/login.jpeg"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('registration');
    const currentStepIndex = steps.indexOf(activeTab);

    useEffect(() => {
        let timeout;
        const cycleImages = () => {
            setFade(false);
            timeout = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % banner.length);
                setFade(true);
                timeout = setTimeout(cycleImages, 4500);
            }, 500);
        };

        cycleImages();

        return () => clearTimeout(timeout);
    }, []);


    const validate = () => {
        const newErrors = {};
        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Full name is required';
            toast.error(newErrors.fullname);
        } else if (!/^[a-zA-Z ]+$/.test(formData.fullname)) {
            newErrors.fullname = 'Name must contain only letters';
            toast.error(newErrors.fullname);
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            toast.error(newErrors.phone);
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be 10 digits';
            toast.error(newErrors.phone);
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            toast.error(newErrors.email);
        } else if (!/^[a-zA-Z][^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            toast.error(newErrors.email);
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            toast.error(newErrors.password);
        } else if (formData.password.length < 6) {
            newErrors.password = 'Must be at least 6 characters';
            toast.error(newErrors.password);
        }

        if (formData.confirm !== formData.password) {
            newErrors.confirm = 'Confirm Passwords do not match';
            toast.error(newErrors.confirm);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const payload = {
            name: formData.fullname,
            mobile: formData.phone,
            email: formData.email,
            password: formData.password,
            isActive: true,
        };



        try {
            const res = await api.post("/admin", payload);
            localStorage.setItem("userId",res.data.data);

            if (res.data.isValid) {
                navigate('/subscription');
            } else {
                setErrors({ Password: "Invalid credentials" });
            }
        } catch (error) {
            console.error("API Error:", error);
            setErrors({ Password: "Login failed. Try again." });
        }
    };

    return (
        <div className='p-3'>
            <div className='row mb-3'>
                <div className='col-md-12 w-100'>
                    <div className="stepper">
                        {steps.map((step, index) => {
                            const isActive = activeTab === step;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={step} className="step-wrapper">
                                    <div
                                        className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}

                                    >
                                        <div className="step-circle">{index + 1}</div>
                                        <div className="step-label">
                                            {step.charAt(0).toUpperCase() + step.slice(1)}
                                        </div>
                                        {index < steps.length - 1 && <div className="step-line"></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className='row main-img-div'>
                <div className="col-md-9 rounded h-100" >
                    <img
                        style={{
                            height: "100%",
                            width: "100%",
                            transition: "opacity 0.5s ease",
                            opacity: fade ? 1 : 0
                        }}
                        src={banner[currentIndex]}
                        alt=""
                        className="rounded"
                    />
                </div>
                <div className="col-md-3 d-flex align-items-end justify-content-center"
                >

                    {activeTab === "registration" && (
                        <Form

                            className=' bg-white w-100 h-100  rounded p-3 d-flex flex-column align-items-center gap-4'
                            // className="fancy-form" 
                            noValidate
                            autoComplete='off'
                            >
                            <h2 className="mb-2 fw-bold fs-3">Create a Yelo account</h2>

                            <InputGroup hasValidation className="">
                                <InputGroup.Text>
                                    <MdOutlinePersonOutline size={25} color='#ffc800' />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={formData.fullname}
                                                          className={`custom-input `}
                                    required
                                    placeholder="Full Name"
                                    isInvalid={!!errors.fullname}
                                    isValid={formData.fullname && !errors.fullname}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z ]/g, '');

                                        setFormData({ ...formData, fullname: value });

                                        let message = '';
                                        if (!value.trim()) {
                                            message = 'Full name is required';
                                        } else if (!/^[a-zA-Z ]+$/.test(value)) {
                                            message = 'Name must contain only letters';
                                        }

                                        setErrors((prev) => ({ ...prev, fullname: message }));
                                    }}
                                />

                            </InputGroup>


                            <InputGroup hasValidation className="">
                                <InputGroup.Text>
                                    <BsTelephone size={24} color='#ffc800' />
                                </InputGroup.Text>
                                <Form.Control
                                         className={`custom-input `}
                                    type="text"
                                    value={formData.phone}
                                    required
                                    placeholder="Phone Number"
                                    isInvalid={!!errors.phone}
                                    isValid={formData.phone && !errors.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })
                                    }
                                />
                            </InputGroup>


                            <InputGroup hasValidation className="">
                                <InputGroup.Text>
                                    <MdOutlineMailOutline size={25} color='#ffc800' />
                                </InputGroup.Text>
                                <Form.Control
                                         className={`custom-input `}
                                    type="email"
                                    name='real-email'
                                    autoComplete='off'
                                    value={formData.email}
                                    required
                                    placeholder="Email Address"
                                    isInvalid={!!errors.email}
                                    isValid={formData.email && !errors.email}
                                    onChange={(e) => {
                                        const firstChar = e.target.value.charAt(0);
                                        if (!/[a-zA-Z]/.test(firstChar) && e.target.value.length > 0) {
                                            setErrors({ ...errors, email: 'Email must start with a letter' });
                                            return;
                                        } else {
                                            const updatedErrors = { ...errors };
                                            delete updatedErrors.email;
                                            setErrors(updatedErrors);
                                        }
                                        setFormData({ ...formData, email: e.target.value });
                                    }}
                                />


                            </InputGroup>


                            <InputGroup hasValidation className="">
                                <InputGroup.Text>
                                    <RiLockPasswordLine size={25} color='#ffc800' />
                                </InputGroup.Text>
                                <Form.Control
                                         className={`custom-input `}
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete='new-password'
                                    placeholder="Enter password"
                                    name="real-password"
                                    isInvalid={!!errors.password}
                                    isValid={formData.password && !errors.password}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />


                            </InputGroup>

                            <InputGroup hasValidation className="">
                                <InputGroup.Text>
                                    <MdOutlineLockPerson size={25} color='#ffc800' />
                                </InputGroup.Text>
                                <Form.Control
                                         className={`custom-input `}
                                    required
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm password"
                                    isInvalid={!!errors.confirm}
                                    isValid={formData.confirm && !errors.confirm}
                                    name="confirm"
                                    value={formData.confirm}
                                    onChange={handleChange}
                                    // className={errors.confirm ? 'input-error' : ''}
                                />
                                {/* <Form.Control.Feedback type="valid">
                                Enter Your Email
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback> */}

                            </InputGroup>


                            <Button variant="warning" className='mt-2' type="submit" onClick={(e) => handleSubmit(e)}>
                                Register
                            </Button>


                            <InputGroup className="">

                                <Form.Check
                                    type="checkbox"
                                    id="custom-checkbox"
                                    label="IsActive"
                                    name="isActive"

                                    className="ms-3"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '1rem',
                                    }}
                                    custom="true"
                                >
                                    <Form.Check.Input
                                        type="checkbox"
                                        className="custom-yellow-checkbox"
                                        onChange={() => setIsAccepted(prev => !prev)}
                                        checked={isAccepted}
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                            marginRight: "8px",
                                        }}
                                    />
                                    <Form.Check.Label htmlFor="custom-checkbox" style={{ fontSize: "0.825vw" }}>
                                        I accept the <a href="/terms" style={{ color: "#ffc300" }} target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a style={{ color: "#ffc300" }} href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                                    </Form.Check.Label>
                                </Form.Check>
                            </InputGroup>


                            {/* <div className=" mt-3">
                                <div className="d-flex align-items-center gap-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="termsCheck"
                                        checked={isAccepted}
                                        onChange={() => setIsAccepted(prev => !prev)}
                                    />
                                    <div  >
                                        I accept the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                                    </div>
                                </div>
                            </div> */}


                            <div className='logInRedirect'>
                                Already have an account? <Link style={{ textDecoration: "none" }} to="/login">
                                    <u>Log in</u>
                                </Link>
                            </div>
                            <div className='google mb-3'>
                                <GoogleLogin
                                    onSuccess={credentialResponse => {

                                        const decoded = jwtDecode(credentialResponse.credential);

                                        setFormData({
                                            fullname: decoded.name,
                                            phone: "9999999999",
                                            email: decoded.email,
                                            password: decoded.jti.slice(0, 6),
                                            confirm: decoded.jti.slice(0, 6)
                                        });

                                    }}
                                    onError={() => {
                                        console.log('Google Login Failed');
                                    }}
                                />

                            </div>
                        </Form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Registration;

