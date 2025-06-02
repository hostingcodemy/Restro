import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuBar from '../../Components/MenuBar';
import { useCategory } from '../../Context/CategoryContext';
import { Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import api from '../../config/AxiosInterceptor';
import Select from "react-select";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdOutlineViewModule } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";

const UserRoleForm = () => {

   const nameRef = useRef(null);
   const fetchCalled = useRef(false);
   const location = useLocation();
   const navigate = useNavigate();
   const token = localStorage.getItem("accessToken");
   const { setIsHiddenSidebarOpen } = useCategory();

   useEffect(() => {
      setIsHiddenSidebarOpen(true);
      if (nameRef.current) {
         nameRef.current.focus();
      }
   }, []);

   const initialValues = {
      userGroupName: "",
      userModules: "",
      userMenus: [],
      permissions: {}
   };

   const [formValues, setFormValues] = useState(initialValues);
   const [errors, setErrors] = useState({});
   const [modulesData, setModulesData] = useState([]);
   const [menusData, setMenusData] = useState([]);
   const [focus, setFocus] = useState(false);

   useEffect(() => {
      if (fetchCalled.current) return;
      fetchCalled.current = true;
      fetchModuleData();
   }, []);

   const fetchModuleData = async () => {
      try {
         const res = await api.get("/user-access/user-module", {
         });
         setModulesData(res.data.list);
      } catch (error) {
         console.error("Error fetching table data", error);
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

   const handleModuleChange = async (selectedOption) => {
      const selectedModuleIds = selectedOption ? [selectedOption.value] : [];

      handleChange("userModules", selectedModuleIds);

      try {
         const res = await Promise.all(
            selectedModuleIds.map(moduleId =>
               api.get(`/user-access/menu/${moduleId}`).catch(err => {
                  return { data: { list: [] } };
               })
            )
         );

         const menusList = res.flatMap(res => res.data.list);
         const uniqueMenus = Array.from(new Map(menusList.map(item => [item.menuId, item])).values());

         setMenusData(uniqueMenus);
         handleChange("userMenus", []);
      } catch (err) {
         console.error("Error fetching menus:", err);
      }
   };

   const validateForm = () => {
      const {
         userGroupName,
         userModules,
         userMenus,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (!userGroupName) {
         isValid = false;
         errors.userGroupName = "Group name is required.";
      }
      if (!userModules || userModules.length === 0) {
         isValid = false;
         errors.userModules = "Modules are required.";
      }
      if (!userMenus || userMenus.length === 0) {
         isValid = false;
         errors.userMenus = "Menus are required.";
      }

      setErrors(errors);
      return isValid;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const selectedModules = modulesData.filter(module =>
         formValues.userModules.includes(module.moduleId)
      );

      const payload = {
         groupName: formValues.userGroupName,
         isActive: true,
         roles: selectedModules.map((module) => {
            const moduleMenus = menusData.filter(menu =>
               formValues.userMenus.includes(menu.menuId) &&
               menu.moduleId === module.moduleId
            );

            return {
               moduleId: module.moduleId,
               menus: moduleMenus.map((menu) => ({
                  menuId: menu.menuId,
                  permissions: {
                     read: !!formValues.permissions?.[menu.menuId]?.IsRead,
                     write: !!formValues.permissions?.[menu.menuId]?.IsWrite,
                     delete: !!formValues.permissions?.[menu.menuId]?.IsDelete,
                     export: !!formValues.permissions?.[menu.menuId]?.IsExport,
                     import: !!formValues.permissions?.[menu.menuId]?.IsImport,
                     print: !!formValues.permissions?.[menu.menuId]?.IsPrint,
                     approve: !!formValues.permissions?.[menu.menuId]?.IsApprove,
                     printLimit: parseInt(formValues.permissions?.[menu.menuId]?.printLimit || 0, 10),
                     printCount: parseInt(formValues.permissions?.[menu.menuId]?.printCount || 0, 10),
                  }
               }))
            };
         })
      };

      try {
         const res = await api.post("/user-access/user-group", payload, {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
         });
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

         <div className='d-flex'>
            <MenuBar />
            <ToastContainer />

            <div className="configurationFormContainer ">
               <div className='configurationCenterFormWrapper'>
                  <div className='configurationgroupFormHeader'>
                     <h2>Add <span>User</span></h2>
                  </div>
                  <Form className=''>
                     <Row className="g-3">
                        <Col md={3}>
                           <Form.Group controlId="userGroupName">
                              <div className='configurationInputFieldWrapperMain shadow-sm'>
                                 <div className='configurationIconWrapper'>
                                    <HiOutlineUserGroup size={18} />
                                 </div>
                                 <div
                                    className={`label ${focus.userGroupName || formValues.userGroupName ? "floating" : ""}`}
                                    style={{
                                       position: "absolute",
                                       top: focus.userGroupName || formValues.userGroupName ? "-10px" : "50%",
                                       left: "40px",
                                       transform: focus.userGroupName || formValues.userGroupName ? "translateY(0)" : "translateY(-50%)",
                                       fontSize: focus.userGroupName || formValues.userGroupName ? "12px" : "14px",
                                       color: "orange",
                                       backgroundColor: "#fff",
                                       padding: focus.userGroupName || formValues.userGroupName ? "0 4px" : "0",
                                       transition: "all 0.2s ease",
                                       pointerEvents: "none",
                                    }}
                                 >
                                    Enter User groupname
                                 </div>
                                 <Form.Control
                                    className='configurationInput'
                                    type="text"
                                    name="userGroupName"
                                    value={formValues.userGroupName || ""}
                                    onChange={(e) => handleChange("userGroupName", e.target.value)}
                                    onFocus={() => setFocus(prev => ({ ...prev, userGroupName: true }))}
                                    onBlur={() => setFocus(prev => ({ ...prev, userGroupName: false }))}
                                    autoComplete="off"
                                 />
                              </div>
                              <div className="text-danger small">
                                 {!formValues.userGroupName && errors.userGroupName}
                              </div>
                           </Form.Group>
                        </Col>
                        <Col md={3}>
                           <Form.Group controlId="userModules">
                              <div className='configurationSelectWrapper shadow-sm'>
                                 <div className='configurationIconWrapper'>
                                    <MdOutlineViewModule size={18} />
                                 </div>
                                 <div
                                    className={`label ${focus.userModules || formValues.userModules ? "floating" : ""}`}
                                    style={{
                                       position: "absolute",
                                       top: focus.userModules || formValues.userModules ? "-10px" : "50%",
                                       left: "40px",
                                       transform: focus.userModules || formValues.userModules ? "translateY(0)" : "translateY(-50%)",
                                       fontSize: focus.userModules || formValues.userModules ? "12px" : "14px",
                                       color: "#666",
                                       backgroundColor: "#fff",
                                       padding: focus.userModules || formValues.userModules ? "0 4px" : "0",
                                       transition: "all 0.2s ease",
                                       pointerEvents: "none",
                                    }}
                                 >
                                   Select Module
                                 </div>
                                 <Select
                                    name="userModules"
                                    isMulti={false}
                                    isSearchable={true}
                                    value={modulesData
                                       ?.filter(item => formValues.userModules.includes(item.moduleId))
                                       .map(item => ({
                                          label: item.moduleName,
                                          value: item.moduleId
                                       }))
                                    }
                                    placeholder=""
                                    onChange={handleModuleChange}
                                    onFocus={() => setFocus(prev => ({ ...prev, userModules: true }))}
                                    onBlur={() => setFocus(prev => ({ ...prev, userModules: false }))}
                                    options={modulesData?.map(item => ({
                                       label: item.moduleName,
                                       value: item.moduleId
                                    }))}
                                    styles={{
                                       control: base => ({
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
                                 {!formValues.userModules && errors.userModules}
                              </div>
                           </Form.Group>
                        </Col>
                        <Col md={3}>
                           <Form.Group controlId="userMenus">
                              <div className='configurationSelectWrapper shadow-sm'>
                                 <div className='configurationIconWrapper'>
                                    <IoRestaurantOutline size={18} />
                                 </div>
                                 <div
                                    className={`label ${focus.userMenus || formValues.userMenus ? "floating" : ""}`}
                                    style={{
                                       position: "absolute",
                                       top: focus.userMenus || formValues.userMenus ? "-10px" : "50%",
                                       left: "40px",
                                       transform: focus.userMenus || formValues.userMenus ? "translateY(0)" : "translateY(-50%)",
                                       fontSize: focus.userMenus || formValues.userMenus ? "12px" : "14px",
                                       color: "#666",
                                       backgroundColor: "#fff",
                                       padding: focus.userMenus || formValues.userMenus ? "0 4px" : "0",
                                       transition: "all 0.2s ease",
                                       pointerEvents: "none",
                                    }}
                                 >
                                   Select Menu
                                 </div>
                                 <Select
                                    name="userMenus"
                                    isMulti
                                    isSearchable
                                    value={menusData
                                       ?.filter(item => formValues.userMenus.includes(item.menuId))
                                       .map(item => ({ label: item.menuName, value: item.menuId }))}
                                    onChange={(selectedOptions) =>
                                       handleChange("userMenus", selectedOptions?.map(option => option.value) || [])
                                    }
                                    onFocus={() => setFocus(prev => ({ ...prev, userMenus: true }))}
                                    onBlur={() => setFocus(prev => ({ ...prev, userMenus: false }))}
                                    placeholder=""
                                    options={menusData?.map(item => ({
                                       label: item.menuName,
                                       value: item.menuId
                                    }))}
                                    styles={{
                                       control: base => ({
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
                                 {!formValues.userMenus.length && errors.userMenus}
                              </div>
                           </Form.Group>
                        </Col>
                        <Col md={6}>
                           {formValues.userMenus.map(menu => {
                              const perms = formValues.permissions[menu] || {};
                              const menuName = menusData.find(m => m.menuId === menu)?.menuName || menu;
                              return (
                                 <div key={menu} className="mt-3 border p-3 rounded">
                                    <strong>{menuName}</strong>
                                    <div className="mt-2 d-flex flex-wrap gap-3">
                                       {["IsApprove", "IsDelete", "IsExport", "IsImport", "IsPrint", "IsWrite", "IsRead"].map(perm => (
                                          <Form.Check
                                             key={perm}
                                             type="checkbox"
                                             label={perm}
                                             checked={!!(formValues.permissions?.[menu]?.[perm])}
                                             onChange={() =>
                                                setFormValues(prev => ({
                                                   ...prev,
                                                   permissions: {
                                                      ...prev.permissions,
                                                      [menu]: {
                                                         ...(prev.permissions?.[menu] || {}),
                                                         [perm]: !prev.permissions?.[menu]?.[perm]
                                                      }
                                                   }
                                                }))
                                             }
                                          />
                                       ))}
                                    </div>
                                    <div className='mt-2'>
                                       <Row >
                                          <Col md={3}>
                                             <Form.Group controlId="printLimit">
                                                <Form.Label>Print Limit</Form.Label>
                                                <Form.Control
                                                   type="text"
                                                   name="printLimit"
                                                   value={formValues.permissions?.[menu]?.printLimit || ""}
                                                   onChange={(e) => {
                                                      if (/^\d*$/.test(e.target.value)) {
                                                         setFormValues(prev => ({
                                                            ...prev,
                                                            permissions: {
                                                               ...prev.permissions,
                                                               [menu]: {
                                                                  ...(prev.permissions?.[menu] || {}),
                                                                  printLimit: e.target.value
                                                               }
                                                            }
                                                         }));
                                                      }
                                                   }}
                                                   placeholder="0"
                                                   autoComplete="off"
                                                />
                                                <div className="text-danger small">
                                                   {!formValues.printLimit && errors.printLimit}
                                                </div>
                                             </Form.Group>
                                          </Col>
                                          <Col md={3}>
                                             <Form.Group controlId="printCount">
                                                <Form.Label>Print Count</Form.Label>
                                                <Form.Control
                                                   type="text"
                                                   name="printCount"
                                                   value={formValues.permissions?.[menu]?.printCount || ""}
                                                   onChange={(e) => {
                                                      if (/^\d*$/.test(e.target.value)) {
                                                         setFormValues(prev => ({
                                                            ...prev,
                                                            permissions: {
                                                               ...prev.permissions,
                                                               [menu]: {
                                                                  ...(prev.permissions?.[menu] || {}),
                                                                  printCount: e.target.value
                                                               }
                                                            }
                                                         }));
                                                      }
                                                   }}
                                                   placeholder="0"
                                                   autoComplete="off"
                                                />
                                                <div className="text-danger small">
                                                   {!formValues.printCount && errors.printCount}
                                                </div>
                                             </Form.Group>
                                          </Col>
                                       </Row>
                                    </div>
                                 </div>
                              );
                           })}
                        </Col>
                     </Row>
                  </Form>
                  <div className="submitBtnWrapper d-flex justify-content-center  w-100">
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

export default UserRoleForm;








