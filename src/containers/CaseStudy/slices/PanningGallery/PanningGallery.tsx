import React, { useEffect, useRef, useState } from 'react'
import { PrismicImage } from 'types/prismic'
import S from './PanningGallery.Styled'
import Flickity from 'flickity-imagesloaded'

type PanningGallery = {
  items: {
    image: PrismicImage
  }[]
  primary: {
    cell_width: number | null
    cell_grouping: boolean
  }
}

type DirectionIndex = -1 | 0 | 1

const PanningGallery: React.FC<{ data: PanningGallery }> = ({ data }) => {
  const [directionIndex, setDirectionIndex] = useState<DirectionIndex>(0)
  const galleryRef = useRef()
  const isDoubleGrouped = data.primary.cell_grouping === true

  const position = useRef({
    furthestLeft: null,
    furthestRight: null,
  })

  const getDirectionIndex = (mouseX): DirectionIndex => {
    if (position.current.furthestLeft > mouseX) return -1
    if (position.current.furthestRight < mouseX) return 1
    return 0
  }

  useEffect(() => {
    if (galleryRef.current) {
      const flkty = new Flickity(galleryRef.current, {
        imagesLoaded: true,
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        groupCells: isDoubleGrouped ? 2 : 1,
      })

      const setPosition = () => {
        const centerRects = flkty.selectedCells.map(item =>
          item.element.getBoundingClientRect()
        )

        const furthestLeft = Math.min(...centerRects.map(rect => rect.x))
        const furthestRight = Math.max(
          ...centerRects.map(rect => rect.x + rect.width)
        )

        position.current = { furthestRight, furthestLeft }
      }

      setPosition()

      flkty.on('change', setPosition)

      flkty.on('staticClick', event => {
        setPosition()
        const indexChange = getDirectionIndex(event.clientX)
        flkty.select(flkty.selectedIndex + indexChange, true)
      })
    }
  }, [])

  const handleMouseOver = (e: React.MouseEvent) => {
    const directionIndexOfMouse = getDirectionIndex(e.clientX)

    if (directionIndexOfMouse !== directionIndex) {
      setDirectionIndex(directionIndexOfMouse)
    }
  }

  return (
    <>
      DIRECTION INDEX: {directionIndex}
      <S.Wrapper ref={galleryRef} className="flexy-carousel ">
        {data.items.map(
          (item, i) =>
            item.image.url && (
              <S.ImageWrapper
                width={data.primary.cell_width}
                onMouseMove={handleMouseOver}
              >
                <img src={item.image.url} />
              </S.ImageWrapper>
            )
        )}
      </S.Wrapper>
    </>
  )
}

export default PanningGallery
