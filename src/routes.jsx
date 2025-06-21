import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('src/views/pages/authentication/Login.jsx'));
const Registration = React.lazy(() => import('./views/pages/authentication/Registration'));
const ChannelOutlet = React.lazy(() => import('./views/pages/channel&outlet/Channel&Outlet'));
const SubscriptionPage = React.lazy(() => import('./views/pages/subscription/SubscriptionPage.jsx'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const TableReservation = React.lazy(() => import('./components/header/TableBook'));
const PosScreen = React.lazy(() => import('src/views/pages/pos/Pos.jsx'));

//Content page
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Group = React.lazy(() => import('./views/pages/group/Group'));
const SubGroup = React.lazy(() => import('./views/pages/subGroup/SubGroup'));
const ItemType = React.lazy(() => import('./views/pages/itemType/ItemType'));
const ItemSubType = React.lazy(() => import('./views/pages/itemSubType/ItemSubType'));
const Item = React.lazy(() => import('./views/pages/item/Item'));
const Table = React.lazy(() => import('./views/pages/table/TablePage.jsx'));
const Channel = React.lazy(() => import('./views/pages/channel/Channel'));
const Outlet = React.lazy(() => import('./views/pages/outlet/Outlet'));
const OutletType = React.lazy(() => import('./views/pages/outletType/outletType.jsx'));
const Customer = React.lazy(() => import('./views/pages/customer/Customer'));
const Tax = React.lazy(() => import('./views/pages/tax/Tax'));
const Uom = React.lazy(() => import('./views/pages/uom/Uom'));
const UomConversion = React.lazy(() => import('src/views/pages/uomconversion/uomconversion.jsx'));
const DiscountList = React.lazy(() => import('./views/pages/discount/DiscountList'));
const DiscountSetup = React.lazy(() => import('./views/pages/discountSetUp/DiscountSetUp'));
const Department = React.lazy(() => import('./views/pages/department/Department.jsx'));
const EmployeeType = React.lazy(() => import('./views/pages/employeeType/EmployeeType.jsx'));
const CancellationPage = React.lazy(() => import('src/views/pages/TransactionPages/CancellationPage.jsx'));
const SuccessPage = React.lazy(() => import('src/views/pages/TransactionPages/SuccessPage.jsx'));
const EmployeePage = React.lazy(() => import('src/views/pages/employee/Employee.jsx'));
const FacilityStatus = React.lazy(() => import('./views/pages/facilityStatus/FacilityStatus.jsx'));
const CustomerForm = React.lazy(() => import('./views/pages/customer/CustomerForm.jsx'));
const TableType = React.lazy(() => import('./views/pages/tableType/TableType.jsx'));
const MemberType = React.lazy(() => import('./views/pages/memberType/MemberType.jsx'));
const AddressType = React.lazy(() => import('./views/pages/addressType/AddressType.jsx'));
const CustomerDocType = React.lazy(() => import('./views/pages/customerDocType/CustomerDocType.jsx'));
const CustomerType = React.lazy(() => import('./views/pages/customerType/CustomerType.jsx'));


const AppRoutes = () => {

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Registration />} />

        <Route path="/login" element={<Login />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/channel-outlet" element={<ChannelOutlet />} />
        <Route path="/cancellation" element={<CancellationPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/404" element={<Page404 />} />
        <Route path="/500" element={<Page500 />} />

        <Route element={<DefaultLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/item-groups" element={<Group />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/item-sub-groups" element={<SubGroup />} />
          <Route path="/item-type" element={<ItemType />} />
          <Route path="/item-sub-type" element={<ItemSubType />} />
          <Route path="/items" element={<Item />} />
          <Route path="/tables" element={<Table />} />
          <Route path="/table-type" element={<TableType />} />
          <Route path="/channels" element={<Channel />} />
          <Route path="/outlets" element={<Outlet />} />
          <Route path="/outlet-type" element={<OutletType />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/taxes" element={<Tax />} />
          <Route path="/uoms" element={<Uom />} />
          <Route path="/uom-conversion" element={<UomConversion />} />
          <Route path="/discounts" element={<DiscountList />} />
          <Route path="/discount-setup" element={<DiscountSetup />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/employee-types" element={<EmployeeType />} />
          <Route path="/facility-status" element={<FacilityStatus />} />
          <Route path="/member-type" element={<MemberType />} />
          <Route path="/address-type" element={<AddressType />} />
          <Route path="/customer-doc-type" element={<CustomerDocType />} />
          <Route path="/customer-type" element={<CustomerType />} />
          <Route path="/restro-pos" element={<TableReservation />} />
          <Route path="/table-management" element={<TableReservation />} />
          <Route path="/customer-form" element={<CustomerForm />} />
          <Route path="/order-management" element={<PosScreen />} />

        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
