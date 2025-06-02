import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup } from "react-bootstrap";
import { MdDeleteForever, MdOutlineDiscount } from "react-icons/md";
import {
  FaRegEdit, FaTrash,
  FaTimesCircle,
  FaExclamationTriangle, FaRegFile
} from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport, CiDiscount1, CiClock1 } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DiscountList = () => {

  const initialValues = {
    discountID: "",
    discountName: "",
    discountRate: "",
    discountStart: "",
    discountEnd: "",
    prefix: "",
    onGrossOrNet: "",
    discountOn: "",
  };

  const discountOption = [
    { label: "Amount", value: "A" },
    { label: "Percentage", value: "P" }
  ];

  const prefixOption = [
    { label: "GENERAL DISCOUNT", value: "GNRL" },
    { label: "ANNIVERSERY AND BDAY DISCOUNT", value: "BANI" },
    { label: "SPECIAL DISCOUNT FOR A PERIOD", value: "SPLP" },
  ];

  const grossOption = [
    { label: "With Gross", value: "G" },
    { label: "Without Gross", value: "N" }
  ];

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
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
  const [discountData, setDiscountData] = useState([]);
  const searchParam = ["itemGroupName", "isActive"];
  const [isEditMode, setIsEditMode] = useState(false);
  const [show, setShow] = useState(false);
  const [expoShow, setExpoShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleExpoClose = () => setExpoShow(false);
  const handleExpoShow = () => setExpoShow(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
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
  };

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchDiscountData();
  }, []);

  const fetchDiscountData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/discount`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setDiscountData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
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

  const validateForm = () => {
    const {
      discountName,
      discountRate,
      discountStart,
      discountEnd,
      prefix,
      onGrossOrNet,
      discountOn
    } = formValues;
    const errors = {};
    let isValid = true;

    if (!discountName) {
      isValid = false;
      errors.discountName = "Discount name is required.";
    }
    if (!discountRate) {
      isValid = false;
      errors.discountRate = "Discount rate is required";
    }
    if (!discountStart) {
      isValid = false;
      errors.discountStart = "Start date & time is required";
    }
    if (!discountEnd) {
      isValid = false;
      errors.discountEnd = "End date & time is required";
    }
    if (!prefix) {
      isValid = false;
      errors.prefix = "Prefix is required";
    }
    if (!onGrossOrNet) {
      isValid = false;
      errors.onGrossOrNet = "Gross or Net is required";
    }
    if (!discountOn) {
      isValid = false;
      errors.discountOn = "Discount type is required";
    }

    setErrors(errors);
    return isValid;
  };

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setFormValues({
      discountID: row.discountID,
      discountName: row.discountName,
      discountRate: row.discountRate,
      discountStart: row.discountStart,
      discountEnd: row.discountEnd,
      onGrossOrNet: row.onGrossOrNet,
      prefix: row.prefix,
      discountOn: row.discountOn,
      isActive: row.isActive
    });
    setShow(true);
  };

  const handleDeleteClick = (discountID, discountName) => {
    setToDelete({ id: discountID, name: discountName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/discount/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Discount deleted successfully!");
        fetchDiscountData();
      })
      .catch((error) => {
        console.error("Error deleting discount:", error);
        toast.error("Failed to delete discount.");
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
      name: <h5>Discount Name</h5>,
      selector: (row) => row.discountName,
      sortable: true,
    },
    {
      name: <h5>Discount Rate</h5>,
      selector: (row) => `${row.discountRate}%`,
      sortable: true,
    },
    {
      name: <h5>Start Date & Time</h5>,
      selector: (row) => new Date(row.discountStart).toLocaleString(),
      sortable: true,
    },
    {
      name: <h5>End Date & Time</h5>,
      selector: (row) => new Date(row.discountEnd).toLocaleString(),
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
            <Link className="action-icon" onClick={() => handleDeleteClick(row.discountID, row.discountName)}>
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const discountStart = new Date(formValues.discountStart);
    const discountEnd = new Date(formValues.discountEnd);
    const discountStartUTC = discountStart.toISOString();
    const discountEndUTC = discountEnd.toISOString();

    const payload = {
      discountName: formValues.discountName,
      discountRate: formValues.discountRate,
      discountStart: discountStartUTC,
      discountEnd: discountEndUTC,
      prefix: formValues.prefix,
      onGrossOrNet: formValues.onGrossOrNet,
      discountOn: formValues.discountOn,
      isActive: formValues.isActive,
    };

    setLoading(true);

    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/discount/${formValues.discountID}`, payload);
      } else {
        res = await api.post("/discount", payload);
      }
      setFormValues(initialValues);
      setIsEditMode(false);
      handleClose();
      fetchDiscountData();
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
      toast.error(res.data.ErrorMessage || "Something went wrong! Please try again.", {
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
                  discountData,
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
              {isEditMode ? "Edit Discount" : "Add Discount"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90' onSubmit={handleSubmit}>
            <InputGroup className="mb-4">
              <InputGroup.Text id="discountName">
                <MdOutlineDiscount size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Control
                name="discountName"
                value={formValues.discountName || ""}
                onChange={(e) =>
                  handleChange("discountName", e.target.value)
                }
                placeholder="Discount name"
                aria-label="discountName"
                isInvalid={!!errors.discountName}
                isValid={formValues.discountName && !errors.discountName}
                autoComplete='off'
              />
              {errors.discountName && <span className="error-msg">{errors.discountName}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text id="discountRate">
                <CiDiscount1 size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Control
                name="discountRate"
                value={formValues.discountRate || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*%?$/.test(value)) {
                    handleChange("discountRate", value);
                  }
                }}
                placeholder="Discount rate"
                aria-label="discountRate"
                isInvalid={!!errors.discountRate}
                isValid={formValues.discountRate && !errors.discountRate}
                autoComplete='off'
              />
              {errors.discountRate && <span className="error-msg">{errors.discountRate}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text id="discountStart">
                <CiClock1 size={25} color='#ffc800' />
              </InputGroup.Text>
              <DatePicker
                className='form-control custom-datepicker'
                selected={formValues.discountStart ? new Date(formValues.discountStart) : null}
                onChange={(date) => handleChange("discountStart", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Start Date & Time"
              />
              {errors.discountStart && <span className="error-msg">{errors.discountStart}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text id="discountEnd">
                <CiClock1 size={25} color='#ffc800' />
              </InputGroup.Text>
              <DatePicker
                className='form-control custom-datepicker'
                selected={formValues.discountEnd ? new Date(formValues.discountEnd) : null}
                onChange={(date) => handleChange("discountEnd", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="End Date & Time"
              />
              {errors.discountEnd && <span className="error-msg">{errors.discountEnd}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text id="discountOn">
                <CiDiscount1 size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Select
                name="discountOn"
                value={formValues.discountOn || ""}
                onChange={(e) => handleChange("discountOn", e.target.value)}
              >
                <option value="">Select discount type</option>
                {formValues.discountOn &&
                  !discountOption?.some(
                    (opt) => opt.value === formValues.discountOn
                  ) && (
                    <option value={formValues.discountOn}>
                      {formValues.discountOn}
                    </option>
                  )}
                {discountOption?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
              {errors.discountOn && <span className="error-msg">{errors.discountOn}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text id="prefix">
                <HiOutlineRectangleGroup size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Select
                name="prefix"
                value={formValues.prefix || ""}
                onChange={(e) => handleChange("prefix", e.target.value)}
              >
                <option value="">Select prefix</option>
                {formValues.prefix &&
                  !prefixOption?.some(
                    (opt) => opt.value === formValues.prefix
                  ) && (
                    <option value={formValues.prefix}>
                      {formValues.prefix}
                    </option>
                  )}
                {prefixOption?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
              {errors.prefix && <span className="error-msg">{errors.prefix}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text id="onGrossOrNet">
                <CiDiscount1 size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Select
                name="onGrossOrNet"
                value={formValues.onGrossOrNet || ""}
                onChange={(e) => handleChange("onGrossOrNet", e.target.value)}
              >
                <option value="">Select  Gross / Net</option>
                {formValues.onGrossOrNet &&
                  !grossOption?.some(
                    (opt) => opt.value === formValues.onGrossOrNet
                  ) && (
                    <option value={formValues.onGrossOrNet}>
                      {formValues.onGrossOrNet}
                    </option>
                  )}
                {grossOption?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
              {errors.onGrossOrNet && <span className="error-msg">{errors.onGrossOrNet}</span>}
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
        </Offcanvas.Body>
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
          <Form className='h-90' onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="itemGroupName">
                <FaRegFile size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Control
                type="file"

              />
            </InputGroup>
            <div className="d-flex justify-content-center mt-5">
              <Button type="submit" variant="warning">
                Save
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default DiscountList
