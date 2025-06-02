import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import api from '../../../config/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { VscTypeHierarchySub } from "react-icons/vsc";
import { HiOutlineRectangleGroup } from "react-icons/hi2";

const ItemTypeForm = () => {

    const nameRef = useRef(null);
    const navigate = useNavigate();
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        itemTypeName: "",
        itemSubgroupId: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const [subGroupData, setSubGroupData] = useState([]);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchSubGroupData();
    }, []);

    const fetchSubGroupData = async () => {
        try {
            const res = await api.get(`/itemsubgroups`, {

            });
            setSubGroupData(res.data.list);
        } catch (error) {
            console.error("Error fetching subgroup data", error);
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
            itemTypeName,
            itemSubgroupId,
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemTypeName) {
            isValid = false;
            errors.itemTypeName = "Type name is required.";
        }
        if (!itemSubgroupId) {
            isValid = false;
            errors.itemSubgroupId = "Sub group name is required";
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
            itemTypeName: formValues.itemTypeName,
            itemSubgroupId: formValues.itemSubgroupId,
        };

        try {
            let res;
            if (formValues.itemCategoryId) {
                res = await api.put(`/itemcategory/${formValues.itemCategoryId}`, payload, {

                });
            } else {
                res = await api.post("/itemcategory", payload, {

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
                navigate("/item-types");
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
                <div className="configurationFormContainer">
                    <div className='configurationFormWrapper'>
                        <div className='configurationgroupFormHeader'>
                            <h2>Add Item <span>Category</span></h2>
                        </div>
                        <Form className='h-100'>
                            <div className='' style={{ justifyContent: "flex-start", display: "flex", flexDirection: "row", gap: "20px" }}>
                                <div className="fancy-group">
                                    <div className="icon"><VscTypeHierarchySub size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemTypeName"
                                        ref={nameRef}
                                        onFocus={() => setFocus(prev => ({ ...prev, itemTypeName: true }))}
                                        onBlur={() => setFocus(prev => ({ ...prev, itemTypeName: false }))}
                                        autoComplete="off"
                                        value={formValues.itemTypeName || ""}
                                        onChange={(e) =>
                                            handleChange("itemTypeName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        className={errors.itemTypeName ? 'input-error' : ''}
                                    />
                                    <label>Item Category Name</label>
                                    {errors.itemTypeName && <span className="error-msg">{errors.itemTypeName}</span>}
                                </div>
                                <div className="fancy-group" >
                                    <div className="icon"><HiOutlineRectangleGroup size={30} /></div>
                                    <div>
                                        <select
                                            name="itemSubgroupId"
                                            value={formValues.itemSubgroupId || ""}
                                            onChange={(e) => handleChange("itemSubgroupId", e.target.value)}
                                            onFocus={() => setFocus((prev) => ({ ...prev, itemSubgroupId: true }))}
                                            onBlur={() => setFocus((prev) => ({ ...prev, itemSubgroupId: false }))}
                                            className={errors.itemSubgroupId ? "input-error" : ""}
                                        >
                                            {subGroupData?.map((group) => (
                                                <option key={group.itemSubGroupId} value={group.itemSubGroupId}>
                                                    {group.itemSubGroupName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <label>Sub Group Name</label>
                                    {errors.itemSubgroupId && <span className="error-msg">{errors.itemSubgroupId}</span>}
                                </div>
                            </div>
                        </Form>
                        <div onClick={handleSubmit} className="d-flex justify-content-center align-items-center w-100 mt-4">
                            <div className='registerSubmitBtn' style={{ width: "5vw" }}>
                                Submit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ItemTypeForm
