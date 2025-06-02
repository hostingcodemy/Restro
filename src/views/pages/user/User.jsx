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

const User = () => {

    const { setIsHiddenSidebarOpen } = useCategory();
    useEffect(() => {
        setIsHiddenSidebarOpen(true);
    }, []);
    const fetchCalled = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchUserData();
    }, []);
   
    const [filterText, setFilterText] = useState("");
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [userData, setUserData] = useState([]);
    const searchParam = [
        "name",
        "userName",
        "mobileNo",
        "email"
    ];

    const fetchUserData = async () => {
        try {
            const res = await api.get("/users", {
               
            });
            setUserData(res.data.list);
        } catch (error) {
            console.error("Error fetching table data", error);
            setLoadingIndicator(false);
        }
    };

    const handleEditClick = (row) => {
        console.log(row, 'kk');

        navigate("/sub-group", { state: { itemSubGroup: row } });
    };

    const columns = [
        {
            name: <h5>Name</h5>,
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: <h5>User name</h5>,
            selector: (row) => row.userName,
            sortable: true,
        },
        {
            name: <h5>Phone</h5>,
            selector: (row) => row.mobileNo,
            sortable: true,
        },
        {
            name: <h5>Email</h5>,
            selector: (row) => row.email,
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
                <Button variant="primary" onClick={() => navigate("/user-form")}>
                    New User
                </Button>
            </div>
        );
    }, []);

    return (
        <>
            <div className='d-flex'>
                <MenuBar />
                <div className='p-3' style={{ width: "93vw" }}>
                    <div className="border rounded-2xl p-4 shadow-lg mt-6" style={{ width: "100%" }}>
                        <DataTable
                            columns={columns}
                            data={DataTableSettings.filterItems(
                                userData,
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

export default User
