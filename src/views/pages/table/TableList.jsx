import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Form, Button, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../config/AxiosInterceptor';

const TableList = () => {

    const fetchCalled = useRef(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken")

    const [filterText, setFilterText] = useState("");
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [tableData, setTableData] = useState([]);
    const searchParam = [
        "tableName",
        "capacity",
        "tableStatus",
        "tableLocation",
        "isActive"
    ];

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchTableData();
    }, []);

    const fetchTableData = async () => {
        try {
            const res = await api.get("/tables");
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
              );
            setTableData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const handleEditClick = (row) => {
        setFormValues({
            tableId: row.tableID,
            TableName: row.tableName,
            Capacity: row.capacity,
            channelID: "d3b8af53-ec22-4b5c-875d-6080c005e9e3",
            tableLocation: "f18bd6e6-bc6d-4ab3-8751-0cf2548d11ff",
            tableStatus: row.tableStatus
        });
    };

    const handleDeleteClick = (tableID, tableName) => {
        if (window.confirm(`Are you sure you want to delete the table "${tableName}"?`)) {
            api.delete(`/tables/${tableID}`)
                .then((res) => {
                    toast.success(res.data.successMessage || "Table deleted successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    fetchTableData();
                })
                .catch((error) => {
                    console.error("Error deleting table:", error);
                    toast.error("Failed to delete table.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                });
        }
    };

    const handleToggleStatus = async (row) => {
        const updatedStatus = !row.isActive;
    
        try {
            await api.delete(`/tables/${row.tableId}`, {
                isActive: updatedStatus
            });
    
            setTableData(prev =>
                prev.map(item =>
                    item.tableId === row.tableId ? { ...item, isActive: updatedStatus } : item
                )
            );
        } catch (error) {
            alert("Failed to update table status.");
        }
    };

    const columns = [
        {
            name: <h5>Table Name</h5>,
            selector: (row) => row.tableName,
            sortable: true,
        },
        {
            name: <h5>Pax</h5>,
            selector: (row) => row.capacity,
            sortable: true,
        },
        {
            name: <h5>Outlet</h5>,
            selector: (row) => row.channelName,
            sortable: true,
        },
        {
            name: <h5>Table Status</h5>,
            selector: (row) => row.tableStatus,
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            cell: (row) => (
                <Form.Check
                    type="switch"
                    id={`switch-${row.tableID}`}
                    checked={row.isActive}
                    onChange={() => handleToggleStatus(row)}
                    label={row.isActive ? "Active" : "Inactive"}
                />
            ),
            sortable: true,
        },
        {
            name: <h5>Action</h5>,
            center: true,
            cell: (row) => (
                <>
                    <Link className="action-icon" onClick={() => handleEditClick(row)}>
                        <FaRegEdit size={24} color="blue" />
                    </Link>
                    <Link className="action-icon" onClick={() => handleDeleteClick(row.tableID, row.tableName)}>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="red" />
                    </Link>
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => {
        return (
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
                <Button variant="primary" onClick={() => navigate("/table")}>
                    New Table
                </Button>
            </div>
        );
    }, []);

    return (
        <>
            <div className='d-flex'>
                <div className='p-3' style={{ width: "100vw" }}>
                    <div  style={{ width: "100%" }}>
                        <DataTable
                            columns={columns}
                            data={DataTableSettings.filterItems(
                                tableData,
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
        </>
    )
}

export default TableList;
