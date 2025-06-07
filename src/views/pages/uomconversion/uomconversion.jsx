import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Row, Col, Table } from "react-bootstrap";
import { MdDeleteForever, MdOutlinePriceCheck } from "react-icons/md";
import {
    FaRegEdit, FaRegFile, FaTrash,
    FaTimesCircle,
    FaExclamationTriangle
} from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation } from 'react-router-dom';;
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';
import axios from "axios";
import { BsPersonRolodex } from "react-icons/bs";
import { LiaWeightSolid } from "react-icons/lia";
import { FaHandHoldingUsd } from "react-icons/fa";


const uomconversion = () => {

    const initialValues = {
        id: "",
        name: "",
        fromUomId: "",
        toUomId: "",
        multiplier: "",
        addFraction: "",
        isActive: false,
    }
    const token = localStorage.getItem('accessToken');

    const initialImpValues = {
        File: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formImpValues, setFormImpValues] = useState(initialImpValues);
    const [impErrors, setImpErrors] = useState({});
    const location = useLocation();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        if (location.state?.permissions) {
            setPermissions(location.state.permissions);
        }
    }, [location.state?.permissions]);

    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [uomConversionData, setUomConversionData] = useState([]);
    const searchParam = ["name", "uomQty", "isActive"];
    const [isEditMode, setIsEditMode] = useState(false);
    const [show, setShow] = useState(false);
    const [expoShow, setExpoShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleExpoClose = () => setExpoShow(false);
    const handleExpoShow = () => setExpoShow(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [uomData, setUomData] = useState([]);

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
        fetchUom();
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchuomConversionData();
    }, []);

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

    const fetchUom = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/uom`);
            setUomData(res?.data?.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchuomConversionData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/uomconversion`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setUomConversionData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await axios.get(
                "https://hotel-api-newdev-hvbbe9bwe3gxemd6.eastasia-01.azurewebsites.net/api/v1/uom/exportexcel",
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "uom.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the file:", error);
            alert("Failed to export file.");
        }
    };

    const validateForm = () => {
        const { name } = formValues;
        const errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors.name = "Uom name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(name)) {
            errors.name = 'Name must contain only letters';
            isValid = false;
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

    const handleEditClick = (row) => {
        setIsEditMode(true);
        setFormValues({
            id: row.id,
            name: row.name,
            fromUomId: row.fromUomId,
            toUomId: row.toUomId,
            multiplier: row.multiplier,
            addFraction: row.addFraction,
            isActive: row.isActive
        });
        setShow(true);
        fetchUom();
    };

    const handleDeleteClick = (id, name) => {
        setToDelete({ id: id, name: name });
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!toDelete) return;

        setLoading(true);
        api.delete(`/uomconversion/${toDelete.id}`)
            .then((res) => {
                toast.success(res.data.successMessage || "Uom deleted successfully!");
                fetchuomConversionData();
            })
            .catch((error) => {
                console.error("Error deleting uom:", error);
                toast.error("Failed to delete uom.");
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
            name: <h5>Name</h5>,
            selector: (row) => row.name,
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
                        <Link className="action-icon" onClick={() => handleDeleteClick(row.id, row.name)}>
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
                <Button variant="success" onClick={downloadExcel}>
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;


  if (formValues.fromUomId === formValues.toUomId) {
    toast.error("From UOM and To UOM cannot be the same.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }

  const payload = {
    name: formValues.name,
    fromUomId: formValues.fromUomId,
    toUomId: formValues.toUomId,
    multiplier: formValues.multiplier,
    addFraction: formValues.addFraction,
    isActive: formValues.isActive,
  };

  setLoading(true);
  try {
    let res;
    if (isEditMode) {
      res = await api.put(`/uomconversion/${formValues.id}`, payload);
    } else {
      res = await api.post("/uomconversion", payload);
    }

    setFormValues(initialValues);
    setIsEditMode(false);
    handleClose();
    fetchuomConversionData();
    toast.success(res.data.successMessage || "Success!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    toast.error(error?.response?.data?.ErrorMessage || "Something went wrong! Please try again.", {
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
            const res = await api.post("/uomconversion/importexcel", formData);

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
                        <div style={{ width: "100%" }}>
                            <DataTable
                                columns={columns}
                                data={DataTableSettings.filterItems(
                                    uomConversionData,
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
                className="custom-offcanvasConversion"
            // style={{ width: "800px !important" }}
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Uom Conversion" : "Add Uom Convertion"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    {loading ? (
                        <div className="d-flex justify-content-center" style={{ marginTop: '20%' }}>
                            <Spinner animation="grow" variant="secondary" size="sm" />
                            <Spinner animation="grow" variant="warning" />
                            <Spinner animation="grow" variant="secondary" size="sm" />
                            <Spinner animation="grow" variant="warning" />
                        </div>
                    ) : (
                        <Form className='h-90' onSubmit={handleSubmit}>
                            <InputGroup className="mb-4">
                                <InputGroup.Text id="Uom Conversion name">
                                    <MdOutlinePriceCheck size={25} color='#ffc800' />
                                </InputGroup.Text>
                                <Form.Control
                                    name="Uom Conversion name"
                                    value={formValues.name || ""}
                                    onChange={(e) =>
                                        setFormValues({ ...formValues, name: e.target.value })
                                    }
                                    placeholder="Uom Conversion name"
                                    aria-label="Uom Conversion name"
                                    isInvalid={!!errors.name}
                                    isValid={formValues.name && !errors.name}
                                />
                                {errors.uomName && <span className="error-msg">{errors.uomName}</span>}
                            </InputGroup>

                            <InputGroup className="mb-4">
                                <InputGroup.Text id="employeeTypeId">
                                    <LiaWeightSolid size={25} color="#ffc800" />
                                </InputGroup.Text>
                                <Form.Select
                                    value={formValues.fromUomId}
                                    onChange={(e) =>
                                        setFormValues({ ...formValues, fromUomId: e.target.value })
                                    }
                                    required
                                    isInvalid={!!errors.fromUomId}
                                >
                                    <option value="">Select Form Uom</option>
                                    {uomData?.map((item) => (
                                        <option key={item.uomId} value={item.uomId}>
                                            {item.uomName}
                                        </option>
                                    ))}
                                </Form.Select>

                            </InputGroup>

                            <InputGroup className="mb-4">
                                <InputGroup.Text id="employeeTypeId">
                                    <LiaWeightSolid size={25} color="#ffc800" />
                                </InputGroup.Text>
                                <Form.Select
                                    value={formValues.toUomId}
                                    onChange={(e) =>
                                        setFormValues({ ...formValues, toUomId: e.target.value })
                                    }
                                    required
                                    isInvalid={!!errors.toUomId}
                                >
                                    <option value="">Select To Uom</option>
                                    {uomData?.map((item) => (
                                        <option key={item.uomId} value={item.uomId}>
                                            {item.uomName}
                                        </option>
                                    ))}
                                </Form.Select>

                            </InputGroup>

                            <InputGroup className="mb-4">
                                <InputGroup.Text id="employeeTypeId">
                                    <FaHandHoldingUsd size={25} color="#ffc800" />
                                </InputGroup.Text>
                                <Form.Control
                                    type='number'
                                    placeholder="Enter Multiplier Value"
                                    value={formValues.multiplier}
                                    onChange={(e) => setFormValues({ ...formValues, multiplier: e.target.value })}
                                />
                            </InputGroup>

                            <InputGroup className="mb-4">
                                <InputGroup.Text id="employeeTypeId">
                                    <FaHandHoldingUsd size={25} color="#ffc800" />
                                </InputGroup.Text>
                                <Form.Control
                                    type='number'
                                    placeholder="Enter Fraction Value"
                                    value={formValues.addFraction}
                                    onChange={(e) => setFormValues({ ...formValues, addFraction: e.target.value })}
                                />
                            </InputGroup>



                            <InputGroup className="mb-3">
                                <InputGroup.Text id="isActive">
                                    <TbHandClick size={25} color="#ffc800" />
                                </InputGroup.Text>
                                <Form.Check
                                    type="checkbox"
                                    id="custom-checkbox"
                                    label="IsActive"
                                    name="isActive"

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
                                        className="custom-yellow-checkbox"
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, isActive: e.target.checked })
                                        }
                                        checked={formValues.isActive}
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
                            <div className="d-flex justify-content-center mt-4">
                                <Button type="submit" variant="warning">
                                    {isEditMode ? "Update" : "Save"}
                                </Button>
                            </div>
                        </Form>
                    )}
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

export default uomconversion
