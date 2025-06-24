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
      localStorage.removeItem('navigateTable');
      localStorage.removeItem('tableLayout');
      localStorage.removeItem('outletIds');
      localStorage.removeItem('coreui-free-react-admin-template-theme');

      navigate('/login');
    }
  };

  // const handleLogout = async (e) => {
  //   e?.preventDefault?.();
  //   logout()
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   localStorage.removeItem('channelId');
  //   localStorage.removeItem('outletId');
  //   localStorage.removeItem('authChannels');
  //   localStorage.removeItem('currentOutletId');
  //   localStorage.removeItem('navigateTable');
  //   localStorage.removeItem('tableLayout');
  //   localStorage.removeItem('outletIds');
  //   localStorage.removeItem('coreui-free-react-admin-template-theme');

  //   navigate('/login');

  // };


  const logout = async () => {
    try {
      const logout = await api.post("adminauth/logout");

    } catch (error) {
      console.log(error);

    }
  }

  return (
    <>
      <CDropdown variant="nav-item">
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
  )
}

export default AppHeaderDropdown
