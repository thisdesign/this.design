import React, { useContext, useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ApiDataCtx } from 'containers/App/App'
import { LayoutContext } from 'containers/Layout/Layout'
import { Link, withRouter } from 'react-router-dom'

import useWindowSize from 'util/useWindowSize'
import { GRID_CONFIG } from './Coordinates'
import interact from 'interactjs'

import { RichText } from 'prismic-reactjs'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import { CSSTransition } from 'react-transition-group'

import VideoNode from '../VideoNode/VideoNode'
import FilterSvg from './Filter.svg'
import 'swiper/swiper.scss'
import './Work.scss'

const GRID_MARGIN = 30
const ITEM_WIDTH = 215
const ITEM_HEIGHT = 450

function Work() {
  const windowSize = useWindowSize()
  const [shouldBeVisible, setShouldBeVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const dragging = useRef(false)
  const timeoutRef = useRef(false)

  const { contextCaseStudies, home } = useContext(ApiDataCtx)
  const { launchProject, filters } = useContext(LayoutContext)
  const [caseStudies] = useState(contextCaseStudies)

  const coords = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  for (let i = 0; i < caseStudies.length + 1; i++) {
    const point = GRID_CONFIG[i]
    if (point[0] < coords.minX) coords.minX = point[0]
    if (point[0] > coords.maxX) coords.maxX = point[0]
    if (point[1] < coords.minY) coords.minY = point[1]
    if (point[1] > coords.maxY) coords.maxY = point[1]
  }

  const scrollerStyles = {
    width:
      (Math.abs(coords.minX) + coords.maxX + 1) *
        (ITEM_WIDTH + GRID_MARGIN * 2) +
      100,
    height:
      (coords.maxY - coords.minY + 1) * (ITEM_HEIGHT + GRID_MARGIN * 2) + 100,
  }

  const startingPosition = {
    x: -(scrollerStyles.width - window.innerWidth) / 2,
    y: -(scrollerStyles.height - window.innerHeight) / 2,
  }

  const centerX = scrollerStyles.width / 2 - ITEM_WIDTH / 2
  const centerY = scrollerStyles.height / 2 - ITEM_HEIGHT / 2

  const [dragInfo, setDragInfo] = useState({
    dragging: false,
    translation: startingPosition,
  })

  const OFFSET =
    scrollerStyles.width - window.innerWidth + dragInfo.translation.x
  const transformOffsets = {
    transform: `translateX(${filters.active ? -OFFSET - 330 : 0}px)`,
  }

  const scrollPosition = {
    position: 'absolute',
    left: `${dragInfo.translation.x}px`,
    top: `${dragInfo.translation.y}px`,
    transform: `translateZ(0.1)`,
  }

  const position = {
    x: dragInfo.translation.x,
    y: dragInfo.translation.y,
  }

  useEffect(() => {
    setTimeout(() => {
      setShouldBeVisible(true)
    }, 250)

    interact('#scroller').draggable({
      inertia: {
        resistance: 1.5,
        endSpeed: 3,
        minSpeed: 100,
        smoothEndDuration: 1000,
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      listeners: {
        start() {
          if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          dragging.current = true
        },
        move(event) {
          position.x += event.dx
          position.y += event.dy
          setDragInfo({
            ...dragInfo,
            translation: { ...position },
          })
        },
        end() {
          timeoutRef.current = setTimeout(() => {
            dragging.current = false
            timeoutRef.current = null
          }, 250)
        },
      },
    })
    // eslint-disable-next-line
  }, [])

  const expandAnimation = (top, left) => {
    const OFFSET_X =
      dragInfo.translation.x - (window.innerWidth - ITEM_WIDTH) * 0.5
    const NEW_X = OFFSET_X + left

    const OFFSET_Y =
      dragInfo.translation.y - (window.innerHeight - ITEM_HEIGHT) * 0.5
    const NEW_Y = OFFSET_Y + top

    return new Promise((resolve) => {
      const el = document.getElementById('expander')
      el.style.transform = `translate(${NEW_X}px,${NEW_Y}px) scale(.1)`
      setTimeout(() => {
        el.classList.add('animate')
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = `scale(1) translate(0,0)`
          setTimeout(resolve, 400)
        }, 10)
      }, 10)
    })
  }

  return (
    <div className="work-overflow">
      <div
        className={`work__inner view__child -wrap-nav ${
          shouldBeVisible ? 'active' : ''
        }`}
      >
        {windowSize.width <= 475 && (
          <WorkMobile setShowModal={setShowModal} data={contextCaseStudies} />
        )}
        {windowSize.width > 475 && (
          <div
            id="scroller"
            className={`work__scoller ${filters.active ? 'scaled' : ''}`}
            style={{
              ...scrollerStyles,
              ...scrollPosition,
              ...transformOffsets,
            }}
          >
            <div className="work_scroller__inner">
              <WorkVideoThumb
                top={centerY}
                left={centerX}
                dragging={dragging}
                video={home.video_reel_loop}
                setShowModal={setShowModal}
              />
              {/* { GRID_CONFIG.map((point, index) => {

          const left = centerX + (point[0] * (ITEM_WIDTH + (GRID_MARGIN * 2)))
          const top = centerY + (point[1] * (ITEM_HEIGHT + (GRID_MARGIN * 2)))
          const styles = {
            top: top, 
            left: left, 
            transitionDelay: (index * 0.15) + 's'
          }

          return (
            <div className="grid_demo" style={styles} />
          )

        }) } */}
              {caseStudies.map(
                (
                  {
                    uid,
                    tags,
                    data: { header, looping_video, color, svg, copy },
                  },
                  index
                ) => {
                  const commonTags = filters.tags.filter((item) =>
                    tags.includes(item)
                  )
                  const mobileImage = header[0]?.mobileImage
                  const point = GRID_CONFIG[index + 1]
                  const left =
                    centerX + point[0] * (ITEM_WIDTH + GRID_MARGIN * 2)
                  const top =
                    centerY + point[1] * (ITEM_HEIGHT + GRID_MARGIN * 2)

                  const joinedCopy = header[0].copy
                    .map((item) => item.text)
                    .join('')

                  return (
                    <WorkThumbnail
                      top={top}
                      left={left}
                      key={uid}
                      uid={uid}
                      video={looping_video}
                      disable={commonTags.length === 0}
                      thumbnail={mobileImage}
                      svg={svg}
                      title={joinedCopy}
                      dragging={dragging}
                      delay={filters.active ? 0 : index * 0.05}
                      expandAnimation={expandAnimation}
                      launchProject={launchProject}
                    />
                  )
                }
              )}
            </div>
          </div>
        )}
      </div>
      <div id="expander" className="work__expander"></div>
      <CSSTransition
        in={showModal}
        timeout={400}
        classNames="fade-slide"
        mountOnEnter
        unmountOnExit
      >
        <WorkReelModal
          setShowModal={setShowModal}
          video={home.video_reel.url}
        />
      </CSSTransition>
    </div>
  )
}

