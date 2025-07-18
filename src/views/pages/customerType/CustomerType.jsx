import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../../../config/AxiosInterceptor';
import { Form, Button, Offcanvas, InputGroup, Spinner } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
  FaRegEdit,
  FaTrash,
  FaTimesCircle,
  FaExclamationTriangle
}
  from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";

const CustomerType = () => {

  const fetchCalled = useRef(false);
  const initialValues = {
    customerTypeId: "",
    customerTypeName: "",
    customerCode: "",
    isActive: true,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const searchParam = ["customerTypeName", "customerCode", "isActive"];

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
    fetchCustomerTypeData();
  }, []);

  const fetchCustomerTypeData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/customertype`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setCustomerTypeData(sortedData);
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
    const { customerTypeName, customerCode } = formValues;
    const errors = {};
    let isValid = true;

    if (!customerTypeName) {
      isValid = false;
      errors.customerTypeName = "Customer type name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(customerTypeName)) {
      errors.customerTypeName = 'Name must contain only letters';
      isValid = false;
    }
    if (!customerCode) {
      isValid = false;
      errors.customerCode = "Customer code is required.";
    }

    setErrors(errors);
    return isValid;
  };

  const handleEditClick = (row) => {
    setIsEditMode(true);
    setFormValues({
      customerTypeId: row.customerTypeId,
      customerTypeName: row.customerTypeName,
      customerCode: row.customerCode,
      isActive: row.isActive
    });
    setShow(true);
  };

  const handleDeleteClick = (customerTypeId, customerTypeName) => {
    setToDelete({ id: customerTypeId, name: customerTypeName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/customertype/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Customer type deleted successfully!");
        fetchCustomerTypeData();
      })
      .catch((error) => {
        console.error("Error deleting customer type:", error);
        toast.error("Failed to delete customer type.");
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
      name: <h5>Customer type Name</h5>,
      selector: (row) => row.customerTypeName,
      sortable: true,
    },
    {
      name: <h5>Customer code</h5>,
      selector: (row) => row.customerCode,
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
          <Link className="action-icon" onClick={() => handleDeleteClick(row.customerTypeId, row.customerTypeName)} title='Delete'>
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
      <Button variant="warning" onClick={handleShow}>
        <GoPlus size={20} /> Add
      </Button>
    </div>
  ), [filterText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      customerTypeName: formValues.customerTypeName,
      customerCode: formValues.customerCode,
      isActive: formValues.isActive
    };

    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/customertype/${formValues.customerTypeId}`, payload);
      } else {
        res = await api.post("/customertype", payload);
      }
      handleClose();
      fetchCustomerTypeData();
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
              data={DataTableSettings.filterItems(customerTypeData, searchParam, filterText)}
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

      <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="false" style={{ "--bs-offcanvas-width": "800px" }}>
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Customer Type" : "Add Customer Type"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90' onSubmit={handleSubmit}>
            <InputGroup className="mb-4">
              <InputGroup.Text>
                <MdOutlinePersonOutline size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Control
                name="customerTypeName"
                value={formValues.customerTypeName}
                onChange={(e) => handleChange("customerTypeName", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                placeholder="Customer type name"
                isInvalid={!!errors.customerTypeName}
                isValid={formValues.customerTypeName && !errors.customerTypeName}
              />
              {errors.customerTypeName && <span className="error-msg">{errors.customerTypeName}</span>}
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroup.Text>
                <MdOutlinePersonOutline size={25} color='#ffc800' />
              </InputGroup.Text>
              <Form.Control
                name="customerCode"
                value={formValues.customerCode}
                onChange={(e) => handleChange("customerCode", e.target.value)}
                placeholder="Customer code"
                isInvalid={!!errors.customerCode}
                isValid={formValues.customerCode && !errors.customerCode}
              />
              {errors.customerCode && <span className="error-msg">{errors.customerCode}</span>}
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text>
                <TbHandClick size={25} color="#ffc800" />
              </InputGroup.Text>
              <Form.Check
                type="checkbox"
                label="IsActive"
                checked={formValues.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="ms-3"
              />
            </InputGroup>

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

export default CustomerType
