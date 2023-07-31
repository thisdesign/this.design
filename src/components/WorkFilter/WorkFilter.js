import React, { useContext, useState, useEffect } from 'react'
import { LayoutContext } from 'containers/Layout/Layout'
import { ApiDataCtx } from 'containers/App/App'

import './WorkFilter.scss'

const WorkFilters = () => {
  const { filters, setFilters } = useContext(LayoutContext)
  const { contextCaseStudies } = useContext(ApiDataCtx)
  const activeTags = filters.tags

  const getCount = (key) => {
    let count = 0
    contextCaseStudies.forEach((element) => {
      if (element.tags.includes(key)) {
        count++
      }
    })
    return count
  }

  const [tags, setTags] = useState([
    {
      title: 'Strategy',
      active: activeTags.includes('strategy'),
      count: getCount('strategy'),
    },
    {
      title: 'Branding',
      active: activeTags.includes('branding'),
      count: getCount('branding'),
    },
    {
      title: 'Digital',
      active: activeTags.includes('digital'),
      count: getCount('digital'),
    },
    {
      title: 'Content',
      active: activeTags.includes('content'),
      count: getCount('content'),
    },
    {
      title: 'Environment',
      active: activeTags.includes('environment'),
      count: getCount('environment'),
    },
    {
      title: 'Sustainability',
      active: activeTags.includes('sustainability'),
      count: getCount('sustainability'),
    },
    {
      title: 'Outdoor',
      active: activeTags.includes('outdoor'),
      count: getCount('outdoor'),
    },
    {
      title: 'Transportation',
      active: activeTags.includes('transportation'),
      count: getCount('transportation'),
    },
    {
      title: 'Hospitality',
      active: activeTags.includes('hospitality'),
      count: getCount('hospitality'),
    },
    {
      title: 'Culture',
      active: activeTags.includes('culture'),
      count: getCount('culture'),
    },
  ])

  const closeFilters = () => {
    setFilters({
      ...filters,
      active: false,
    })
  }

  const resetFilters = () => {
    setTags(
      tags.map((item) => {
        return { title: item.title, count: item.count, active: true }
      })
    )
  }

  const selectTag = (index) => {
    const newTags = [...tags]
    const key = newTags[index].title.toLowerCase()
    const currentTags = newTags.filter((item, i) => item.active === true)

    if (activeTags.length === 10) {
      newTags.forEach((item, i) => {
        item.active = index === i
      })
    } else {
      if (
        currentTags.length === 1 &&
        currentTags[0].title.toLowerCase() === key
      ) {
        resetFilters()
        return
      } else {
        newTags.forEach((item, i) => {
          item.active = index === i
        })
      }
    }
    setTags(newTags)
  }

  useEffect(() => {
    const newTags = tags
      .filter((item) => item.active === true)
      .map((item) => item.title.toLowerCase())
    setFilters({
      ...filters,
      tags: newTags,
    })
    // eslint-disable-next-line
  }, [tags])

  return (
    <div className="work-filters-outer">
      <div
        className="work-filters-background"
        onClick={() => closeFilters()}
      ></div>
      <div className="work-filters">
        <button className="work-filters__close" onClick={() => closeFilters()}>
          CLOSE
        </button>
        <div className="work-filters__content">
          <div className="work-filters__categories">
            {tags.slice(0, 5).map((item, index) => {
              return (
                <div
                  key={'workcat' + index}
                  onClick={() => {
                    selectTag(index)
                  }}
                  className={`work-filters__category work-filters__filter ${
                    item.active ? 'active' : ''
                  }`}
                >
                  <div>
                    {item.title}
                    <span>_{item.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="work-filters__seperator">_</div>
          <div className="work-filters__tags">
            {tags.slice(5, tags.length).map((item, index) => {
              return (
                <div
                  key={'worktag' + index}
                  onClick={() => {
                    selectTag(5 + index)
                  }}
                  className={`work-filters__tag work-filters__filter ${
                    item.active ? 'active' : ''
                  }`}
                >
                  <div>
                    {item.title}
                    <span>_{item.count}</span>
                  </div>
                </div>
              )
            })}
            <div
              onClick={() => {
                resetFilters()
              }}
              className={`work-filters__tag work-filters__filter active`}
            >
              All
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkFilters
