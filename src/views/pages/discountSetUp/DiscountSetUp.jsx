import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import { Form, Button } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const DiscountSetUp = () => {

    const navigate = useNavigate();

    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [discountSetData, setDiscountSetData] = useState([]);
    const searchParam = ["itemGroupName", "isActive"];

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchDiscountSetupData();
    }, []);

    const fetchDiscountSetupData = async () => {
        try {
            const res = await api.get(`/discountsetup`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setDiscountSetData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    const columns = [
        {
            name: <h5>Name</h5>,
            selector: (row) => row.DiscountName,
            sortable: true,
        },
        {
            name: <h5>Client Code</h5>,
            selector: (row) => `${row.DiscountRate}%`,
            sortable: true,
        },
        {
            name: <h5>Client Type Descr</h5>,
            selector: (row) => new Date(row.DiscountStart).toLocaleString(),
            sortable: true,
        },
        {
            name: <h5>Member Id</h5>,
            selector: (row) => new Date(row.DiscountEnd).toLocaleString(),
            sortable: true,
        },
        {
            name: <h5>Email</h5>,
            selector: (row) => new Date(row.DiscountEnd).toLocaleString(),
            sortable: true,
        },
        {
            name: <h5>ACCD</h5>,
            selector: (row) => new Date(row.DiscountEnd).toLocaleString(),
            sortable: true,
        },
        {
            name: <h5>Dallow</h5>,
            selector: (row) => new Date(row.DiscountEnd).toLocaleString(),
            sortable: true,
        },
        {
            name: <h5>Status</h5>,
            cell: (row) => (
                <span
                    style={{
                        color: row.isActive ? "green" : "red",
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
                    <Link className="action-icon">
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
                <Button variant="primary" onClick={() => navigate("/discount-setupform")}>
                    New Discount Setup
                </Button>
            </div>
        );
    }, []);

    return (
        <>
            <div className='d-flex'>
                <ToastContainer />
                <div className='p-3' style={{ width: "93vw" }}>
                    <div className="border rounded-2xl p-4 shadow-lg mt-6" style={{ width: "100%" }}>
                        <DataTable
                            className='DataTable'
                            columns={columns}
                            data={DataTableSettings.filterItems(
                              discountSetData,
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

export default DiscountSetUp
