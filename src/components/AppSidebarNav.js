import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {
  CBadge,
  CNavItem,
  CNavLink,
  CSidebarNav,
  CNavGroup,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer } from '@coreui/icons'; 

export const AppSidebarNav = ({ modules, selectedOutlet }) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    if (modules && modules.length > 0) {
      const sidebarItems = generateSidebarItems(modules);
      setItems(sidebarItems);
    } else {
      setItems([]); 
    }
  }, [modules]); 

  const generateSidebarItems = (modulesToProcess) => {
    return modulesToProcess.map((module) => {
      const menus = module.menus || [];

      const menuItems = menus.map((menu) => ({
        component: CNavItem,
        name: menu.menuName,
        to: menu.menuPath,
        icon: <span className="nav-icon-bullet" />, 
      }));

      return {
        component: CNavGroup,
        name: module.moduleName,
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />, 
        items: menuItems,
      };
    });
  };

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
  );

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
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
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, items: groupItems, ...rest } = item; 
    const Component = component;
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {groupItems?.map((child, childIndex) =>
          child.items ? navGroup(child, childIndex) : navItem(child, childIndex, true)
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items.map((item, index) =>
        item.items ? navGroup(item, index) : navItem(item, index)
      )}
    </CSidebarNav>
  );
};