import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../../../config/AxiosInterceptor';
import { Form, Button, Offcanvas, InputGroup, Spinner, Row, Col } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
  FaRegEdit,
  FaTrash,
  FaTimesCircle,
  FaExclamationTriangle,
  FaMicrophone,
  FaBuilding
}
  from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";

const Section = () => {

  const fetchCalled = useRef(false);
  const commonRef = useRef(null);
  const initialValues = {
    sectionId: "",
    floorName: "",
    outletId: "",
    isActive: true,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [sectionData, setSectionData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const searchParam = ["floorName", "OutletName", "IsActive"];

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
    fetchOutletData();
  };

  useEffect(() => {
    if (setShow && commonRef.current) {
      commonRef.current.focus();
    }
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchSectionData();
  }, [setShow]);

  const fetchSectionData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/section`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setSectionData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
    } finally {
      setLoading(false);
    }
  };

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
    const { FloorName } = formValues;
    const errors = {};
    let isValid = true;

    if (!FloorName) {
      isValid = false;
      errors.FloorName = "Floor name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(FloorName)) {
      errors.FloorName = 'Name must contain only letters';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setFormValues({
      sectionId: row.sectionId,
      floorName: row.floorName,
      outletId: row.outletId,
      isActive: row.isActive
    });
    setShow(true);
  };

  const handleDeleteClick = (sectionId, floorName) => {
    setToDelete({ id: sectionId, name: floorName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/section/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Floor deleted successfully!");
        fetchSectionData();
      })
      .catch((error) => {
        console.error("Error deleting floor:", error);
        toast.error("Failed to delete floor.");
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
      name: <h5>Floor Name</h5>,
      selector: (row) => row.floorName,
      sortable: true,
    },
    {
      name: <h5>Outlet Name</h5>,
      selector: (row) => row.outletName,
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
          <Link className="action-icon"
            onClick={(e) => {
              e.preventDefault();
              handleEditClick(row);
            }}
            title='Edit'
          >
            <FaRegEdit size={24} color="#87CEEB" />
          </Link>
          <Link className="action-icon" onClick={() => handleDeleteClick(row.sectionId, row.floorName)} title='Delete'>
            <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
          </Link>
        </>
      ),
    },
  ];

  const subHeaderComponentMemo = useMemo(() => (
    <div className="d-flex justify-content-end gap-2 align-items-center w-100">
      <div className="position-relative ">
        <Form.Control
          type="search"
          placeholder="Search..."
          className="me-2 rounded-pill"
          aria-label="Search"
          onChange={(e) => setFilterText(e.target.value)}
        />
        <FaMicrophone
          size={20}
          color="#ffc800"
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer"
          }}
        />
      </div>
      <Button variant="warning" onClick={handleShow}>
        <GoPlus size={20} /> Add
      </Button>
    </div>
  ), [filterText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      floorName: formValues.floorName,
      outletId: formValues.outletId,
      isActive: formValues.isActive
    };

    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/section/${formValues.sectionId}`, payload);
      } else {
        res = await api.post("/section", payload);
      }
      handleClose();
      fetchSectionData();
      toast.success(res.data.successMessage || "Success!");
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
            <DataTable
              className='DataTable'
              columns={columns}
              data={DataTableSettings.filterItems(sectionData, searchParam, filterText)}
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

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        backdrop="false"
        className="custom-offcanvas"
        onEntered={() => {
          if (commonRef.current) {
            commonRef.current.focus();
          }
        }}
      >
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Section" : "Add Section"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90' onSubmit={handleSubmit}>
            <Row className='mb-2'>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id='floorName'>
                    <FaBuilding size={25} color='#ffc800' title='Floor' />
                  </InputGroup.Text>
                  <Form.Control
                    name="floorName"
                    ref={commonRef}
                    value={formValues.floorName}
                    onChange={(e) => handleChange("floorName", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                    placeholder="Floor name"
                    isInvalid={!!errors.floorName}
                    isValid={formValues.floorName && !errors.floorName}
                  />
                  {errors.floorName && <span className="error-msg">{errors.floorName}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-4">
                  <InputGroup.Text id="outletId">
                    <CiLocationOn size={25} color='#ffc800' title='Location' />
                  </InputGroup.Text>
                  <Form.Select
                    name="outletId"
                    value={formValues.outletId || ""}
                    onChange={(e) => handleChange("outletId", e.target.value)}
                  >
                    <option>Select Outlet</option>
                    {outletData?.map((item) => (
                      <option key={item.outletId} value={item.outletId}>
                        {item.outletName}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.outletId && <span className="error-msg">{errors.outletId}</span>}
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <TbHandClick size={25} color="#ffc800" title='Active' />
                  </InputGroup.Text>
                  <Form.Check
                    type="checkbox"
                    label="IsActive"
                    checked={formValues.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="ms-3"
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
    </>
  )
}

export default Section
