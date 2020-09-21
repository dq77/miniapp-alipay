import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, Video } from '@tarojs/components'
import './index.scss'

export default class Gallery extends Component {
  static defaultProps = {
    list: []
  }

  state = {
    current: 0
  }

  handleChange = e => {
    const { current } = e.detail
    this.setState({ current })
  }

  render() {
    const { list, video } = this.props
    const { current } = this.state

    let galleryList = []
    galleryList = JSON.parse(JSON.stringify(list))
    if (video !== '') {
      galleryList.unshift({ video })
    }
    let length = galleryList.length
    return (
      <View className='item-gallery'>
        <Swiper className='item-gallery__swiper' current={current} onChange={this.handleChange}>
          {galleryList.map(item => (
            <SwiperItem key={item} className='item-gallery__swiper-item'>
              {!!item.video && (
                <Video
                  src={item.video}
                  controls
                  autoplay={false}
                  object-fit='fill'
                  poster={galleryList[1]}
                  initialTime='0'
                  id='video'
                  loop={false}
                  muted={false}
                />
              )}
              {!item.video && <Image className='item-gallery__swiper-item-img' src={item} />}
            </SwiperItem>
          ))}
        </Swiper>
        <View className='item-gallery__indicator'>
          <Text className='item-gallery__indicator-txt'>{`${current + 1}/${length}`}</Text>
        </View>
      </View>
    )
  }
}
