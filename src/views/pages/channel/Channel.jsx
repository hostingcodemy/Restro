import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Row, Col } from "react-bootstrap";
import {
  MdDeleteForever,
  MdOutlinePersonOutline,
  MdOutlinePhone,
  MdOutlineMail,
  MdOutlineNumbers,
  MdOutlineFoodBank
}
  from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import { FaRegEdit, FaRegFile, FaRegAddressCard } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { Spinner } from 'react-bootstrap';

const Channel = () => {

  const initialValues = {
    channelName: "",
    vatNo: "",
    pan: "",
    address1: "",
    address2: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
    gstNo: "",
    fssai: "",
    mainNightAudit: "",
    sessionOpen: "",
    afterBillHoldStatus: "",
    gstBillPrint: "",
    channelImage: "",
    isActive: false,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
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
  const [channelData, setChannelData] = useState([]);
  const searchParam = [
    "channelName",
    "phone",
    "mobile",
    "email",
    "website",
    "address1",
    "address2",
    "vatNo",
    "gstNo"
  ];
  const [isEditMode, setIsEditMode] = useState(false);
  const [show, setShow] = useState(false);
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
  };

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchChannelData();
  }, []);

  const fetchChannelData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/channels");
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setChannelData(sortedData);
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

  const validateForm = () => {
    const {
      channelName,
      pan,
      address1,
      address2,
      phone,
      mobile,
      email,
      website,
      gstNo,
      fssai,
      vatNo,
    } = formValues;
    const errors = {};
    let isValid = true;

    const phoneRegex = /^[9876]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\S*)?$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!channelName) {
      isValid = false;
      errors.channelName = "Channel name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(channelName)) {
      errors.channelName = 'Name must contain only letters';
      isValid = false;
    }
    if (!pan) {
      isValid = false;
      errors.pan = "PAN is required.";
    } else if (!panRegex.test(pan)) {
      isValid = false;
      errors.pan = "Invalid PAN No format.";
    }
    if (!address1) {
      isValid = false;
      errors.address1 = "Address 1 is required.";
    }
    if (!address2) {
      isValid = false;
      errors.address2 = "Address 2 is required.";
    }
    if (!phone) {
      isValid = false;
      errors.phone = "Phone is required.";
    } else if (phone.length < 10) {
      isValid = false;
      errors.phone = "Phone number must be exactly 10 digits.";
    } else if (!phoneRegex.test(phone)) {
      isValid = false;
      errors.phone = "Phone must start with 9, 8, 7, or 6 and have 10 digits.";
    }
    if (!mobile) {
      isValid = false;
      errors.mobile = "Mobile is required.";
    } else if (mobile.length < 10) {
      isValid = false;
      errors.mobile = "Mobile number must be exactly 10 digits.";
    } else if (!phoneRegex.test(mobile)) {
      isValid = false;
      errors.mobile = "Mobile must start with 9, 8, 7, or 6 and have 10 digits.";
    }
    if (!email) {
      isValid = false;
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      errors.email = "Enter a valid email address.";
    }
    if (!website) {
      isValid = false;
      errors.website = "Website is required.";
    } else if (!websiteRegex.test(website)) {
      isValid = false;
      errors.website = "Enter a valid website URL (e.g., https://example.com).";
    }
    if (!gstNo) {
      isValid = false;
      errors.gstNo = "GST No is required.";
    } else if (!gstRegex.test(gstNo)) {
      isValid = false;
      errors.gstNo = "Invalid GST No format.";
    }
    if (!fssai) {
      isValid = false;
      errors.fssai = "Fssai is required.";
    }
    if (!vatNo) {
      isValid = false;
      errors.vatNo = "Vat no is required.";
    }

    setErrors(errors);
    return isValid;
  };

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setFormValues({
      channelId: row.channelId,
      channelName: row.channelName,
      phone: row.phone,
      mobile: row.mobile,
      email: row.email,
      website: row.website,
      address1: row.address1,
      address2: row.address2,
      vatNo: row.vatNo,
      gstNo: row.gstNo,
      gstBillPrint: row.gstBillPrint,
      afterBillHoldStatus: row.afterBillHoldStatus,
      pan: row.pan
    });
    setShow(true);
  };

  const handleDeleteClick = (channelId, channelName) => {
    setToDelete({ id: channelId, name: channelName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/channels/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Channel deleted successfully!");
        fetchChannelData();
      })
      .catch((error) => {
        console.error("Error deleting channel:", error);
        toast.error("Failed to delete channel.");
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
      name: <h5>Channel Name</h5>,
      selector: (row) => row.channelName,
      sortable: true,
    },
    {
      name: <h5>Phone</h5>,
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: <h5>Mobile</h5>,
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: <h5>Email</h5>,
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <h5>Website</h5>,
      selector: (row) => row.website,
      sortable: true,
    },
    {
      name: <h5>Status</h5>,
      cell: (row) => (
        <span style={{
          color: row.isActive ? "#88E788" : "#FF474C",
          fontWeight: "bold",
        }}>
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
            <Link className="action-icon" onClick={() => handleDeleteClick(row.channelId, row.channelName)}>
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

    const payload = {
      channelName: formValues.channelName,
      vatNo: formValues.vatNo,
      pan: formValues.pan,
      address1: formValues.address1,
      address2: formValues.address2,
      phone: formValues.phone,
      mobile: formValues.mobile,
      email: formValues.email,
      website: formValues.website,
      gstNo: formValues.gstNo,
      fssai: formValues.fssai,
      mainNightAudit: formValues.mainNightAudit,
      sessionOpen: formValues.sessionOpen,
      afterBillHoldStatus: formValues.afterBillHoldStatus,
      gstBillPrint: formValues.gstBillPrint,
      isActive: formValues.isActive
    };
    setLoading(true);
    try {
      let res;
      if (formValues.channelId) {
        res = await api.put(`/channels/${formValues.channelId}`, payload);
      } else {
        res = await api.post("/channels", payload);
      }
      setFormValues(initialValues);
      setIsEditMode(false);
      handleClose();
      fetchChannelData();
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
                  channelData,
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
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Channel" : "Add Channel"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90' onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="channelName">
                    <MdOutlinePersonOutline size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="channelName"
                    value={formValues.channelName || ""}
                    onChange={(e) =>
                      handleChange("channelName", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                    }
                    placeholder="Name"
                    aria-label="channelName"
                    isInvalid={!!errors.channelName}
                    isValid={formValues.channelName && !errors.channelName}
                    autoComplete='off'
                  />
                  {errors.channelName && <span className="error-msg">{errors.channelName}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="phone">
                    <MdOutlinePhone size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="phone"
                    value={formValues.phone || ""}
                    onChange={(e) =>
                      handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Phone"
                    aria-label="phone"
                    isInvalid={!!errors.phone}
                    isValid={formValues.phone && !errors.phone}
                    minLength={10}
                    maxLength={15}
                    autoComplete='off'
                  />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="mobile">
                    <MdOutlinePhone size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="mobile"
                    value={formValues.mobile || ""}
                    onChange={(e) =>
                      handleChange("mobile", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Mobile"
                    aria-label="mobile"
                    isInvalid={!!errors.mobile}
                    isValid={formValues.mobile && !errors.mobile}
                    minLength={10}
                    maxLength={15}
                    autoComplete='off'
                  />
                  {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <InputGroup className="mb-4">
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
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="pan">
                    <FaRegAddressCard size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="pan"
                    value={formValues.pan || ""}
                    onChange={(e) =>
                      handleChange("pan", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="PAN"
                    aria-label="pan"
                    isInvalid={!!errors.pan}
                    isValid={formValues.pan && !errors.pan}
                    autoComplete='off'
                  />
                  {errors.pan && <span className="error-msg">{errors.pan}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="vatNo">
                    <MdOutlineNumbers size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="vatNo"
                    value={formValues.vatNo || ""}
                    onChange={(e) =>
                      handleChange("vatNo", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Vat no"
                    aria-label="vatNo"
                    isInvalid={!!errors.vatNo}
                    isValid={formValues.vatNo && !errors.vatNo}
                    autoComplete='off'
                  />
                  {errors.vatNo && <span className="error-msg">{errors.vatNo}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="gstNo">
                    <MdOutlineNumbers size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="gstNo"
                    value={formValues.gstNo || ""}
                    onChange={(e) =>
                      handleChange("gstNo", e.target.value)
                    }
                    placeholder="Gst no"
                    aria-label="gstNo"
                    isInvalid={!!errors.gstNo}
                    isValid={formValues.gstNo && !errors.gstNo}
                    autoComplete='off'
                  />
                  {errors.gstNo && <span className="error-msg">{errors.gstNo}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="website">
                    <CgWebsite size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="website"
                    value={formValues.website || ""}
                    onChange={(e) =>
                      handleChange("website", e.target.value)
                    }
                    placeholder="Website"
                    aria-label="website"
                    isInvalid={!!errors.website}
                    isValid={formValues.website && !errors.website}
                    autoComplete='off'
                  />
                  {errors.website && <span className="error-msg">{errors.website}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="fssai">
                    <MdOutlineFoodBank size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="fssai"
                    value={formValues.fssai || ""}
                    onChange={(e) =>
                      handleChange("fssai", e.target.value)
                    }
                    placeholder="Fssai"
                    aria-label="fssai"
                    isInvalid={!!errors.fssai}
                    isValid={formValues.fssai && !errors.fssai}
                    autoComplete='off'
                  />
                  {errors.fssai && <span className="error-msg">{errors.fssai}</span>}
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="address1">
                    <FaRegAddressCard size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="address1"
                    value={formValues.address1 || ""}
                    onChange={(e) =>
                      handleChange("address1", e.target.value)
                    }
                    placeholder="Address 1"
                    aria-label="address1"
                    isInvalid={!!errors.address1}
                    isValid={formValues.address1 && !errors.address1}
                    autoComplete='off'
                  />
                  {errors.address1 && <span className="error-msg">{errors.address1}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="address2">
                    <FaRegAddressCard size={25} color='#ffc800' />
                  </InputGroup.Text>
                  <Form.Control
                    name="address2"
                    value={formValues.address2 || ""}
                    onChange={(e) =>
                      handleChange("address2", e.target.value)
                    }
                    placeholder="Address 2"
                    aria-label="address2"
                    isInvalid={!!errors.address2}
                    isValid={formValues.address2 && !errors.address2}
                    autoComplete='off'
                  />
                  {errors.address2 && <span className="error-msg">{errors.address2}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="mainNightAudit">
                    <TbHandClick size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Check
                    type="checkbox"
                    id="custom-checkbox"
                    label="mainNightAudit"
                    name="mainNightAudit"

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
                      checked={formValues.mainNightAudit}
                      onChange={(e) => handleChange("mainNightAudit", e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    />
                    <Form.Check.Label htmlFor="custom-checkbox">
                      Night Audit
                    </Form.Check.Label>
                  </Form.Check>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="sessionOpen">
                    <TbHandClick size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Check
                    type="checkbox"
                    id="custom-checkbox"
                    label="sessionOpen"
                    name="sessionOpen"

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
                      checked={formValues.sessionOpen}
                      onChange={(e) => handleChange("sessionOpen", e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    />
                    <Form.Check.Label htmlFor="custom-checkbox">
                      Session Open
                    </Form.Check.Label>
                  </Form.Check>
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="afterBillHoldStatus">
                    <TbHandClick size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Check
                    type="checkbox"
                    id="custom-checkbox"
                    label="afterBillHoldStatus"
                    name="afterBillHoldStatus"

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
                      checked={formValues.afterBillHoldStatus}
                      onChange={(e) => handleChange("afterBillHoldStatus", e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    />
                    <Form.Check.Label htmlFor="custom-checkbox">
                      Bill Hold Status
                    </Form.Check.Label>
                  </Form.Check>
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="gstBillPrint">
                    <TbHandClick size={25} color="#ffc800" />
                  </InputGroup.Text>
                  <Form.Check
                    type="checkbox"
                    id="custom-checkbox"
                    label="gstBillPrint"
                    name="gstBillPrint"

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
                      checked={formValues.gstBillPrint}
                      onChange={(e) => handleChange("gstBillPrint", e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    />
                    <Form.Check.Label htmlFor="custom-checkbox">
                      GST Bill Print
                    </Form.Check.Label>
                  </Form.Check>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
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
                Submit
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Channel
