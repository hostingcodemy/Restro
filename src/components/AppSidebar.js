import React from 'react'
import {
  CCloseButton,
  CSidebar,
  CSidebarHeader,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = ({ sidebarShow, setSidebarShow }) => {
  return (
    <CSidebar
      className="border-end"
      // colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => setSidebarShow(visible)}
    >
      <CSidebarHeader className="border-bottom d-flex justify-content-between align-items-center px-3">
        <strong>Restaurant</strong>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => setSidebarShow(false)}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)






