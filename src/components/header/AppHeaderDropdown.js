import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilAccountLogout,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom';
import api from '../../config/AxiosInterceptor';
import { toast, ToastContainer } from 'react-toastify';

const AppHeaderDropdown = () => {

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e?.preventDefault?.();

    try {
      let res;
      res = await api.post("/adminauth/logout");
      toast.success(res.data.successMessage || "Success!");
    } catch (error) {
      console.error("Logout API failed:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('channelId');
      localStorage.removeItem('outletId');
      localStorage.removeItem('authChannels');
      localStorage.removeItem('currentOutletId');
<<<<<<< HEAD
=======
      localStorage.removeItem('navigateTable');
      localStorage.removeItem('tableLayout');
      localStorage.removeItem('outletIds');
>>>>>>> e1d50592c1ddcf7dc41188282b874d4fe922dc44
      localStorage.removeItem('coreui-free-react-admin-template-theme');

      navigate('/login');
    }
  };

  return (
    <>
      <ToastContainer />
      <CDropdown variant="nav-item">
<<<<<<< HEAD
=======

>>>>>>> e1d50592c1ddcf7dc41188282b874d4fe922dc44
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
<<<<<<< HEAD
=======

>>>>>>> e1d50592c1ddcf7dc41188282b874d4fe922dc44
  )
}

export default AppHeaderDropdown
