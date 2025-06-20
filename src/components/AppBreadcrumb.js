import React from 'react';
import { useLocation } from 'react-router-dom';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import routes from '../routes';

const flattenRoutes = (routesArray) => {
  let flat = []
  routesArray.forEach((route) => {
    if (route.path && route.name) {
      flat.push({ path: route.path, name: route.name })
    }
    if (route.routes || route.children) {
      flat = flat.concat(flattenRoutes(route.routes || route.children))
    }
  })
  return flat
}

const AppBreadcrumb = () => {
  const location = useLocation().pathname
  
  const routesArray = Array.isArray(routes) ? routes : Object.values(routes || {})

  const flatRoutes = flattenRoutes(routesArray)

  const getRouteName = (pathname) => {
    const route = flatRoutes.find((r) => r.path === pathname)
    return route ? route.name : null
  }

  const generateBreadcrumbs = () => {
    const pathnames = location.split('/').filter(Boolean)
    const breadcrumbs = pathnames.map((_, index) => {
      const url = '/' + pathnames.slice(0, index + 1).join('/')
      const name = getRouteName(url)
      if (!name) return null
      return {
        pathname: url,
        name,
        active: index === pathnames.length - 1,
      }
    })
    return breadcrumbs.filter(Boolean)
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <CBreadcrumb className="my-0">
      {breadcrumbs.map((breadcrumb, idx) => (
        <CBreadcrumbItem
          key={idx}
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)


