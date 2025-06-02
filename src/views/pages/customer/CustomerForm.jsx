import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuBar from '../../Components/MenuBar';
import { useCategory } from '../../Context/CategoryContext';
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../config/AxiosInterceptor';
import Select from "react-select";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FaObjectUngroup } from "react-icons/fa6";
import { CiPhone } from "react-icons/ci";
import { MdOutlineMail } from "react-icons/md";
import { CiMobile3 } from "react-icons/ci";
import { BsGenderAmbiguous } from "react-icons/bs";
import { BsPersonVcard } from "react-icons/bs";
import { BsPersonGear } from "react-icons/bs";
import { MdOutlineBloodtype } from "react-icons/md";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { TbCalendarTime } from "react-icons/tb";
import { HiOutlineLanguage } from "react-icons/hi2";
import { CiPassport1 } from "react-icons/ci";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { TiGroupOutline } from "react-icons/ti";
import { BsPersonCheck } from "react-icons/bs";
import { VscPersonAdd } from "react-icons/vsc";
import { RiOpenSourceLine } from "react-icons/ri";

const CustomerForm = () => {

    const navigate = useNavigate();
    const fetchCalled = useRef(false);
    const { setIsHiddenSidebarOpen } = useCategory();
    useEffect(() => {
        setIsHiddenSidebarOpen(true);
    }, []);

    const initialValues = {
        customerTypeId: "",
        firstName: "",
        lastName: "",
        designation: "",
        occupation: "",
        gender: "",
        religion: "",
        bloodGroup: "",
        dateOfBirth: "",
        dateOfAdmission: "",
        phone: "",
        emailAddress: "",
        mobile: "",
        citizenshipStatus: "",
        motherTongue: "",
        passportNumber: "",
        mailingAddress: "",
        billingAddress: "",
        accountCode: "",
        discountAllowed: "",
        status: "",
        approvedBy: "",
        authorisedBy: "",
        pan: "",
        customerSource: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);

    const genderOption = [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
        { label: "Other", value: "O" }
    ]

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
            firstName,
            lastName,
            gender,
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!firstName) {
            isValid = false;
            errors.firstName = "First name is required.";
        }
        if (!lastName) {
            isValid = false;
            errors.lastName = "Last name is required";
        }
        if (!gender) {
            isValid = false;
            errors.gender = "Gender is required";
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
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            designation: formValues.designation,
            occupation: formValues.occupation,
            gender: formValues.gender,
            religion: formValues.religion,
            bloodGroup: formValues.bloodGroup,
            dateOfBirth: formValues.dateOfBirth,
            dateOfAdmission: formValues.dateOfAdmission,
            phone: formValues.phone,
            emailAddress: formValues.emailAddress,
            mobile: formValues.mobile,
            citizenshipStatus: formValues.citizenshipStatus,
            motherTongue: formValues.motherTongue,
            passportNumber: formValues.passportNumber,
            mailingAddress: formValues.mailingAddress,
            accountCode: formValues.accountCode,
            discountAllowed: formValues.discountAllowed,
            status: formValues.status,
            approvedBy: formValues.approvedBy,
            authorisedBy: formValues.authorisedBy,
            pan: formValues.pan,
            customerSource: formValues.customerSource,
            isActive: true
        };

        try {
            let res;
            if (formValues.customerID) {
                res = await api.put(`/customers/${formValues.customerID}`, payload);
            } else {
                res = await api.post("/customers", payload);
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
                navigate("/customers");
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
                            <h2>Add <span>Customer</span></h2>
                        </div>
                        <Form className='h-100'>
                            <div className='formWrapper d-flex flex-column justify-content-between h-100 w-100'>
                                <Row className="g-3">
                                    <Col md={3}>
                                        <Form.Group controlId="firstName">
                                            <div className='configurationInputFieldWrapperMain shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineGroupAdd size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.firstName || formValues.firstName ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.firstName || formValues.firstName ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.firstName || formValues.firstName ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.firstName || formValues.firstName ? "12px" : "14px",
                                                        color: "orange",
                                                        backgroundColor: "#fff",
                                                        padding: focus.firstName || formValues.firstName ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter First Name
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="firstName"
                                                    value={formValues.firstName || ""}
                                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, firstName: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, firstName: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.firstName && errors.firstName}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="lastName">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineGroupAdd size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.lastName || formValues.lastName ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.lastName || formValues.lastName ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.lastName || formValues.lastName ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.lastName || formValues.lastName ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.lastName || formValues.lastName ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Last Name
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="lastName"
                                                    value={formValues.lastName || ""}
                                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, lastName: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, lastName: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.lastName && errors.lastName}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="phone">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <CiPhone
                                                        size={18} />
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
                                                    Enter Phone Number
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="phone"
                                                    value={formValues.phone || ""}
                                                    onChange={(e) => {
                                                        if (/^\d*$/.test(e.target.value)) handleChange("phone", e.target.value);
                                                    }}
                                                    onFocus={() => setFocus(prev => ({ ...prev, phone: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, phone: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.phone && errors.phone}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="emailAddress">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineMail size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.emailAddress || formValues.emailAddress ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.emailAddress || formValues.emailAddress ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.emailAddress || formValues.emailAddress ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.emailAddress || formValues.emailAddress ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.emailAddress || formValues.emailAddress ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Email Address
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="emailAddress"
                                                    value={formValues.emailAddress || ""}
                                                    onChange={(e) => {
                                                        if (/^\d*$/.test(e.target.value)) handleChange("emailAddress", e.target.value);
                                                    }}
                                                    onFocus={() => setFocus(prev => ({ ...prev, emailAddress: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, emailAddress: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.emailAddress && errors.emailAddress}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={3}>
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
                                                        if (/^\d*$/.test(e.target.value)) handleChange("mobile", e.target.value);
                                                    }}
                                                    onFocus={() => setFocus(prev => ({ ...prev, mobile: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, mobile: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.mobile && errors.mobile}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="gender">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <BsGenderAmbiguous size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.gender || formValues.gender ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.gender || formValues.gender ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.gender || formValues.gender ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.gender || formValues.gender ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.gender || formValues.gender ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Gender
                                                </div>
                                                <Select
                                                    name="gender"
                                                    isSearchable={true}
                                                    placeholder=""
                                                    value={formValues.gender ? genderOption.find((item) => item.value === formValues.gender) : null}
                                                    onChange={(selectedOption) => handleChange("gender", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, gender: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, gender: false }))}
                                                    options={genderOption.map(item => ({
                                                        label: item.label,
                                                        value: item.value
                                                    }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                                {!formValues.gender && errors.gender}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="designation">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <BsPersonVcard size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.designation || formValues.designation ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.designation || formValues.designation ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.designation || formValues.designation ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.designation || formValues.designation ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.designation || formValues.designation ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Designation
                                                </div>
                                                <Select
                                                    name="designation"
                                                    isSearchable={true}
                                                    placeholder=""
                                                    // value={formValues.designation ? itemTypesData.find((item) => item.value === formValues.designation) : null}
                                                    onChange={(selectedOption) => handleChange("designation", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, designation: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, designation: false }))}
                                                    // options={itemTypesData.map(item => ({
                                                    //     label: item.itemTypeName,
                                                    //     value: item.itemTypeId
                                                    // }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                                {!formValues.designation && errors.designation}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="occupation">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <BsPersonGear size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.occupation || formValues.occupation ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.occupation || formValues.occupation ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.occupation || formValues.occupation ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.occupation || formValues.occupation ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.occupation || formValues.occupation ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Occupation
                                                </div>
                                                <Select
                                                    name="occupation"
                                                    isSearchable={true}
                                                    placeholder=""
                                                    onChange={(selectedOption) => handleChange("occupation", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, occupation: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, occupation: false }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                                {!formValues.occupation && errors.occupation}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={3}>
                                        <Form.Group controlId="religion">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <FaObjectUngroup size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.religion || formValues.religion ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.religion || formValues.religion ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.religion || formValues.religion ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.religion || formValues.religion ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.religion || formValues.religion ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Religion
                                                </div>
                                                <Select
                                                    name="religion"
                                                    isSearchable={true}
                                                    placeholder=""
                                                    onChange={(selectedOption) => handleChange("religion", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, religion: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, religion: false }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                                {!formValues.religion && errors.religion}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="bloodGroup">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineBloodtype size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.bloodGroup || formValues.bloodGroup ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.bloodGroup || formValues.bloodGroup ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.bloodGroup || formValues.bloodGroup ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.bloodGroup || formValues.bloodGroup ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.bloodGroup || formValues.bloodGroup ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Blood Group
                                                </div>
                                                <Select
                                                    name="bloodGroup"
                                                    isSearchable={true}
                                                    placeholder=""
                                                    onChange={(selectedOption) => handleChange("bloodGroup", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, bloodGroup: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, bloodGroup: false }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                                {!formValues.bloodGroup && errors.bloodGroup}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="dateOfBirth">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <HiOutlineCalendarDateRange size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.dateOfBirth || formValues.dateOfBirth ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.dateOfBirth || formValues.dateOfBirth ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.dateOfBirth || formValues.dateOfBirth ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.dateOfBirth || formValues.dateOfBirth ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.dateOfBirth || formValues.dateOfBirth ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter DOB
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formValues.dateOfBirth || ""}
                                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, dateOfBirth: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, dateOfBirth: false }))}
                                                    autoComplete="off"
                                                    placeholder=''
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.dateOfBirth && errors.dateOfBirth}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="dateOfAdmission">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <TbCalendarTime size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.dateOfAdmission || formValues.dateOfAdmission ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.dateOfAdmission || formValues.dateOfAdmission ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.dateOfAdmission || formValues.dateOfAdmission ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.dateOfAdmission || formValues.dateOfAdmission ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.dateOfAdmission || formValues.dateOfAdmission ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Date of Admission
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="date"
                                                    name="dateOfAdmission"
                                                    value={formValues.dateOfAdmission || ""}
                                                    onChange={(e) => handleChange("dateOfAdmission", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, dateOfAdmission: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, dateOfAdmission: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.dateOfAdmission && errors.dateOfAdmission}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={3}>
                                        <Form.Group controlId="citizenshipStatus">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <FaObjectUngroup size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.citizenshipStatus || formValues.citizenshipStatus ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.citizenshipStatus || formValues.citizenshipStatus ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.citizenshipStatus || formValues.citizenshipStatus ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.citizenshipStatus || formValues.citizenshipStatus ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.citizenshipStatus || formValues.citizenshipStatus ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Citizenship
                                                </div>
                                                <Select
                                                    name="citizenshipStatus"
                                                    isSearchable={true}
                                                    onChange={(selectedOption) => handleChange("citizenshipStatus", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, citizenshipStatus: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, citizenshipStatus: false }))}
                                                    placeholder=""
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="motherTongue">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <HiOutlineLanguage size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.motherTongue || formValues.motherTongue ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.motherTongue || formValues.motherTongue ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.motherTongue || formValues.motherTongue ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.motherTongue || formValues.motherTongue ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.motherTongue || formValues.motherTongue ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Mother Tongue
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="motherTongue"
                                                    value={formValues.motherTongue || ""}
                                                    onChange={(e) => handleChange("motherTongue", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, motherTongue: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, motherTongue: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small">
                                                {!formValues.motherTongue && errors.motherTongue}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="passportNumber">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <CiPassport1 size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.passportNumber || formValues.passportNumber ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.passportNumber || formValues.passportNumber ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.passportNumber || formValues.passportNumber ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.passportNumber || formValues.passportNumber ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.passportNumber || formValues.passportNumber ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Passport No.
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="passportNumber"
                                                    value={formValues.passportNumber || ""}
                                                    onChange={(e) => handleChange("passportNumber", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, passportNumber: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, passportNumber: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="mailingAddress">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineGroupAdd size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.mailingAddress || formValues.mailingAddress ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.mailingAddress || formValues.mailingAddress ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.mailingAddress || formValues.mailingAddress ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.mailingAddress || formValues.mailingAddress ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.mailingAddress || formValues.mailingAddress ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Mail Address
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="mailingAddress"
                                                    value={formValues.mailingAddress || ""}
                                                    onChange={(e) => handleChange("mailingAddress", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, mailingAddress: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, mailingAddress: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={3}>
                                        <Form.Group controlId="billingAddress">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineGroupAdd size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.billingAddress || formValues.billingAddress ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.billingAddress || formValues.billingAddress ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.billingAddress || formValues.billingAddress ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.billingAddress || formValues.billingAddress ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.billingAddress || formValues.billingAddress ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Billing Address
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    as="text"
                                                    name="billingAddress"
                                                    value={formValues.billingAddress || ""}
                                                    onChange={(e) => handleChange("billingAddress", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, billingAddress: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, billingAddress: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="accountCode">
                                            <div className='configurationInputFieldWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineAccountBalanceWallet size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.accountCode || formValues.accountCode ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.accountCode || formValues.accountCode ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.accountCode || formValues.accountCode ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.accountCode || formValues.accountCode ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.accountCode || formValues.accountCode ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Account Code
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="accountCode"
                                                    value={formValues.accountCode || ""}
                                                    onChange={(e) => handleChange("accountCode", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, accountCode: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, accountCode: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
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
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="discountAllowed">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <CiDiscount1 size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.discountAllowed || formValues.discountAllowed ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.discountAllowed || formValues.discountAllowed ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.discountAllowed || formValues.discountAllowed ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.discountAllowed || formValues.discountAllowed ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.discountAllowed || formValues.discountAllowed ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Discount
                                                </div>
                                                <Select
                                                    name="discountAllowed"
                                                    isSearchable={true}
                                                    onChange={(selectedOption) => handleChange("discountAllowed", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, discountAllowed: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, discountAllowed: false }))}
                                                    placeholder=""
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                                {!formValues.religion && errors.religion}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={3}>
                                        <Form.Group controlId="status">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <FaObjectUngroup size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.status || formValues.status ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.status || formValues.status ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.status || formValues.status ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.status || formValues.status ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.status || formValues.status ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Status
                                                </div>
                                                <Select
                                                    name="status"
                                                    isSearchable={true}
                                                    onChange={(selectedOption) => handleChange("status", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, status: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, status: false }))}
                                                    placeholder=""
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="customerTypeId">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <TiGroupOutline size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.customerTypeId || formValues.customerTypeId ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.customerTypeId || formValues.customerTypeId ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.customerTypeId || formValues.customerTypeId ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.customerTypeId || formValues.customerTypeId ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.customerTypeId || formValues.customerTypeId ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Customer Type
                                                </div>
                                                <Select
                                                    name="customerTypeId"
                                                    isSearchable={true}
                                                    // value={formValues.customerTypeId ? itemTypesData.find((item) => item.value === formValues.customerTypeId) : null}
                                                    onChange={(selectedOption) => handleChange("customerTypeId", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, customerTypeId: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, customerTypeId: false }))}
                                                    placeholder=""
                                                    // options={itemTypesData.map(item => ({
                                                    //     label: item.itemTypeName,
                                                    //     value: item.itemTypeId
                                                    // }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="approvedBy">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <BsPersonCheck size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.approvedBy || formValues.approvedBy ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.approvedBy || formValues.approvedBy ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.approvedBy || formValues.approvedBy ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.approvedBy || formValues.approvedBy ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.approvedBy || formValues.approvedBy ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Approved By
                                                </div>
                                                <Select
                                                    name="approvedBy"
                                                    isSearchable={true}
                                                    // value={formValues.approvedBy ? itemTypesData.find((item) => item.value === formValues.approvedBy) : null}
                                                    onChange={(selectedOption) => handleChange("approvedBy", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, approvedBy: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, approvedBy: false }))}
                                                    placeholder=""
                                                    // options={itemTypesData.map(item => ({
                                                    //     label: item.itemTypeName,
                                                    //     value: item.itemTypeId
                                                    // }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group controlId="authorisedBy">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <VscPersonAdd size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.authorisedBy || formValues.authorisedBy ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.authorisedBy || formValues.authorisedBy ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.authorisedBy || formValues.authorisedBy ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.authorisedBy || formValues.authorisedBy ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.authorisedBy || formValues.authorisedBy ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Authorised By
                                                </div>
                                                <Select
                                                    name="authorisedBy"
                                                    isSearchable={true}
                                                    // value={formValues.authorisedBy ? itemTypesData.find((item) => item.value === formValues.authorisedBy) : null}
                                                    onChange={(selectedOption) => handleChange("authorisedBy", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, authorisedBy: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, authorisedBy: false }))}
                                                    placeholder=""
                                                    // options={itemTypesData.map(item => ({
                                                    //     label: item.itemTypeName,
                                                    //     value: item.itemTypeId
                                                    // }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={3}>
                                        <Form.Group controlId="customerSource">
                                            <div className='configurationSelectWrapper shadow-sm'>
                                                <div className='configurationIconWrapper'>
                                                    <RiOpenSourceLine size={18} />
                                                </div>
                                                <div
                                                    className={`label ${focus.customerSource || formValues.customerSource ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.customerSource || formValues.customerSource ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.customerSource || formValues.customerSource ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.customerSource || formValues.customerSource ? "12px" : "14px",
                                                        color: "#666",
                                                        backgroundColor: "#fff",
                                                        padding: focus.customerSource || formValues.customerSource ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Select Customer Source
                                                </div>
                                                <Select
                                                    name="customerSource"
                                                    isSearchable={true}
                                                    // value={formValues.customerSource ? itemTypesData.find((item) => item.value === formValues.customerSource) : null}
                                                    onChange={(selectedOption) => handleChange("customerSource", selectedOption.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, customerSource: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, customerSource: false }))}
                                                    placeholder=""
                                                    // options={itemTypesData.map(item => ({
                                                    //     label: item.itemTypeName,
                                                    //     value: item.itemTypeId
                                                    // }))}
                                                    styles={{
                                                        control: base => ({
                                                            ...base,
                                                            border: 'none',
                                                            boxShadow: 'none',
                                                            backgroundColor: 'none',
                                                            height: '1rem',
                                                            width: '17rem',
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
                                        </Form.Group>
                                    </Col>
                                </Row>
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
    )
}

export default CustomerForm