import { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button, Offcanvas, InputGroup, Spinner } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import {
  FaRegEdit,
  FaCodeBranch,
  FaRegFile,
  FaTrash,
  FaTimesCircle,
  FaExclamationTriangle
}
  from "react-icons/fa";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { CiImport, CiExport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { toast, ToastContainer } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';
import axios from "axios";

const Group = () => {

  const location = useLocation();
  const fetchCalled = useRef(false);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    if (location.state?.permissions) {
      setPermissions(location.state.permissions);
    }
  }, [location.state?.permissions]);

  const initialValues = {
    itemGroupId: "",
    itemGroupName: "",
    itemGroupCode: "",
    isActive: false,
  };

  const initialImpValues = {
    File: "",
  };

  const groupCodeOptions = [
    { label: "FinishedGoods", value: "1" },
    { label: "SemiFinishedGoods", value: "2" },
    { label: "RawMaterial", value: "3" },
    { label: "Consumables", value: "4" },
    { label: "SpareParts", value: "5" },
    { label: "PackagingMaterial", value: "6" },
    { label: "Service", value: "7" },
    { label: "Other", value: "8" },
  ];

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formImpValues, setFormImpValues] = useState(initialImpValues);
  const [impErrors, setImpErrors] = useState({});
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [groupData, setGroupData] = useState([]);
  const searchParam = ["itemGroupName", "itemGroupCode", "isActive"];
  const [isEditMode, setIsEditMode] = useState(false);
  const [show, setShow] = useState(false);
  const [expoShow, setExpoShow] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleExpoClose = () => setExpoShow(false);
  const handleExpoShow = () => setExpoShow(true);

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/itemgroups`);
      const sortedData = res?.data?.list?.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setGroupData(sortedData);
    } catch (error) {
      console.error("Error fetching table data", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get("/itemgroups/exportexcel", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "itemGroup.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to export file.");
    }
  };

  // const downloadExcel = async () => {
  //   try {
  //     const response = await axios.get("/itemgroups/exportexcel", {
  //       responseType: "blob", // Important: ensures binary data is received correctly
  //     });

  //     // Create a blob from the response
  //     const blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     // Create a URL for the blob
  //     const url = window.URL.createObjectURL(blob);

  //     // Create a temporary link element
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "itemGroup.xlsx");

  //     // Trigger download
  //     document.body.appendChild(link);
  //     link.click();

  //     // Cleanup
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading the Excel file:", error);
  //     alert("Failed to download Excel file.");
  //   }
  // };

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

  const validateForm = () => {
    const { itemGroupName, itemGroupCode } = formValues;
    const errors = {};
    let isValid = true;

    if (!itemGroupName) {
      isValid = false;
      errors.itemGroupName = "Group name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(itemGroupName)) {
      errors.itemGroupName = 'Name must contain only letters';
      isValid = false;
    }
    if (!itemGroupCode) {
      isValid = false;
      errors.itemGroupCode = "Group code is required.";
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
      itemGroupId: row.itemGroupId,
      itemGroupName: row.itemGroupName,
      itemGroupCode: row.itemGroupCode,
      isActive: row.isActive
    });
    setShow(true);
  };

  const handleDeleteClick = (itemGroupId, itemGroupName) => {
    setToDelete({ id: itemGroupId, name: itemGroupName });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    setLoading(true);
    api.delete(`/itemgroups/${toDelete.id}`)
      .then((res) => {
        toast.success(res.data.successMessage || "Group deleted successfully!");
        fetchGroupData();
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
      name: <h5>Group Name</h5>,
      selector: (row) => row.itemGroupName,
      sortable: true,
    },
    {
      name: <h5>Group Code</h5>,
      selector: (row) => row.itemGroupCode,
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
            <Link className="action-icon" onClick={() => handleDeleteClick(row.itemGroupId, row.itemGroupName)}>
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

    const payload = {
      itemGroupName: formValues.itemGroupName,
      itemGroupCode: formValues.itemGroupCode,
      isActive: formValues.isActive
    };

    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await api.put(`/itemgroups/${formValues.itemGroupId}`, payload);
      } else {
        res = await api.post("/itemgroups", payload);
      }
      handleClose();
      fetchGroupData();
      toast.success(res.data.successMessage || "Success!");
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
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
      const res = await api.post("/itemgroups/importexcel", formData);

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
            <DataTable
              className='DataTable'
              columns={columns}
              data={DataTableSettings.filterItems(groupData, searchParam, filterText)}
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
                <MdOutlinePersonOutline size={25} color='#ffc800' />
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
  );
};

export default Group;

