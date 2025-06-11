import React, { useEffect, useState } from 'react'
import {
  CCloseButton,
  CSidebar,
  CSidebarHeader,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import { useLocation } from 'react-router-dom'

const AppSidebar = ({ sidebarShow, setSidebarShow }) => {

  const location = useLocation()
  const [channelName, setChannelName] = useState('')

  useEffect(() => {
    const authChannels = JSON.parse(localStorage.getItem('authChannels'))
    if (authChannels && Array.isArray(authChannels) && authChannels.length > 0) {
      setChannelName(authChannels[0].channelName || '')
    }
  }, [])

  useEffect(() => {
    if (location.pathname === '/table-reservations') {
      setSidebarShow(false)
    }
  }, [location.pathname])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => setSidebarShow(visible)}
    >
      <CSidebarHeader className="border-bottom d-flex justify-content-between align-items-center px-3 py-3">
        {channelName && (
          <strong className="text-uppercase" style={{ fontSize: '1rem' }}>
            {channelName}
          </strong>
        )}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => setSidebarShow(false)}
        />
      </CSidebarHeader>

      <AppSidebarNav />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
