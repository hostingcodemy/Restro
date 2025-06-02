import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../../config/AxiosInterceptor';
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { MdOutlinePersonOutline, MdOutlineLockPerson, MdOutlineMailOutline } from "react-icons/md";

const GroupForm = () => {

    const nameRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state?.groupData;
    console.log('location.state:', location.state);
    console.log('Data from location.state:', data);

    const initialValues = {
        itemGroupId: "",
        itemGroupName: ""
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [focus, setFocus] = useState(false);
    const isEditMode = !!formValues.itemGroupId;

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
        if (data) {
            setFormValues({
                itemGroupId: data.itemGroupId,
                itemGroupName: data.itemGroupName
            });
        }
    }, [data]);

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
        const { itemGroupName } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemGroupName) {
            isValid = false;
            errors.itemGroupName = "Group name is required.";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            itemGroupName: formValues.itemGroupName,
        };

        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/itemgroups/${formValues.itemGroupId}`, payload);
            } else {
                res = await api.post("/itemgroups", payload);
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
                navigate("/item-groups");
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
                            <h2>{isEditMode ? "Edit Group" : "Add Group"}</h2>
                        </div>
                        <Form className='h-100'>
                            <div className='groupWrapper' style={{ justifyContent: "start" }}>
                                <div className="fancy-group">
                                    <div className="icon"><MdOutlinePersonOutline size={30} /></div>
                                    <input
                                        type="text"
                                        name="itemGroupName"
                                        value={formValues.itemGroupName || ""}
                                        onChange={(e) =>
                                            handleChange("itemGroupName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        className={errors.itemGroupName ? 'input-error' : ''}
                                        autoComplete="off"
                                    />
                                    <label>Group Name</label>
                                    {errors.itemGroupName && <span className="error-msg">{errors.itemGroupName}</span>}
                                </div>
                            </div>
                            <div onClick={handleSubmit} className=" d-flex justify-content-center align-items-center w-100">
                                <div className='registerSubmitBtn' style={{ width: "5vw", }}>
                                    Submit
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupForm;










