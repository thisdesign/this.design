import React, { useContext, useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ApiDataCtx } from 'containers/App/App'
import { LayoutContext } from 'containers/Layout/Layout'
import CursorAnchor from 'components/CursorDot/CursorAnchor'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'

import useWindowSize from 'util/useWindowSize'
import { GRID_CONFIG } from './Coordinates'
import interact from 'interactjs'

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { CSSTransition } from 'react-transition-group'

import 'swiper/swiper.scss'
import './Work.scss'



const GRID_MARGIN = 30
const ITEM_WIDTH = 215
const ITEM_HEIGHT = 450

function Work() {

  const windowSize = useWindowSize()
  const [shouldBeVisible, setShouldBeVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    active: false,
    tags: [
      'stategy',
      'branding',
      'digital',
      'content',
      'environment',
      'sustainability',
      'outdoor',
      'transportation',
      'hospitality',
      'culture'
    ]
  })
  

  const dragging = useRef(false)
  const timeoutRef = useRef(false)

  const { contextCaseStudies } = useContext(ApiDataCtx)
  const { launchProject } = useContext(LayoutContext)
  const [caseStudies, setCaseStudies] = useState(contextCaseStudies)

  

  const coords = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  for(let i=0; i < caseStudies.length + 1; i++) {
    const point = GRID_CONFIG[i]
    if(point[0] < coords.minX) coords.minX = point[0]
    if(point[0] > coords.maxX) coords.maxX = point[0]
    if(point[1] < coords.minY) coords.minY = point[1]
    if(point[1] > coords.maxY) coords.maxY = point[1]
  }


  const scrollerStyles = {
    width: (Math.abs(coords.minX) + coords.maxX + 1) * (ITEM_WIDTH + (GRID_MARGIN * 2)) + 100,
    height: (coords.maxY - coords.minY + 1) * (ITEM_HEIGHT + (GRID_MARGIN * 2)) + 100,
  }

  const startingPosition = { 
    x: -(scrollerStyles.width - window.innerWidth) / 2 , 
    y: -(scrollerStyles.height - window.innerHeight) / 2
  }

  const centerX = (scrollerStyles.width / 2) - ITEM_WIDTH / 2
  const centerY = (scrollerStyles.height / 2) - ITEM_HEIGHT / 2

  const [dragInfo, setDragInfo] = useState({
    dragging: false,
    translation: startingPosition,
  })

  const scrollPosition = {
    position: "absolute",
    left: `${dragInfo.translation.x}px`,
    top: `${dragInfo.translation.y}px`,
  }

  const position = { 
    x: dragInfo.translation.x,
    y: dragInfo.translation.y,
  }

  useEffect(() => {

    setTimeout(() => {
      setShouldBeVisible(true)
    }, 250)

    interact('#scroller')
      .draggable({
        inertia: {
          resistance: 5
        },
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true,
          })
        ],
        listeners: {
         start () {
          if(timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          dragging.current = true
         },
         move (event) {
            position.x += event.dx
            position.y += event.dy
            setDragInfo({
              ...dragInfo,
              translation: {...position}
            })
          },
          end () {
            timeoutRef.current = setTimeout(() => {
              dragging.current = false
              timeoutRef.current = null
            }, 250)
          }
        }
      })
    }, [])


    
  return (
    <>
    <div className={`work__inner view__child -wrap-nav ${shouldBeVisible ? 'active': ''}`}>
      {windowSize.width <= 475 && <WorkMobile setShowModal={setShowModal} data={contextCaseStudies} />}
      {windowSize.width > 475 && <div 
        id="scroller"
        className={`work__scoller ${filters.active ? 'scaled' : ''}`} 
        style={{
          ...scrollerStyles,
          ...scrollPosition
        }}
        >
        <WorkVideoThumb 
          top={centerY}
          left={centerX}
          dragging={dragging}
          setShowModal={setShowModal}
        />
        { caseStudies.map(({ uid, tags, data: { header, thumbnail, svg, title } }, index) => {

          const commonTags = filters.tags.filter(item => !tags.includes(item))
          const mobileImage = header[0]?.mobileImage
          const point = GRID_CONFIG[index + 1]
          const left = centerX + (point[0] * (ITEM_WIDTH + (GRID_MARGIN * 2)))
          const top = centerY + (point[1] * (ITEM_HEIGHT + (GRID_MARGIN * 2)))
          return <WorkThumbnail
            top={top}
            left={left}
            key={uid}
            uid={uid}
            disable={commonTags.length === 0}
            thumbnail={mobileImage}
            svg={svg}
            title={title}
            dragging={dragging}
            delay={filters.active ? 0 : index * 0.05}
            launchProject={launchProject}
          />

        }) }
      </div>}
    </div>
    <div className={`work-about-button`}>
      <Link to={`/about`}>
        About
      </Link>
    </div>
    <div className={`work-filter-button ${filters.active === true ? 'hide' : ''}`}>
      <button onClick={() => setFilters({
        ...filters,
        active: true,
      })}>Filter</button>
    </div>
    <CSSTransition in={showModal} timeout={400} classNames="fade-slide" mountOnEnter unmountOnExit>
      <WorkReelModal setShowModal={setShowModal} />
    </CSSTransition>
    <CSSTransition in={filters.active === true} timeout={400} classNames="fade-slide-filters" mountOnEnter unmountOnExit>
      <WorkFilters filters={filters} setFilters={setFilters} />
    </CSSTransition>
    
    </>
  )
}

