import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Button, Row, Col } from "react-bootstrap";
import { useCategory } from '../../Context/CategoryContext';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FaObjectUngroup } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";
import { PiBuildingApartmentLight } from "react-icons/pi";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BsPersonVcard } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { RiUserLocationLine } from "react-icons/ri";
import { CiPhone } from "react-icons/ci";
import { CiMobile3 } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { RiUserCommunityLine } from "react-icons/ri";
import { HiOutlineDocumentCurrencyRupee } from "react-icons/hi2";

const ChannelForm = () => {

    const nameRef = useRef(null);
    const navigate = useNavigate();
    const { setIsHiddenSidebarOpen } = useCategory();

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        companyName: "",
        vatNo: "",
        pan: "",
        address1: "",
        address2: "",
        phone: "",
        mobile: "",
        email: "",
        website: "",
        gstNo: "",
        fssai: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);

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
        const {
            companyName,
            pan,
            address1,
            address2,
            phone,
            mobile,
            email,
            website,
            gstNo,
        } = formValues;
        const errors = {};
        let isValid = true;

        const phoneRegex = /^[9876]\d{9}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\S*)?$/;

        if (!companyName) {
            isValid = false;
            errors.companyName = "Company name is required.";
        }
        if (!pan) {
            isValid = false;
            errors.pan = "PAN is required.";
        }
        if (!address1) {
            isValid = false;
            errors.address1 = "Address 1 is required.";
        }
        if (!address2) {
            isValid = false;
            errors.address2 = "Address 2 is required.";
        }
        if (!phone) {
            isValid = false;
            errors.phone = "Phone is required.";
        } else if (phone.length < 10) {
            isValid = false;
            errors.phone = "Phone number must be exactly 10 digits.";
        } else if (!phoneRegex.test(phone)) {
            isValid = false;
            errors.phone = "Phone must start with 9, 8, 7, or 6 and have 10 digits.";
        }
        if (!mobile) {
            isValid = false;
            errors.mobile = "Mobile is required.";
        } else if (mobile.length < 10) {
            isValid = false;
            errors.mobile = "Mobile number must be exactly 10 digits.";
        } else if (!phoneRegex.test(mobile)) {
            isValid = false;
            errors.mobile = "Mobile must start with 9, 8, 7, or 6 and have 10 digits.";
        }
        if (!email) {
            isValid = false;
            errors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            isValid = false;
            errors.email = "Enter a valid email address.";
        }
        if (!website) {
            isValid = false;
            errors.website = "Website is required.";
        } else if (!websiteRegex.test(website)) {
            isValid = false;
            errors.website = "Enter a valid website URL (e.g., https://example.com).";
        }
        if (!gstNo) {
            isValid = false;
            errors.gstNo = "GST No is required.";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            companyName: formValues.companyName,
            vatNo: formValues.vatNo,
            pan: formValues.pan,
            address1: formValues.address1,
            address2: formValues.address2,
            phone: formValues.phone,
            mobile: formValues.mobile,
            email: formValues.email,
            website: formValues.website,
            gstNo: formValues.gstNo,
        };

        try {
            let res;
            if (formValues.channelId) {
                res = await api.put(`/channels/${formValues.channelId}`, payload, {

                });
            } else {
                res = await api.post("/channels", payload, {

                });
            }
            setFormValues(initialValues);
            toast.success(res.data.successMessage || "Success!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                navigate("/channels");
            }, 3000);
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong! Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <>
            <div className='d-flex'>
                <ToastContainer />
                <div className="configurationFormContainer ">
                    <div className='configurationFormWrapper'>
                        <div className='configurationgroupFormHeader'>
                            <h2>Add <span>Channel</span></h2>
                        </div>
                        <Form className='h-100'>
                            <div className='formWrapper d-flex flex-column justify-content-between h-100 w-100'>
                                <div className='w-100'>
                                    <Row>
                                        <Col md={10}>
                                            <Row className="g-3">
                                                <Col md={4}>
                                                    <Form.Group controlId="companyName">
                                                        <div className='configurationInputFieldWrapperMain  shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <PiBuildingApartmentLight size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.companyName || formValues.companyName ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.companyName || formValues.companyName ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.companyName || formValues.companyName ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.companyName || formValues.companyName ? "12px" : "14px",
                                                                    color: "orange",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.companyName || formValues.companyName ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Company Name
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="companyName"
                                                                ref={nameRef}
                                                                value={formValues.companyName || ""}
                                                                onChange={(e) => handleChange("companyName", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, companyName: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, companyName: false }))}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {!formValues.companyName && errors.companyName}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="gstNo">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <HiOutlineReceiptTax size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.gstNo || formValues.gstNo ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.gstNo || formValues.gstNo ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.gstNo || formValues.gstNo ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.gstNo || formValues.gstNo ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.gstNo || formValues.gstNo ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Gst No.
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="gstNo"
                                                                value={formValues.gstNo || ""}
                                                                onChange={(e) => handleChange("gstNo", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, gstNo: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, gstNo: false }))}
                                                                autoComplete="off"
                                                                minLength={15}
                                                                maxLength={15}
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {!formValues.gstNo && errors.gstNo}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="pan">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <BsPersonVcard size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.pan || formValues.pan ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.pan || formValues.pan ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.pan || formValues.pan ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.pan || formValues.pan ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.pan || formValues.pan ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Pan No.
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="pan"
                                                                value={formValues.pan || ""}
                                                                onChange={(e) => handleChange("pan", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, pan: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, pan: false }))}
                                                                autoComplete="off"
                                                                minLength={10}
                                                                maxLength={10}
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {!formValues.pan && errors.pan}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="mt-4">
                                                <Col md={4}>
                                                    <Form.Group controlId="address1">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <IoLocationOutline size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.address1 || formValues.address1 ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.address1 || formValues.address1 ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.address1 || formValues.address1 ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.address1 || formValues.address1 ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.address1 || formValues.address1 ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Current Address
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="address1"
                                                                value={formValues.address1 || ""}
                                                                onChange={(e) => handleChange("address1", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, address1: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, address1: false }))}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {!formValues.address1 && errors.address1}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="address2">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <IoLocationOutline size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.address2 || formValues.address2 ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.address2 || formValues.address2 ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.address2 || formValues.address2 ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.address2 || formValues.address2 ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.address2 || formValues.address2 ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Corporate Address
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="address2"
                                                                value={formValues.address2 || ""}
                                                                onChange={(e) => handleChange("address2", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, address2: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, address2: false }))}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {!formValues.address2 && errors.address2}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="phone">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <CiPhone size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.phone || formValues.phone ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.phone || formValues.phone ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.phone || formValues.phone ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.phone || formValues.phone ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.phone || formValues.phone ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Phone No.
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="phone"
                                                                value={formValues.phone || ""}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (/^\d*$/.test(value)) {
                                                                        handleChange("phone", value);
                                                                    }
                                                                }}
                                                                onFocus={() => setFocus(prev => ({ ...prev, phone: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, phone: false }))}
                                                                autoComplete="off"
                                                                minLength={10}
                                                                maxLength={15}
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {errors.phone && <span>{errors.phone}</span>}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="mt-4">
                                                <Col md={4}>
                                                    <Form.Group controlId="mobile">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <CiMobile3 size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.mobile || formValues.mobile ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.mobile || formValues.mobile ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.mobile || formValues.mobile ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.mobile || formValues.mobile ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.mobile || formValues.mobile ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Mobile No.
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="mobile"
                                                                value={formValues.mobile || ""}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (/^\d*$/.test(value)) {
                                                                        handleChange("mobile", value);
                                                                    }
                                                                }}
                                                                onFocus={() => setFocus(prev => ({ ...prev, mobile: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, mobile: false }))}
                                                                autoComplete="off"
                                                                minLength={10}
                                                                maxLength={15}
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {errors.mobile && <span>{errors.mobile}</span>}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="email">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <AiOutlineMail size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.email || formValues.email ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.email || formValues.email ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.email || formValues.email ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.email || formValues.email ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.email || formValues.email ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Email Address
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="email"
                                                                value={formValues.email || ""}
                                                                onChange={(e) => handleChange("email", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, email: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, email: false }))}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {errors.email && <span>{errors.email}</span>}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="website">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <CgWebsite size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.website || formValues.website ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.website || formValues.website ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.website || formValues.website ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.website || formValues.website ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.website || formValues.website ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Website
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="website"
                                                                value={formValues.website || ""}
                                                                onChange={(e) => handleChange("website", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, website: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, website: false }))}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {errors.website && <span>{errors.website}</span>}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className='mt-4'>
                                                <Col md={4}>
                                                    <Form.Group controlId="fssai">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <div className="channelIcon">
                                                                    <img src="src/assets/icons/FSSAI.svg" alt="" />
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`label ${focus.fssai || formValues.fssai ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.fssai || formValues.fssai ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.fssai || formValues.fssai ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.fssai || formValues.fssai ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.fssai || formValues.fssai ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Fssai
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="fssai"
                                                                value={formValues.fssai || ""}
                                                                onChange={(e) => handleChange("fssai", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, fssai: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, fssai: false }))}
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {errors.fssai && <span>{errors.fssai}</span>}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="channelID">
                                                        <div className='configurationSelectWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <RiUserCommunityLine size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.channelID || formValues.channelID ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.channelID || formValues.channelID ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.channelID || formValues.channelID ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.channelID || formValues.channelID ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.channelID || formValues.channelID ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Select Channel
                                                            </div>
                                                            <Select
                                                                name="channelID"
                                                                placeholder=""
                                                                onFocus={() => setFocus(prev => ({ ...prev, channelID: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, channelID: false }))}
                                                                styles={{
                                                                    control: base => ({
                                                                        ...base,
                                                                        border: 'none',
                                                                        boxShadow: 'none',
                                                                        backgroundColor: 'none',
                                                                        height: '1rem',
                                                                        width: '20rem',
                                                                    }),
                                                                    placeholder: (base) => ({
                                                                        ...base,
                                                                        color: '#8c8c8c',
                                                                    }),
                                                                    singleValue: (base) => ({
                                                                        ...base,
                                                                        color: '#333',
                                                                    }),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="text-danger small">
                                                            {!formValues.channelID && errors.channelID}
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Group controlId="vatNo">
                                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                                            <div className='configurationIconWrapper'>
                                                                <HiOutlineDocumentCurrencyRupee size={18} />
                                                            </div>
                                                            <div
                                                                className={`label ${focus.vatNo || formValues.vatNo ? "floating" : ""}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: focus.vatNo || formValues.vatNo ? "-10px" : "50%",
                                                                    left: "40px",
                                                                    transform: focus.vatNo || formValues.vatNo ? "translateY(0)" : "translateY(-50%)",
                                                                    fontSize: focus.vatNo || formValues.vatNo ? "12px" : "14px",
                                                                    color: "#666",
                                                                    backgroundColor: "#fff",
                                                                    padding: focus.vatNo || formValues.vatNo ? "0 4px" : "0",
                                                                    transition: "all 0.2s ease",
                                                                    pointerEvents: "none",
                                                                }}
                                                            >
                                                                Enter Vat No.
                                                            </div>
                                                            <Form.Control
                                                                className='configurationInput'
                                                                type="text"
                                                                name="vatNo"
                                                                value={formValues.vatNo || ""}
                                                                onChange={(e) => handleChange("vatNo", e.target.value)}
                                                                onFocus={() => setFocus(prev => ({ ...prev, vatNo: true }))}
                                                                onBlur={() => setFocus(prev => ({ ...prev, vatNo: false }))}
                                                                autoComplete="off"
                                                                minLength={20}
                                                                maxLength={20}
                                                            />
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={2}>
                                            <div className='imageContainer'>
                                                <div className='itemImage d-flex align-items-center justify-content-center shadow-sm'>
                                                    <div className="">
                                                        <IoFastFoodOutline size={100} className='formIcon' />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="submitBtnWrapper d-flex justify-content-end bg-white">
                                    <div className='nextBtn d-flex align-items-center justify-content-center' onClick={handleSubmit}>
                                        {/* Next <div className='nextIcon'><TbPlayerTrackNext /></div> */}
                                        {formValues.itemSubGroupId ? "Update" : "Submit"}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ChannelForm;
