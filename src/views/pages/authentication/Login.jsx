import React, { useEffect, useState } from 'react';
import { MdOutlineMailOutline, MdOutlineLockPerson } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';
import 'src/index.css';
import InputGroup from 'react-bootstrap/InputGroup';
import { Container, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const navigate = useNavigate();
    const steps = ['registration', 'subscription', 'login', 'configure'];
    const banner = ["src/assets/login1.jpeg", "src/assets/logIn3.jpg", "src/assets/login.jpeg"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const initialValues = {
        Email: "",
        Password: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('login');

    useEffect(() => {
        let timeout;
        const cycleImages = () => {
            setFade(false);
            timeout = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % banner.length);
                setFade(true);
                timeout = setTimeout(cycleImages, 2000);
            }, 300);
        };

        cycleImages();

        return () => clearTimeout(timeout);
    }, []);

    const handleChange = (name, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const { Email, Password } = formValues;
        const newErrors = {};
        let isValid = true;

        if (!Email) {
            isValid = false;
            newErrors.Email = "Email is required.";
            toast.error(newErrors.Email);
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Email)) {
            isValid = false;
            newErrors.Email = "Email is invalid.";
            toast.error(newErrors.Email);
        }

        if (!Password) {
            isValid = false;
            newErrors.Password = "Password is required.";
            toast.error(newErrors.Password);
        } else if (Password.length < 6) {
            isValid = false;
            newErrors.Password = "Must be at least 6 characters.";
            toast.error(newErrors.Password);
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = {
            email: formValues.Email,
            Password: formValues.Password,
        };

        try {
            const res = await api.post("/adminauth/login", payload);

            if (res.data.isValid) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
                localStorage.setItem("refreshToken", res.data.data.refreshToken);
               localStorage.setItem("authChannels", JSON.stringify(res.data.data.authChannels));

                if (res.data.data.authChannels.length === 0) {
                    navigate("/channel-outlet");
                } else {
                    navigate("/dashboard");
                }
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
                            const isCompleted = index < steps.indexOf(activeTab);

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
            <div className='row main-img-div' >
                <div className="col-md-9 rounded h-100">
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
                <div className="col-md-3 h-100 d-flex align-items-end justify-content-center"
                >
                    <form
                        className='bg-white w-100 h-100 rounded p-3 d-flex flex-column justify-content-center align-items-center gap-4'
                        noValidate>
                        <div className='text-center'>
                            <h2 className="mb-2 fw-bold fs-1">
                                Welcome Back
                            </h2>
                            <p className='fs-6'>Enter your email and password to access your account</p>
                        </div>
                        <InputGroup hasValidation className="">
                            <InputGroup.Text>
                                <MdOutlineMailOutline size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                type="email"
                                name='real-email'
                                value={formValues.Email || ""}
                                onChange={(e) => handleChange("Email", e.target.value)}
                                className={`custom-input ${errors.Email ? 'input-error' : ''}`}
                                autoComplete="off"
                                placeholder="Email Address"
                                isInvalid={!!errors.Email}
                                isValid={formValues.Email && !errors.Email}

                            />
                        </InputGroup>
                        <InputGroup hasValidation className="">
                            <InputGroup.Text>
                                <MdOutlineLockPerson size={24} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                autoComplete='new-password'
                                value={formValues.Password || ""}
                                onChange={(e) => handleChange("Password", e.target.value)}
                                className={`custom-input ${errors.Password ? 'input-error' : ''}`}
                                name="real-password"
                                required
                                placeholder="Password"
                                isInvalid={!!errors.Password}
                                isValid={formValues.Password && !errors.Password}
                            />
                        </InputGroup>
                        <Button variant="warning" className='mt-2' type="submit" onClick={handleSubmit}>
                            Log In
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
