import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
    FaRegEdit,
    FaRegFile,
    FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
}
    from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { VscGroupByRefType } from "react-icons/vsc";
import { FaRegObjectUngroup } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';
import { LiaSitemapSolid } from "react-icons/lia";
import Select from "react-select";
import { PiBuildingLight } from "react-icons/pi";
import { HiOutlineDocumentCurrencyRupee } from "react-icons/hi2";

const SubGroup = () => {

    const [mappingShow, setMappingShow] = useState(false);
    const fetchCalled = useRef(false);
    const initialValues = {
        itemSubGroupId: "",
        itemSubGroupName: "",
        itemGroupId: "",
        itemSubGroupCode: "",
        isActive: false,
    };

    const initialImpValues = {
        File: "",
    };

    const subGroupCodeOptions = [
        { label: "Gravies ", value: "1" },
        { label: "Liquor ", value: "2" },
        { label: "DryGoods ", value: "3" },
        { label: "Food ", value: "4" },
        { label: "Mocktails", value: "5" },
        { label: "BoiledItems", value: "6" },
        { label: "Dairy", value: "7" },
        { label: "Meat", value: "8" },
        { label: "Bases", value: "9" },
        { label: "Vegetables", value: "10" },
        { label: "OilAndFats", value: "11" },
    ];
    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formImpValues, setFormImpValues] = useState(initialImpValues);
    const [impErrors, setImpErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [groupData, setGroupData] = useState([]);
    const [subGroupData, setSubGroupData] = useState([]);
    const [subGroupMappingData, setSubGroupMappingData] = useState([]);
    const searchParam = [
        "itemSubGroupName",
        "itemGroupName",
        "itemSubGroupCode",
        "isActive",
    ];
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);
    const [outletData, setOutletData] = useState([]);
    const [taxData, setTaxData] = useState([]);
    const [selectedTaxes, setSelectedTaxes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchSubGroupData();
    }, []);

    const handleChangeForm = (selected) => {
        setSelectedOptions(selected);
    };

    const handleClose = () => {
        setShow(false);
        setFormValues(initialValues);
        setErrors({});
        setIsEditMode(false);
    };

    const handleShow = () => {
        setFormValues(initialValues);
        setIsEditMode(false);
        setErrors({});
        setShow(true);
        fetchGroupData();
    };

    const fetchSubGroupData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/itemsubgroups");
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setSubGroupData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/itemgroups`);
            setGroupData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await api.get("/itemsubgroups/exportexcel", {
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "itemSubGroup.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the file:", error);
            alert("Failed to export file.");
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

    const handleImpChange = (name, value) => {
        setFormImpValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setImpErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleEditClick = (row) => {
        setIsEditMode(true);
        setFormValues({
            itemSubGroupId: row.itemSubGroupId,
            itemSubGroupName: row.itemSubGroupName,
            itemGroupId: row.itemGroupId,
            itemSubGroupCode: row.itemSubGroupCode,
            isActive: row.isActive
        });
        setShow(true);
    };

    const handleDeleteClick = (itemSubGroupId, itemSubGroupName) => {
        setToDelete({ id: itemSubGroupId, name: itemSubGroupName });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/itemsubgroups/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Group deleted successfully!");
                fetchSubGroupData();
            })
            .catch((error) => {
                console.error("Error deleting group:", error);
                toast.error("Failed to delete group.");
            })
            .finally(() => {
                setLoading(false);
                setConfirmOpen(false);
                setToDelete(null);
            });
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setToDelete(null);
    };

    const fetchOutletData = async () => {
        try {
            const res = await api.get("/outlets");
            const sortedData = res?.data?.list;
            setOutletData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);

        }
    };

    const options = outletData.map((outlet) => ({
        value: outlet.outletId,
        label: outlet.outletName
    }));

    const taxOptions = taxData.map((tax) => ({
        value: tax.taxId,
        label: tax.taxName,
    }));

    const handleTaxChange = (selected) => {
        setSelectedTaxes(selected);
    };

    const fetchTaxData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/tax`);
            const sortedData = res?.data?.list;
            setTaxData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };



    const handleMappingClick = async (subGroupIds) => {
        setSelectedRows(subGroupIds);
        setMappingShow(true);

        try {
            const response = await api.get(`/outletsubgrouptax/${subGroupIds}`);
            const mappingList = response?.data?.list || [];

            const uniqueOutletIDs = [...new Set(mappingList.map(item => item.outletID))];
            const uniqueTaxIDs = [...new Set(mappingList.map(item => item.taxID))];

            const matchedOutlets = options.filter(outlet => uniqueOutletIDs.includes(outlet.value));
            const matchedTaxes = taxOptions.filter(tax => uniqueTaxIDs.includes(tax.value));

            setSelectedOptions(matchedOutlets);
            setSelectedTaxes(matchedTaxes);

            fetchOutletData();
            fetchTaxData();

        } catch (error) {
            console.error("Error fetching subgroup mapping:", error);
        }
    };



    const handleMultiMappingClick = () => {
        setMappingShow(true);
        fetchOutletData();
        fetchTaxData();
    };



    const handleMappingSubmit = async () => {
        if (!selectedRows.length) {
            toast.error("Please select at least one sub group.");
            return;
        }

        if (!selectedOptions.length || !selectedTaxes.length) {
            toast.error("Please select at least one outlet and tax.");
            return;
        }

        const taxIDs = selectedTaxes.map(t => t.value);

        const outletMappings = selectedOptions.map(outlet => ({
            outletID: outlet.value,
            taxID: taxIDs
        }));

        const payload = {
            subgroupIDs: selectedRows,
            outletInfos: outletMappings,
            isActive: formValues.isActive
        };

        try {
            const res = await api.post("/outletsubgrouptax", payload);
            toast.success("Mapping submitted successfully!");

            setMappingShow(false);
            setSelectedRows([]);
            setSelectedOptions([]);
            setSelectedTaxes([]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit mapping. Please try again.");
        }
    };


    const handleMappingClose = () => {
        setMappingShow(false);
    };

    const handleRowCheckboxChange = (id) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAllRows = (e) => {
        if (e.target.checked) {
            const allIds = subGroupData.map((row) => row.itemSubGroupId);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    const areAllRowsSelected =
        subGroupData.length > 0 &&
        selectedRows.length === subGroupData.length &&
        subGroupData.every((row) => selectedRows.includes(row.itemSubGroupId));


    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    className="custom-yellow-checkbox"
                    onChange={handleSelectAllRows}
                    checked={areAllRowsSelected}
                />
            ),
            cell: (row) => (
                <input
                    type="checkbox"
                    className="custom-yellow-checkbox"
                    checked={selectedRows.includes(row.itemSubGroupId)}
                    onChange={() => handleRowCheckboxChange(row.itemSubGroupId)}
                />
            ),
            width: '60px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },

        {
            name: <h5>Sub group name</h5>,
            selector: (row) => row.itemSubGroupName,
            sortable: true,
        },
        {
            name: <h5>Group name</h5>,
            selector: (row) => row.itemGroupName,
            sortable: true,
        },
        {
            name: <h5>Sub group code</h5>,
            selector: (row) => row.itemSubGroupCode,
            sortable: true,
        },

        {
            name: <h5>Status</h5>,
            cell: (row) => (
                <span
                    style={{
                        color: row.isActive ? "#88E788" : "#FF474C",
                        fontWeight: "bold",
                    }}
                >
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
            sortable: true,
        },
        {
            name: <h5>Action</h5>,
            center: true,
            cell: (row) => (
                <>
                    <Link className="action-icon" onClick={() => handleEditClick(row)}>
                        <FaRegEdit size={24} color="#87CEEB" />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.itemSubGroupId, row.itemSubGroupName)}>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                    </Link>
                    {
                        <Link
                            onClick={() =>
                                handleMappingClick(row.itemSubGroupId)
                            }
                            style={{ cursor: "pointer" }}
                        >
                            <LiaSitemapSolid size={30} style={{ margin: "0.2vh" }} color="green" />
                        </Link>

                    }
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => (
        <div className="d-flex justify-content-end gap-2 align-items-center w-100">
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search..."
                    className="me-2 rounded-pill"
                    aria-label="Search"
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </Form>
            <Button
                variant="secondary"
                onClick={handleMultiMappingClick}
            >
                <CiExport size={20} /> Mapping
            </Button>
            <Button variant="info" onClick={handleExpoShow}>
                <CiExport size={20} /> Import
            </Button>
            <Button variant="success" onClick={downloadExcel}>
                <CiImport size={20} /> Export
            </Button>
            <Button variant="warning" onClick={handleShow}>
                <GoPlus size={20} /> Add
            </Button>
        </div>
    ), [filterText]);

    const validateForm = () => {
        const {
            itemSubGroupName,
            itemGroupId,
            itemSubGroupCode,
        } = formValues;
        const errors = {};
        let isValid = true;

        if (!itemSubGroupName) {
            isValid = false;
            errors.itemSubGroupName = "Sub Group name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(itemSubGroupName)) {
            errors.itemSubGroupName = 'Name must contain only letters';
            isValid = false;
        }
        if (!itemGroupId) {
            isValid = false;
            errors.itemGroupId = "Group name is required";
        }
        if (!itemSubGroupCode) {
            isValid = false;
            errors.itemSubGroupCode = "Sub group code is required";
        }

        setErrors(errors);
        return isValid;
    };

    const validateImpForm = () => {
        const { File } = formImpValues;
        const errors = {};
        let isValid = true;

        if (!File) {
            isValid = false;
            errors.File = "Import file is required.";
        } else if (
            File.type !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            isValid = false;
            errors.File = "Only .xlsx files are allowed.";
        }

        setImpErrors(errors);
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
            itemSubGroupCode: formValues.itemSubGroupCode,
            isActive: formValues.isActive,
        };
        setLoading(true);
        try {
            let res;
            if (formValues.itemSubGroupId) {
                res = await api.put(`/itemsubgroups/${formValues.itemSubGroupId}`, payload);
            } else {
                res = await api.post("/itemsubgroups", payload,);
            }

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
                    setIsEditMode(false);
                    handleClose();
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
        } finally {
            setLoading(false);
        }
    };

    const handleImpSubmit = async (e) => {
        e.preventDefault();
        if (!validateImpForm()) return;

        const formData = new FormData();
        formData.append("File", formImpValues.File);

        setLoading(true);
        try {
            const res = await api.post("/itemsubgroups/importexcel", formData);

            toast.success(res.data.successMessage || "File uploaded successfully!");
            handleExpoClose();
            setFormImpValues(initialImpValues);
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />

            {confirmOpen && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        transition: "opacity 0.3s ease-in-out",
                    }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 animate__animated animate__fadeInDown">
                            <div className="modal-header bg-danger text-white rounded-top-4">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <FaExclamationTriangle />
                                    Confirm Deletion
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={cancelDelete}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <p className="fs-5 mb-0">
                                    Are you sure you want to delete{" "}
                                    <strong>{toDelete?.name}</strong>?
                                </p>
                            </div>
                            <div className="modal-footer justify-content-center border-0 pb-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary rounded text-white px-4 d-flex align-items-center gap-2"
                                    onClick={cancelDelete}
                                >
                                    <FaTimesCircle />
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger text-white rounded px-4 shadow d-flex align-items-center gap-2"
                                    onClick={confirmDelete}
                                >
                                    <FaTrash />
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="d-flex justify-content-center" style={{ marginTop: '20%' }}>
                    <Spinner animation="grow" variant="secondary" size="sm" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="secondary" size="sm" />
                    <Spinner animation="grow" variant="warning" />
                </div>
            ) : (
                <div className='d-flex'>
                    <div className='p-3' style={{ width: "100vw" }}>
                        <div className="" style={{ width: "100%" }}>
                            <DataTable
                                columns={columns}
                                data={DataTableSettings.filterItems(
                                    subGroupData,
                                    searchParam,
                                    filterText
                                )}
                                pagination
                                paginationPerPage={DataTableSettings.paginationPerPage}
                                paginationRowsPerPageOptions={
                                    DataTableSettings.paginationRowsPerPageOptions
                                }
                                progressPending={loadingIndicator}
                                subHeader
                                fixedHeaderScrollHeight="400px"
                                subHeaderComponent={subHeaderComponentMemo}
                                persistTableHead
                            />
                        </div>
                    </div>
                </div>
            )}

            <Offcanvas
                show={show}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                style={{ "--bs-offcanvas-width": "800px" }}
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Sub Group" : "Add Sub Group"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-100' onSubmit={handleSubmit} autoComplete='off'>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubGroupName">
                                <VscGroupByRefType size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                name="itemSubGroupName"
                                value={formValues.itemSubGroupName || ""}
                                onChange={(e) =>
                                    handleChange("itemSubGroupName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                }
                                placeholder="Sub group name"
                                aria-label="itemSubGroupName"
                                isInvalid={!!errors.itemSubGroupName}
                                isValid={formValues.itemSubGroupName && !errors.itemSubGroupName}
                            />
                            {errors.itemSubGroupName && <span className="error-msg">{errors.itemSubGroupName}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemSubGroupCode">
                                <VscGroupByRefType size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Select
                                name="itemSubGroupCode"
                                value={formValues.itemSubGroupCode || ""}
                                onChange={(e) => handleChange("itemSubGroupCode", e.target.value)}
                            >
                                <option value="">Select group code</option>
                                {formValues.itemSubGroupCode &&
                                    !subGroupCodeOptions?.some(
                                        (opt) => opt.value === formValues.itemSubGroupCode
                                    ) && (
                                        <option value={formValues.itemSubGroupCode}>
                                            {formValues.itemSubGroupCode}
                                        </option>
                                    )}
                                {subGroupCodeOptions?.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.itemSubGroupCode && <span className="error-msg">{errors.itemSubGroupCode}</span>}
                        </InputGroup>
                        <InputGroup className="mb-4">
                            <InputGroup.Text id="itemGroupId">
                                <FaRegObjectUngroup size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Select
                                name="itemGroupId"
                                value={formValues.itemGroupId || ""}
                                onChange={(e) => handleChange("itemGroupId", e.target.value)}
                            >
                                <option>Select group</option>
                                {groupData?.map((item) => (
                                    <option key={item.itemGroupId} value={item.itemGroupId}>
                                        {item.itemGroupName}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.itemGroupId && <span className="error-msg">{errors.itemGroupId}</span>}
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="IsActive">
                                <TbHandClick size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Form.Check
                                type="checkbox"
                                id="custom-checkbox"
                                label="IsActive"
                                name="IsActive"

                                className="ms-3"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1rem',
                                }}
                                custom="true"
                            >
                                <Form.Check.Input
                                    type="checkbox"
                                    checked={formValues.isActive}
                                    onChange={(e) => handleChange("isActive", e.target.checked)}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                        marginRight: "8px",
                                    }}
                                />
                                <Form.Check.Label htmlFor="custom-checkbox">
                                    IsActive
                                </Form.Check.Label>
                            </Form.Check>
                        </InputGroup>
                        <div className="d-flex justify-content-center mt-5">
                            <Button
                                type="submit" variant="warning"
                            >
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas
                show={mappingShow}
                onHide={handleMappingClose}
                placement="end"
                backdrop="static"
                style={{ "--bs-offcanvas-width": "1000px" }}
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Sub Group Mapping
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                {loading ? (
                    <div className="d-flex justify-content-center" style={{ marginTop: '20%' }}>
                        <Spinner animation="grow" variant="secondary" size="sm" />
                        <Spinner animation="grow" variant="warning" />
                        <Spinner animation="grow" variant="secondary" size="sm" />
                        <Spinner animation="grow" variant="warning" />
                    </div>
                ) : (
                    <Offcanvas.Body className='mt-2 d-flex flex-column gap-3'>

                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <PiBuildingLight size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Select
                                classNames="custom-select"
                                isMulti
                                options={options}
                                value={selectedOptions}
                                onChange={handleChangeForm}
                                placeholder="Select Outlets..."
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        width: "19.5rem",
                                        borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                                        boxShadow: state.isFocused
                                            ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                                            : provided.boxShadow,
                                        '&:hover': {
                                            borderColor: '#ffc800',
                                        },
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? '#ffc800'
                                            : state.isFocused
                                                ? '#ffe066'
                                                : 'white',
                                        color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                                        cursor: 'pointer',
                                    }),
                                    multiValue: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#fff3cd',
                                    }),
                                    multiValueLabel: (provided) => ({
                                        ...provided,
                                        color: '#856404',
                                    }),
                                    multiValueRemove: (provided) => ({
                                        ...provided,
                                        color: '#856404',
                                        ':hover': {
                                            backgroundColor: '#ffc800',
                                            color: 'black',
                                        },
                                    }),
                                }}
                            />
                        </InputGroup>

                        <InputGroup className="mb-4">
                            <InputGroup.Text>
                                <HiOutlineDocumentCurrencyRupee size={25} color="#ffc800" />
                            </InputGroup.Text>
                            <Select
                                isMulti
                                options={taxOptions}
                                value={selectedTaxes}
                                onChange={handleTaxChange}
                                placeholder="Select Taxes..."
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        width: "19.5rem",
                                        borderColor: state.isFocused ? '#ffc800' : provided.borderColor,
                                        boxShadow: state.isFocused
                                            ? '0 0 0 0.2rem rgba(255, 200, 0, 0.25)'
                                            : provided.boxShadow,
                                        '&:hover': {
                                            borderColor: '#ffc800',
                                        },
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? '#ffc800'
                                            : state.isFocused
                                                ? '#ffe066'
                                                : 'white',
                                        color: state.isSelected || state.isFocused ? 'black' : 'inherit',
                                        cursor: 'pointer',
                                    }),
                                    multiValue: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#fff3cd',
                                    }),
                                    multiValueLabel: (provided) => ({
                                        ...provided,
                                        color: '#856404',
                                    }),
                                    multiValueRemove: (provided) => ({
                                        ...provided,
                                        color: '#856404',
                                        ':hover': {
                                            backgroundColor: '#ffc800',
                                            color: 'black',
                                        },
                                    }),
                                }}
                            />

                        </InputGroup>

                        <Form.Check
                            type="checkbox"
                            id="custom-checkbox"
                            label="IsActive"
                            name="IsActive"

                            className="ms-3"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '1rem',
                            }}
                            custom="true"
                        >
                            <Form.Check.Input
                                type="checkbox"
                                className='custom-yellow-checkbox'
                                checked={formValues.isActive}
                                onChange={(e) => handleChange("isActive", e.target.checked)}
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                }}
                            />
                            <Form.Check.Label htmlFor="custom-checkbox">
                                IsActive
                            </Form.Check.Label>
                        </Form.Check>

                        <div className="d-flex justify-content-center mt-5">
                            <Button
                                onClick={handleMappingSubmit}
                                type="submit" variant="warning"
                            >
                                Save
                            </Button>
                        </div>

                    </Offcanvas.Body>
                )}

            </Offcanvas>

            <Offcanvas
                show={expoShow}
                onHide={handleExpoClose}
                backdrop="static"
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            Add File
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <FaRegFile size={25} color='#ffc800' />
                            </InputGroup.Text>
                            <Form.Control
                                type="file"
                                accept=".xlsx"
                                name='File'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    handleImpChange("File", file);
                                }}
                            />
                            {impErrors.File && <span className="error-msg">{impErrors.File}</span>}
                        </InputGroup>
                        <div className="d-flex justify-content-center mt-5">
                            <Button type="submit" variant="warning" onClick={handleImpSubmit}>Save</Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default SubGroup;
