import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilContrast,
  cilSettings,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';

import { AppHeaderDropdown } from './header/index'
import { PiInvoiceThin } from "react-icons/pi";
import { IoAnalytics } from "react-icons/io5";
import { PiPencilSimpleLineThin } from "react-icons/pi";
import { PiBowlFoodThin } from "react-icons/pi";
import { PiGlobeThin } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiHandshakeThin } from "react-icons/pi";
import { PiSealPercentThin } from "react-icons/pi";
import { LuMessagesSquare } from "react-icons/lu";
import { MdOutlineMerge } from "react-icons/md";
import { MdOutlineCallSplit } from "react-icons/md";
import { useGeneralContext } from '../Context/GeneralContext';
import { CiBookmarkPlus } from "react-icons/ci";
import { Prev } from 'react-bootstrap/esm/PageItem';
import OrderAndBillModal from '../views/pages/pos/OrderAndBillModal';

const AppHeader = ({ sidebarShow, setSidebarShow }) => {
  const [isMerged, setIsMerged] = useState(false);
  const location = useLocation();
  const headerRef = useRef();
  const { isMergeTable, setIsMergeTable, isSplitTable, setisSplitTable, OrderBillPopUp, setOrderBillPopUp } = useGeneralContext();

  const isTablePage = location.pathname === "/table-management";
  const isOrderPage = location.pathname === '/order-management';

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const routeTitles = {
    '/dashboard': 'Dashboard',
    '/item-groups': 'Item Group',
    '/item-sub-type': 'Item Sub Category',
    '/item-type': 'Item Type',
    '/orders': 'Orders',
    '/item-sub-groups': 'Item Sub Group',
    '/items': 'Item',
    '/channels': 'Channel',
    '/outlets': 'Outlet',
    '/customers': 'Customer',
    '/tables': 'Table',
    '/taxes': 'Tax',
    '/uoms': 'UOM',
    '/discounts': 'Discount',
    '/discount-setup': 'Discount SetUp',
    '/departments': 'Department',
    '/employee-types': 'Employee Type',
    '/employees': 'Employee',
    '/restro-pos': 'Table Layout',
    '/order-management': 'Point of Sale',
    '/facility-status': 'Facility Status',
    '/outlet-type': 'Outlet Type',
    '/table-type': 'Table Type',
    '/member-type': 'Member Type',
    '/address-type': 'Address Type',
    '/customer-type': 'Customer Type',
    '/customer-doc-type': 'Customer Doc Type',
    '/section': 'Section',
    '/offer-type': 'Offer Type',
    '/offer': 'Offer',
    '/business-sourcetype': 'Business Source Type',
    '/business-source': 'Business Source',
    '/coupon': 'Coupon',
    '/finyear': 'FinYear',
    '/security-question': 'Security Question',
    '/section': 'Section',
    '/table-reservation-rate': 'Table Reservation Rate',
    '/item-size': 'Item Size',
    '/item-category': 'Item Category'
  };

  const currentPath = location.pathname
  const pageTitle = routeTitles[currentPath] || ''

  return (
    <CHeader position="sticky" className="header p-0"  ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <div className='d-flex gap-2 align-items-center'>

          <CHeaderToggler
            onClick={() => setSidebarShow(!sidebarShow)}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <CHeaderNav className="d-none d-md-flex">
            <CNavItem className='d-flex align-items-center gap-5'>
              <CNavLink to="#" className="fw-bold">
                {pageTitle}
              </CNavLink>

            </CNavItem>
          </CHeaderNav>

        </div>



        <CHeaderNav className='d-flex gap-3'>
          <div className="button-group-wrapper d-flex gap-3 align-items-center"
          >
            {(isTablePage || isOrderPage) ? (
              <>
                <div className="d-flex gap-2 align-items-center ">
                  <div className="tableHeaderButton">
                    <CiBookmarkPlus size={14} /> Reservation
                  </div>

                </div>

                <div className="d-flex gap-2 align-items-center ">
                  <div
                    className='tableHeaderButton d-flex align-items-center gap-1'
                  >
                    <PiInvoiceThin />
                    Sales Analysis
                  </div>

                </div>

                <div className="d-flex gap-2 align-items-center">
                  <div
                    className=' tableHeaderButton d-flex align-items-center gap-1'

                  >
                    <IoAnalytics />
                    Cost Analysis
                  </div>
                  <div className="tableHeaderButton" onClick={() => setIsMergeTable(true)}>
                    <MdOutlineMerge />
                    Merge
                  </div>
                  <div className="tableHeaderButton" onClick={() => setisSplitTable(true)}>
                    <MdOutlineCallSplit />
                    Split
                  </div>

                </div>


                <div className="d-flex gap-2 align-items-center">
                  <div>
                    <div
                      className=' tableHeaderButton d-flex align-items-center gap-1'
                      onClick={() => setOrderBillPopUp((prev) => !prev)}
                    >
                      <PiPencilSimpleLineThin />
                      Order
                    </div>
                    <OrderAndBillModal OrderBillPopUp={OrderBillPopUp} onClose={() => setOrderBillPopUp(false)} />

                  </div>
                  <div
                    className=' tableHeaderButton d-flex align-items-center gap-1'
                  >
                    <PiBowlFoodThin />
                    Bill
                  </div>

                </div>


                <div className="d-flex gap-2 align-items-center">

                  <div
                    className=' tableHeaderButton d-flex align-items-center gap-1'

                  >
                    <PiHandshakeThin />
                    Settlement
                  </div>

                  <div
                    className=' tableHeaderButton d-flex align-items-center gap-1'

                  >
                    <CiDeliveryTruck />
                    Dispatch
                  </div>

                  <div
                    className=' tableHeaderButton d-flex align-items-center gap-1'
                  >
                    <PiGlobeThin />
                    Online
                  </div>
                  <div
                    className=' tableHeaderButton d-flex align-items-center gap-1'

                  >
                    <PiHandshakeThin />
                    Pickup
                  </div>

                </div>

                <div
                  style={{ color: "orange" }}
                  className='tableHeaderButton d-flex align-items-center gap-1'
                >
                  Support Ticket
                </div>
              </>
            )
              : ""}
          </div>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-1 text-body text-opacity-75"></div>
          </li>
          <CHeaderNav className="ms-auto d-flex align-items-center">
            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilBell} size="md" />
              </CNavLink>
            </CNavItem>
            {(isTablePage || isOrderPage) ? (
              <>
                <CNavItem>
                  <CNavLink href="#">
                    <PiSealPercentThin size={19.5} />
                  </CNavLink>

                </CNavItem>
                <CNavItem>
                  <CNavLink href="#">
                    <LuMessagesSquare size={19.5} />
                  </CNavLink>

                </CNavItem>

              </>
            ) : ""}
            {/* {isTablePage ? (
              

            ) : ""} */}

            {/* <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="md" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="nd" />
                ) : (
                  <CIcon icon={cilSun} size="md" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown> */}

          </CHeaderNav>


          <li className="nav-item py-1 d-flex">

            <div className="vr h-100 text-body text-opacity-75"></div>

          </li>
          <AppHeaderDropdown />
          {/* <div className='d-flex align-items-center justify-content-center'>

          hello
          </div> */}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

