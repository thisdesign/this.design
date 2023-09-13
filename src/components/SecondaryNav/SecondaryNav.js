import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LayoutContext } from 'containers/Layout/Layout'
import './SecondaryNav.scss'

const SecondaryNav = () => {
  const context = useContext(LayoutContext)
  const {
    view,
    navInverted,
    filters,
    setFilters,
    csState: { currentUid },
  } = context

  // const linkTo = link => {
  //   if (view === 'root') {
  //     return `/${link}`
  //   } if (currentUid) {
  //     return `/work/${currentUid}`
  //   }
  //   return '/'
  // }

  const navState = [
    navInverted && view === 'root' ? 'nav--dark' : '',
    `-view-is-${view}`,
    currentUid ? 'is-subpage' : '',
  ].join(' ')

  return (
    <nav className={`secondaryNav -wrap-nav ${navState}`}>
      <div className="secondaryNav__inner">
        <div className="secondaryNav__item">
          <Link to={`/about`}>
            <span>About</span>
          </Link>
        </div>
        <div className={`secondaryNav__item filter`}>
          <button
            onClick={() =>
              setFilters({
                ...filters,
                active: true,
              })
            }
          >
            <span>Filter</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default SecondaryNav
