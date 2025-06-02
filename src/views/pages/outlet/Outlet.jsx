import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit,FaCodeBranch,FaRegFile } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";

const Outlet = () => {

  const initialValues = {
    outletName: "",
    outletCode: "",
    outletType: "",
    hsnCode: "",
    channelID: "",
    phone: "",
    mobile: "",
    email: "",
  }
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
  const [outletData, setOutletData] = useState([]);
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

  const handleEditClick = (row) => {
    setFormValues({
      OutletId: row.OutletId,
      outletName: row.outletName,
      outletCode: row.outletCode,
      outletType: row.outletType,
      hsnCode: row.hsnCode,
    });
  };

  const handleDeleteClick = (outletID, outletName) => {
    if (window.confirm(`Are you sure you want to delete the outlet "${outletName}"?`)) {
      api.delete(`/outlets/${outletID}`)
        .then((res) => {
          toast.success(res.data.successMessage || "Outlet deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchOutletData();
        })
        .catch((error) => {
          console.error("Error deleting outlet:", error);
          toast.error("Failed to delete outlet.", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  };

  const columns = [
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
          {permissions?.write && (
            <Link className="action-icon" onClick={() => handleEditClick(row)}>
              <FaRegEdit size={24} color="#87CEEB" />
            </Link>
          )}
          {permissions?.delete && (
            <Link className="action-icon" onClick={() => handleDeleteClick(row.outletID, row.outletName)}>
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
      outletName: formValues.outletName,
      outletCode: formValues.outletCode,
      outletType: formValues.outletType,
      hsnCode: formValues.hsnCode,
      channelID: "409967e4-2cf8-4bb3-989a-2bd2755ffce1",
    };

    try {
      let res;
      if (formValues.OutletId) {
        res = await api.put(`/outlets/${formValues.OutletId}`, payload);
      } else {
        res = await api.post("/outlets", payload);
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
        navigate("/outlets");
      }, 3000);
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
    }
  };

  return (
    <>
      <ToastContainer />

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

      <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="false" style={{ "--bs-offcanvas-width": "800px" }}>
        <Offcanvas.Header closeButton>
          <div className="w-100 text-center">
            <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
              {isEditMode ? "Edit Group" : "Add Group"}
            </Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ marginTop: "-2vh" }}>
          <Form className='h-90' onSubmit={handleSubmit}>
            <InputGroup className="mb-4">
              <InputGroup.Text>
                {/* <MdOutlinePersonOutline size={25} color='#ffc800' /> */}
              </InputGroup.Text>
              <Form.Control
                name="itemGroupName"
                value={formValues.itemGroupName}
                onChange={(e) => handleChange("itemGroupName", e.target.value.replace(/[^a-zA-Z ]/g, ""))}
                placeholder="Group name"
                isInvalid={!!errors.itemGroupName}
                isValid={formValues.itemGroupName && !errors.itemGroupName}
              />
              {errors.itemGroupName && <span className="error-msg">{errors.itemGroupName}</span>}
            </InputGroup>
{/* 
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <FaCodeBranch size={25} color="#ffc800" />
              </InputGroup.Text>
              <Form.Select
                name="itemGroupCode"
                value={formValues.itemGroupCode || ""}
                onChange={(e) => handleChange("itemGroupCode", e.target.value)}
              >
                <option value="">Select group code</option>
                {formValues.itemGroupCode &&
                  !groupCodeOptions?.some(
                    (opt) => opt.value === formValues.itemGroupCode
                  ) && (
                    <option value={formValues.itemGroupCode}>
                      {formValues.itemGroupCode}
                    </option>
                  )}
                {groupCodeOptions?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
              {errors.itemGroupCode && <span className="error-msg">{errors.itemGroupCode}</span>}
            </InputGroup> */}

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
