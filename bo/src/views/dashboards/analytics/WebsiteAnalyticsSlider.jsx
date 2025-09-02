'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Badge from '@mui/material/Badge'
import { useTheme } from '@mui/material/styles'

// Third-party Components
import classnames from 'classnames'
import { useKeenSlider } from 'keen-slider/react'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

const Slides = ({ data }) => {
  if (data.length === 1) {
    return (
      <div>
        <img src={data[0].image} alt="Annonce" className="w-full md:h-[300px] h-auto rounded-lg shadow-md" />
      </div>
    )
  }

  return (
    <>
      {data.map((item, index) => (
        <div key={index} className="keen-slider__slide">
          <img src={item.image} alt={`Annonce ${index + 1}`} className="w-full md:h-[300px] h-auto rounded-lg shadow-md" />
        </div>
      ))}
    </>
  )
}

const WebsiteAnalyticsSlider = ({ data }) => {
  // States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Hooks
  const theme = useTheme()

  const ResizePlugin = slider => {
    const observer = new ResizeObserver(function () {
      slider.update()
    })

    slider.on('created', () => {
      observer.observe(slider.container)
    })
    slider.on('destroyed', () => {
      observer.unobserve(slider.container)
    })
  }

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      ResizePlugin,
      slider => {
        let mouseOver = false
        let timeout

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <AppKeenSlider>
      {/* <Card> */}
        <div ref={sliderRef} className='keen-slider relative'>
          {loaded && instanceRef.current && (
            <div className='swiper-dots absolute top-1 inline-end-6'>
              {instanceRef.current.track.details && instanceRef.current.track.details.slides.length > 0 && [...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                return (
                  <Badge
                    key={idx}
                    variant='dot'
                    component='div'
                    className={classnames({
                      active: currentSlide === idx
                    })}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx)
                    }}
                    sx={{
                      '& .MuiBadge-dot': {
                        width: '8px !important',
                        height: '8px !important',
                        backgroundColor: 'var(--mui-palette-common-white) !important',
                        opacity: 0.4
                      },
                      '&.active .MuiBadge-dot': {
                        opacity: 1
                      }
                    }}
                  ></Badge>
                )
              })}
            </div>
          )}
          <Slides data={data} />
        </div>
      {/* </Card> */}
    </AppKeenSlider>
  )
}

export default WebsiteAnalyticsSlider
