import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Row, Col } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
  FaRegEdit, FaTimesCircle, FaTrash,
  FaExclamationTriangle, FaRegFile
} from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport, CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { PiMicrophoneThin } from "react-icons/pi";
import { FaCode, FaPhone } from "react-icons/fa6";
import { MdOutlineMail, MdOutlinePayment } from "react-icons/md";
import { FaRegClock, FaRegAddressBook } from "react-icons/fa";
import { TbTax, TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';

const Outlet = () => {

  const billTypeOptions = [
    { label: "FOOD SALES", value: "FOOD SALES" },
    { label: "BEVERAGE SALES", value: "BEVERAGE SALES" },
    { label: "BAR SALES", value: "BAR SALES" },
    { label: "TOBACCO SALES", value: "TOBACCO SALES" },
  ];

  const payOptions = [
    { label: "CASH", value: "CASH" },
    { label: "CARD", value: "CARD" },
    { label: "UPI", value: "UPI" },
  ];

  const initialValues = {
    outletId: "",
    outletName: "",
    outletTypeID: "",
    outletImageFile: null,
    sac: "",
    phone: "",
    mobile: "",
    email: "",
    outletCode: "",
    cuisineType: "",
    openingHours: "",
    billPrefix: "",
    billType: "",
    barBillPrefix: "",
    defaultPaymode: "",
    outletAddress: "",
    outletTaxNo: "",
    isActive: true,
  }

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const fetchCalled = useRef(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [outletData, setOutletData] = useState([]);
  const [subGroupData, setSubGroupData] = useState([]);
  const [outletTypeData, setOutletTypeData] = useState([]);
  const searchParam = [
    "outletName",
    "outletCode",
    "outletType",
    "hsnCode"
  ];
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
    fetchSubGroupData();
    fetchOutletTypeData();
    setLoading(false);
  };

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchOutletData();
  }, []);

  const fetchOutletData = async () => {
    try {
      const res = await api.get("/outlets");
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setOutletData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
      setLoadingIndicator(false);
    }
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
    } finally {
      setLoading(false);
    }
  };

  const fetchOutletTypeData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/outlettype");
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setOutletTypeData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const
      {
        outletName,
        outletTypeID,
        phone,
        mobile,
        email,
        sac,
        outletCode,
        cuisineType,
        openingHours,
        billPrefix,
        billType,
        barBillPrefix,
        defaultPaymode,
        outletAddress,
        outletTaxNo
      } = formValues;
    const errors = {};
    let isValid = true;

    if (!outletName) {
      isValid = false;
      errors.outletName = "Outlet name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(outletName)) {
      errors.outletName = 'Name must contain only letters';
      isValid = false;
    }
    if (!outletTypeID) {
      isValid = false;
      errors.outletTypeID = "Outlet type is required.";
    }
    if (!phone) {
      isValid = false;
      errors.phone = "Phone is required.";
    } else if (!/^91\d{10}$/.test(phone)) {
      isValid = false;
      errors.phone = "Phone must start with '91' followed by a valid 10-digit number.";
    }
    if (!mobile) {
      isValid = false;
      errors.mobile = "Mobile is required.";
    } else if (!/^91\d{10}$/.test(mobile)) {
      isValid = false;
      errors.mobile = "Mobile must start with '91' followed by a valid 10-digit number.";
    }
    if (!email) {
      isValid = false;
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      isValid = false;
      errors.email = "Email is not valid.";
    }
    if (!sac) {
      isValid = false;
      errors.sac = "Sac is required.";
    }
    if (!sac) {
      isValid = false;
      errors.sac = "Sac is required.";
    }
    if (!outletCode) {
      isValid = false;
      errors.outletCode = "Outlet code is required.";
    }
    if (!cuisineType) {
      isValid = false;
      errors.cuisineType = "Cusine type is required.";
    }
    if (!openingHours) {
      isValid = false;
      errors.openingHours = "Opening hours is required.";
    }
    if (!billPrefix) {
      isValid = false;
      errors.billPrefix = "Bill prefix is required.";
    } else if (!/^[a-zA-Z ]+$/.test(billPrefix)) {
      errors.billPrefix = 'Name must contain only letters';
      isValid = false;
    }
    if (!barBillPrefix) {
      isValid = false;
      errors.barBillPrefix = "Bar bill prefix is required.";
    }
    if (!billType) {
      isValid = false;
      errors.billType = "Bill type is required.";
    }
    if (!defaultPaymode) {
      isValid = false;
      errors.defaultPaymode = "Default pay mode is required.";
    }
    if (!outletAddress) {
      isValid = false;
      errors.outletAddress = "Address is required.";
    }
    if (!outletTaxNo) {
      isValid = false;
      errors.outletTaxNo = "Tax no is required.";
    }

    setErrors(errors);
    return isValid;
  };

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setFormValues({
      outletId: row.outletId,
      outletName: row.outletName,
      outletTypeID: row.outletTypeID,
      sac: row.sac,
      phone: row.phone,
      mobile: row.mobile,
      email: row.email,
      outletCode: row.outletCode,
      cuisineType: row.cuisineType,
      openingHours: row.openingHours,
      billPrefix: row.billPrefix,
      billType: row.billType,
      barBillPrefix: row.barBillPrefix,
      defaultPaymode: row.defaultPaymode,
      outletAddress: row.outletAddress,
      outletTaxNo: row.outletTaxNo,
      isActive: row.isActive
    });
    setShow(true);
  };

  const handleDeleteClick = (outletId, outletName) => {
    setToDelete({ id: outletId, name: outletName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/outlets/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Outlet deleted successfully!");
        fetchOutletData();
      })
      .catch((error) => {
        console.error("Error deleting outlet:", error);
        toast.error("Failed to delete outlet.");
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
      name: <h5>Outlet Image</h5>,
      selector: (row) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={
              row.outletImage
                ? `${import.meta.env.VITE_IMG_BASE_URL}/${row.outletImage}`
                : 'src/assets/outlet.png'
            }
            alt={row.itemName}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'fill',
              borderRadius: '0px',
            }}
          />
        </div>
      ),
      sortable: false,
      center: true,
    },
    {
      name: <h5>Outlet Name</h5>,
      selector: (row) => row.outletName,
      sortable: true,
    },
    {
      name: <h5>Email</h5>,
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <h5>Phone</h5>,
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: <h5>Channel Name</h5>,
      selector: (row) => row.channelName,
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
          <Link className="action-icon" onClick={(e) => {
            e.preventDefault();
            handleEditClick(row);
          }}
            title='Edit'
          >
            <FaRegEdit size={24} color="#87CEEB" />
          </Link>
          <Link className="action-icon" onClick={() => handleDeleteClick(row.outletId, row.outletName)} title='Delete'>
            <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
          </Link>
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
      <PiMicrophoneThin size={30} color='yellow' />
      <Button variant="info" >
        <CiExport size={20} /> Import
      </Button>
      <Button variant="success" >
        <CiImport size={20} /> Export
      </Button>
      <Button variant="warning" onClick={handleShow}>
        <GoPlus size={20} /> Add
      </Button>
    </div>
  ), [filterText]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("outletName", formValues.outletName);
    formData.append("outletCode", formValues.outletCode);
    formData.append("outletTypeID", formValues.outletTypeID);
    formData.append("phone", formValues.phone);
    formData.append("sac", formValues.sac);
    formData.append("mobile", formValues.mobile);
    formData.append("email", formValues.email);
    formData.append("cuisineType", formValues.cuisineType);
    formData.append("openingHours", formValues.openingHours);
    formData.append("billPrefix", formValues.billPrefix);
    formData.append("billType", formValues.billType);
    formData.append("barBillPrefix", formValues.barBillPrefix);
    formData.append("defaultPaymode", formValues.defaultPaymode);
    formData.append("outletAddress", formValues.outletAddress);
    formData.append("outletTaxNo", formValues.outletTaxNo);
    formData.append("isActive", formValues.isActive);
    if (formValues.outletImageFile) {
      formData.append("outletImageFile", formValues.outletImageFile);
    }

    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/outlets/${formValues.outletId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/outlets", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleClose();
      fetchOutletData();
      toast.success(res.data.successMessage || "Success!");
    } catch (error) {
      console.error("API Error:", error);
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
            <DataTable
              className='DataTable'
              columns={columns}
              data={DataTableSettings.filterItems(outletData, searchParam, filterText)}
              pagination
              paginationPerPage={DataTableSettings.paginationPerPage}
              paginationRowsPerPageOptions={DataTableSettings.paginationRowsPerPageOptions}
              progressPending={loadingIndicator}
              subHeader
              fixedHeaderScrollHeight="400px"
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
            />
          </div>
        </div>
      )}

      <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="false" className="custom-offcanvas">
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Outlet" : "Add Outlet"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90' onSubmit={handleSubmit}>
            <Row md={3}>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="outletName">
                    <CiLocationOn size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="outletName"
                    value={formValues.outletName || ""}
                    onChange={(e) =>
                      handleChange("outletName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
                    placeholder="Outlet name"
                    aria-label="outletName"
                    isInvalid={!!errors.outletName}
                    isValid={formValues.outletName && !errors.outletName}
                    autoComplete='off'
                  />
                  {errors.outletName && <span className="error-msg">{errors.outletName}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="outletCode">
                    <FaCode size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="outletCode"
                    value={formValues.outletCode || ""}
                    onChange={(e) =>
                      handleChange("outletCode", e.target.value)
                    }
                    placeholder="Outlet code"
                    aria-label="outletCode"
                    isInvalid={!!errors.outletCode}
                    isValid={formValues.outletCode && !errors.outletCode}
                    autoComplete='off'
                  />
                  {errors.outletCode && <span className="error-msg">{errors.outletCode}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="sac">
                    <FaCode size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="sac"
                    value={formValues.sac || ""}
                    onChange={(e) =>
                      handleChange("sac", e.target.value)
                    }
                    placeholder="sac"
                    aria-label="sac"
                    isInvalid={!!errors.sac}
                    isValid={formValues.sac && !errors.sac}
                    autoComplete='off'
                  />
                  {errors.sac && <span className="error-msg">{errors.sac}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row md={4}>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="phone">
                    <FaPhone size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="phone"
                    value={formValues.phone || ""}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    placeholder="Phone"
                    aria-label="phone"
                    isInvalid={!!errors.phone}
                    isValid={formValues.phone && !errors.phone}
                    autoComplete='off'
                  />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="mobile">
                    <FaPhone size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="mobile"
                    value={formValues.mobile || ""}
                    onChange={(e) =>
                      handleChange("mobile", e.target.value)
                    }
                    placeholder="Mobile"
                    aria-label="mobile"
                    isInvalid={!!errors.mobile}
                    isValid={formValues.mobile && !errors.mobile}
                    autoComplete='off'
                  />
                  {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="email">
                    <MdOutlineMail size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="email"
                    value={formValues.email || ""}
                    onChange={(e) =>
                      handleChange("email", e.target.value)
                    }
                    placeholder="Email"
                    aria-label="email"
                    isInvalid={!!errors.email}
                    isValid={formValues.email && !errors.email}
                    autoComplete='off'
                  />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row md={4} className='mt-2'>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="outletTypeID">
                    <CiLocationOn size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Select
                    name="outletTypeID"
                    value={formValues.outletTypeID || ""}
                    onChange={(e) => handleChange("outletTypeID", e.target.value)}
                  >
                    <option value="">Select outlet type</option>
                    {outletTypeData?.map((item) => (
                      <option key={item.outletTypeID} value={item.outletTypeID}>
                        {item.outletTypeName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.outletTypeID && <span className="error-msg">{errors.outletTypeID}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="cuisineType">
                    <CiLocationOn size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Select
                    name="cuisineType"
                    value={formValues.cuisineType || ""}
                    onChange={(e) => handleChange("cuisineType", e.target.value)}
                  >
                    <option value="">Select cuisine type</option>
                    {subGroupData?.map((item) => (
                      <option key={item.itemSubGroupId} value={item.itemSubGroupId}>
                        {item.itemSubGroupName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.cuisineType && <span className="error-msg">{errors.cuisineType}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="openingHours">
                    <FaRegClock size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="openingHours"
                    value={formValues.openingHours || ""}
                    onChange={(e) =>
                      handleChange("openingHours", e.target.value)
                    }
                    placeholder="Opening hours"
                    aria-label="openingHours"
                    isInvalid={!!errors.openingHours}
                    isValid={formValues.openingHours && !errors.openingHours}
                    autoComplete='off'
                  />
                  {errors.openingHours && <span className="error-msg">{errors.openingHours}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row md={4} className='mt-2'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="billPrefix">
                    <CiMoneyBill size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="billPrefix"
                    value={formValues.billPrefix || ""}
                    onChange={(e) =>
                      handleChange("billPrefix", e.target.value)
                    }
                    placeholder="Bill prefix"
                    aria-label="billPrefix"
                    isInvalid={!!errors.billPrefix}
                    isValid={formValues.billPrefix && !errors.billPrefix}
                    autoComplete='off'
                  />
                  {errors.billPrefix && <span className="error-msg">{errors.billPrefix}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="billType">
                    <CiMoneyBill size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Select
                    name="billType"
                    value={formValues.billType || ""}
                    onChange={(e) => handleChange("billType", e.target.value)}
                  >
                    <option value="">Select Bill Type</option>
                    {formValues.billType &&
                      !billTypeOptions?.some(
                        (opt) => opt.value === formValues.billType
                      ) && (
                        <option value={formValues.billType}>
                          {formValues.billType}
                        </option>
                      )}
                    {billTypeOptions?.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.billType && <span className="error-msg">{errors.billType}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="barBillPrefix">
                    <CiMoneyBill size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="barBillPrefix"
                    value={formValues.barBillPrefix || ""}
                    onChange={(e) =>
                      handleChange("barBillPrefix", e.target.value)
                    }
                    placeholder="Bar bill prefix"
                    aria-label="barBillPrefix"
                    isInvalid={!!errors.barBillPrefix}
                    isValid={formValues.barBillPrefix && !errors.barBillPrefix}
                    autoComplete='off'
                  />
                  {errors.barBillPrefix && <span className="error-msg">{errors.barBillPrefix}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row md={4} className='mt-2'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="defaultPaymode">
                    <MdOutlinePayment size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Select
                    name="defaultPaymode"
                    value={formValues.defaultPaymode || ""}
                    onChange={(e) => handleChange("defaultPaymode", e.target.value)}
                  >
                    <option value="">Select pay mode</option>
                    {formValues.defaultPaymode &&
                      !payOptions?.some(
                        (opt) => opt.value === formValues.defaultPaymode
                      ) && (
                        <option value={formValues.defaultPaymode}>
                          {formValues.defaultPaymode}
                        </option>
                      )}
                    {payOptions?.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.defaultPaymode && <span className="error-msg">{errors.defaultPaymode}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="outletTaxNo">
                    <TbTax size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="outletTaxNo"
                    value={formValues.outletTaxNo || ""}
                    onChange={(e) =>
                      handleChange("outletTaxNo", e.target.value)
                    }
                    placeholder="Tax no"
                    aria-label="outletTaxNo"
                    isInvalid={!!errors.outletTaxNo}
                    isValid={formValues.outletTaxNo && !errors.outletTaxNo}
                    autoComplete='off'
                  />
                  {errors.outletTaxNo && <span className="error-msg">{errors.outletTaxNo}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="outletAddress">
                    <FaRegAddressBook size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="outletAddress"
                    value={formValues.outletAddress || ""}
                    onChange={(e) =>
                      handleChange("outletAddress", e.target.value)
                    }
                    placeholder="Outlet address"
                    aria-label="outletAddress"
                    isInvalid={!!errors.outletAddress}
                    isValid={formValues.outletAddress && !errors.outletAddress}
                    autoComplete='off'
                  />
                  {errors.outletAddress && <span className="error-msg">{errors.outletAddress}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row md={4} className='mt-2'>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaRegFile size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormValues(prev => ({
                          ...prev,
                          outletImageFile: file
                        }));
                      }
                    }}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <TbHandClick size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Check
                    type="checkbox"
                    label="IsActive"
                    checked={formValues.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="ms-3 mt-2"
                    style={{ size: '30px' }}
                  />
                </InputGroup>
              </Col>
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Button type="submit" variant="warning">
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
              <Form.Control type="file" />
            </InputGroup>
            <div className="d-flex justify-content-center mt-5">
              <Button type="submit" variant="warning">Save</Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Outlet
