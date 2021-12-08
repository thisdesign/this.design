import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LayoutContext } from 'containers/Layout/Layout'
import CursorAnchor from 'components/CursorDot/CursorAnchor'
import GridIcon from './GridIcon/GridIcon'
import AboutIcon from './AboutIcon/AboutIcon'
import * as ReactRouter from "react-router"
import './Nav.scss'

const Nav = () => {

  const {
    view,
    navInverted,
    mobileMenu,
    setMobileMenu,
    filters,
    setFilters,
    csState: { currentUid },
  } = useContext(LayoutContext)

  const linkTo = link => {
    if (view === 'root') {
      return `/${link}`
    } if (currentUid) {
      return `/work/${currentUid}`
    }
    return '/'
  }

  const navState = [
    navInverted && view === 'root' ? 'nav--dark' : '',
    `-view-is-${view}`, currentUid ? 'is-subpage' : ''
  ].join(' ')

  const closeActive = (view !== 'root' || mobileMenu)

  return (
    <>
    
    <div className="nav__mobile-logo">
      <Link to={(() => linkTo(''))()}>
        <img  className="nav__mobile-logo-img" src={require('./Logo.png')} alt="" />
      </Link>
    </div>

    <nav className={`nav -wrap-nav ${navState}`}>
      
      <div className="nav__mobile" onClick={() => {
        if(filters.active) {
          setFilters({
            ...filters,
            active: false,
          })
        } else if(view === 'root' && currentUid === undefined) {
          setMobileMenu(!mobileMenu)
        }
      }}>
        {(view !== 'root' || currentUid) && <Link to="/">
          <AboutIcon view={'active'} />
        </Link>}
        {view === 'root' && currentUid === undefined && <AboutIcon view={mobileMenu || filters.active ? 'active' : ''} />}
      </div>
      <div className="nav__close">
        <Link to={(() => linkTo(''))()}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.41431" width="14" height="2" transform="rotate(45 1.41431 0)" fill="white"/>
            <rect y="10" width="14" height="2" transform="rotate(-45 0 10)" fill="white"/>
          </svg>
        </Link>
      </div>
      <div className="nav__inner">
        <div className="nav__item">
          <Link to={(() => linkTo(''))()}>
            <img  className="nav__item--logo" src={require('./Logo.png')} alt="" />
          </Link>
        </div>
        <div className={`nav__item link`}>
          <a href='https://thisllc.myshopify.com' target="_blank">
            <span>SHOP</span>
          </a>
        </div>
        
        {/* {['work', 'about'].map(link => (
          <div className="nav__item" key={link}>
            <CursorAnchor textId={view === 'root' ? link : 'close'}>
              <Link to={(() => linkTo(link))()}>
                {link === 'work' && <GridIcon view={view} />}
                {link === 'about' && <AboutIcon view={view} />}
              </Link>
            </CursorAnchor>
          </div>
        ))} */}
      </div>
    </nav>
    </>
  )
}

export default Nav
