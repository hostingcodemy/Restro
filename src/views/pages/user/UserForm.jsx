import { useEffect, useRef, useState } from "react";
import MenuBar from '../../Components/MenuBar';
import { useCategory } from '../../Context/CategoryContext';
import api from '../../config/AxiosInterceptor';
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { toast, ToastContainer } from 'react-toastify';
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineMail } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { CiMobile3 } from "react-icons/ci";
import { LuUserPen } from "react-icons/lu";
import { TbScanPosition } from "react-icons/tb";
import { RiUserLocationLine } from "react-icons/ri";


const UserForm = () => {

  const nameRef = useRef(null);
  const navigate = useNavigate();
  const fetchCalled = useRef(false);
  const channelID = localStorage.getItem("channelId");

  const initialValues = {
    name: "",
    mobileNo: "",
    email: "",
    username: "",
    outletPermissions: [{ userGroupId: "", OutletId: "" }],
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const { setIsHiddenSidebarOpen } = useCategory();
  const [outletData, setOutletData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [focus, setFocus] = useState(false);
  const [focused, setFocused] = useState({});

  useEffect(() => {
    setIsHiddenSidebarOpen(true);
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (fetchCalled.current) return;
    fetchCalled.current = true;
    fetchOutletData();
    fetchUserGroupData();
  }, []);

  const fetchOutletData = async () => {
    try {
      const res = await api.get("/outlets", {
      });
      setOutletData(res?.data?.list);
    } catch (error) {
      console.error("Error fetching outlets", error);
    }
  };

  const fetchUserGroupData = async () => {
    try {
      const res = await api.get(`/usergroups?channelID=${channelID}`, {

      });
      setRoleData(res?.data?.list);
    } catch (error) {
      console.error("Error fetching user groups", error);
    }
  };

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleDropDownChange = (index, field, value) => {
    setFormValues((prevValues) => {
      const updatedPermissions = [...prevValues.outletPermissions];
      updatedPermissions[index] = {
        ...updatedPermissions[index],
        [field]: value,
      };
      return {
        ...prevValues,
        outletPermissions: updatedPermissions,
      };
    });
  };

  const validateForm = () => {
    const { name, mobileNo, email } = formValues;
    const errors = {};
    let isValid = true;

    const phoneRegex = /^[9876]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) {
      isValid = false;
      errors.name = "Name is required.";
    }
    if (!mobileNo) {
      isValid = false;
      errors.mobileNo = "Phone is required.";
    } else if (!phoneRegex.test(mobileNo)) {
      isValid = false;
      errors.mobileNo = "Enter a valid 10-digit phone number starting with 9, 8, 7, or 6.";
    }
    if (!email) {
      isValid = false;
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      isValid = false;
      errors.email = "Enter a valid email address.";
    }

    setErrors(errors);
    return isValid;
  };

  const addNewRow = () => {
    setFormValues((prev) => ({
      ...prev,
      outletPermissions: [...prev.outletPermissions, { channelUserGroupId: "", OutletId: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: formValues.name,
      mobileNo: formValues.mobileNo,
      email: formValues.email,
      password: "SuperSecure123!",
      username: formValues.username,
      channelId: channelID,
      isActive: true,
      outletPermissions: formValues.outletPermissions.map((perm) => ({
        userGroupId: perm.channelUserGroupId,
        OutletId: perm.OutletId,
      })),
    };

    try {
      let res;
      if (formValues.userId) {
        res = await api.put(`/users/${formValues.userId}`, payload, {

        });
      } else {
        res = await api.post("/users", payload, {

        });
      }
      setFormValues(initialValues);
      toast.success(res.data.successMessage || "Success!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/users");
      }, 3000);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong! Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>

      <div className='d-flex'>
        <MenuBar />
        <ToastContainer />
        <div className="configurationFormContainer ">
          <div className='configurationFormWrapper'>
            <div className='configurationgroupFormHeader'>
              <h2>Add <span>User</span></h2>
            </div>
            <Form className='h-100'>
              <Row>
                <Col md={3}>
                  <Form.Group controlId="name">
                    <div className='configurationInputFieldWrapperMain shadow-sm'>
                      <div className='configurationIconWrapper'>
                        <VscAccount size={20} />
                      </div>
                      <div
                        className={`label ${focus.name || formValues.name ? "floating" : ""}`}
                        style={{
                          position: "absolute",
                          top: focus.name || formValues.name ? "-10px" : "50%",
                          left: "40px",
                          transform: focus.name || formValues.name ? "translateY(0)" : "translateY(-50%)",
                          fontSize: focus.name || formValues.name ? "12px" : "14px",
                          color: "orange",
                          backgroundColor: "#fff",
                          padding: focus.name || formValues.name ? "0 4px" : "0",
                          transition: "all 0.2s ease",
                          pointerEvents: "none",
                        }}
                      >
                        Enter Your Name
                      </div>
                      <Form.Control
                        className='configurationInput'
                        type="text"
                        value={formValues.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        onFocus={() => setFocus(prev => ({ ...prev, name: true }))}
                        onBlur={() => setFocus(prev => ({ ...prev, name: false }))}
                        autoComplete="off"
                      />
                    </div>
                    <div className="text-danger small">{errors.name}</div>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="mobileNo">
                    <div className='configurationInputFieldWrapper shadow-sm'>
                      <div className='configurationIconWrapper'>
                        <CiPhone
                          size={20} />
                      </div>
                      <div
                        className={`label ${focus.mobileNo || formValues.mobileNo ? "floating" : ""}`}
                        style={{
                          position: "absolute",
                          top: focus.mobileNo || formValues.mobileNo ? "-10px" : "50%",
                          left: "40px",
                          transform: focus.mobileNo || formValues.mobileNo ? "translateY(0)" : "translateY(-50%)",
                          fontSize: focus.mobileNo || formValues.mobileNo ? "12px" : "14px",
                          color: "#666",
                          backgroundColor: "#fff",
                          padding: focus.mobileNo || formValues.mobileNo ? "0 4px" : "0",
                          transition: "all 0.2s ease",
                          pointerEvents: "none",
                        }}
                      >
                        Enter Mobile No.
                      </div>
                      <Form.Control
                        className='configurationInput'
                        type="text"
                        value={formValues.mobileNo || ""}
                        onChange={(e) => {
                          if (/^\d*$/.test(e.target.value)) handleChange("mobileNo", e.target.value);
                        }}
                        onFocus={() => setFocus(prev => ({ ...prev, mobileNo: true }))}
                        onBlur={() => setFocus(prev => ({ ...prev, mobileNo: false }))}
                        autoComplete="off"
                        minLength={10}
                        maxLength={15}
                      />
                    </div>
                    <div className="text-danger small">{errors.mobileNo}</div>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="email">
                    <div className='configurationInputFieldWrapper shadow-sm'>
                      <div className='configurationIconWrapper'>
                        <MdOutlineMail size={20} />
                      </div>
                      <div
                        className={`label ${focus.email || formValues.email ? "floating" : ""}`}
                        style={{
                          position: "absolute",
                          top: focus.email || formValues.email ? "-10px" : "50%",
                          left: "40px",
                          transform: focus.email || formValues.email ? "translateY(0)" : "translateY(-50%)",
                          fontSize: focus.email || formValues.email ? "12px" : "14px",
                          color: "#666",
                          backgroundColor: "#fff",
                          padding: focus.email || formValues.email ? "0 4px" : "0",
                          transition: "all 0.2s ease",
                          pointerEvents: "none",
                        }}
                      >
                        Enter Email
                      </div>
                      <Form.Control
                        className='configurationInput'
                        type="text"
                        value={formValues.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onFocus={() => setFocus(prev => ({ ...prev, email: true }))}
                        onBlur={() => setFocus(prev => ({ ...prev, email: false }))}
                        autoComplete="off"
                      />
                    </div>
                    <div className="text-danger small">{errors.email}</div>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="username">
                    <div className='configurationInputFieldWrapper shadow-sm'>
                      <div className='configurationIconWrapper'>
                        <LuUserPen size={20} />
                      </div>
                      <div
                        className={`label ${focus.username || formValues.username ? "floating" : ""}`}
                        style={{
                          position: "absolute",
                          top: focus.username || formValues.username ? "-10px" : "50%",
                          left: "40px",
                          transform: focus.username || formValues.username ? "translateY(0)" : "translateY(-50%)",
                          fontSize: focus.username || formValues.username ? "12px" : "14px",
                          color: "#666",
                          backgroundColor: "#fff",
                          padding: focus.username || formValues.username ? "0 4px" : "0",
                          transition: "all 0.2s ease",
                          pointerEvents: "none",
                        }}
                      >
                        Enter Username
                      </div>
                      <Form.Control
                        className='configurationInput'
                        type="text"
                        name="username"
                        value={formValues.username || ""}
                        onChange={(e) => handleChange("username", e.target.value)}
                        onFocus={() => setFocus(prev => ({ ...prev, username: true }))}
                        onBlur={() => setFocus(prev => ({ ...prev, username: false }))}
                        autoComplete="off"
                      />
                    </div>
                    <div className="text-danger small">
                      {!formValues.username && errors.username}
                    </div>
                  </Form.Group>
                </Col>
                {formValues.outletPermissions.map((item, index) => {
                  const selectedRoles = formValues.outletPermissions.map((p) => p.channelUserGroupId);
                  const selectedLocations = formValues.outletPermissions.map((p) => p.OutletId);

                  return (
                    <Row className="mt-4" key={index}>
                      <Col md={3}>
                        <Form.Group>
                          <div className='configurationSelectWrapper shadow-sm'>
                            <div className='configurationIconWrapper'>
                              <TbScanPosition size={20} />
                            </div>
                            <div
                              className={`label ${focused[index]?.channelUserGroupId || item.channelUserGroupId ? "floating" : ""}`}
                              style={{
                                position: "absolute",
                                top: focused[index]?.channelUserGroupId || item.channelUserGroupId ? "-10px" : "50%",
                                left: "40px",
                                transform: focused[index]?.channelUserGroupId || item.channelUserGroupId ? "translateY(0)" : "translateY(-50%)",
                                fontSize: focused[index]?.channelUserGroupId || item.channelUserGroupId ? "12px" : "14px",
                                color: "#666",
                                backgroundColor: "#fff",
                                padding: focused[index]?.channelUserGroupId || item.channelUserGroupId ? "0 4px" : "0",
                                transition: "all 0.2s ease",
                                pointerEvents: "none",
                              }}
                            >
                              Select User Role
                            </div>
                            <Select
                              isSearchable
                              placeholder=""
                              name={`channelUserGroupId-${index}`}
                              value={
                                item.channelUserGroupId
                                  ? roleData?.find((role) => role.value === item.channelUserGroupId)
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleDropDownChange(index, "channelUserGroupId", selectedOption.value)
                              }
                              onFocus={() =>
                                setFocused((prev) => ({
                                  ...prev,
                                  [index]: { ...(prev[index] || {}), channelUserGroupId: true },
                                }))
                              }
                              onBlur={() =>
                                setFocused((prev) => ({
                                  ...prev,
                                  [index]: { ...(prev[index] || {}), channelUserGroupId: false },
                                }))
                              }
                              options={roleData
                                ?.map((role) => ({
                                  label: role.groupName,
                                  value: role.channelUserGroupId,
                                }))
                                .filter(
                                  (role) =>
                                    !selectedRoles.includes(role.value) || role.value === item.channelUserGroupId
                                )}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: 'none',
                                  boxShadow: 'none',
                                  backgroundColor: 'none',
                                  height: '1rem',
                                  width: '17rem',
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: '#8c8c8c',
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  color: '#333',
                                }),
                              }}
                            />
                          </div>
                          <div className="text-danger small">
                            {errors.outletPermissions?.[index]?.channelUserGroupId}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <div className='configurationSelectWrapper shadow-sm'>
                            <div className='configurationIconWrapper'>
                              <RiUserLocationLine size={20} />
                            </div>
                            <div
                              className={`label ${focused[index]?.OutletId || item.OutletId ? "floating" : ""}`}
                              style={{
                                position: "absolute",
                                top: focused[index]?.OutletId || item.OutletId ? "-10px" : "50%",
                                left: "40px",
                                transform: focused[index]?.OutletId || item.OutletId ? "translateY(0)" : "translateY(-50%)",
                                fontSize: focused[index]?.OutletId || item.OutletId ? "12px" : "14px",
                                color: "#666",
                                backgroundColor: "#fff",
                                padding: focused[index]?.OutletId || item.OutletId ? "0 4px" : "0",
                                transition: "all 0.2s ease",
                                pointerEvents: "none",
                              }}
                            >
                              Select Outlet
                            </div>
                            <Select
                              isSearchable
                              placeholder=""
                              name={`OutletId-${index}`}
                              value={
                                item.OutletId
                                  ? outletData?.find((outlet) => outlet.value === item.OutletId)
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleDropDownChange(index, "OutletId", selectedOption.value)
                              }
                              onFocus={() =>
                                setFocused((prev) => ({
                                  ...prev,
                                  [index]: { ...(prev[index] || {}), OutletId: true },
                                }))
                              }
                              onBlur={() =>
                                setFocused((prev) => ({
                                  ...prev,
                                  [index]: { ...(prev[index] || {}), OutletId: false },
                                }))
                              }
                              options={outletData
                                ?.map((outlet) => ({
                                  label: outlet.outletName,
                                  value: outlet.outletID,
                                }))
                                .filter(
                                  (outlet) =>
                                    !selectedLocations.includes(outlet.value) || outlet.value === item.OutletId
                                )}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: 'none',
                                  boxShadow: 'none',
                                  backgroundColor: 'none',
                                  height: '1rem',
                                  width: '17rem',
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: '#8c8c8c',
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  color: '#333',
                                }),
                              }}
                            />
                          </div>
                          <div className="text-danger small">
                            {errors.outletPermissions?.[index]?.OutletId}
                          </div>
                        </Form.Group>
                      </Col>

                      {index === formValues.outletPermissions.length - 1 &&
                        index < Math.min(roleData.length, outletData.length) - 1 && (
                          <Col md={3} className="mt-2">
                            <CiCirclePlus size={32} onClick={addNewRow} style={{ cursor: "pointer" }} />
                          </Col>
                        )}
                    </Row>
                  );
                })}
              </Row>
            </Form>
            <div className="submitBtnWrapper d-flex justify-content-end bg-white">
              <div className='nextBtn d-flex align-items-center justify-content-center' onClick={handleSubmit}>
                {/* Next <div className='nextIcon'><TbPlayerTrackNext /></div> */}
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForm;
