import React, { useEffect, useRef } from 'react'
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

const PanningGallery: React.FC<{ data: PanningGallery }> = ({ data }) => {
  const galleryRef = useRef()

  const isDoubleGrouped = data.primary.cell_grouping === true

  useEffect(() => {
    if (galleryRef.current) {
      const flkty = new Flickity(galleryRef.current, {
        imagesLoaded: true,
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        groupCells: isDoubleGrouped ? 2 : 1,
      })
    }
  }, [])
  return (
    <S.Wrapper ref={galleryRef} className="flexy-carousel ">
      {data.items.map(
        item =>
          item.image.url && (
            <S.ImageWrapper width={data.primary.cell_width}>
              <img src={item.image.url} />
            </S.ImageWrapper>
          )
      )}
    </S.Wrapper>
  )
}

export default PanningGallery