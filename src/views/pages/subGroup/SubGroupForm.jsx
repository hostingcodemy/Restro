import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../../config/AxiosInterceptor';
import Select from "react-select";
import { useNavigate, useLocation } from 'react-router-dom';
import { VscGroupByRefType } from "react-icons/vsc";
import { FaRegObjectUngroup } from "react-icons/fa6";

const SubGroupForm = () => {

    const nameRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    console.log("Full location object:", location);
    const data = location.state?.itemSubGroup;
    console.log("Received itemSubGroup:", data);

    const initialValues = {
        itemSubGroupId: "",
        itemSubGroupName: "",
        itemGroupId: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [groupData, setGroupData] = useState([]);
    const [focus, setFocus] = useState(false);
    const isEditMode = !!formValues.itemGroupId;

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchGroupData();
    }, []);

    // useEffect(() => {
    //     if (location.state && location.state.itemSubGroup) {
    //         console.log(location.state,'ll');
    //         setFormValues(location.state.itemSubGroup);
    //     } else {
    //         console.log("No itemSubGroup found in location state");
    //     }
    // }, [location.state]);


    const fetchGroupData = async () => {
        try {
            const res = await api.get(`/itemgroups`, {

            });
            setGroupData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
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
            itemSubGroupName,
            itemGroupId,
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemSubGroupName) {
            isValid = false;
            errors.itemSubGroupName = "Sub Group name is required.";
        }
        if (!itemGroupId) {
            isValid = false;
            errors.itemGroupId = "Group name is required";
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
            itemSubGroupName: formValues.itemSubGroupName,
            itemGroupId: formValues.itemGroupId,
        };

        try {
            let res;
            if (formValues.itemSubGroupId) {
                res = await api.put(`/itemsubgroups/${formValues.itemSubGroupId}`, payload, {

                });
            } else {
                res = await api.post("/itemsubgroups", payload, {

                });
            }

            console.log("API Response:", res);

            if (res.data && typeof res.data === "object" && "IsValid" in res.data) {
                if (res.data.IsValid) {
                    toast.success(res.data.SuccessMessage || "Success!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setFormValues(initialValues);
                    setTimeout(() => {
                        navigate("/sub-groups");
                    }, 3000);
                } else {
                    toast.error(res.data.ErrorMessage || "Something went wrong!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else {
                console.error("Unexpected API response structure:", res);
                toast.error("Invalid response from the server!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
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
                            <h2>Add <span>Subgroup</span></h2>
                        </div>

                        <Form className='h-100'>
                            <div className='' style={{ justifyContent: "flex-start", display: "flex", flexDirection: "row", gap: "20px" }}>
                                <div className="fancy-group">
                                    <div className="icon"><VscGroupByRefType size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemSubGroupName"
                                        value={formValues.itemSubGroupName || ""}
                                        onChange={(e) =>
                                            handleChange("itemSubGroupName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        className={errors.itemSubGroupName ? 'input-error' : ''}
                                        autoComplete="off"
                                    />
                                    <label>Sub Group Name</label>
                                    {errors.itemSubGroupName && <span className="error-msg">{errors.itemSubGroupName}</span>}
                                </div>
                                <div className="fancy-group" >
                                    <div className="icon"><FaRegObjectUngroup size={30} /></div>
                                    <div>
                                        <select
                                            name="itemGroupId"
                                            value={formValues.itemGroupId || ""}
                                            onChange={(e) => handleChange("itemGroupId", e.target.value)}
                                            onFocus={() => setFocus((prev) => ({ ...prev, itemGroupId: true }))}
                                            onBlur={() => setFocus((prev) => ({ ...prev, itemGroupId: false }))}
                                            className={errors.itemGroupId ? "input-error" : ""}
                                        >
                                            {groupData.map((group) => (
                                                <option key={group.itemGroupId} value={group.itemGroupId}>
                                                    {group.itemGroupName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <label>Group Name</label>
                                    {errors.itemGroupId && <span className="error-msg">{errors.itemGroupId}</span>}
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

export default SubGroupForm
