import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import api from '../../../config/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { VscTypeHierarchySub } from "react-icons/vsc";
import { PiPassword } from "react-icons/pi";
import { TfiShortcode } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";


const ItemSubTypeFrom = () => {

    const nameRef = useRef(null);
    const navigate = useNavigate();
    const outletId = localStorage.getItem("outletId");
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        itemSubCategoryName: "",
        itemSubCategoryCode: "",
        itemSubCategoryShortCode: "",
        itemSubGroupShortCode: "",
        itemCategoryID: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const [itemTypesData, setItemTypesData] = useState([]);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchItemTypeData();
    }, []);

    const fetchItemTypeData = async () => {
        try {
            const res = await api.get("/itemcategory", {

            });
            setItemTypesData(res.data.list);
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
            itemSubCategoryName,
            itemSubCategoryCode,
            itemSubCategoryShortCode,
            itemSubGroupShortCode,
            itemCategoryID
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemSubCategoryName) {
            isValid = false;
            errors.itemSubCategoryName = "Item sub category name is required.";
        }
        if (!itemSubCategoryCode) {
            isValid = false;
            errors.itemSubCategoryCode = "Item sub category code is required.";
        }
        if (!itemSubCategoryShortCode) {
            isValid = false;
            errors.itemSubCategoryShortCode = "Item sub category short code is required.";
        }
        if (!itemSubGroupShortCode) {
            isValid = false;
            errors.itemSubGroupShortCode = "Item sub group short code is required.";
        }
        if (!itemCategoryID) {
            isValid = false;
            errors.itemCategoryID = "Item category is required.";
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
            itemSubCategoryName: formValues.itemSubCategoryName,
            itemSubCategoryCode: formValues.itemSubCategoryCode,
            itemSubCategoryShortCode: formValues.itemSubCategoryShortCode,
            itemSubGroupShortCode: formValues.itemSubGroupShortCode,
            itemCategoryID: formValues.itemCategoryID,
            outletId: outletId,
            isActive: true
        };

        try {
            let res;
            if (formValues.itemSubCategoryID) {
                res = await api.put(`/itemsubcategory/${formValues.itemSubCategoryID}`, payload, {

                });
            } else {
                res = await api.post("/itemsubcategory", payload, {

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
                navigate("/item-sub-type");
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
            <div className='groupForm d-flex'>
                <ToastContainer />
                <div className="configurationFormContainer ">
                    <div className='configurationFormWrapper'>
                        <div className='configurationgroupFormHeader'>
                            <h2>Add Item <span>Sub Category</span></h2>
                        </div>
                        <Form className='h-100 d-flex flex-column'>
                            <div className='' style={{ justifyContent: "flex-start", display: "flex", flexDirection: "row", gap: "20px" }}>
                                <div className="fancy-group">
                                    <div className="icon"><VscTypeHierarchySub size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemSubCategoryName"
                                        ref={nameRef}
                                        value={formValues.itemSubCategoryName || ""}
                                        onChange={(e) =>
                                            handleChange("itemSubCategoryName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        className={errors.itemSubCategoryName ? 'input-error' : ''}
                                        autoComplete="off"
                                    />
                                    <label>Sub Category Name</label>
                                    {errors.itemSubCategoryName && <span className="error-msg">{errors.itemSubCategoryName}</span>}
                                </div>

                                <div className="fancy-group">
                                    <div className="icon"><PiPassword size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemSubCategoryCode"
                                        value={formValues.itemSubCategoryCode || ""}
                                        onChange={(e) => handleChange("itemSubCategoryCode", e.target.value)}
                                        className={errors.itemSubCategoryCode ? 'input-error' : ''}
                                        autoComplete="off"
                                    />
                                    <label>Sub Category Code</label>
                                    {errors.itemSubCategoryCode && <span className="error-msg">{errors.itemSubCategoryCode}</span>}
                                </div>

                                <div className="fancy-group">
                                    <div className="icon"><TfiShortcode size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemSubCategoryShortCode"
                                        value={formValues.itemSubCategoryShortCode || ""}
                                        onChange={(e) => handleChange("itemSubCategoryShortCode", e.target.value)}
                                        className={errors.itemSubCategoryShortCode ? 'input-error' : ''}
                                        autoComplete="off"
                                    />
                                    <label>Sub Category short Code</label>
                                    {errors.itemSubCategoryShortCode && <span className="error-msg">{errors.itemSubCategoryShortCode}</span>}
                                </div>
                            </div>
                            <div className='mt-3' style={{ justifyContent: "flex-start", display: "flex", flexDirection: "row", gap: "20px" }}>
                                <div className="fancy-group">
                                    <div className="icon"><TfiShortcode size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemSubGroupShortCode"
                                        value={formValues.itemSubGroupShortCode || ""}
                                        onChange={(e) => handleChange("itemSubGroupShortCode", e.target.value)}
                                        className={errors.itemSubGroupShortCode ? 'input-error' : ''}
                                        autoComplete="off"
                                    />
                                    <label>Sub group short Code</label>
                                    {errors.itemSubGroupShortCode && <span className="error-msg">{errors.itemSubGroupShortCode}</span>}
                                </div>

                                <div className="fancy-group" >
                                    <div className="icon"><CiViewList size={30} /></div>
                                    <div>
                                        <select
                                            name="itemCategoryID"
                                            value={formValues.itemCategoryID || ""}
                                            onChange={(e) => handleChange("itemCategoryID", e.target.value)}
                                            onFocus={() => setFocus((prev) => ({ ...prev, itemCategoryID: true }))}
                                            onBlur={() => setFocus((prev) => ({ ...prev, itemCategoryID: false }))}
                                            className={errors.itemCategoryID ? "input-error" : ""}
                                        >
                                            {itemTypesData?.map((item) => (
                                                <option key={item.itemGroupId} value={item.itemGroupId}>
                                                    {item.itemCategoryName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <label>Category Name</label>
                                    {errors.itemCategoryID && <span className="error-msg">{errors.itemCategoryID}</span>}
                                </div>
                            </div>



                            <div onClick={handleSubmit} className="d-flex justify-content-center align-items-center w-100 mt-4">
                                <div className='registerSubmitBtn' style={{ width: "5vw" }}>
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

export default ItemSubTypeFrom