const WorkMobile = ({ setShowModal, data }) => {
  const { home } = useContext(ApiDataCtx)

  const slider = useRef()
  useEffect(() => {
    return () => {
      slider.current.destroy()
    }
  }, [])

  return (
    <div>
      <Swiper
        speed={650}
        spaceBetween={20}
        slidesPerView={'auto'}
        centeredSlides={true}
        onSwiper={(swiper) => (slider.current = swiper)}
      >
        <SwiperSlide>
          <WorkVideoThumb
            video={home.video_reel_loop}
            setShowModal={setShowModal}
          />
        </SwiperSlide>
        {data
          .slice(0, 3)
          .map(({ uid, data: { thumbnail, svg, header } }, index) => {
            const mobileImage = header[0]?.mobileImage
            const joinedCopy = header[0].copy.map((item) => item.text).join('')

            return (
              <SwiperSlide>
                <WorkThumbnail
                  key={uid}
                  uid={uid}
                  featured={true}
                  thumbnail={mobileImage}
                  svg={svg}
                  title={joinedCopy}
                />
              </SwiperSlide>
            )
          })}
        <SwiperSlide>
          <WorkList items={data.slice(3, data.length)} />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

const WorkVideoThumb = ({ left, top, dragging, setShowModal, video }) => {
  const ref = useRef()
  return (
    <div
      className="work__item__video"
      style={{ left, top }}
      onClick={() => {
        if (!(dragging && dragging.current === true)) {
          setShowModal(true)
        }
      }}
    >
      {video && video.url && (
        <div className="work__item__video--wrapper">
          <video autoPlay loop muted playsInline ref={ref}>
            <source src={video.url} type="video/mp4" />
          </video>
        </div>
      )}
      <img
        className="work__item__video--play"
        src={require('./Play.svg')}
        alt=""
      />
    </div>
  )
}

const WorkList = ({ items }) => {
  const { filters, setFilters } = useContext(LayoutContext)

  return (
    <div className="work__list">
      <div className="work__list__filter">
        <button>Show All</button>
        <img
          className="work__list__filter__icon"
          src={FilterSvg}
          alt=""
          onClick={() => {
            setFilters({
              ...filters,
              active: true,
            })
          }}
        />
      </div>
      <div className="work__list__inner">
        <div className="work__list__container">
          <div className="work__list__items">
            {items.map((caseStudy, index) => {
              const csTags = caseStudy.tags
              const commonTags = filters.tags.filter((filter) =>
                csTags.includes(filter)
              )

              return (
                <Link
                  to={`/work/${caseStudy.uid}`}
                  key={`work-list-item${index}`}
                >
                  <div
                    className={`work__list__item ${
                      commonTags.length === 0 ? 'disable' : ''
                    }`}
                  >
                    <div className="work__list__item--thumb">
                      <img src={caseStudy.data.thumbnail.url} alt="" />
                    </div>
                    <div className="work__list__item--content">
                      <div className="work__list__item--content-inner">
                        <div className="work__list__item--title">
                          {caseStudy.data.title}
                        </div>
                        <div className="work__list__item--subtitle">
                          {RichText.asText(caseStudy.data.project_location)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const WorkReelModal = ({ setShowModal, video }) => {
  const containerRef = useRef()
  const windowSize = useWindowSize()
  const [dimensions, setDimensons] = useState({
    width: 'unset',
    height: 'unset',
  })

  useEffect(() => {
    if (windowSize.width !== undefined) {
      const rect = containerRef.current.getBoundingClientRect()
      const rectHeight = rect.height

      let maxWidth = windowSize.width > 1920 ? 1920 : windowSize.width
      let maxHeight = maxWidth * (9 / 16)

      if (maxHeight > rectHeight) {
        maxHeight = rectHeight
        maxWidth = rectHeight * (16 / 9)
      }

      setDimensons({ width: maxWidth + 'px', height: maxHeight + 'px' })
    }
  }, [windowSize, containerRef])

  return (
    <div className="work__modal">
      <div className="work__modal-wrapper" ref={containerRef}>
        <div className="react-player-wrapper" style={dimensions}>
          <VideoNode
            url={video}
            controls={true}
            poster={'/video/poster.jpg'}
            autoPlay={true}
            playing={true}
          />
        </div>
      </div>
      <button className="close" onClick={() => setShowModal(false)}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1.41431"
            width="14"
            height="2"
            transform="rotate(45 1.41431 0)"
            fill="white"
          />
          <rect
            y="10"
            width="14"
            height="2"
            transform="rotate(-45 0 10)"
            fill="white"
          />
        </svg>
      </button>
    </div>
  )
}

const WorkThumbnail = withRouter(
  ({
    history,
    uid,
    featured,
    thumbnail,
    video,
    svg,
    title,
    dragging,
    launchProject,
    top,
    left,
    delay,
    disable,
    expandAnimation,
  }) => {
    const styles = top && left ? { top, left } : {}
    styles.transitionDelay = `${delay}s`

    return (
      <Link
        className={`work__link ${disable ? 'disable' : ''}`}
        to={`/work/${uid}`}
        key={uid}
        onClick={(e) => {
          if (dragging.current === false) {
            if (expandAnimation) {
              e.preventDefault()
              expandAnimation(top, left).then(() => {
                history.push(`/work/${uid}`)
                launchProject(uid)
              })
            } else {
              launchProject(uid)
            }
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
          {video && (
            <div className="work__link__item--wrapper">
              <video autoPlay loop muted playsInline>
                <source src={video.url} type="video/mp4" />
              </video>
            </div>
          )}
          <div className="work__link__item--outer">
            <img
              className={`work__link__item--svg ${featured ? 'featured' : ''} `}
              nopin="nopin"
              src={svg.url}
              alt={svg.alt}
            />
          </div>
        </div>
        <div className="work__link__content">
          <p className="work__link__item--title">{title}</p>
          <p className="work__link__item--subtitle">View Work</p>
        </div>
      </Link>
    )
  }
)

WorkThumbnail.propTypes = {
  uid: PropTypes.string.isRequired,
  thumbnail: PropTypes.object.isRequired,
  svg: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  launchProject: PropTypes.func.isRequired,
}

export default React.memo(Work)
