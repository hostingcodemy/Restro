import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
//import api from '../../config/AxiosInterceptor';
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

    const items = [
        { label: "PRIMARY", style: { top: '10%', left: '30%' } },
        { label: "FAMILY", style: { top: '30%', left: '15%' } },
        { label: "ADDRESS", style: { top: '60%', left: '28%' } },
        { label: "DOCS", style: { top: '72%', left: '45%' } },
        { label: "OTHERS", style: { top: '60%', right: '28%' } },
        { label: "MEMBERS", style: { top: '30%', right: '15%' } },
        { label: "BUSINESS", style: { top: '10%', right: '30%' } },
    ];

    const containerStyle = {
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
    };

    const nodeStyle = {
        position: 'absolute',
        textAlign: 'center',
    };

    const circleStyle = {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        backgroundColor: '#f5c518',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #000',
        fontWeight: 'bold',
        color: '#000',
    };

    const centerNodeStyle = {
        position: 'absolute',
        top: '40%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
    };

    const centerCircleStyle = {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#eee',
        border: '3px solid #000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '10px',
    };

    const startButtonStyle = {
        position: 'absolute',
        bottom: '5%',
        left: '45%',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#000',
        cursor: 'pointer',
    };


    const navigate = useNavigate();
    const fetchCalled = useRef(false);

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
            <div style={containerStyle}>
                {items.map((item, index) => (
                    <div key={index} style={{ ...nodeStyle, ...item.style }}>
                        <div style={circleStyle}>{item.label}</div>
                    </div>
                ))}

                <div style={centerNodeStyle}>
                    <div style={centerCircleStyle}>SOUMITRA DAS</div>
                </div>

                <div style={startButtonStyle}>GET STARTED &gt;</div>
            </div>
        </>
    )
}

export default CustomerForm