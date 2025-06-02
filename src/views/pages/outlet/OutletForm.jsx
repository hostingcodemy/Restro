import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useCategory } from '../../Context/CategoryContext';
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import { CiMail } from "react-icons/ci";
import { CiTimer } from "react-icons/ci";
import { IoIosBarcode } from "react-icons/io";
import { LuPhone } from "react-icons/lu";
import { CiMobile3 } from "react-icons/ci";
import { IoRestaurantOutline } from "react-icons/io5";
import { IoCodeWorkingOutline } from "react-icons/io5";
import { FiType } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { PiChefHatThin } from "react-icons/pi";



const OutletForm = () => {

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
        outletName: "",
        outletCode: "",
        outletType: "",
        hsnCode: "",
        channelID: "",
        phone: "",
        mobile: "",
        email: "",
    }

    const typeOptions = [
        { label: "Restaurant", value: "Restaurant" },
        { label: "Room", value: "Room" },
        { label: "Bar", value: "Bar" },
        { label: "Cafe", value: "Cafe" },
        { label: "Banquet", value: "Banquet" },
        { label: "Lounge", value: "Lounge" },
        { label: "Club", value: "Club" },
        { label: "Spa", value: "Spa" },
        { label: "Gym", value: "Gym" },
        { label: "Retail", value: "Retail" },
        { label: "SwimPool ", value: "SwimPool " }
    ];

    const cuisineTypeOptions = [
        { label: "Indian", value: "Indian" },
        { label: "Multi", value: "Multi" },
    ];

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
            outletName,
            outletCode,
            outletType,
            hsnCode,
            channelID,
            phone,
            mobile,
            email
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!outletName) {
            isValid = false;
            errors.outletName = "Outlet name is required.";
        }
        if (!outletCode) {
            isValid = false;
            errors.outletCode = "Code is required";
        }
        if (!outletType) {
            isValid = false;
            errors.outletType = "Type is required";
        }
        if (!hsnCode) {
            isValid = false;
            errors.hsnCode = "HSN code is required";
        }
        if (!channelID) {
            isValid = false;
            errors.channelID = "Channel is required";
        }
        if (!phone) {
            isValid = false;
            errors.phone = "Phone is required";
        }
        if (!mobile) {
            isValid = false;
            errors.mobile = "Mobile is required";
        }
        if (!email) {
            isValid = false;
            errors.email = "Email is required";
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
            outletName: formValues.outletName,
            outletCode: formValues.outletCode,
            outletType: formValues.outletType,
            hsnCode: formValues.hsnCode,
            channelID: "409967e4-2cf8-4bb3-989a-2bd2755ffce1",
        };

        try {
            let res;
            if (formValues.OutletId) {
                res = await api.put(`/outlets/${formValues.OutletId}`, payload, {

                });
            } else {
                res = await api.post("/outlets", payload, {

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
                navigate("/outlets");
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
                            <h2>Add <span>Outlet</span></h2>
                        </div>
                        <Form className='h-100'>
                            <Row>
                                <Col md={10}>
                                    <Row className="g-3">
                                        <Col md={4}>
                                            <Form.Group controlId="outletName">
                                                <div className='configurationInputFieldWrapperMain shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <IoRestaurantOutline size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.outletName || formValues.outletName ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.outletName || formValues.outletName ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.outletName || formValues.outletName ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.outletName || formValues.outletName ? "12px" : "14px",
                                                            color: "orange",
                                                            backgroundColor: "#fff",
                                                            padding: focus.outletName || formValues.outletName ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Outlet Name
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="outletName"
                                                        ref={nameRef}
                                                        value={formValues.outletName || ""}
                                                        onChange={(e) => handleChange("outletName", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, outletName: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, outletName: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.outletName && errors.outletName}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="outletCode">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <IoCodeWorkingOutline size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.outletCode || formValues.outletCode ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.outletCode || formValues.outletCode ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.outletCode || formValues.outletCode ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.outletCode || formValues.outletCode ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.outletCode || formValues.outletCode ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Outlet Code
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="outletCode"
                                                        value={formValues.outletCode || ""}
                                                        onChange={(e) => handleChange("outletCode", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, outletCode: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, outletCode: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.outletCode && errors.outletCode}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="outletType">
                                                <div className='configurationSelectWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <FiType size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.outletType || formValues.outletType ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.outletType || formValues.outletType ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.outletType || formValues.outletType ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.outletType || formValues.outletType ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.outletType || formValues.outletType ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Select Type
                                                    </div>
                                                    <Select
                                                        name="outletType"
                                                        isSearchable={true}
                                                        value={typeOptions.find(option => option.value === formValues.outletType) || null}
                                                        onChange={(selectedOption) => handleChange("outletType", selectedOption ? selectedOption.value : "")}
                                                        onFocus={() => setFocus(prev => ({ ...prev, outletType: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, outletType: false }))}
                                                        options={typeOptions}
                                                        placeholder=""
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
                                                    {!formValues.outletType && errors.outletType}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col md={4}>
                                            <Form.Group controlId="hsnCode">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <IoIosBarcode size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.hsnCode || formValues.hsnCode ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.hsnCode || formValues.hsnCode ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.hsnCode || formValues.hsnCode ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.hsnCode || formValues.hsnCode ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.hsnCode || formValues.hsnCode ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter HSN Code
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="hsnCode"
                                                        value={formValues.hsnCode || ""}
                                                        onChange={(e) => handleChange("hsnCode", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, hsnCode: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, hsnCode: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.hsnCode && errors.hsnCode}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="phone">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <LuPhone size={20} />
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
                                        <Col md={4}>
                                            <Form.Group controlId="mobile">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <CiMobile3 size={20} />
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
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col md={4}>
                                            <Form.Group controlId="email">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <CiMail size={20} />
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
                                            <Form.Group controlId="openingHours">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <CiTimer size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.openingHours || formValues.openingHours ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.openingHours || formValues.openingHours ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.openingHours || formValues.openingHours ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.openingHours || formValues.openingHours ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.openingHours || formValues.openingHours ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                       Select Time
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <Form.Control
                                                            className='configurationInput'
                                                            style={{ width: "5rem" }}
                                                            type="time"
                                                            name="startTime"
                                                            placeholder=''
                                                            value={formValues.startTime || ""}
                                                            onChange={(e) => handleChange("startTime", e.target.value)}
                                                            onFocus={() => setFocus(prev => ({ ...prev, startTime: true }))}
                                                            onBlur={() => setFocus(prev => ({ ...prev, startTime: false }))}
                                                        />
                                                        <span className="align-self-center">to</span>
                                                        <Form.Control
                                                            className='configurationInput'
                                                            style={{ width: "5rem" }}
                                                            type="time"
                                                            name="endTime"
                                                            value={formValues.endTime || ""}
                                                            onChange={(e) => handleChange("endTime", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="text-danger small">
                                                        {(errors.startTime || errors.endTime) && (
                                                            <span>
                                                                {errors.startTime && `${errors.startTime} `}
                                                                {errors.endTime && errors.endTime}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        {/* <Col md={4}>
                                            <Form.Group controlId="outletType">
                                                <div className='configurationSelectWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <PiChefHatThin size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.openingHours || formValues.openingHours ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.openingHours || formValues.openingHours ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.openingHours || formValues.openingHours ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.openingHours || formValues.openingHours ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.openingHours || formValues.openingHours ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                       Select 
                                                    </div>
                                                    <Select
                                                        name="outletType"
                                                        isSearchable={true}
                                                        value={typeOptions.find(option => option.value === formValues.outletType) || null}
                                                        onChange={(selectedOption) => handleChange("outletType", selectedOption ? selectedOption.value : "")}
                                                        options={typeOptions}
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
                                                    {!formValues.outletType && errors.outletType}
                                                </div>
                                            </Form.Group>
                                        </Col> */}
                                    </Row>
                                </Col>
                                <Col md={2}>
                                    <div className='imageContainer'>
                                        <div className='itemImage d-flex align-items-center justify-content-center'>
                                            {/* <FaRegBuilding size={100} /> */}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                        <div className="submitBtnWrapper d-flex justify-content-end bg-white">
                            <div className='nextBtn d-flex align-items-center justify-content-center' onClick={handleSubmit}>
                                {/* Next <div className='nextIcon'><TbPlayerTrackNext /></div> */}
                                Submit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OutletForm
