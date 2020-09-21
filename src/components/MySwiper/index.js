import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, Image } from '@tarojs/components'
import PropTypes from 'prop-types'
import { pageJump } from '../../utils/resourceAllocation'
import './index.scss'

export default class MySwiper extends Component {
  static propTypes = {
    banner: PropTypes.array,
    home: PropTypes.bool
  }

  static defaultProps = {
    banner: [],
    home: false
  }

  bannerClick = item => {
    // type 0 商品   10 活动
    if (item.type === 0) {
      Taro.navigateTo({
        url: `/pages/goods/index?no=${item.content}`
      })
    } else if (item.type === 10) {
      pageJump(item)
    }
  }

  render() {
    const { home, bannerList } = this.props
    return (
      <Swiper
        className={!home ? 'swiper-container' : 'swiper'}
        circular
        indicatorDots
        indicatorColor='#999'
        indicatorActiveColor='#bf708f'
        autoplay='true'
      >
        {bannerList.map(item => (
          <SwiperItem key={item}>
            {/* <Image mode='widthFix' src={`${item.image_src}!w750`}></Image> */}
            <Image mode='scaleToFill' src={`${item.img}`} onClick={this.bannerClick.bind(this, item)} />
          </SwiperItem>
        ))}
      </Swiper>
    )
  }
}
