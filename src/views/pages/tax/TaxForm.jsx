import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategory } from '../../Context/CategoryContext';
import { Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../config/AxiosInterceptor';
import { MdOutlineGroupAdd } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { MdOutlinePriceCheck } from "react-icons/md";

const TaxForm = () => {

    const navigate = useNavigate();
    const taxNameRef = useRef(null);
    const { setIsHiddenSidebarOpen } = useCategory();

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
    }, []);

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
        if (taxNameRef.current) {
            taxNameRef.current.focus();
        }
    }, []);

    const initialValues = {
        taxName: "",
        taxRate: "",
        fromAmount: "",
        toAmount: "",
        restrictedFrom: "",
        restrictedTo: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const isEditMode = !!formValues.itemGroupId;

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
        const { taxName, taxRate, fromAmount, toAmount, restrictedFrom, restrictedTo } = formValues;
        const errors = {};
        let isValid = true;

        if (!taxName) {
            isValid = false;
            errors.taxName = "Tax name is required.";
        }
        if (!taxRate) {
            isValid = false;
            errors.taxRate = "Tax rate is required.";
        }
        if (!fromAmount) {
            isValid = false;
            errors.fromAmount = "From Amount is required.";
        }
        if (!toAmount) {
            isValid = false;
            errors.toAmount = "To Amount is required.";
        }
        if (!restrictedFrom) {
            isValid = false;
            errors.restrictedFrom = "Restricted From is required.";
        }
        if (!restrictedTo) {
            isValid = false;
            errors.restrictedTo = "Restricted To is required.";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            taxName: formValues.taxName,
            taxRate: formValues.taxRate,
            fromAmt: formValues.fromAmt,
            toAmt: formValues.toAmt,
            restrictedFrom: formValues.restrictedFrom,
            restrictedTo: formValues.restrictedTo,
            isActive: true,
        };

        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/itemgroups/${formValues.itemGroupId}`, payload, {

                });
            } else {
                res = await api.post("/tax", payload

                );
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
                navigate("/taxs");
            }, 3000);
        } catch (error) {
            toast.error(res.data.ErrorMessage || "Something went wrong! Please try again.", {
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
            <div className='groupForm d-flex'>
                <ToastContainer />
                <div className="configurationFormContainer">
                    <div className='configurationCenterFormWrapper'>
                        <div className='configurationgroupFormHeader'>
                            <h2>{isEditMode ? "Edit " : "Add "}<span>Tax</span></h2>
                        </div>
                        <Form className=''>
                            <Row>
                                <Col md={3}>
                                    <Form.Group controlId="taxName">
                                        <div className='configurationInputFieldWrapperMain shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <HiOutlineReceiptTax size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.taxName || formValues.taxName ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.taxName || formValues.taxName ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.taxName || formValues.taxName ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.taxName || formValues.taxName ? "12px" : "14px",
                                                    color: "orange",
                                                    backgroundColor: "#fff",
                                                    padding: focus.taxName || formValues.taxName ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Enter Tax Name
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="taxName"
                                                ref={taxNameRef}
                                                value={formValues.taxName || ""}
                                                onChange={(e) => handleChange("taxName", e.target.value)}
                                                onFocus={() => setFocus(prev => ({ ...prev, taxName: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, taxName: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.taxName && errors.taxName}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="taxRate">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.taxRate || formValues.taxRate ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.taxRate || formValues.taxRate ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.taxRate || formValues.taxRate ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.taxRate || formValues.taxRate ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.taxRate || formValues.taxRate ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                Enter Tax Rate
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="taxRate"
                                                value={formValues.taxRate || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("taxRate", e.target.value);
                                                    }
                                                }}
                                                onFocus={() => setFocus(prev => ({ ...prev, taxRate: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, taxRate: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.taxRate && errors.taxRate}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="fromAmount">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.fromAmount || formValues.fromAmount ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.fromAmount || formValues.fromAmount ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.fromAmount || formValues.fromAmount ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.fromAmount || formValues.fromAmount ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.fromAmount || formValues.fromAmount ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                From Amount
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="fromAmount"
                                                value={formValues.fromAmount || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("fromAmount", e.target.value);
                                                    }
                                                }}
                                                onFocus={() => setFocus(prev => ({ ...prev, fromAmount: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, fromAmount: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.fromAmount && errors.fromAmount}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="toAmount">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.toAmount || formValues.toAmount ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.toAmount || formValues.toAmount ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.toAmount || formValues.toAmount ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.toAmount || formValues.toAmount ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.toAmount || formValues.toAmount ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                To Amount
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="toAmount"
                                                value={formValues.toAmount || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("toAmount", e.target.value);
                                                    }
                                                }}
                                                onFocus={() => setFocus(prev => ({ ...prev, toAmount: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, toAmount: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.toAmount && errors.toAmount}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col md={3}>
                                    <Form.Group controlId="restrictedFrom">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.restrictedFrom || formValues.restrictedFrom ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.restrictedFrom || formValues.restrictedFrom ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.restrictedFrom || formValues.restrictedFrom ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.restrictedFrom || formValues.restrictedFrom ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.restrictedFrom || formValues.restrictedFrom ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                               Restricted From
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="restrictedFrom"
                                                value={formValues.restrictedFrom || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("restrictedFrom", e.target.value);
                                                    }
                                                }}
                                                onFocus={() => setFocus(prev => ({ ...prev, restrictedFrom: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, restrictedFrom: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.restrictedFrom && errors.restrictedFrom}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="restrictedTo">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div
                                                className={`label ${focus.restrictedTo || formValues.restrictedTo ? "floating" : ""}`}
                                                style={{
                                                    position: "absolute",
                                                    top: focus.restrictedTo || formValues.restrictedTo ? "-10px" : "50%",
                                                    left: "40px",
                                                    transform: focus.restrictedTo || formValues.restrictedTo ? "translateY(0)" : "translateY(-50%)",
                                                    fontSize: focus.restrictedTo || formValues.restrictedTo ? "12px" : "14px",
                                                    color: "#666",
                                                    backgroundColor: "#fff",
                                                    padding: focus.restrictedTo || formValues.restrictedTo ? "0 4px" : "0",
                                                    transition: "all 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                               Restricted To
                                            </div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="restrictedTo"
                                                value={formValues.restrictedTo || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("restrictedTo", e.target.value);
                                                    }
                                                }}
                                                onFocus={() => setFocus(prev => ({ ...prev, restrictedTo: true }))}
                                                onBlur={() => setFocus(prev => ({ ...prev, restrictedTo: false }))}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.restrictedTo && errors.restrictedTo}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="submitBtnWrapper d-flex justify-content-center w-100">
                            <div className='nextBtn d-flex align-items-center justify-content-center' onClick={handleSubmit}>
                                {/* Next <div className='nextIcon'><TbPlayerTrackNext /></div> */}
                                {isEditMode ? "Update" : "Submit"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaxForm
