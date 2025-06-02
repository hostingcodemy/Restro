import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, InputGroup } from "react-bootstrap";
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

const SubGroup = () => {

    const location = useLocation();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        if (location.state?.permissions) {
            setPermissions(location.state.permissions);
        }
    }, [location.state?.permissions]);

    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchSubGroupData();
    }, []);

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
            const res = await api.get(`/itemgroups`, {

            });
            setGroupData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        } finally {
            setLoading(false);
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

    const columns = [
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
                    {permissions?.write && (
                        <Link className="action-icon" onClick={() => handleEditClick(row)}>
                            <FaRegEdit size={24} color="#87CEEB" />
                        </Link>
                    )}
                    {permissions?.delete && (
                        <Link className="action-icon" onClick={() => handleDeleteClick(row.itemSubGroupId, row.itemSubGroupName)}>
                            <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                        </Link>
                    )}
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
            {permissions?.import && (
                <Button variant="info" onClick={handleExpoShow}>
                    <CiExport size={20} /> Import
                </Button>
            )}
            {permissions?.export && (
                <Button variant="success">
                    <CiImport size={20} /> Export
                </Button>
            )}
            {permissions?.write && (
                <Button variant="warning" onClick={handleShow}>
                    <GoPlus size={20} /> Add
                </Button>
            )}
        </div>
    ), [permissions, filterText]);

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
                    <Form className='h-100' onSubmit={handleSubmit}>
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

            <Offcanvas show={expoShow} onHide={handleExpoClose} backdrop="static" placement="end">
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
