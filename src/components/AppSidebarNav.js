import React, { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import {
  CBadge,
  CNavItem,
  CNavLink,
  CSidebarNav,
  CNavGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer } from '@coreui/icons'
import api from '../config/AxiosInterceptor'

export const AppSidebarNav = () => {
  const [items, setItems] = useState([])
  const [channelName, setChannelName] = useState('')
  const fetchCalled = useRef(false)

  useEffect(() => {
    if (fetchCalled.current) return
    fetchCalled.current = true
    fetchUserAccess()
  }, [])

  const fetchUserAccess = async () => {
    try {
      const res = await api.get('/admin-access')
      const userAccess = res?.data?.data

      localStorage.setItem('channelId', userAccess.channelId)
      setChannelName(userAccess.channelName)

      const outlets = userAccess?.outletDetail || []

      // Store all outletIds and default currentOutletId
      const outletIds = outlets.map(o => o.outletId)
      localStorage.setItem('outletIds', JSON.stringify(outletIds))
      if (outletIds.length > 0) {
        localStorage.setItem('currentOutletId', outletIds[0])
      }

      const sidebarItems = generateSidebarItems(outlets)
      setItems(sidebarItems)
    } catch (err) {
      console.error('Error fetching user access', err)
    }
  }

  const generateSidebarItems = (outlets) => {
    return outlets.map((outlet) => {
      const modules = outlet.modules || []

      const moduleGroups = modules.map((module) => {
        const menus = module.permissions || []

        const menuItems = menus.map((menu) => ({
          component: CNavItem,
          name: menu.menu,
          to: menu.routePath,
          icon: <span className="nav-icon-bullet" />,
          state: { permissions: menu },
        }))

        return {
          component: CNavGroup,
          name: module.moduleName,
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
          items: menuItems,
        }
      })

      return {
        component: CNavGroup,
        name: outlet.outletName,
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        items: moduleGroups,
      }
    })
  }

  const navLink = (name, icon, badge, indent = false) => (
    <>
      {icon || (indent && <span className="nav-icon"><span className="nav-icon-bullet" /></span>)}
      {name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto" size="sm">
          {badge.text}
        </CBadge>
      )}
    </>
  )

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((child, childIndex) =>
          child.items ? navGroup(child, childIndex) : navItem(child, childIndex, true)
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {channelName && (
        <div className="px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '0.9rem' }}>
          {channelName}
        </div>
      )}

      {items.map((item, index) =>
        item.items ? navGroup(item, index) : navItem(item, index)
      )}
    </CSidebarNav>
  )
}
