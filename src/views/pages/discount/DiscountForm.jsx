import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Row, Col } from "react-bootstrap";
import { MdOutlineDiscount } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../Context/CategoryContext';
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '../../config/AxiosInterceptor';
import axios from 'axios';

const DiscountForm = () => {

    const token = localStorage.getItem("accessToken");
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
        discountId: "",
        discountName: "",
        discountRate: "",
        discountStart: "",
        discountEnd: "",
        prefix: "",
        onGrossOrNet: "",
        discountOn: "",
    };

    const discountOption = [
        { label: "Amount", value: "A" },
        { label: "Percentage", value: "P" }
    ];

    const prefixOption = [
        { label: "GENERAL DISCOUNT", value: "GNRL" },
        { label: "ANNIVERSERY AND BDAY DISCOUNT", value: "BANI" },
        { label: "SPECIAL DISCOUNT FOR A PERIOD", value: "SPLP" },
    ];

    const grossOption = [
        { label: "With Gross", value: "G" },
        { label: "Without Gross", value: "N" }
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
            discountName,
            discountRate,
            discountStart,
            discountEnd,
            prefix,
            onGrossOrNet,
            discountOn
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!discountName) {
            isValid = false;
            errors.discountName = "Discount name is required.";
        }
        if (!discountRate) {
            isValid = false;
            errors.discountRate = "Discount rate is required";
        }
        if (!discountStart) {
            isValid = false;
            errors.discountStart = "Start date & time is required";
        }
        if (!discountEnd) {
            isValid = false;
            errors.discountEnd = "End date & time is required";
        }
        if (!prefix) {
            isValid = false;
            errors.prefix = "Prefix is required";
        }
        if (!onGrossOrNet) {
            isValid = false;
            errors.onGrossOrNet = "Gross or Net is required";
        }
        if (!discountOn) {
            isValid = false;
            errors.discountOn = "Discount type is required";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const discountStart = new Date(formValues.discountStart);
        const discountEnd = new Date(formValues.discountEnd);

        const discountStartUTC = discountStart.toISOString();
        const discountEndUTC = discountEnd.toISOString();

        const payload = {
            discountName: formValues.discountName,
            discountRate: formValues.discountRate,
            discountStart: discountStartUTC,
            discountEnd: discountEndUTC,
            prefix: formValues.prefix,
            onGrossOrNet: formValues.onGrossOrNet,
            isActive: true
        };

        try {
            let res;
            if (formValues.discountId) {
                res = await api.put(`/discount/${formValues.discountId}`, payload);
            } else {
                res = await axios.post("http://192.168.0.110:5000/api/v1/discount", payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
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
                navigate("/discounts");
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

                <div className="configurationFormContainer">
                    <div className='configurationCenterFormWrapper'>
                        <div className='configurationgroupFormHeader'>
                            <h2>Add <span>Discount</span></h2>
                        </div>
                        <Form className=''>
                            <Row className="g-3">
                                <Col md={3}>
                                    <Form.Group controlId="discountName">
                                        <div className='configurationInputFieldWrapperMain shadow-sm'>
                                            <div className='configurationIconWrapper'>
                                                <MdOutlineDiscount size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.discountName || formValues.discountName ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.discountName || formValues.discountName ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.discountName || formValues.discountName ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.discountName || formValues.discountName ? "12px" : "14px",
                                                    color: "orange",
                                                    backgroundColor: "#fff",
                                                    padding: focus.discountName || formValues.discountName ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Enter Discount Name
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="discountName"
                                                ref={nameRef}
                                                value={formValues.discountName || ""}
                                                onChange={(e) => handleChange("discountName", e.target.value)}
                                                onFocus={() => setFocus(prev => ({ ...prev, discountName: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, discountName: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.discountName && errors.discountName}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="discountRate">
                                        <div className='configurationInputFieldWrapper '>
                                            <div className='groupInputIconWrapper'>
                                                <CiDiscount1 size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.discountRate || formValues.discountRate ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.discountRate || formValues.discountRate ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.discountRate || formValues.discountRate ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.discountRate || formValues.discountRate ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.discountRate || formValues.discountRate ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Enter Discount Rate
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="discountRate"
                                                value={formValues.discountRate || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("discountRate", e.target.value);
                                                    }
                                                }}
                                                onFocus={() => setFocus(prev => ({ ...prev, discountRate: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, discountRate: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.discountRate && errors.discountRate}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="discountStart">
                                        <div className='configurationInputFieldWrapper'>
                                            <div className='groupInputIconWrapper'>
                                                <CiClock1 size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.discountStart || formValues.discountStart ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.discountStart || formValues.discountStart ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.discountStart || formValues.discountStart ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.discountStart || formValues.discountStart ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus || formValues.discountStart ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Enter Start Date & Time
                                            </div>
                                            <DatePicker
                                                className='configurationInput'
                                                selected={formValues.discountStart ? new Date(formValues.discountStart) : null}
                                                onChange={(date) => handleChange("discountStart", date)}
                                                onFocus={() => setFocus(prev => ({ ...prev, discountStart: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, discountStart: false }))}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.discountStart && errors.discountStart}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="discountEnd">
                                        <div className='configurationInputFieldWrapper'>
                                            <div className='groupInputIconWrapper'>
                                                <CiClock1 size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.discountEnd || formValues.discountEnd ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.discountEnd || formValues.discountEnd ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.discountEnd || formValues.discountEnd ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.discountEnd || formValues.discountEnd ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.discountEnd || formValues.discountEnd ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Enter End Date & Time
                                            </div>
                                            <DatePicker
                                                className='configurationInput'
                                                selected={formValues.discountEnd ? new Date(formValues.discountEnd) : null}
                                                onChange={(date) => handleChange("discountEnd", date)}
                                                onFocus={() => setFocus(prev => ({ ...prev, discountEnd: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, discountEnd: false }))}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                minDate={formValues.discountStart ? new Date(formValues.discountStart) : new Date()}
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.discountEnd && errors.discountEnd}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={3}>
                                    <Form.Group controlId="prefix">
                                        <div className='configurationSelectWrapper shadow-sm'>
                                            <div className='configurationIconWrapper'>
                                                <HiOutlineRectangleGroup size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.prefix || formValues.prefix ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.prefix || formValues.prefix ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.prefix || formValues.prefix ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.prefix || formValues.prefix ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.prefix || formValues.prefix ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Select Prefix
                                            </div>
                                            <Select
                                                name="prefix"
                                                isSearchable={true}
                                                placeholder=""
                                                value={formValues.prefix ? prefixOption?.find((item) => item.value === formValues.prefix) : null}
                                                onChange={(selectedOption) => handleChange("prefix", selectedOption.value)}
                                                onFocus={() => setFocus(prev => ({ ...prev, prefix: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, prefix: false }))}
                                                options={prefixOption?.map(item => ({
                                                    label: item.label,
                                                    value: item.value
                                                }))}
                                                styles={{
                                                    control: base => ({
                                                        ...base,
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        backgroundColor: 'transparent',
                                                        height: '1.5rem',
                                                        width: '15rem',
                                                        fontSize: '14px',
                                                    }),
                                                    placeholder: base => ({
                                                        ...base,
                                                        color: '#8c8c8c',
                                                    }),
                                                    singleValue: base => ({
                                                        ...base,
                                                        color: '#333',
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.prefix && errors.prefix}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="discountOn">
                                        <div className='configurationSelectWrapper shadow-sm'>
                                            <div className='configurationIconWrapper'>
                                                <CiDiscount1 size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.discountOn || formValues.discountOn ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.discountOn || formValues.discountOn ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.discountOn || formValues.discountOn ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.discountOn || formValues.discountOn ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.discountOn || formValues.discountOn ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Select Discount Type
                                            </div>
                                            <Select
                                                name="discountOn"
                                                isSearchable={true}
                                                placeholder=""
                                                value={formValues.discountOn ? discountOption?.find((item) => item.value === formValues.discountOn) : null}
                                                onChange={(selectedOption) => handleChange("discountOn", selectedOption.value)}
                                                onFocus={() => setFocus(prev => ({ ...prev, discountOn: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, discountOn: false }))}
                                                options={discountOption?.map(item => ({
                                                    label: item.label,
                                                    value: item.value
                                                }))}
                                                styles={{
                                                    control: base => ({
                                                        ...base,
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        backgroundColor: 'transparent',
                                                        height: '1.5rem',
                                                        width: '15rem',
                                                    }),
                                                    placeholder: base => ({
                                                        ...base,
                                                        color: '#8c8c8c',
                                                    }),
                                                    singleValue: base => ({
                                                        ...base,
                                                        color: '#333',
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.discountOn && errors.discountOn}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="onGrossOrNet">
                                        <div className='configurationSelectWrapper shadow-sm'>
                                            <div className='configurationIconWrapper'>
                                                <CiDiscount1 size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.onGrossOrNet || formValues.onGrossOrNet ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.onGrossOrNet || formValues.onGrossOrNet ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.onGrossOrNet || formValues.onGrossOrNet ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.onGrossOrNet || formValues.onGrossOrNet ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.onGrossOrNet || formValues.onGrossOrNet ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Select Gross / Net
                                            </div>
                                            <Select
                                                name="onGrossOrNet"
                                                isSearchable={true}
                                                placeholder=""
                                                value={formValues.onGrossOrNet ? grossOption?.find((item) => item.value === formValues.onGrossOrNet) : null}
                                                onChange={(selectedOption) => handleChange("onGrossOrNet", selectedOption.value)}
                                                onFocus={() => setFocus(prev => ({ ...prev, onGrossOrNet: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, onGrossOrNet: false }))}
                                                options={grossOption?.map(item => ({
                                                    label: item.label,
                                                    value: item.value
                                                }))}
                                                styles={{
                                                    control: base => ({
                                                        ...base,
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                        backgroundColor: 'transparent',
                                                        height: '1.5rem',
                                                        width: '15rem',
                                                    }),
                                                    placeholder: base => ({
                                                        ...base,
                                                        color: '#8c8c8c',
                                                    }),
                                                    singleValue: base => ({
                                                        ...base,
                                                        color: '#333',
                                                    }),
                                                }}
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.onGrossOrNet && errors.onGrossOrNet}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="submitBtnWrapper d-flex justify-content-center w-100">
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

export default DiscountForm
