import React, { useEffect, useMemo, useRef, useState } from 'react';
import MenuBar from '../../Components/MenuBar';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import { Form, Button } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import api from '../../config/AxiosInterceptor';
import { Link, useNavigate } from 'react-router-dom';
import { useCategory } from '../../Context/CategoryContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const OrderList = () => {

    const outletId = localStorage.getItem("outletId");
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const { setIsHiddenSidebarOpen } = useCategory();

    useEffect(() => {
        setIsHiddenSidebarOpen(true);
    }, []);

    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [groupData, setGroupData] = useState([]);
    const searchParam = ["itemGroupName", "isActive"];

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchOrderData();
    }, []);

    const fetchOrderData = async () => {
        try {
          const res = await axios.get(`http://192.168.0.110:5000/api/v1/order/outlet/${outletId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const sortedData = res?.data?.list?.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setGroupData(sortedData);
        } catch (error) {
          console.error("Error fetching table data", error);
        }
      };

    const columns = [
        {
            name: <h5>Group Name</h5>,
            selector: (row) => row.itemGroupName,
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
                    <Link className="action-icon" >
                        <FaRegEdit size={24} color="blue" />
                    </Link>
                    <Link className="action-icon" >
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
                {/* <Button variant="primary" onClick={() => navigate("/group")}>
          New Group
        </Button> */}
            </div>
        );
    }, []);

    return (
        <>
            <div className='groupContainer d-flex'>
                <MenuBar />
                <ToastContainer />
                <div className='groupDetails'>
                    <div className="groupDetailsWrapper">
                        <DataTable
                            className='DataTable'
                            //columns={columns}
                            //    data={DataTableSettings.filterItems(
                            //      groupData,
                            //      searchParam,
                            //      filterText
                            //    )}
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

export default OrderList
