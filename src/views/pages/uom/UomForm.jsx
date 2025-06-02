import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategory } from '../../Context/CategoryContext';
import { Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../config/AxiosInterceptor';
import { MdOutlineGroupAdd } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { MdOutlinePriceCheck } from "react-icons/md";

const UomForm = () => {

    const navigate = useNavigate();
    const nameRef = useRef(null);
    const { setIsHiddenSidebarOpen } = useCategory();

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
    }, []);

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        uomName: "",
        uomQty: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
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
        const { uomName, uomQty } = formValues;
        const errors = {};
        let isValid = true;

        if (!uomName) {
            isValid = false;
            errors.uomName = "Uom name is required.";
        }
        if (!uomQty) {
            isValid = false;
            errors.uomQty = "Uom Qty is required.";
        }
        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            uomName: formValues.uomName,
            uomQty: formValues.uomQty,
            isActive: true,
        };

        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/itemgroups/${formValues.itemGroupId}`, payload, {

                });
            } else {
                res = await api.post("/uom", payload

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
                navigate("/uom");
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
                    <div className='configurationFormWrapper'>
                        <div className='configurationgroupFormHeader'>
                            <h2>{isEditMode ? "Edit " : "Add "}<span>UOM</span></h2>
                        </div>
                        <Form className='h-100'>
                            <Row>
                            <Col md={3}>
                                    <Form.Group controlId="uomName">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div className='label'>Enter Uom Name</div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="uomName"
                                                value={formValues.uomName || ""}
                                                onChange={(e) => handleChange("uomName", e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.uomName && errors.uomName}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="uomQty">
                                        <div className='configurationInputFieldWrapper shadow-sm'>
                                            <div className='groupInputIconWrapper'>
                                                <MdOutlinePriceCheck size={20} />
                                            </div>
                                            <div className='label'>Enter Uom Qty</div>
                                            <Form.Control
                                                className='configurationInput'
                                                type="text"
                                                name="uomQty"
                                                value={formValues.uomQty || ""}
                                                onChange={(e) => {
                                                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                                                        handleChange("uomQty", e.target.value);
                                                    }
                                                }}

                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="text-danger small">
                                            {!formValues.uomQty && errors.uomQty}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="submitBtnWrapper d-flex justify-content-end bg-white">
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

export default UomForm
