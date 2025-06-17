import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useNavigate } from 'react-router-dom';

const Customer = () => {

    const navigate = useNavigate();

    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [customerData, setCustomerData] = useState([]);
    const searchParam = ["firstName", "lastName"];

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchCustomerData();
    }, []);

    const fetchCustomerData = async () => {
        try {
            const res = await api.get(`/customers`, {

            });
            setCustomerData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const handleEditClick = (row) => {
        console.log(row, 'kk');
        navigate("/customer-form", { state: { groupData: row } });
    };

    const columns = [
        {
            name: <h5>Client Name</h5>,
            selector: (row) => `${row.firstName} ${row.lastName}`,
            sortable: true,
        },
        {
            name: <h5>Company</h5>,
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: <h5>Family</h5>,
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: <h5>Docs</h5>,
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: <h5>Address</h5>,
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: <h5>Phone</h5>,
            selector: (row) => row.mobile,
            sortable: true,
        },
        {
            name: <h5>Email</h5>,
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: <h5>GSTIN</h5>,
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: <h5>IsVIP</h5>,
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: <h5>IsMember</h5>,
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: <h5>Ref By</h5>,
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            selector: (row) => row.status,
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
                    <Link className="action-icon">
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
                <Button variant="primary" onClick={() => navigate("/customer-form")}>
                    New Lead
                </Button>
            </div>
        );
    }, []);

    return (
        <>
            <div className='d-flex'>
                <div className='p-3' style={{ width: "100vw" }}>
                    <div className="border rounded-2xl p-4 shadow-lg mt-6" style={{ width: "100%" }}>
                        <DataTable
                            columns={columns}
                            data={DataTableSettings.filterItems(
                                customerData,
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

export default Customer
