import React, { useEffect, useMemo, useRef, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../../helpers/DataTableSettings";
import {
    MdDeleteForever,
    MdMergeType,
    MdOutlineBloodtype,
    MdOutlineEmail,
    MdCastForEducation,
    MdFormatListNumbered,
    MdTransgender
}
    from "react-icons/md";
import { FaRegEdit, FaPhoneAlt, FaRegFile, FaFax, FaFlagCheckered, FaRegAddressBook } from "react-icons/fa";
import api from '../../../config/AxiosInterceptor';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Offcanvas, InputGroup, Row, Col, Spinner, ButtonGroup, ToggleButton } from "react-bootstrap";
import { IoPersonOutline, IoLanguage } from "react-icons/io5";
import { TbScanPosition, TbCalendarEvent, TbHandClick } from "react-icons/tb";
import { CiCreditCard1, CiImport, CiExport } from "react-icons/ci";
import { IoMdGlobe } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { PiMicrophoneThin } from "react-icons/pi";
import { BiTable, BiBarChartAlt2, BiLayout } from "react-icons/bi";
import { FiFilter, FiCalendar, FiRepeat } from "react-icons/fi";
import { BsFilePdf } from "react-icons/bs";

const Customer = () => {

    const initialValues = {
        personal: {
            CustomerID: "",
            CustomerTypeId: "",
            name: "",
            Designation: "",
            Occupation: "",
            Gender: "",
            Religion: "",
            BloodGroup: "",
            DOB: "",
            DOA: "",
            Phone: "",
            Email: "",
            Mobile: "",
            Fax: "",
            Citizenship: "",
            Language: "",
            LedgerNo: "",
            DiscountAllowed: "",
            EducationalQualification: "",
            PhotoFile: null,
            SignatureFile: null,
            GSTIN: "",
            CreditLimit: "",
            NcAllow: "",
            PFIdNumber: "",
            Block: "",
            BlockDate: "",
            GSTNo: "",
            TinNo: "",
            CINNo: "",
            IsActive: true,
        },

        address: {
            customerID: "",
            addressTypeId: "",
            addr1: "",
            addr2: "",
            addr3: "",
            addrPlace: "",
            addrDist: "",
            addrState: "",
            addrCountry: "",
            IsActive: true,
        },

        business: {
            customerID: "",
            compAddr1: "",
            compAddr2: "",
            compAddr3: "",
            compAddrPlace: "",
            compAddrDist: "",
            compAddrState: "",
            compPhone: "",
            compMobile: "",
            compEmail: "",
            companyName: "",
            regdOfficeAddr1: "",
            regdOfficeAddr2: "",
            regdOfficeAddr3: "",
            regdOfficePlace: "",
            regdOfficeState: "",
            regdOfficePIN: "",
            regdOfficeCountry: "",
            regdOfficePhone: "",
            regdOfficeMobile: "",
            regdOfficeEmail: "",
            corporateId: "",
            IsActive: true,
        },

        family: {
            CusFamilyId: "",
            CustomerID: "",
            SerialNo: "",
            FamilyMemberName: "",
            Gender: "",
            DOB: "",
            PhotoFile: null,
            SignatureFile: null,
            BirthCertificate: null,
            Designation: "",
            Occupation: "",
            CompanyName: "",
            OverAged: "",
            Flag: "",
            Religion: "",
            Nationality: "",
            Address: "",
            Passport: "",
            ITNUM: "",
            MobileNo: "",
            EmailId: "",
            Restriction: "",
            ClientCode: "",
            Relation: "",
            PAN: "",
            FlatId: "",
            MemberId: "",
            AdditionalFM: "",
            IsActive: true,
        },

        member: {
            CusMemberId: "",
            FrequentMember: "",
            MemberId: "",
            ClientApplDate: "",
            InterViewDate: "",
            ScreeningDate: "",
            ApprovedDate: "",
            StatusRemarks: "",
            MemberPhotoFile: "",
            MemberSignatureFile: "",
            MembershipDate: "",
            MemebershipStatus: "",
            WithdrawlDate: "",
            ExpiryDate: "",
            YearofValidation: "",
            FlatCode: "",
            SchemeOpted: "",
            BLNTag: "",
            ICOEmail: "",
            DiscountOffered: "",
            TotDepositRecievable: "",
            MonthlySubscription: "",
            AnnualSubscription: "",
            Blocked: "",
            BlockDate: "",
            BlockUser: "",
            CusDocId: "",
            RenewalDate: "",
            SpecialInformation: "",
            MarritalStatus: "",
            Creditlimit: "",
            loyaltipoints: "",
            PrimaryApplicant: "",
            InvwApproveDt: "",
            InvwApproveBy: "",
            InvwPerson: "",
            InvwRemarks: "",
            IsActive: true,
        },

        documents: {
            CusDocId: "",
            CustomerID: "",
            DocTypeId: "",
            DocName: "",
            DocImageFile: "",
            ValidFrom: "",
            ValidTo: "",
        },

        others: {
            cusOthersId: "",
            customerID: "",
            referredCustomerID: "",
            isActive: true,
        },
    };

    const genderOptions = [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
    ];

    const bloodGroupOptions = [
        { label: "A+", value: "A+" },
        { label: "A-", value: "A-" },
        { label: "B+", value: "B+" },
        { label: "B-", value: "B-" },
        { label: "AB+", value: "AB+" },
        { label: "AB-", value: "AB-" },
        { label: "O+", value: "O+" },
        { label: "O-", value: "O-" }
    ];

    const radios = [
        { name: 'Table', value: 'table', icon: <BiTable size={18} /> },
        { name: 'Board', value: 'board', icon: <BiLayout size={18} /> },
    ];

    const [formValues, setFormValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const fetchCalled = useRef(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [customerData, setCustomerData] = useState([]);
    const [customerBusiData, setCustomerBusiData] = useState([]);
    const [addressTypeData, setAddressTypeData] = useState([]);
    const [customerTypeData, setCustomerTypeData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const searchParam = ["name", "phone", "email", "gstin"];
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [viewMode, setViewMode] = useState('table');
    const [activeStep, setActiveStep] = useState(1);
    const handleNext = (e) => {
        e.preventDefault();
        setActiveStep(prev => Math.min(prev + 1, 7));
    };

    const handlePrevious = (e) => {
        e.preventDefault();
        setActiveStep(prev => Math.max(prev - 1, 1));
    };

    const handleStart = () => {
        setFormValues(initialValues);
        setIsEditMode(false);
        setErrors({});
        setActiveStep(1);
        fetchCustomerTypeData();
    };

    const handleClose = () => {
        setActiveStep(0);
        setFormValues(initialValues);
        setErrors({});
        setIsEditMode(false);
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchCustomerData();
        //fetchCustomerBusinessData();
    }, []);

    const fetchCustomerData = async () => {
        try {
            const res = await api.get(`/customers`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setCustomerData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        }
    };

    // const fetchCustomerBusinessData = async () => {
    //     try {
    //         const res = await api.get(`/customers/customer-business`, {

    //         });
    //         setCustomerBusiData(res.data.list);
    //     } catch (error) {
    //         console.error("Error fetching table data", error);
    //     }
    // };

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

    const fetchAddressTypeData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/addresstype`);
            const sortedData = res?.data?.list?.sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setAddressTypeData(sortedData);
        } catch (error) {
            console.error("Error fetching table data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e, section) => {
        const { name, value, type, checked } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: type === "checkbox" ? checked : value,
            },
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [section]: {
                ...(prevErrors?.[section] || {}),
                [name]: "",
            },
        }));
    };


    const handleEditClick = (row) => {
        console.log(row, 'Edit Clicked Data');

        setIsEditMode(true);
        setFormValues(prev => ({
            ...prev,

            personal: {
                ...prev.personal,
                CustomerID: row.CustomerID || "",
                CustomerTypeId: row.CustomerTypeId || "",
                MemberTypeId: row.MemberTypeId || "",
                name: row.name || "",
                Designation: row.Designation || "",
                Occupation: row.Occupation || "",
                Gender: row.Gender || "",
                Religion: row.Religion || "",
                BloodGroup: row.BloodGroup || "",
                DOB: row.DOB || "",
                DOA: row.DOA || "",
                Phone: row.Phone || "",
                Email: row.Email || "",
                Mobile: row.Mobile || "",
                Fax: row.Fax || "",
                Citizenship: row.Citizenship || "",
                Language: row.Language || "",
                LedgerNo: row.LedgerNo || "",
                DiscountAllowed: row.DiscountAllowed || "",
                EducationalQualification: row.EducationalQualification || "",
                PhotoFile: row.PhotoFile || null,
                SignatureFile: row.SignatureFile || null,
                GSTIN: row.GSTIN || "",
                CreditLimit: row.CreditLimit || "",
                NcAllow: row.NcAllow || "",
                PFIdNumber: row.PFIdNumber || "",
                Block: row.Block || "",
                BlockDate: row.BlockDate || "",
                GSTNo: row.GSTNo || "",
                TinNo: row.TinNo || "",
                CINNo: row.CINNo || "",
                IsActive: row.IsActive !== undefined ? row.IsActive : true
            },

            business: {
                ...prev.business,
                customerID: row.CustomerID || "",
                compAddr1: row.compAddr1 || "",
                compAddr2: row.compAddr2 || "",
                compAddr3: row.compAddr3 || "",
                compAddrPlace: row.compAddrPlace || "",
                compAddrDist: row.compAddrDist || "",
                compAddrState: row.compAddrState || "",
                compPhone: row.compPhone || "",
                compMobile: row.compMobile || "",
                compEmail: row.compEmail || "",
                companyName: row.companyName || "",
                regdOfficeAddr1: row.regdOfficeAddr1 || "",
                regdOfficeAddr2: row.regdOfficeAddr2 || "",
                regdOfficeAddr3: row.regdOfficeAddr3 || "",
                regdOfficePlace: row.regdOfficePlace || "",
                regdOfficeState: row.regdOfficeState || "",
                regdOfficePIN: row.regdOfficePIN || "",
                regdOfficeCountry: row.regdOfficeCountry || "",
                regdOfficePhone: row.regdOfficePhone || "",
                regdOfficeMobile: row.regdOfficeMobile || "",
                regdOfficeEmail: row.regdOfficeEmail || "",
                corporateId: row.corporateId || "",
                IsActive: row.businessIsActive !== undefined ? row.businessIsActive : true
            },

            address: {
                ...prev.address,
                customerID: row.CustomerID || "",
                addressTypeId: row.addressTypeId || "",
                addr1: row.addr1 || "",
                addr2: row.addr2 || "",
                addr3: row.addr3 || "",
                addrPlace: row.addrPlace || "",
                addrDist: row.addrDist || "",
                addrState: row.addrState || "",
                addrCountry: row.addrCountry || "",
                IsActive: row.addressIsActive !== undefined ? row.addressIsActive : true
            },

            member: {
                ...prev.member,
                CusMemberId: row.CusMemberId || "",
                CustomerID: row.CustomerID || "",
                FrequentMember: row.FrequentMember || "",
                MemberId: row.MemberId || "",
                ClientApplDate: row.ClientApplDate || "",
                InterViewDate: row.InterViewDate || "",
                ScreeningDate: row.ScreeningDate || "",
                ApprovedDate: row.ApprovedDate || "",
                StatusRemarks: row.StatusRemarks || "",
                MemberPhotoFile: row.MemberPhotoFile || "",
                MemberSignatureFile: row.MemberSignatureFile || "",
                MembershipDate: row.MembershipDate || "",
                MemebershipStatus: row.MemebershipStatus || "",
                WithdrawlDate: row.WithdrawlDate || "",
                ExpiryDate: row.ExpiryDate || "",
                YearofValidation: row.YearofValidation || "",
                FlatCode: row.FlatCode || "",
                SchemeOpted: row.SchemeOpted || "",
                BLNTag: row.BLNTag || "",
                ICOEmail: row.ICOEmail || "",
                DiscountOffered: row.DiscountOffered || "",
                TotDepositRecievable: row.TotDepositRecievable || "",
                MonthlySubscription: row.MonthlySubscription || "",
                AnnualSubscription: row.AnnualSubscription || "",
                Blocked: row.Blocked || "",
                BlockDate: row.BlockDate || "",
                BlockUser: row.BlockUser || "",
                CusDocId: row.CusDocId || "",
                RenewalDate: row.RenewalDate || "",
                SpecialInformation: row.SpecialInformation || "",
                MarritalStatus: row.MarritalStatus || "",
                Creditlimit: row.Creditlimit || "",
                loyaltipoints: row.loyaltipoints || "",
                PrimaryApplicant: row.PrimaryApplicant || "",
                InvwApproveDt: row.InvwApproveDt || "",
                InvwApproveBy: row.InvwApproveBy || "",
                InvwPerson: row.InvwPerson || "",
                InvwRemarks: row.InvwRemarks || "",
                IsActive: row.memberIsActive !== undefined ? row.memberIsActive : true
            },

            documents: {
                ...prev.documents,
                CusDocId: row.CusDocId || "",
                CustomerID: row.CustomerID || "",
                DocTypeId: row.DocTypeId || "",
                DocName: row.DocName || "",
                DocImageFile: row.DocImageFile || "",
                ValidFrom: row.ValidFrom || "",
                ValidTo: row.ValidTo || ""
            },

            family: {
                ...prev.family,
                CusFamilyId: row.CusFamilyId || "",
                CustomerID: row.CustomerID || "",
                SerialNo: row.SerialNo || "",
                FamilyMemberName: row.FamilyMemberName || "",
                Gender: row.familyGender || "",
                DOB: row.familyDOB || "",
                PhotoFile: row.familyPhotoFile || null,
                SignatureFile: row.familySignatureFile || null,
                BirthCertificate: row.BirthCertificate || null,
                Designation: row.familyDesignation || "",
                Occupation: row.familyOccupation || "",
                CompanyName: row.CompanyName || "",
                OverAged: row.OverAged || "",
                Flag: row.Flag || "",
                Religion: row.familyReligion || "",
                Nationality: row.Nationality || "",
                Address: row.familyAddress || "",
                Passport: row.Passport || "",
                ITNUM: row.ITNUM || "",
                MobileNo: row.MobileNo || "",
                EmailId: row.EmailId || "",
                Restriction: row.Restriction || "",
                ClientCode: row.ClientCode || "",
                Relation: row.Relation || "",
                PAN: row.PAN || "",
                FlatId: row.FlatId || "",
                MemberId: row.familyMemberId || "",
                AdditionalFM: row.AdditionalFM || "",
                IsActive: row.familyIsActive !== undefined ? row.familyIsActive : true
            },

            others: {
                ...prev.others,
                cusOthersId: row.cusOthersId || "",
                customerID: row.CustomerID || "",
                referredCustomerID: row.referredCustomerID || "",
                isActive: row.othersIsActive !== undefined ? row.othersIsActive : true
            }
        }));

        setActiveStep(1);
    };

    const validateForm = () => {
        const { Name, Phone } = formValues;
        const errors = {};
        let isValid = true;

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!Name) {
            isValid = false;
            errors.Name = "Name is required.";
        } else if (!/^[a-zA-Z ]+$/.test(Name)) {
            errors.Name = 'Name must contain only letters';
            isValid = false;
        }
        if (!Phone) {
            isValid = false;
            errors.Phone = "Phone is required.";
        }
        // else if (!phoneRegex.test(Phone)) {
        //     isValid = false;
        //     errors.Phone = "Enter a valid 10-digit phone number.";
        // }

        setErrors(errors);
        return isValid;
    };

    const columns = [
        {
            name: <h6 className="fw-bold">Client Name</h6>,
            selector: row => row.name,
            cell: row => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={
                            row.photo
                                ? `${import.meta.env.VITE_IMG_BASE_URL}/${row.photo}`
                                : 'src/assets/person.png'
                        }
                        alt="Profile"
                        width={35}
                        height={35}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>{row.name}</div>
                </div>
            ),
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">Company</h6>,
            selector: row => row.company,
            cell: row => <div>{row.company || '-'}</div>,
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">Family</h6>,
            selector: row => row.family,
            cell: row => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={
                            row.photo
                                ? `${import.meta.env.VITE_IMG_BASE_URL}/${row.photo}`
                                : 'src/assets/person.png'
                        }
                        alt="Profile"
                        width={35}
                        height={35}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span
                        className="badge bg-secondary"
                        style={{ fontSize: "0.75rem", padding: "4px 6px" }}
                    >
                        +1
                    </span>
                </div>
            ),
            sortable: false,
        },

        {
            name: <h6 className="fw-bold">Docs</h6>,
            selector: row => row.docs,
            cell: () => (
                <div className="text-danger">
                    <BsFilePdf size={20} />
                </div>
            ),
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">Address</h6>,
            selector: () => "Sector V",
            //selector: row => row.address,
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">Phone</h6>,
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">Email</h6>,
            selector: row => row.email,
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">GSTIN</h6>,
            selector: row => row.gstin,
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">IsVIP</h6>,
            cell: row => (row.isVip ? <span className="text-danger fw-bold">YES</span> : "No"),
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">IsMember</h6>,
            cell: row => (row.isMember ? <span className="text-success fw-bold">YES</span> : "Yes"),
            sortable: true,
        },
        {
            name: <h6 className="fw-bold">Ref By</h6>,
            selector: row => row.name,
            sortable: true,
        },
        //   {
        //     name: <h6 className="fw-bold">Status</h6>,
        //     selector: row => row.status,
        //     cell: row => {
        //       let bg = "secondary";
        //       if (row.status === "Once") bg = "success";
        //       else if (row.status === "Cancelled") bg = "danger";
        //       else if (row.status === "Offline") bg = "dark";
        //       else if (row.status === "Rarely") bg = "warning";
        //       return <Badge bg={bg}>{row.status}</Badge>;
        //     },
        //     sortable: true,
        //   },

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
                    <Link
                        className="action-icon"
                        //onClick={() => handleDeleteClick(row.itemGroupId, row.itemGroupName)} 
                        title='Delete'>
                        <MdDeleteForever size={30} style={{ margin: "1vh" }} color="#FF474C" />
                    </Link>
                </>
            ),
        },
    ];

    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div className="d-flex justify-content-end gap-2 align-items-center w-100">
                <ButtonGroup className="toggle-switch rounded-pill overflow-hidden">
                    {radios.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={viewMode === radio.value ? 'light' : 'dark'}
                            name="viewMode"
                            value={radio.value}
                            checked={viewMode === radio.value}
                            onChange={(e) => setViewMode(e.currentTarget.value)}
                            className="d-flex align-items-center gap-2 px-3 py-2"
                            style={{ border: 'none', borderRadius: 0 }}
                        >
                            {radio.icon}
                            {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
                <InputGroup className="border rounded px-2 py-1" style={{ width: '200px' }}>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                        className="border-0 p-0 shadow-none"
                        style={{ backgroundColor: "transparent" }}
                    />

                </InputGroup>
                <Form className="d-flex">
                    <InputGroup>
                        <Form.Control
                            type="search"
                            placeholder="Search..."
                            aria-label="Search"
                            className="rounded-pill pe-5"
                            onChange={(e) => setFilterText(e.target.value)}
                            style={{ paddingRight: "2.5rem" }}
                        />
                        <InputGroup.Text
                            style={{
                                marginLeft: "-3rem",
                                background: "transparent",
                                border: "none",
                                zIndex: 10,
                            }}
                        >
                            <PiMicrophoneThin size={25} color="gold" />
                        </InputGroup.Text>
                    </InputGroup>
                </Form>
                <div className="d-flex gap-2">
                    <Button variant="dark" className="d-flex align-items-center gap-2">
                        <BiTable size={18} />
                        Column
                    </Button>
                    <Button variant="dark" className="d-flex align-items-center gap-2">
                        <FiFilter size={18} />
                        Filter
                    </Button>
                    <Button variant="dark" className="d-flex align-items-center gap-2">
                        <BiBarChartAlt2 size={18} />
                        Insights
                    </Button>
                </div>
                <h5 style={{ fontWeight: "bold" }}>Graphical Analysis</h5>
                <Button variant="info">
                    <CiExport size={20} /> Import
                </Button>
                <Button variant="success">
                    <CiImport size={20} /> Export
                </Button>
                <Button variant="warning" onClick={handleStart}>
                    New Lead
                </Button>
            </div>
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();

        for (const key in formValues) {
            const value = formValues[key];

            if (key === "PhotoFile" || key === "SignatureFile") {
                if (value) {
                    formData.append(key, value);
                }
            } else {
                formData.append(key, value ?? "");
            }
        }

        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/customers/${formValues.CustomerID}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                res = await api.post("/customers", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            handleClose();
            fetchCustomerData();
            toast.success(res.data.successMessage || "Success!");
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                            data={DataTableSettings.filterItems(customerData, searchParam, filterText)}
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

            {/* Customer Info */}
            <Offcanvas
                show={activeStep === 1}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Customer" : "Add Customer"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="name">
                                        <IoPersonOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="name"
                                        value={formValues.name || ""}
                                        onChange={(e) =>
                                            handleChange("name", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        placeholder="Name"
                                        aria-label="Name"
                                        isInvalid={!!errors.Name}
                                        isValid={formValues.Name && !errors.Name}
                                        autoComplete='off'
                                    />
                                    {errors.Name && <span className="error-msg">{errors.Name}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="CustomerTypeId">
                                        <MdMergeType size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="CustomerTypeId"
                                        value={formValues.CustomerTypeId || ""}
                                        onChange={(e) => handleChange("CustomerTypeId", e.target.value)}
                                    >
                                        <option>Select customer type</option>
                                        {customerTypeData?.map((item) => (
                                            <option key={item.customerTypeId} value={item.customerTypeId}>
                                                {item.customerTypeName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.CustomerTypeId && <span className="error-msg">{errors.CustomerTypeId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Designation">
                                        <TbScanPosition size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Designation"
                                        value={formValues.Designation || ""}
                                        onChange={(e) =>
                                            handleChange("Designation", e.target.value.replace(/[^a-zA-Z ]/g, ""))
                                        }
                                        placeholder="Designation"
                                        aria-label="Name"
                                        isInvalid={!!errors.Designation}
                                        isValid={formValues.Designation && !errors.Designation}
                                        autoComplete='off'
                                    />
                                    {errors.Designation && <span className="error-msg">{errors.Designation}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="Occupation">
                                        <IoPersonOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Occupation"
                                        value={formValues.Occupation || ""}
                                        onChange={(e) =>
                                            handleChange("Occupation", e.target.value)
                                        }
                                        placeholder="Occupation"
                                        aria-label="Occupation"
                                        isInvalid={!!errors.Occupation}
                                        isValid={formValues.Occupation && !errors.Occupation}
                                        autoComplete='off'
                                    />
                                    {errors.Occupation && <span className="error-msg">{errors.Occupation}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Gender">
                                        <MdTransgender size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="Gender"
                                        value={formValues.Gender || ""}
                                        onChange={(e) => handleChange("Gender", e.target.value)}
                                    >
                                        <option>Select gender</option>
                                        {genderOptions?.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.Gender && <span className="error-msg">{errors.Gender}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Religion">
                                        <TbScanPosition size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Religion"
                                        value={formValues.Religion || ""}
                                        onChange={(e) =>
                                            handleChange("Religion", e.target.value.replace)
                                        }
                                        placeholder="Religion"
                                        aria-label="Religion"
                                        isInvalid={!!errors.Religion}
                                        isValid={formValues.Religion && !errors.Religion}
                                        autoComplete='off'
                                    />
                                    {errors.Religion && <span className="error-msg">{errors.Religion}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="BloodGroup">
                                        <MdOutlineBloodtype size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="BloodGroup"
                                        value={formValues.BloodGroup || ""}
                                        onChange={(e) => handleChange("BloodGroup", e.target.value)}
                                    >
                                        <option>Select blood group</option>
                                        {bloodGroupOptions?.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.BloodGroup && <span className="error-msg">{errors.BloodGroup}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="DOB">
                                        <TbCalendarEvent size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="DOB"
                                        value={formValues.DOB || ""}
                                        onChange={(e) => handleChange("DOB", e.target.value)}
                                        placeholder="Date of Birth"
                                        aria-label="DOB"
                                        isInvalid={!!errors.DOB}
                                        isValid={formValues.DOB && !errors.DOB}
                                        max={new Date().toISOString().split("T")[0]}
                                        autoComplete="off"
                                    />
                                    {errors.DOB && <span className="error-msg">{errors.DOB}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="DOA">
                                        <TbCalendarEvent size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="DOA"
                                        value={formValues.DOA || ""}
                                        onChange={(e) => handleChange("DOA", e.target.value)}
                                        placeholder="Date of Anniversary "
                                        aria-label="DOA"
                                        isInvalid={!!errors.DOA}
                                        isValid={formValues.DOA && !errors.DOA}
                                        max={new Date().toISOString().split("T")[0]}
                                        autoComplete="off"
                                    />
                                    {errors.DOA && <span className="error-msg">{errors.DOA}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Phone">
                                        <FaPhoneAlt size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="Phone"
                                        value={formValues.Phone || ""}
                                        onChange={(e) => handleChange("Phone", e.target.value)}
                                        placeholder="Phone"
                                        aria-label="Phone"
                                        isInvalid={!!errors.Phone}
                                        isValid={formValues.Phone && !errors.Phone}
                                        autoComplete="off"
                                    />
                                    {errors.Phone && <span className="error-msg">{errors.Phone}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Mobile">
                                        <FaPhoneAlt size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="Mobile"
                                        value={formValues.Mobile || ""}
                                        onChange={(e) => handleChange("Mobile", e.target.value)}
                                        placeholder="mobile"
                                        aria-label="Mobile"
                                        isInvalid={!!errors.Mobile}
                                        isValid={formValues.Mobile && !errors.Mobile}
                                        autoComplete="off"
                                    />
                                    {errors.Mobile && <span className="error-msg">{errors.Mobile}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Email">
                                        <MdOutlineEmail size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="Email"
                                        value={formValues.Email || ""}
                                        onChange={(e) => handleChange("Email", e.target.value)}
                                        placeholder="Email"
                                        aria-label="Email"
                                        isInvalid={!!errors.Email}
                                        isValid={formValues.Email && !errors.Email}
                                        autoComplete="off"
                                    />
                                    {errors.Email && <span className="error-msg">{errors.Email}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Fax">
                                        <FaFax size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="Fax"
                                        value={formValues.Fax || ""}
                                        onChange={(e) => handleChange("Fax", e.target.value)}
                                        placeholder="Fax"
                                        aria-label="Fax"
                                        isInvalid={!!errors.Fax}
                                        isValid={formValues.Fax && !errors.Fax}
                                        autoComplete="off"
                                    />
                                    {errors.Fax && <span className="error-msg">{errors.Fax}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Citizenship">
                                        <FaFlagCheckered size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="Citizenship"
                                        value={formValues.Citizenship || ""}
                                        onChange={(e) => handleChange("Citizenship", e.target.value)}
                                        placeholder="Citizenship"
                                        aria-label="Citizenship"
                                        isInvalid={!!errors.Citizenship}
                                        isValid={formValues.Citizenship && !errors.Citizenship}
                                        autoComplete="off"
                                    />
                                    {errors.Citizenship && <span className="error-msg">{errors.Citizenship}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Language">
                                        <IoLanguage size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="Language"
                                        value={formValues.Language || ""}
                                        onChange={(e) => handleChange("Language", e.target.value)}
                                        placeholder="Language"
                                        aria-label="Language"
                                        isInvalid={!!errors.Language}
                                        isValid={formValues.Language && !errors.Language}
                                        autoComplete="off"
                                    />
                                    {errors.Language && <span className="error-msg">{errors.Language}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="LedgerNo">
                                        <MdFormatListNumbered size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="LedgerNo"
                                        value={formValues.LedgerNo || ""}
                                        onChange={(e) => handleChange("LedgerNo", e.target.value)}
                                        placeholder="Ledger No"
                                        aria-label="LedgerNo"
                                        isInvalid={!!errors.LedgerNo}
                                        isValid={formValues.LedgerNo && !errors.LedgerNo}
                                        autoComplete="off"
                                    />
                                    {errors.LedgerNo && <span className="error-msg">{errors.LedgerNo}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="EducationalQualification">
                                        <MdCastForEducation size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="EducationalQualification"
                                        value={formValues.EducationalQualification || ""}
                                        onChange={(e) => handleChange("EducationalQualification", e.target.value)}
                                        placeholder="Educational Qualification"
                                        aria-label="EducationalQualification"
                                        isInvalid={!!errors.EducationalQualification}
                                        isValid={formValues.EducationalQualification && !errors.EducationalQualification}
                                        autoComplete="off"
                                    />
                                    {errors.EducationalQualification && <span className="error-msg">{errors.EducationalQualification}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="CreditLimit">
                                        <CiCreditCard1 size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="CreditLimit"
                                        value={formValues.CreditLimit || ""}
                                        onChange={(e) => handleChange("CreditLimit", e.target.value)}
                                        placeholder="Credit Limit"
                                        aria-label="CreditLimit"
                                        isInvalid={!!errors.CreditLimit}
                                        isValid={formValues.CreditLimit && !errors.CreditLimit}
                                        autoComplete="off"
                                    />
                                    {errors.CreditLimit && <span className="error-msg">{errors.CreditLimit}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="GSTIN">
                                        <MdOutlineEmail size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="GSTIN"
                                        value={formValues.GSTIN || ""}
                                        onChange={(e) => handleChange("GSTIN", e.target.value)}
                                        placeholder="GSTIN"
                                        aria-label="GSTIN"
                                        isInvalid={!!errors.GSTIN}
                                        isValid={formValues.GSTIN && !errors.GSTIN}
                                        autoComplete="off"
                                    />
                                    {errors.GSTIN && <span className="error-msg">{errors.GSTIN}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="PFIdNumber">
                                        <MdOutlineEmail size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="PFIdNumber"
                                        value={formValues.PFIdNumber || ""}
                                        onChange={(e) => handleChange("PFIdNumber", e.target.value)}
                                        placeholder="PFIdNumber"
                                        aria-label="PFIdNumber"
                                        isInvalid={!!errors.PFIdNumber}
                                        isValid={formValues.PFIdNumber && !errors.PFIdNumber}
                                        autoComplete="off"
                                    />
                                    {errors.PFIdNumber && <span className="error-msg">{errors.PFIdNumber}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="GSTNo">
                                        <MdOutlineEmail size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="GSTNo"
                                        value={formValues.GSTNo || ""}
                                        onChange={(e) => handleChange("GSTNo", e.target.value)}
                                        placeholder="GSTNo"
                                        aria-label="GSTNo"
                                        isInvalid={!!errors.GSTNo}
                                        isValid={formValues.GSTNo && !errors.GSTNo}
                                        autoComplete="off"
                                    />
                                    {errors.GSTNo && <span className="error-msg">{errors.GSTNo}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="TinNo">
                                        <MdFormatListNumbered size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="TinNo"
                                        value={formValues.TinNo || ""}
                                        onChange={(e) => handleChange("TinNo", e.target.value)}
                                        placeholder="TinNo"
                                        aria-label="TinNo"
                                        isInvalid={!!errors.TinNo}
                                        isValid={formValues.TinNo && !errors.TinNo}
                                        autoComplete="off"
                                    />
                                    {errors.TinNo && <span className="error-msg">{errors.TinNo}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="CINNo">
                                        <MdFormatListNumbered size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="CINNo"
                                        value={formValues.CINNo || ""}
                                        onChange={(e) => handleChange("CINNo", e.target.value)}
                                        placeholder="CINNo"
                                        aria-label="CINNo"
                                        isInvalid={!!errors.CINNo}
                                        isValid={formValues.CINNo && !errors.CINNo}
                                        autoComplete="off"
                                    />
                                    {errors.CINNo && <span className="error-msg">{errors.CINNo}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="BlockDate">
                                        <TbCalendarEvent size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="BlockDate"
                                        value={formValues.BlockDate || ""}
                                        onChange={(e) => handleChange("BlockDate", e.target.value)}
                                        placeholder="Block Date"
                                        aria-label="BlockDate"
                                        isInvalid={!!errors.BlockDate}
                                        isValid={formValues.BlockDate && !errors.BlockDate}
                                        autoComplete="off"
                                    />
                                    {errors.BlockDate && <span className="error-msg">{errors.BlockDate}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="DiscountAllowed"
                                        checked={formValues.DiscountAllowed}
                                        onChange={(e) => handleChange("DiscountAllowed", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="NcAllow"
                                        checked={formValues.NcAllow}
                                        onChange={(e) => handleChange("NcAllow", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="Block"
                                        checked={formValues.Block}
                                        onChange={(e) => handleChange("Block", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="PhotoFile">
                                        <FaRegFile size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormValues(prev => ({
                                                    ...prev,
                                                    PhotoFile: file
                                                }));
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="SignatureFile">
                                        <FaRegFile size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormValues(prev => ({
                                                    ...prev,
                                                    SignatureFile: file
                                                }));
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="IsActive"
                                        checked={formValues.IsActive}
                                        onChange={(e) => handleChange("IsActive", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save & Skip
                                </Button>
                            </div>
                            <div>
                                <Button type="submit" variant="warning" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Family Info */}
            <Offcanvas
                show={activeStep === 2}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Customer Family" : "Add Customer Family"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="FamilyMemberName">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="FamilyMemberName"
                                        value={formValues.family?.FamilyMemberName || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Family member name"
                                        isInvalid={!!errors.family?.FamilyMemberName}
                                        isValid={formValues.family?.FamilyMemberName && !errors.family?.FamilyMemberName}
                                        autoComplete='off'
                                    />
                                    {errors.family?.FamilyMemberName && <span className="error-msg">{errors.family.FamilyMemberName}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Gender">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="Gender"
                                        value={formValues.family?.Gender || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                    >
                                        <option>Select gender</option>
                                        {genderOptions?.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.family?.Gender && <span className="error-msg">{errors.family?.Gender}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="DOB">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="DOB"
                                        value={formValues.family?.DOB || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="DOB"
                                        isInvalid={!!errors.family?.DOB}
                                        isValid={formValues.family?.DOB && !errors.family?.DOB}
                                        autoComplete='off'
                                    />
                                    {errors.family?.DOB && <span className="error-msg">{errors.family.DOB}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaRegFile size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        name="PhotoFile"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleChange({ target: { name: "PhotoFile", value: file } }, "family");
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaRegFile size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        name="SignatureFile"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleChange({ target: { name: "SignatureFile", value: file } }, "family");
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaRegFile size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        name="BirthCertificateFile"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleChange({ target: { name: "BirthCertificateFile", value: file } }, "family");
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Designation">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Designation"
                                        value={formValues.family?.Designation || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Designation"
                                        isInvalid={!!errors.family?.Designation}
                                        isValid={formValues.family?.Designation && !errors.family?.Designation}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Designation && <span className="error-msg">{errors.family.Designation}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Occupation">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Occupation"
                                        value={formValues.family?.Occupation || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Occupation"
                                        isInvalid={!!errors.family?.Occupation}
                                        isValid={formValues.family?.Occupation && !errors.family?.Occupation}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Occupation && <span className="error-msg">{errors.family.Occupation}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="CompanyName">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="CompanyName"
                                        value={formValues.family?.CompanyName || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Company Name"
                                        isInvalid={!!errors.family?.CompanyName}
                                        isValid={formValues.family?.CompanyName && !errors.family?.CompanyName}
                                        autoComplete='off'
                                    />
                                    {errors.family?.CompanyName && <span className="error-msg">{errors.family.CompanyName}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Religion">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Religion"
                                        value={formValues.family?.Religion || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Religion"
                                        isInvalid={!!errors.family?.Religion}
                                        isValid={formValues.family?.Religion && !errors.family?.Religion}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Religion && <span className="error-msg">{errors.family.Religion}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Nationality">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Nationality"
                                        value={formValues.family?.Nationality || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Nationality"
                                        isInvalid={!!errors.family?.Nationality}
                                        isValid={formValues.family?.Nationality && !errors.family?.Nationality}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Nationality && <span className="error-msg">{errors.family.Nationality}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Address">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Address"
                                        value={formValues.family?.Address || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Address"
                                        isInvalid={!!errors.family?.Address}
                                        isValid={formValues.family?.Address && !errors.family?.Address}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Address && <span className="error-msg">{errors.family.Address}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Passport">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Passport"
                                        value={formValues.family?.Passport || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Passport"
                                        isInvalid={!!errors.family?.Passport}
                                        isValid={formValues.family?.Passport && !errors.family?.Passport}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Passport && <span className="error-msg">{errors.family.Passport}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ITNUM">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="ITNUM"
                                        value={formValues.family?.ITNUM || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="ITNUM"
                                        isInvalid={!!errors.family?.ITNUM}
                                        isValid={formValues.family?.ITNUM && !errors.family?.ITNUM}
                                        autoComplete='off'
                                    />
                                    {errors.family?.ITNUM && <span className="error-msg">{errors.family.ITNUM}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MobileNo">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="MobileNo"
                                        value={formValues.family?.MobileNo || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="MobileNo"
                                        isInvalid={!!errors.family?.MobileNo}
                                        isValid={formValues.family?.MobileNo && !errors.family?.MobileNo}
                                        autoComplete='off'
                                    />
                                    {errors.family?.MobileNo && <span className="error-msg">{errors.family.MobileNo}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="EmailId">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="EmailId"
                                        value={formValues.family?.EmailId || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="EmailId"
                                        isInvalid={!!errors.family?.EmailId}
                                        isValid={formValues.family?.EmailId && !errors.family?.EmailId}
                                        autoComplete='off'
                                    />
                                    {errors.family?.EmailId && <span className="error-msg">{errors.family.EmailId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Restriction">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Restriction"
                                        value={formValues.family?.Restriction || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Restriction"
                                        isInvalid={!!errors.family?.Restriction}
                                        isValid={formValues.family?.Restriction && !errors.family?.Restriction}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Restriction && <span className="error-msg">{errors.family.Restriction}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ClientCode">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="ClientCode"
                                        value={formValues.family?.ClientCode || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="ClientCode"
                                        isInvalid={!!errors.family?.ClientCode}
                                        isValid={formValues.family?.ClientCode && !errors.family?.ClientCode}
                                        autoComplete='off'
                                    />
                                    {errors.family?.ClientCode && <span className="error-msg">{errors.family.ClientCode}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="Relation">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="Relation"
                                        value={formValues.family?.Relation || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Relation"
                                        isInvalid={!!errors.family?.Relation}
                                        isValid={formValues.family?.Relation && !errors.family?.Relation}
                                        autoComplete='off'
                                    />
                                    {errors.family?.Relation && <span className="error-msg">{errors.family.Relation}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="PAN">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="PAN"
                                        value={formValues.family?.PAN || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="PAN"
                                        isInvalid={!!errors.family?.PAN}
                                        isValid={formValues.family?.PAN && !errors.family?.PAN}
                                        autoComplete='off'
                                    />
                                    {errors.family?.PAN && <span className="error-msg">{errors.family.PAN}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="FlatId">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="FlatId"
                                        value={formValues.family?.FlatId || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Flat"
                                        isInvalid={!!errors.family?.FlatId}
                                        isValid={formValues.family?.FlatId && !errors.family?.FlatId}
                                        autoComplete='off'
                                    />
                                    {errors.family?.FlatId && <span className="error-msg">{errors.family.FlatId}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MemberId">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="MemberId"
                                        value={formValues.family?.MemberId || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Member"
                                        isInvalid={!!errors.family?.MemberId}
                                        isValid={formValues.family?.MemberId && !errors.family?.MemberId}
                                        autoComplete='off'
                                    />
                                    {errors.family?.MemberId && <span className="error-msg">{errors.family.MemberId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="AdditionalFM">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="AdditionalFM"
                                        value={formValues.family?.AdditionalFM || ""}
                                        onChange={(e) => handleChange(e, "family")}
                                        placeholder="Additional FM"
                                        isInvalid={!!errors.family?.AdditionalFM}
                                        isValid={formValues.family?.AdditionalFM && !errors.family?.AdditionalFM}
                                        autoComplete='off'
                                    />
                                    {errors.family?.AdditionalFM && <span className="error-msg">{errors.family.AdditionalFM}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="Over Aged"
                                        name="OverAged"
                                        checked={formValues.family?.OverAged || false}
                                        onChange={(e) =>
                                            handleChange(
                                                { target: { name: "OverAged", value: e.target.checked } },
                                                "family"
                                            )
                                        }
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="Flag"
                                        name="Flag"
                                        checked={formValues.family?.Flag || false}
                                        onChange={(e) =>
                                            handleChange(
                                                { target: { name: "Flag", value: e.target.checked } },
                                                "family"
                                            )
                                        }
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="IsActive"
                                        name="IsActive"
                                        checked={formValues.family?.IsActive || false}
                                        onChange={(e) =>
                                            handleChange(
                                                { target: { name: "IsActive", value: e.target.checked } },
                                                "family"
                                            )
                                        }
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Button type="submit" variant="warning" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            </div>
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save & Skip
                                </Button>
                            </div>
                            <div>
                                <Button type="submit" variant="warning" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Address Info */}
            <Offcanvas
                show={activeStep === 3}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Customer Address" : "Add Customer Address"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="addressTypeId">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="addressTypeId"
                                        value={formValues.address?.addressTypeId || ""}
                                        onChange={(e) => handleChange(e, "other")}
                                    >
                                        <option>Select address type</option>
                                        {addressTypeData?.map((item) => (
                                            <option key={item.addressTypeId} value={item.addressTypeId}>
                                                {item.addressTypeName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.address?.addressTypeId && (
                                        <span className="error-msg">{errors.address?.addressTypeId}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="addr1">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addr1"
                                        value={formValues.address?.addr1 || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="Address 1"
                                        isInvalid={!!errors.address?.addr1}
                                        isValid={formValues.address?.addr1 && !errors.address?.addr1}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addr1 && <span className="error-msg">{errors.address.addr1}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="addr2">
                                        <FaRegAddressBook size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addr2"
                                        value={formValues.address?.addr2 || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="Address 2"
                                        isInvalid={!!errors.address?.addr2}
                                        isValid={formValues.address?.addr2 && !errors.address?.addr2}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addr2 && <span className="error-msg">{errors.address.addr2}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="addr3">
                                        <FaRegAddressBook size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addr3"
                                        value={formValues.address?.addr3 || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="Address 3"
                                        isInvalid={!!errors.address?.addr3}
                                        isValid={formValues.address?.addr3 && !errors.address?.addr3}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addr3 && <span className="error-msg">{errors.address.addr3}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="addrPlace">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addrPlace"
                                        value={formValues.address?.addrPlace || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="Address place"
                                        isInvalid={!!errors.address?.addrPlace}
                                        isValid={formValues.address?.addrPlace && !errors.address?.addrPlace}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addrPlace && <span className="error-msg">{errors.address.addrPlace}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="addrDist">
                                        <IoHomeOutline size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addrDist"
                                        value={formValues.address?.addrDist || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="District"
                                        isInvalid={!!errors.address?.addrDist}
                                        isValid={formValues.address?.addrDist && !errors.address?.addrDist}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addrDist && <span className="error-msg">{errors.address.addrDist}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="addrState">
                                        <IoHomeOutline size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addrState"
                                        value={formValues.address?.addrState || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="State"
                                        isInvalid={!!errors.address?.addrState}
                                        isValid={formValues.address?.addrState && !errors.address?.addrState}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addrState && <span className="error-msg">{errors.address.addrState}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="addrCountry">
                                        <IoMdGlobe size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="addrCountry"
                                        value={formValues.address?.addrCountry || ""}
                                        onChange={(e) => handleChange(e, "address")}
                                        placeholder="Country"
                                        isInvalid={!!errors.address?.addrCountry}
                                        isValid={formValues.address?.addrCountry && !errors.address?.addrCountry}
                                        autoComplete='off'
                                    />
                                    {errors.address?.addrCountry && <span className="error-msg">{errors.address.addrCountry}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="IsActive"
                                        name="isActive"
                                        checked={formValues.address?.isActive || false}
                                        onChange={(e) =>
                                            handleChange(
                                                { target: { name: "isActive", value: e.target.checked } },
                                                "address"
                                            )
                                        }
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Button type="submit" variant="warning" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            </div>
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save & Skip
                                </Button>
                            </div>
                            <div>
                                <Button type="submit" variant="warning" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Business Info */}
            <Offcanvas
                show={activeStep === 4}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Customer Business" : "Add Customer Business"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compAddr1">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compAddr1"
                                        value={formValues.business?.compAddr1 || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company address 1"
                                        isInvalid={!!errors.business?.compAddr1}
                                        isValid={formValues.business?.compAddr1 && !errors.business?.compAddr1}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compAddr1 && <span className="error-msg">{errors.business?.compAddr1}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compAddr2">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compAddr2"
                                        value={formValues.business?.compAddr2 || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company address 2"
                                        isInvalid={!!errors.business?.compAddr2}
                                        isValid={formValues.business?.compAddr2 && !errors.business?.compAddr2}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compAddr2 && <span className="error-msg">{errors.business?.compAddr2}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compAddr3">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compAddr3"
                                        value={formValues.business?.compAddr3 || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company address 3"
                                        isInvalid={!!errors.business?.compAddr3}
                                        isValid={formValues.business?.compAddr3 && !errors.business?.compAddr3}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compAddr3 && <span className="error-msg">{errors.business?.compAddr3}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compAddrPlace">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compAddrPlace"
                                        value={formValues.business?.compAddrPlace || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company address Place"
                                        isInvalid={!!errors.business?.compAddrPlace}
                                        isValid={formValues.business?.compAddrPlace && !errors.business?.compAddrPlace}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compAddrPlace && <span className="error-msg">{errors.business?.compAddrPlace}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compAddrDist">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compAddrDist"
                                        value={formValues.business?.compAddrDist || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company address District"
                                        isInvalid={!!errors.business?.compAddrDist}
                                        isValid={formValues.business?.compAddrDist && !errors.business?.compAddrDist}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compAddrDist && <span className="error-msg">{errors.business?.compAddrDist}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compAddrState">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compAddrState"
                                        value={formValues.business?.compAddrState || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company address state"
                                        isInvalid={!!errors.business?.compAddrState}
                                        isValid={formValues.business?.compAddrState && !errors.business?.compAddrState}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compAddrState && <span className="error-msg">{errors.business?.compAddrState}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compPhone">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compPhone"
                                        value={formValues.business?.compPhone || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company Phone"
                                        isInvalid={!!errors.business?.compPhone}
                                        isValid={formValues.business?.compPhone && !errors.business?.compPhone}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compPhone && <span className="error-msg">{errors.business?.compPhone}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compMobile">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compMobile"
                                        value={formValues.business?.compMobile || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company Mobile"
                                        isInvalid={!!errors.business?.compMobile}
                                        isValid={formValues.business?.compMobile && !errors.business?.compMobile}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compMobile && <span className="error-msg">{errors.business?.compMobile}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="compEmail">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="compEmail"
                                        value={formValues.business?.compEmail || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company email"
                                        isInvalid={!!errors.business?.compEmail}
                                        isValid={formValues.business?.compEmail && !errors.business?.compEmail}
                                        autoComplete='off'
                                    />
                                    {errors.business?.compEmail && <span className="error-msg">{errors.business?.compEmail}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="companyName">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="companyName"
                                        value={formValues.business?.companyName || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company name"
                                        isInvalid={!!errors.business?.companyName}
                                        isValid={formValues.business?.companyName && !errors.business?.companyName}
                                        autoComplete='off'
                                    />
                                    {errors.business?.companyName && <span className="error-msg">{errors.business?.companyName}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeAddr1">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeAddr1"
                                        value={formValues.business?.regdOfficeAddr1 || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company office address 1"
                                        isInvalid={!!errors.business?.regdOfficeAddr1}
                                        isValid={formValues.business?.regdOfficeAddr1 && !errors.business?.regdOfficeAddr1}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeAddr1 && <span className="error-msg">{errors.business?.regdOfficeAddr1}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeAddr2">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeAddr2"
                                        value={formValues.business?.regdOfficeAddr2 || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company office address 2"
                                        isInvalid={!!errors.business?.regdOfficeAddr2}
                                        isValid={formValues.business?.regdOfficeAddr2 && !errors.business?.regdOfficeAddr2}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeAddr2 && <span className="error-msg">{errors.business?.regdOfficeAddr2}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeAddr3">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeAddr3"
                                        value={formValues.business?.regdOfficeAddr3 || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Company office address 3"
                                        isInvalid={!!errors.business?.regdOfficeAddr3}
                                        isValid={formValues.business?.regdOfficeAddr3 && !errors.business?.regdOfficeAddr3}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeAddr3 && <span className="error-msg">{errors.business?.regdOfficeAddr3}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficePlace">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficePlace"
                                        value={formValues.business?.regdOfficePlace || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office place"
                                        isInvalid={!!errors.business?.regdOfficePlace}
                                        isValid={formValues.business?.regdOfficePlace && !errors.business?.regdOfficePlace}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficePlace && <span className="error-msg">{errors.business?.regdOfficePlace}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeState">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeState"
                                        value={formValues.business?.regdOfficeState || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office place"
                                        isInvalid={!!errors.business?.regdOfficeState}
                                        isValid={formValues.business?.regdOfficeState && !errors.business?.regdOfficeState}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeState && <span className="error-msg">{errors.business?.regdOfficeState}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficePIN">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficePIN"
                                        value={formValues.business?.regdOfficePIN || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office PIN"
                                        isInvalid={!!errors.business?.regdOfficePIN}
                                        isValid={formValues.business?.regdOfficePIN && !errors.business?.regdOfficePIN}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficePIN && <span className="error-msg">{errors.business?.regdOfficePIN}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeCountry">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeCountry"
                                        value={formValues.business?.regdOfficeCountry || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office country"
                                        isInvalid={!!errors.business?.regdOfficeCountry}
                                        isValid={formValues.business?.regdOfficeCountry && !errors.business?.regdOfficeCountry}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeCountry && <span className="error-msg">{errors.business?.regdOfficeCountry}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficePhone">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficePhone"
                                        value={formValues.business?.regdOfficePhone || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office phone"
                                        isInvalid={!!errors.business?.regdOfficePhone}
                                        isValid={formValues.business?.regdOfficePhone && !errors.business?.regdOfficePhone}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficePhone && <span className="error-msg">{errors.business?.regdOfficePhone}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeMobile">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeMobile"
                                        value={formValues.business?.regdOfficeMobile || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office phone"
                                        isInvalid={!!errors.business?.regdOfficeMobile}
                                        isValid={formValues.business?.regdOfficeMobile && !errors.business?.regdOfficeMobile}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeMobile && <span className="error-msg">{errors.business?.regdOfficeMobile}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="regdOfficeEmail">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="regdOfficeEmail"
                                        value={formValues.business?.regdOfficeEmail || ""}
                                        onChange={(e) => handleChange(e, "business")}
                                        placeholder="Register office email"
                                        isInvalid={!!errors.business?.regdOfficeEmail}
                                        isValid={formValues.business?.regdOfficeEmail && !errors.business?.regdOfficeEmail}
                                        autoComplete='off'
                                    />
                                    {errors.business?.regdOfficeEmail && <span className="error-msg">{errors.business?.regdOfficeEmail}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="IsActive"
                                        checked={formValues.business?.IsActive}
                                        onChange={(e) => handleChange("isActive", e.target.checked)}
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Button type="submit" variant="warning" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            </div>
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save & Skip
                                </Button>
                            </div>
                            <div>
                                <Button type="submit" variant="warning" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Member Info */}
            <Offcanvas
                show={activeStep === 5}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Member" : "Add Member"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="FrequentMember">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="FrequentMember"
                                        value={formValues.member?.FrequentMember || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder="Frequent Member"
                                        isInvalid={!!errors.member?.FrequentMember}
                                        isValid={formValues.member?.FrequentMember && !errors.member?.FrequentMember}
                                        autoComplete='off'
                                    />
                                    {errors.member?.FrequentMember && <span className="error-msg">{errors.member?.FrequentMember}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MemberId">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="MemberId"
                                        value={formValues.member?.MemberId || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder="Membar Id"
                                        isInvalid={!!errors.member?.MemberId}
                                        isValid={formValues.member?.MemberId && !errors.member?.MemberId}
                                        autoComplete='off'
                                    />
                                    {errors.member?.MemberId && <span className="error-msg">{errors.member?.MemberId}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ClientApplDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="ClientApplDate"
                                        value={formValues.member?.ClientApplDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.ClientApplDate}
                                        isValid={formValues.member?.ClientApplDate && !errors.member?.ClientApplDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.ClientApplDate && <span className="error-msg">{errors.member?.ClientApplDate}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="InterViewDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="InterViewDate"
                                        value={formValues.member?.InterViewDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.InterViewDate}
                                        isValid={formValues.member?.InterViewDate && !errors.member?.InterViewDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.InterViewDate && <span className="error-msg">{errors.member?.InterViewDate}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ScreeningDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="ScreeningDate"
                                        value={formValues.member?.ScreeningDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.ScreeningDate}
                                        isValid={formValues.member?.ScreeningDate && !errors.member?.ScreeningDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.ScreeningDate && <span className="error-msg">{errors.member?.ScreeningDate}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ApprovedDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="ApprovedDate"
                                        value={formValues.member?.ApprovedDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.ApprovedDate}
                                        isValid={formValues.member?.ApprovedDate && !errors.member?.ApprovedDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.ApprovedDate && <span className="error-msg">{errors.member?.ApprovedDate}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="StatusRemarks">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="StatusRemarks"
                                        value={formValues.member?.StatusRemarks || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Status Remarks'
                                        isInvalid={!!errors.member?.StatusRemarks}
                                        isValid={formValues.member?.StatusRemarks && !errors.member?.StatusRemarks}
                                        autoComplete='off'
                                    />
                                    {errors.member?.StatusRemarks && <span className="error-msg">{errors.member?.StatusRemarks}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MemberPhotoFile">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        name="MemberPhotoFile"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleChange({ target: { name: "MemberPhotoFile", value: file } }, "member");
                                            }
                                        }}
                                    />
                                    {errors.member?.MemberPhotoFile && <span className="error-msg">{errors.member?.MemberPhotoFile}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MemberSignatureFile">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        name="MemberSignatureFile"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleChange({ target: { name: "MemberSignatureFile", value: file } }, "member");
                                            }
                                        }}
                                    />
                                    {errors.member?.MemberSignatureFile && <span className="error-msg">{errors.member?.MemberSignatureFile}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MembershipDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="MembershipDate"
                                        value={formValues.member?.MembershipDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.MembershipDate}
                                        isValid={formValues.member?.MembershipDate && !errors.member?.MembershipDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.MembershipDate && <span className="error-msg">{errors.member?.MembershipDate}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MembershipDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="MemebershipStatus"
                                        value={formValues.member?.MemebershipStatus || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Memebership Status'
                                        isInvalid={!!errors.member?.MemebershipStatus}
                                        isValid={formValues.member?.MemebershipStatus && !errors.member?.MemebershipStatus}
                                        autoComplete='off'
                                    />
                                    {errors.member?.MemebershipStatus && <span className="error-msg">{errors.member?.MemebershipStatus}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="WithdrawlDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="WithdrawlDate"
                                        value={formValues.member?.WithdrawlDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.WithdrawlDate}
                                        isValid={formValues.member?.WithdrawlDate && !errors.member?.WithdrawlDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.WithdrawlDate && <span className="error-msg">{errors.member?.WithdrawlDate}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ExpiryDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="ExpiryDate"
                                        value={formValues.member?.ExpiryDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.ExpiryDate}
                                        isValid={formValues.member?.ExpiryDate && !errors.member?.ExpiryDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.ExpiryDate && <span className="error-msg">{errors.member?.ExpiryDate}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="YearofValidation">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="YearofValidation"
                                        value={formValues.member?.YearofValidation || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Year of Validation'
                                        isInvalid={!!errors.member?.YearofValidation}
                                        isValid={formValues.member?.YearofValidation && !errors.member?.YearofValidation}
                                        autoComplete='off'
                                    />
                                    {errors.member?.YearofValidation && <span className="error-msg">{errors.member?.YearofValidation}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="FlatCode">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="FlatCode"
                                        value={formValues.member?.FlatCode || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Flat Code'
                                        isInvalid={!!errors.member?.FlatCode}
                                        isValid={formValues.member?.FlatCode && !errors.member?.FlatCode}
                                        autoComplete='off'
                                    />
                                    {errors.member?.FlatCode && <span className="error-msg">{errors.member?.FlatCode}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="SchemeOpted">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="SchemeOpted"
                                        value={formValues.member?.SchemeOpted || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Flat Code'
                                        isInvalid={!!errors.member?.SchemeOpted}
                                        isValid={formValues.member?.SchemeOpted && !errors.member?.SchemeOpted}
                                        autoComplete='off'
                                    />
                                    {errors.member?.SchemeOpted && <span className="error-msg">{errors.member?.SchemeOpted}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="BLNTag">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="BLNTag"
                                        value={formValues.member?.BLNTag || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='BLN Tag'
                                        isInvalid={!!errors.member?.BLNTag}
                                        isValid={formValues.member?.BLNTag && !errors.member?.BLNTag}
                                        autoComplete='off'
                                    />
                                    {errors.member?.BLNTag && <span className="error-msg">{errors.member?.BLNTag}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ICOEmail">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="ICOEmail"
                                        value={formValues.member?.ICOEmail || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='ICO Email'
                                        isInvalid={!!errors.member?.ICOEmail}
                                        isValid={formValues.member?.ICOEmail && !errors.member?.ICOEmail}
                                        autoComplete='off'
                                    />
                                    {errors.member?.ICOEmail && <span className="error-msg">{errors.member?.ICOEmail}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="DiscountOffered">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="DiscountOffered"
                                        value={formValues.member?.DiscountOffered || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Discount Offered'
                                        isInvalid={!!errors.member?.DiscountOffered}
                                        isValid={formValues.member?.DiscountOffered && !errors.member?.DiscountOffered}
                                        autoComplete='off'
                                    />
                                    {errors.member?.DiscountOffered && <span className="error-msg">{errors.member?.DiscountOffered}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="TotDepositRecievable">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="TotDepositRecievable"
                                        value={formValues.member?.TotDepositRecievable || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Tot Deposit Recievable'
                                        isInvalid={!!errors.member?.TotDepositRecievable}
                                        isValid={formValues.member?.TotDepositRecievable && !errors.member?.TotDepositRecievable}
                                        autoComplete='off'
                                    />
                                    {errors.member?.TotDepositRecievable && <span className="error-msg">{errors.member?.TotDepositRecievable}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="MonthlySubscription">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="MonthlySubscription"
                                        value={formValues.member?.MonthlySubscription || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Monthly Subscription'
                                        isInvalid={!!errors.member?.MonthlySubscription}
                                        isValid={formValues.member?.MonthlySubscription && !errors.member?.MonthlySubscription}
                                        autoComplete='off'
                                    />
                                    {errors.member?.MonthlySubscription && <span className="error-msg">{errors.member?.MonthlySubscription}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="AnnualSubscription">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="AnnualSubscription"
                                        value={formValues.member?.AnnualSubscription || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Annual Subscription'
                                        isInvalid={!!errors.member?.AnnualSubscription}
                                        isValid={formValues.member?.AnnualSubscription && !errors.member?.AnnualSubscription}
                                        autoComplete='off'
                                    />
                                    {errors.member?.AnnualSubscription && <span className="error-msg">{errors.member?.AnnualSubscription}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="BlockDate">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='date'
                                        name="BlockDate"
                                        value={formValues.member?.BlockDate || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        isInvalid={!!errors.member?.BlockDate}
                                        isValid={formValues.member?.BlockDate && !errors.member?.BlockDate}
                                        autoComplete='off'
                                    />
                                    {errors.member?.BlockDate && <span className="error-msg">{errors.member?.BlockDate}</span>}
                                </InputGroup>
                            </Col>
                             <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="BlockUser">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="BlockUser"
                                        value={formValues.member?.BlockUser || ""}
                                        onChange={(e) => handleChange(e, "member")}
                                        placeholder='Block User'
                                        isInvalid={!!errors.member?.BlockUser}
                                        isValid={formValues.member?.BlockUser && !errors.member?.BlockUser}
                                        autoComplete='off'
                                    />
                                    {errors.member?.BlockUser && <span className="error-msg">{errors.member?.BlockUser}</span>}
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Button type="submit" variant="warning" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            </div>
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save & Skip
                                </Button>
                            </div>
                            <div>
                                <Button type="submit" variant="warning" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Doc Info */}
            <Offcanvas
                show={activeStep === 6}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Document Info" : "Add Document Info"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="DocTypeId">
                                        <IoPersonOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="DocTypeId"
                                        value={formValues.documents?.DocTypeId || ""}
                                        onChange={(e) => handleChange(e, "documents")}
                                    >
                                        <option>Select document type</option>
                                        {customerData?.map((item) => (
                                            <option key={item.customerID} value={item.customerID}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.documents?.DocTypeId && (
                                        <span className="error-msg">{errors.documents.DocTypeId}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="DocName">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        name="DocName"
                                        value={formValues.documents?.DocName || ""}
                                        onChange={(e) => handleChange(e, "documents")}
                                        placeholder="Document name"
                                        aria-label="DocName"
                                        isInvalid={!!errors.documents?.DocName}
                                        isValid={formValues.documents?.DocName && !errors.documents?.DocName}
                                        autoComplete='off'
                                    />
                                    {errors.documents?.DocName && <span className="error-msg">{errors.documents?.DocName}</span>}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="DocImageFile">
                                        <FaRegFile size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        name="DocImageFile"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleChange({ target: { name: "DocImageFile", value: file } }, "documents");
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ValidFrom">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="ValidFrom"
                                        value={formValues.documents?.ValidFrom || ""}
                                        onChange={(e) => handleChange(e, "documents")}
                                        placeholder="Valid From"
                                        aria-label="ValidFrom"
                                        isInvalid={!!errors.documents?.ValidFrom}
                                        isValid={formValues.documents?.ValidFrom && !errors.documents?.ValidFrom}
                                        autoComplete="off"
                                    />
                                    {errors.documents?.ValidFrom && (
                                        <span className="error-msg">{errors.documents?.ValidFrom}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="ValidTo">
                                        <FaRegAddressBook size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="ValidTo"
                                        value={formValues.documents?.ValidTo || ""}
                                        onChange={(e) => handleChange(e, "documents")}
                                        placeholder="Valid To"
                                        aria-label="ValidTo"
                                        isInvalid={!!errors.documents?.ValidTo}
                                        isValid={formValues.documents?.ValidTo && !errors.documents?.ValidTo}
                                        autoComplete="off"
                                    />
                                    {errors.documents?.ValidTo && (
                                        <span className="error-msg">{errors.documents?.ValidTo}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="IsActive"
                                        name="isActive"
                                        checked={formValues.documents?.isActive || false}
                                        onChange={(e) =>
                                            handleChange(
                                                { target: { name: "isActive", value: e.target.checked } },
                                                "other"
                                            )
                                        }
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>

                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Button type="submit" variant="warning" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            </div>
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save & Skip
                                </Button>
                            </div>
                            <div>
                                <Button type="submit" variant="warning" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Other Info */}
            <Offcanvas
                show={activeStep === 7}
                onHide={handleClose}
                placement="end"
                backdrop="false"
                className="custom-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <div className="w-100 text-center">
                        <Offcanvas.Title style={{ fontSize: "30px", fontWeight: 600 }}>
                            {isEditMode ? "Edit Other Info" : "Add Other Info"}
                        </Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ marginTop: "-2vh" }}>
                    <Form className='h-90'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <InputGroup className="mb-4">
                                    <InputGroup.Text id="referredCustomerID">
                                        <IoPersonOutline size={25} color='#ffc800' />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="referredCustomerID"
                                        value={formValues.others?.referredCustomerID || ""}
                                        onChange={(e) => handleChange(e, "other")}
                                    >
                                        <option value="">Select referred customer</option>
                                        {customerData?.map((item) => (
                                            <option key={item.customerID} value={item.customerID}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    {errors.other?.referredCustomerID && (
                                        <span className="error-msg">{errors.other.referredCustomerID}</span>
                                    )}
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <TbHandClick size={25} color="#ffc800" />
                                    </InputGroup.Text>
                                    <Form.Check
                                        type="checkbox"
                                        label="IsActive"
                                        name="isActive"
                                        checked={formValues.other?.isActive || false}
                                        onChange={(e) =>
                                            handleChange(
                                                { target: { name: "isActive", value: e.target.checked } },
                                                "other"
                                            )
                                        }
                                        className="ms-3"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-4">
                            <div>
                                <Button type="submit" variant="warning" onClick={handlePrevious}>
                                    Previous
                                </Button>
                            </div>
                            <div className="mx-auto">
                                <Button type="submit" variant="warning" onClick={handleSubmit}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Customer
