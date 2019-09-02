import React, { useContext, memo } from 'react'
import { CaseStudyDataCtx } from 'structure/CaseStudy'
import { RichText } from 'prismic-reactjs'
import formatAlt from 'util/formatAlt'
import { sizes } from 'style/theme'
import Heading from 'components/Heading'
import Styled from './Styled'

function useParsedData() {
  const { data } = useContext(CaseStudyDataCtx)
  const header = data.header[0]

  return {
    title: RichText.asText(header.title),
    bgColor: data.color,
    preloadColor: header.background_color,
    intro: RichText.asText(header.copy),
    mobileImage: header.mobileImage.url,
    mainImage: header.image1.url,
    mainVideo: header.video1.url,
    auxWidth: header.floating_media_width,
    auxVideo: header.video2.url,
    auxImage: header.image2.url,
    auxLayout: header.layout2,
    services: header.services,
  }
}

const Hero = memo(({ uid }) => {
  React.useEffect(() => {
    console.log('mounted ', uid)
  }, [uid])
  const { bgColor } = useParsedData()
  return (
    <Styled.HeroWrapper bgColor={bgColor}>
      <Info />
      <AuxItem />
      <Background />
    </Styled.HeroWrapper>
  )
})

function Info() {
  const { title, intro, services } = useParsedData()
  return (
    <Styled.Info>
      <Styled.InfoItem>
        <Heading as="h1" headingStyle={0}>
          {title}
        </Heading>
      </Styled.InfoItem>
      <Styled.InfoItem>
        <Heading as="h2" headingStyle={3}>
          {intro}
        </Heading>
      </Styled.InfoItem>
      <Styled.InfoItem>
        <Styled.ServicesWraper>
          {RichText.render(services)}
        </Styled.ServicesWraper>
      </Styled.InfoItem>
    </Styled.Info>
  )
}

function Background() {
  const { mainImage, mobileImage, mainVideo, title } = useParsedData()
  const hasBackground = !!(mobileImage || mainVideo)

  if (hasBackground) {
    return (
      <Styled.MainItem>
        {mainVideo ? (
          <Video src={mainVideo} />
        ) : (
          <picture>
            <source srcSet={mobileImage} media={`(max-width: ${sizes.xs}px)`} />
            <Styled.Img src={mainImage} alt={formatAlt(title)} />
          </picture>
        )}
      </Styled.MainItem>
    )
  }
  return null
}

function AuxItem() {
  const { auxImage, auxVideo, auxWidth, auxLayout, title } = useParsedData()
  const hasAux = auxVideo || auxImage

  if (hasAux) {
    return (
      <Styled.AuxItem auxWidth={auxWidth} layout={auxLayout}>
        {auxVideo ? (
          <Video src={auxVideo} />
        ) : (
          <img src={auxImage} alt={formatAlt(title)} />
        )}
      </Styled.AuxItem>
    )
  }
  return null
}

function Video({ src }) {
  return (
    <Styled.Video autoPlay muted="muted" playsInline loop>
      <source src={src} />
    </Styled.Video>
  )
}

export default Hero