const WorkMobile = ({setShowModal, data}) => {
  return (
    <div>
      <Swiper
        spaceBetween={20}
        slidesPerView={'auto'}
        centeredSlides={true}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <WorkVideoThumb setShowModal={setShowModal}/>
        </SwiperSlide>
        { data.map(({ uid, data: { thumbnail, svg, title } }, index) => {

          if(index > 3) {
            return null
          }

          return <SwiperSlide>
            <WorkThumbnail
              key={uid}
              uid={uid}
              thumbnail={thumbnail}
              svg={svg}
              title={title}
            />
          </SwiperSlide>
        }) }
      </Swiper>
    </div>
  )
}

const WorkVideoThumb = ({left, top, dragging, setShowModal}) => {
  const ref = useRef()
  return (
    <div className="work__item__video" style={{left, top}} onClick={() => {
        if(!(dragging && dragging.current === true)) {
          setShowModal(true)
        }
      }
    }>
      <div className="work__item__video--wrapper">
        <video autoPlay loop muted playsInline ref={ref}>
          <source src={'/video/reel-autoplay.mp4'} type="video/mp4" />
        </video>
      </div>
      <img className="work__item__video--play" src={require('./Play.svg')} alt="" />
      <img  className="work__item__video--logo" src={require('./Logo.png')} alt="" />
    </div>
  )
}

const WorkReelModal = ({setShowModal}) => {
  return (
    <div className="work__modal">
      <button onClick={() => setShowModal(false)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.41431" width="14" height="2" transform="rotate(45 1.41431 0)" fill="white"/>
          <rect y="10" width="14" height="2" transform="rotate(-45 0 10)" fill="white"/>
        </svg>
      </button>
      <div className="work__modal-wrapper">
        <div className="react-player-wrapper">
          <ReactPlayer 
            url={'https://vimeo.com/641779410'}
            playing={true}
            className="react-player"
            width="100%"
            height="100%"
            controls={true}
          />
        </div>
      </div>
    </div>
  )
}

const WorkFilters = ({filters, setFilters}) => {

  const [tags, setTags] = useState([
    {title: 'Stategy', active: true,},
    {title: 'Branding', active: true,},
    {title: 'Digital', active: true,},
    {title: 'Content', active: true,},
    {title: 'Environment', active: true,},
    {title: 'Sustainability', active: true,},
    {title: 'Outdoor', active: true,},
    {title: 'Transportation', active: true,},
    {title: 'Hospitality', active: true,},
    {title: 'Culture', active: true,},
  ])

  const closeFilters = () => {
    setFilters({
      ...filters,
      active: false,
    })
  }

  const resetFilters = () => {
    setTags(tags.map((item) => { return {title: item.title, active: true}}))
  }

  const selectTag = (index) => {
    const newTags = [...tags]
    newTags[index].active = !newTags[index].active
    setTags(newTags)
  }

  useEffect(() => {
    setFilters({
      ...filters,
      tags: tags.filter(item => item.active === true).map(item => item.title.toLowerCase())
    })
  },[tags])

  return (
    <div className="work-filters-outer">
      <div className="work-filters-background" onClick={() => closeFilters()}></div>
      <div className="work-filters">
        <div className="work-filters__content">
          <div className="work-filters__sidebar">
            <p>This Is</p>
            <div className="work-filters__buttons">
              <button onClick={() => resetFilters()}>View All</button>
            </div>
          </div>
          <div className="work-filters__categories">
            {tags.slice(0, 5).map((item, index) => {
              return <div key={'workcat' + index} 
                onClick={() => {selectTag(index)}} 
                className={`work-filters__category work-filters__filter ${item.active ? 'active' : ''}`}>
                  {item.title}
                </div>
            })}
          </div>
          <div className="work-filters__tags">
            {tags.slice(5, tags.length).map((item, index) => {
              return <div key={'worktag' + index} 
              onClick={() => {selectTag(5 + index)}} 
              className={`work-filters__tag work-filters__filter ${item.active ? 'active' : ''}`}>
                {item.title}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const WorkThumbnail = ({ uid, thumbnail, svg, title, dragging, launchProject, top, left, delay, disable }) => {

  const styles = top && left ? {top, left} : {}
  styles.transitionDelay = `${delay}s`

  return (
    <Link
      className={`work__link ${disable ? 'disable' : ''}`}
      to={`/work/${uid}`}
      key={uid}
      onClick={(e) => {
        if(dragging.current === false){
          launchProject(uid)
        } else {
          e.preventDefault()
        }
      }}
      style={styles}
    >
      <div className="work__link__wrapper">
       <img
          className="work__link__item"
          src={thumbnail.url}
          alt={thumbnail.alt}
          nopin="nopin"
        />
        <img
          className="work__link__item--svg"
          nopin="nopin"
          src={svg.url}
          alt={svg.alt}
        />
      </div>
      <div className="work__link__content">
        <p className="work__link__item--title">{title}</p>
        <p className="work__link__item--subtitle">View Work</p>
      </div>
    </Link>
  )
}

WorkThumbnail.propTypes = {
  uid: PropTypes.string.isRequired,
  thumbnail: PropTypes.object.isRequired,
  svg: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  launchProject: PropTypes.func.isRequired,
}

export default React.memo(Work)
