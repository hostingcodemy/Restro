import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useCategory } from '../../Context/CategoryContext';
import { useNavigate } from 'react-router-dom';
import api from '../../config/AxiosInterceptor';
import { FiType } from "react-icons/fi";
import { TbNumber } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineTableBar } from "react-icons/md";
import { SlDirections } from "react-icons/sl";
import { PiChairThin } from "react-icons/pi";
import { MdTableBar, MdOutlineTableRestaurant } from "react-icons/md";
import { PiPicnicTableBold } from "react-icons/pi";

const TableForm = () => {

    const nameRef = useRef(null);
    const fetchCalled = useRef(false);
    const navigate = useNavigate();
    const { setIsHiddenSidebarOpen } = useCategory();

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        tableName: "",
        capacity: "",
        outletId: "",
        tableStatus: "",
        direction: "",
        type: "",
        serial: "",
        tableShapes: "",
        openTable: false,
    }

    const tableStatusOptions = [
        { label: "Available", value: "Available" },
        { label: "Occupied", value: "Occupied" },
        { label: "Reserved", value: "Reserved" },
        { label: "Hold", value: "Hold" },
    ]

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const [outletData, setOutletData] = useState([]);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchOutletData();
    }, []);

    const fetchOutletData = async () => {
        try {
            const res = await api.get("/outlets", {

            });
            setOutletData(res?.data?.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

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
            tableName,
            capacity,
            outletId,
            tableStatus,
            direction,
            type,
            serial
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!tableName) {
            isValid = false;
            errors.tableName = "Table name is required.";
        }
        if (!capacity) {
            isValid = false;
            errors.capacity = "Pax is required";
        }
        if (!outletId) {
            isValid = false;
            errors.outletId = "Outlet is required";
        }
        if (!tableStatus) {
            isValid = false;
            errors.tableStatus = "Table status is required";
        }
        if (!direction) {
            isValid = false;
            errors.direction = "Direction is required";
        }
        if (!type) {
            isValid = false;
            errors.type = "Table type is required";
        }
        if (!serial) {
            isValid = false;
            errors.serial = "Serial no. is required";
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
            tableName: formValues.tableName,
            capacity: formValues.capacity,
            outletId: formValues.outletId,
            tableStatus: formValues.tableStatus,
            direction: formValues.direction,
            type: formValues.type,
            isActive: true,
            serial: formValues.serial,
            tableShapes: formValues.tableShapes,
            openTable: formValues.openTable
        };

        try {
            let res;
            if (formValues.tableId) {
                res = await api.put(`/tables/${formValues.tableId}`, payload, {

                });
            } else {
                res = await api.post("/tables", payload, {

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
                navigate("/tables");
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
                            <h2>Add <span>Table</span></h2>
                        </div>
                        <Form className='h-100' onSubmit={handleSubmit}>
                            <Row>
                                <Col md={10}>
                                    <Row className="g-3">
                                        <Col md={4}>
                                            <Form.Group controlId="tableName">
                                                <div className='configurationInputFieldWrapperMain shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <FiType size={18} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.tableName || formValues.tableName ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.tableName || formValues.tableName ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.tableName || formValues.tableName ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.tableName || formValues.tableName ? "12px" : "14px",
                                                            color: "orange",
                                                            backgroundColor: "#fff",
                                                            padding: focus.tableName || formValues.tableName ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Table Name
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="tableName"
                                                        ref={nameRef}
                                                        value={formValues.tableName || ""}
                                                        onChange={(e) => handleChange("tableName", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, tableName: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, tableName: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.tableName && errors.tableName}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="capacity">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <TbNumber size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.capacity || formValues.capacity ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.capacity || formValues.capacity ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.capacity || formValues.capacity ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.capacity || formValues.capacity ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.capacity || formValues.capacity ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Pax
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="capacity"
                                                        value={formValues.capacity || ""}
                                                        onChange={(e) => handleChange("capacity", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, capacity: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, capacity: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.capacity && errors.capacity}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="tableLocation">
                                                <div className='configurationSelectWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <CiLocationOn size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.outletId || formValues.outletId ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.outletId || formValues.outletId ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.outletId || formValues.outletId ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.outletId || formValues.outletId ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.outletId || formValues.outletId ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Select Outlet
                                                    </div>
                                                    <Select
                                                        name="outletId"
                                                        placeholder=''
                                                        value={formValues.outletId ? outletData.find((item) => item.value === formValues.outletId) : null}
                                                        onChange={(selectedOption) => handleChange("outletId", selectedOption?.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, outletId: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, outletId: false }))}
                                                        options={outletData?.filter(item => item.isActive)
                                                            .map(item => ({
                                                                label: item.outletName,
                                                                value: item.outletID
                                                            }))
                                                        }
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
                                                    {!formValues.outletId && errors.outletId}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-4">
                                        <Col md={4}>
                                            <Form.Group controlId="tableStatus">
                                                <div className='configurationSelectWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <MdOutlineTableBar size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.tableStatus || formValues.tableStatus ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.tableStatus || formValues.tableStatus ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.tableStatus || formValues.tableStatus ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.tableStatus || formValues.tableStatus ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.tableStatus || formValues.tableStatus ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Select Status
                                                    </div>
                                                    <Select
                                                        name="tableStatus"
                                                        placeholder=''
                                                        value={tableStatusOptions.find(option => option.value === formValues.tableStatus) || null}
                                                        onChange={(selectedOption) => handleChange("tableStatus", selectedOption ? selectedOption.value : "")}
                                                        onFocus={() => setFocus(prev => ({ ...prev, tableStatus: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, tableStatus: false }))}
                                                        options={tableStatusOptions}
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
                                                    {!formValues.tableStatus && errors.tableStatus}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="direction">
                                                <div className='configurationInputFieldWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <SlDirections size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.direction || formValues.direction ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.direction || formValues.direction ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.direction || formValues.direction ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.direction || formValues.direction ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.direction || formValues.direction ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Table Direction
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="direction"
                                                        value={formValues.direction || ""}
                                                        onChange={(e) => handleChange("direction", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, direction: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, direction: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.direction && errors.direction}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="type">
                                                <div className='configurationSelectWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <PiChairThin size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.type || formValues.type ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.type || formValues.type ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.type || formValues.type ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.type || formValues.type ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.type || formValues.type ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Table Type
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="type"
                                                        value={formValues.type || ""}
                                                        onChange={(e) => handleChange("type", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, type: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, type: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.type && errors.type}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col md={4}>
                                            <Form.Group controlId="serial">
                                                <div className='configurationSelectWrapper shadow-sm'>
                                                    <div className='configurationIconWrapper'>
                                                        <PiChairThin size={20} />
                                                    </div>
                                                    <div
                                                        className={`label ${focus.serial || formValues.serial ? "floating" : ""}`}
                                                        style={{
                                                            position: "absolute",
                                                            top: focus.serial || formValues.serial ? "-10px" : "50%",
                                                            left: "40px",
                                                            transform: focus.serial || formValues.serial ? "translateY(0)" : "translateY(-50%)",
                                                            fontSize: focus.serial || formValues.serial ? "12px" : "14px",
                                                            color: "#666",
                                                            backgroundColor: "#fff",
                                                            padding: focus.serial || formValues.serial ? "0 4px" : "0",
                                                            transition: "all 0.2s ease",
                                                            pointerEvents: "none",
                                                        }}
                                                    >
                                                        Enter Serial No.
                                                    </div>
                                                    <Form.Control
                                                        className='configurationInput'
                                                        type="text"
                                                        name="serial"
                                                        value={formValues.serial || ""}
                                                        onChange={(e) => handleChange("serial", e.target.value)}
                                                        onFocus={() => setFocus(prev => ({ ...prev, serial: true }))}
                                                        onBlur={() => setFocus(prev => ({ ...prev, serial: false }))}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                                <div className="text-danger small">
                                                    {!formValues.serial && errors.serial}
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className='mt-2'>
                                            <div className="custom-switch">
                                                <input
                                                    type="checkbox"
                                                    id="openTable"
                                                    name="openTable"
                                                    className="custom-switch-input"
                                                />
                                                <label htmlFor="openTable" className="custom-switch-label">
                                                    <span className="custom-switch-button"></span>
                                                </label>
                                                Open Table
                                            </div>

                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col md={4}>
                                            <div>Table Shape</div>
                                            <div className="d-flex gap-4 mt-2 align-items-center">
                                                <div
                                                    className={`table-icon ${formValues.tableShapes === "Bar Table" ? "selected" : ""}`}
                                                    title="Bar Table"
                                                    onClick={() => setFormValues({ ...formValues, tableShapes: "Bar Table" })}
                                                >
                                                    <MdTableBar size={30} />
                                                </div>
                                                <div
                                                    className={`table-icon with-separator ${formValues.tableShapes === "Restaurant Table" ? "selected" : ""}`}
                                                    title="Restaurant Table"
                                                    onClick={() => setFormValues({ ...formValues, tableShapes: "Restaurant Table" })}
                                                >
                                                    <MdOutlineTableRestaurant size={30} />
                                                </div>
                                                <div
                                                    className={`table-icon with-separator ${formValues.tableShapes === "Square Table" ? "selected" : ""}`}
                                                    title="Square Table"
                                                    onClick={() => setFormValues({ ...formValues, tableShapes: "Square Table" })}
                                                >
                                                    <PiPicnicTableBold size={30} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={2}>
                                    <div className='imageContainer'>
                                        <div className='itemImage d-flex align-items-center justify-content-center shadow-sm'>
                                            <div className="">
                                                <MdOutlineTableBar size={100} className='formIcon' />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="submitBtnWrapper d-flex justify-content-end bg-white">
                                <div className='nextBtn d-flex align-items-center justify-content-center' onClick={handleSubmit} >
                                    Submit
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TableForm;
