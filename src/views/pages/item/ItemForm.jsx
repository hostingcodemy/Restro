import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Form, Button, Row, Col } from "react-bootstrap";
//import Select from "react-select";
import api from '../../../config/AxiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { MdOutlineGroupAdd } from "react-icons/md";
import { RiHotelLine } from "react-icons/ri";
import { TbPlayerTrackNext } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaObjectUngroup } from "react-icons/fa6";
import { FaRegObjectGroup } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { TbCategoryPlus } from "react-icons/tb";
import { IoBarcodeOutline } from "react-icons/io5";
import { LiaWeightSolid } from "react-icons/lia";
import { LuTypeOutline } from "react-icons/lu";
import { TbPencilCode } from "react-icons/tb";
import { LiaProductHunt } from "react-icons/lia";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineFastfood } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

const ItemForm = () => {

    const navigate = useNavigate();
    const nameRef = useRef(null);
    const outletId = localStorage.getItem("outletId");
    const channelId = localStorage.getItem("channelId");
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const initialValues = {
        itemName: "",
        itemGroupId: "",
        itemSubGroupId: "",
        itemCategoryId: "",
        itemSubCategoryId: "",
        itemType: "",
        itemCode: "",
        uom: "",
        hsnCode: "",
        qrCode: "",
        ProductType: "",
        isActive: true,
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [groupData, setGroupData] = useState([]);
    const [subGroupData, setSubGroupData] = useState([]);
    const [itemTypeData, setItemTypeData] = useState([]);
    const [itemSubTypeData, setItemSubTypeData] = useState([]);
    const [uomData, setUomData] = useState([]);
    const [focus, setFocus] = useState(false);

    const itemTypeOptions = [
        { label: "Veg", value: "Veg" },
        { label: "NonVeg", value: "NonVeg" },
    ];

    const productTypeOptions = [
        { label: "Saleable Item", value: "Saleable Item" },
        { label: "Stockable Item", value: "Stockable Item" },
        { label: "Purchase Item", value: "Purchase Item" },
    ];

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchGroupData();
        fetchUomData();
    }, []);

    const fetchGroupData = async () => {
        try {
            const res = await api.get(`/itemgroups`, {

            });
            setGroupData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const fetchSubGroupData = async () => {
        try {
            const res = await api.get(`/itemsubgroups`, {

            });
            setSubGroupData(res.data.list);
        } catch (error) {
            console.error("Error fetching subgroup data", error);
        }
    };

    const fetchItemTypeData = async () => {
        try {
            const res = await api.get(`/itemcategory`, {

            });
            setItemTypeData(res.data.list);
        } catch (error) {
            console.error("Error fetching subgroup data", error);
        }
    };

    const fetchItemSubTypeData = async () => {
        try {
            const res = await api.get(`/itemsubcategory`, {

            });
            setItemSubTypeData(res.data.list);
        } catch (error) {
            console.error("Error fetching subgroup data", error);
        }
    };

    const fetchUomData = async () => {
        try {
            const res = await api.get(`/uom`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setUomData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const handleChange = (name, value) => {
        if (formValues[name] === value) return;

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
            ...(name === "itemGroupId" && { itemSubGroupId: "", itemCategoryId: "", itemSubCategoryId: "" }),
            ...(name === "itemSubGroupId" && { itemCategoryId: "", itemSubCategoryId: "" }),
            ...(name === "itemCategoryId" && { itemSubCategoryId: "" })
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));

        if (name === "itemGroupId") {
            fetchSubGroupData(value);
        }

        if (name === "itemSubGroupId") {
            fetchItemTypeData(value);
        }

        if (name === "itemCategoryId") {
            fetchItemSubTypeData(value);
        }
    };

    const validateForm = () => {
        const {
            itemName,
            itemGroupId,
            itemSubGroupId,
            itemCategoryId,
            itemSubCategoryId,
            itemType,
            uom,
            itemCode,
            hsnCode,
            qrCode,
            ProductType
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemName) {
            isValid = false;
            errors.itemName = "Item name is required.";
        }
        if (!itemGroupId) {
            isValid = false;
            errors.itemGroupId = "Group is required";
        }
        if (!itemSubGroupId) {
            isValid = false;
            errors.itemSubGroupId = "Sub group is required";
        }
        if (!itemCategoryId) {
            isValid = false;
            errors.itemCategoryId = "Item category is required";
        }
        if (!itemSubCategoryId) {
            isValid = false;
            errors.itemSubCategoryId = "Item sub category is required";
        }
        if (!itemCode) {
            isValid = false;
            errors.itemCode = "Item code is required";
        }
        if (!uom) {
            isValid = false;
            errors.uom = "Uom is required";
        }
        if (!itemType) {
            isValid = false;
            errors.itemType = "Item type is required";
        }
        if (!hsnCode) {
            isValid = false;
            errors.hsnCode = "HSN code is required";
        }
        if (!ProductType) {
            isValid = false;
            errors.ProductType = "Product type is required";
        }

        setErrors(errors);
        return isValid;
    };

    const handleNext = async (e) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     return;
        // }

        navigate("/item-outlet", { state: { formData: formValues } });
    };

    return (
        <>
            <div className='itemAdd d-flex'>
                <ToastContainer />
                <div className="configurationFormContainer ">
                    <div className='configurationFormWrapper '>
                        <div className='configurationgroupFormHeader d-flex align-items-center justify-content-between'>
                            <h2>Add <span>Item</span></h2>
                        </div>
                        <Form className='h-100'>
                            <div className="layoutWrapper">
                                <div className="leftItemImg">
                                    <div className='itemImg shadow-lg'>
                                        <img src="src/assets/springroll.jpeg" alt="" />
                                    </div>
                                    <div className="ItemName ">
                                        <Form.Group controlId="itemName">
                                            <div className='configurationInputFieldWrapperMainSpecial shadow-lg'>
                                                <div className='configurationIconWrapper'>
                                                    <MdOutlineFastfood size={20} />
                                                </div>
                                                <div
                                                    className={`label ${focus.itemName || formValues.itemName ? "floating" : ""}`}
                                                    style={{
                                                        position: "absolute",
                                                        top: focus.itemName || formValues.itemName ? "-10px" : "50%",
                                                        left: "40px",
                                                        transform: focus.itemName || formValues.itemName ? "translateY(0)" : "translateY(-50%)",
                                                        fontSize: focus.itemName || formValues.itemName ? "12px" : "14px",
                                                        color: "orange",
                                                        backgroundColor: "#fff",
                                                        padding: focus.itemName || formValues.itemName ? "0 4px" : "0",
                                                        transition: "all 0.2s ease",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Enter Item Name
                                                </div>
                                                <Form.Control
                                                    className='configurationInput'
                                                    type="text"
                                                    name="itemName"
                                                    ref={nameRef}
                                                    value={formValues.itemName || ""}
                                                    onChange={(e) => handleChange("itemName", e.target.value)}
                                                    onFocus={() => setFocus(prev => ({ ...prev, itemName: true }))}
                                                    onBlur={() => setFocus(prev => ({ ...prev, itemName: false }))}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            <div className="text-danger small danger-font">

                                                {!formValues.itemName && errors.itemName}
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="rightForm">
                                    <Row>
                                        <Col md={12}>
                                            <div className='formLeft gap-2 d-flex flex-column'>
                                                <Row className="g-4">
                                                    <Col md={4}>
                                                        <Form.Group controlId="itemGroupId" className='select'>
                                                            <div className='configurationSelectWrapper '>
                                                                <div className='configurationIconWrapper'>
                                                                    <FaObjectUngroup size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.itemGroupId || formValues.itemGroupId ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.itemGroupId || formValues.itemGroupId ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.itemGroupId || formValues.itemGroupId ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.itemGroupId || formValues.itemGroupId ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.itemGroupId || formValues.itemGroupId ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select Group
                                                                </div>
                                                                {/* <Select
                                                                    name="itemGroupId"
                                                                    value={formValues.itemGroupId ? groupData?.find((item) => item.value === formValues.itemGroupId) : null}
                                                                    onChange={(selectedOption) => handleChange("itemGroupId", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, itemGroupId: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, itemGroupId: false }))}
                                                                    placeholder=""
                                                                    options={groupData?.map(group => ({
                                                                        label: group.itemGroupName,
                                                                        value: group.itemGroupId
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem',
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
                                                                /> */}

                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.itemGroupId && errors.itemGroupId}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group controlId="itemSubGroupId">
                                                            <div className='configurationSelectWrapper '>
                                                                <div className='configurationIconWrapper'>
                                                                    <FaRegObjectGroup size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.itemSubGroupId || formValues.itemSubGroupId ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.itemSubGroupId || formValues.itemSubGroupId ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.itemSubGroupId || formValues.itemSubGroupId ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.itemSubGroupId || formValues.itemSubGroupId ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.itemSubGroupId || formValues.itemSubGroupId ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select Sub Group
                                                                </div>
                                                                {/* <Select
                                                                    name="itemSubGroupId"
                                                                    isSearchable={true}
                                                                    value={formValues.itemSubGroupId ? subGroupData?.find((item) => item.value === formValues.itemSubGroupId) : null}
                                                                    onChange={(selectedOption) => handleChange("itemSubGroupId", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, itemSubGroupId: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, itemSubGroupId: false }))}
                                                                    placeholder=""
                                                                    options={subGroupData?.map(group => ({
                                                                        label: group.itemSubGroupName,
                                                                        value: group.itemSubGroupId
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem'
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
                                                                /> */}
                                                                <IoIosAddCircleOutline />
                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.itemSubGroupId && errors.itemSubGroupId}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group controlId="itemCategoryId">
                                                            <div className='configurationSelectWrapper '>
                                                                <div className='configurationIconWrapper'>
                                                                    <BiCategoryAlt size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.itemCategoryId || formValues.itemCategoryId ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.itemCategoryId || formValues.itemCategoryId ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.itemCategoryId || formValues.itemCategoryId ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.itemCategoryId || formValues.itemCategoryId ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.itemCategoryId || formValues.itemCategoryId ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select Category
                                                                </div>
                                                                {/* <Select
                                                                    name="itemCategoryId"
                                                                    isSearchable={true}
                                                                    value={formValues.itemCategoryId ? itemTypeData?.find((item) => item.value === formValues.itemCategoryId) : null}
                                                                    onChange={(selectedOption) => handleChange("itemCategoryId", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, itemCategoryId: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, itemCategoryId: false }))}
                                                                    placeholder=""
                                                                    options={itemTypeData?.map(item => ({
                                                                        label: item.itemCategoryName,
                                                                        value: item.itemCategoryId
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem'
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
                                                                /> */}
                                                                <IoIosAddCircleOutline />
                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.itemCategoryId && errors.itemCategoryId}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: "2rem" }}>
                                                    <Col md={4}>
                                                        <Form.Group controlId="itemSubCategoryId">
                                                            <div className='configurationSelectWrapper '>
                                                                <div className='configurationIconWrapper'>
                                                                    <TbCategoryPlus size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.itemSubCategoryId || formValues.itemSubCategoryId ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.itemSubCategoryId || formValues.itemSubCategoryId ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.itemSubCategoryId || formValues.itemSubCategoryId ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.itemSubCategoryId || formValues.itemSubCategoryId ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.itemSubCategoryId || formValues.itemSubCategoryId ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select Sub Category
                                                                </div>
                                                                {/* <Select
                                                                    name="itemSubCategoryId"
                                                                    isSearchable={true}
                                                                    value={formValues.itemSubCategoryId ? itemSubTypeData?.find((item) => item.value === formValues.itemSubCategoryId) : null}
                                                                    onChange={(selectedOption) => handleChange("itemSubCategoryId", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, itemSubCategoryId: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, itemSubCategoryId: false }))}
                                                                    placeholder=""
                                                                    options={itemSubTypeData?.map(item => ({
                                                                        label: item.itemSubCategoryName,
                                                                        value: item.itemSubCategoryID
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem'
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
                                                                /> */}
                                                                <IoIosAddCircleOutline />
                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.itemSubCategoryId && errors.itemSubCategoryId}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group controlId="itemCode">
                                                            <div className='configurationInputFieldWrapper '>
                                                                <div className='groupInputIconWrapper'>
                                                                    <IoBarcodeOutline size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.itemCode || formValues.itemCode ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.itemCode || formValues.itemCode ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.itemCode || formValues.itemCode ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.itemCode || formValues.itemCode ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.itemCode || formValues.itemCode ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Enter Item Code
                                                                </div>
                                                                <Form.Control
                                                                    className='configurationInput'
                                                                    type="text"
                                                                    name="itemCode"
                                                                    value={formValues.itemCode || ""}
                                                                    onChange={(e) => handleChange("itemCode", e.target.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, itemCode: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, itemCode: false }))}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.itemCode && errors.itemCode}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group controlId="uom">
                                                            <div className='configurationSelectWrapper'>
                                                                <div className='configurationIconWrapper'>
                                                                    <LiaWeightSolid size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.uom || formValues.uom ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.uom || formValues.uom ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.uom || formValues.uom ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.uom || formValues.uom ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.uom || formValues.uom ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select UOM
                                                                </div>
                                                                {/* <Select
                                                                    name="uom"
                                                                    isSearchable={true}
                                                                    value={formValues.uom ? uomData?.find((item) => item.value === formValues.uom) : null}
                                                                    onChange={(selectedOption) => handleChange("uom", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, uom: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, uom: false }))}
                                                                    placeholder=""
                                                                    options={uomData?.map(item => ({
                                                                        label: item.uomName,
                                                                        value: item.uomId
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem'
                                                                        }),
                                                                        placeholder: (base) => ({
                                                                            ...base,
                                                                            color: '#5C5E60',
                                                                        }),
                                                                        singleValue: (base) => ({
                                                                            ...base,
                                                                            color: '#333',
                                                                        }),
                                                                    }}
                                                                /> */}

                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.uom && errors.uom}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: "2rem" }}>
                                                    <Col md={4}>
                                                        <Form.Group controlId="itemType">
                                                            <div className='configurationSelectWrapper '>
                                                                <div className='configurationIconWrapper'>
                                                                    <LuTypeOutline size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.itemType || formValues.itemType ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.itemType || formValues.itemType ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.itemType || formValues.itemType ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.itemType || formValues.itemType ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.itemType || formValues.itemType ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select Item Type
                                                                </div>
                                                                {/* <Select
                                                                    name="itemType"
                                                                    isSearchable={true}
                                                                    value={formValues.itemType ? itemTypeOptions?.find((item) => item.value === formValues.itemType) : null}
                                                                    onChange={(selectedOption) => handleChange("itemType", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, itemType: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, itemType: false }))}
                                                                    placeholder=""
                                                                    options={itemTypeOptions?.map(item => ({
                                                                        label: item.label,
                                                                        value: item.value
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem'
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
                                                                /> */}
                                                                <IoIosAddCircleOutline />
                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.itemType && errors.itemType}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group controlId="hsnCode">
                                                            <div className='configurationInputFieldWrapper '>
                                                                <div className='groupInputIconWrapper'>
                                                                    <TbPencilCode size={18} />
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
                                                                    Enter Hsn Code
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
                                                        <Form.Group controlId="ProductType">
                                                            <div className='configurationSelectWrapper '>
                                                                <div className='configurationIconWrapper'>
                                                                    <LiaProductHunt size={18} />
                                                                </div>
                                                                <div
                                                                    className={`label ${focus.ProductType || formValues.ProductType ? "floating" : ""}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: focus.ProductType || formValues.ProductType ? "-10px" : "50%",
                                                                        left: "40px",
                                                                        transform: focus.ProductType || formValues.ProductType ? "translateY(0)" : "translateY(-50%)",
                                                                        fontSize: focus.ProductType || formValues.ProductType ? "12px" : "14px",
                                                                        color: "#666",
                                                                        backgroundColor: "#fff",
                                                                        padding: focus.ProductType || formValues.ProductType ? "0 4px" : "0",
                                                                        transition: "all 0.2s ease",
                                                                        pointerEvents: "none",
                                                                    }}
                                                                >
                                                                    Select Product Type
                                                                </div>
                                                                {/* <Select
                                                                    name="ProductType"
                                                                    isSearchable={true}
                                                                    value={formValues.ProductType ? productTypeOptions?.find((item) => item.value === formValues.ProductType) : null}
                                                                    onChange={(selectedOption) => handleChange("ProductType", selectedOption.value)}
                                                                    onFocus={() => setFocus(prev => ({ ...prev, ProductType: true }))}
                                                                    onBlur={() => setFocus(prev => ({ ...prev, ProductType: false }))}
                                                                    placeholder=""
                                                                    options={productTypeOptions?.map(item => ({
                                                                        label: item.label,
                                                                        value: item.value
                                                                    }))}
                                                                    styles={{
                                                                        control: base => ({
                                                                            ...base,
                                                                            border: 'none',
                                                                            boxShadow: 'none',
                                                                            backgroundColor: 'none',
                                                                            height: '1rem',
                                                                            width: '15rem'
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
                                                                /> */}
                                                                <IoIosAddCircleOutline />
                                                            </div>
                                                            <div className="text-danger small">
                                                                {!formValues.ProductType && errors.ProductType}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="submitBtnWrapper d-flex justify-content-end bg-white">
                                        <div onClick={handleNext} className='nextBtn d-flex align-items-center justify-content-center'>
                                            Next <div className='nextIcon'><TbPlayerTrackNext /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div >
                </div >
            </div >
        </>
    );
};

export default ItemForm;
