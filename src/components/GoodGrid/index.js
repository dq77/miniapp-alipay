import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text } from '@tarojs/components'
import { AtTag, AtActivityIndicator } from 'taro-ui'
import PropTypes from 'prop-types'
import { cnzzTrackEvent } from '../../utils/cnzz'
import './index.scss'

export default class GoodGrid extends Component {
  static propTypes = {
    goodDatas: PropTypes.array
  }

  state = {
    loading: true,
    hasMore: false
  }

  static defaultProps = {
    goodDatas: [
      {
        id: 1,
        name: 'Beats Solo3 Wireless 头戴耳机',
        tag: '租完免还',
        price: '99.0',
        src: 'http://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/Front-end-h5/product01.jpg'
      },
      {
        id: 2,
        name: 'Beats Solo3 Wireless 头戴耳机',
        tag: '租完免还',
        price: '99.0',
        src: 'http://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/Front-end-h5/product01.jpg'
      },
      {
        id: 3,
        name: 'Beats Solo3 Wireless 头戴耳机',
        tag: '租完免还',
        price: '99.0',
        src: 'http://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/Front-end-h5/product01.jpg'
      },
      {
        id: 4,
        name: 'Beats Solo3 Wireless 头戴耳机',
        tag: '租完免还',
        price: '99.0',
        src: 'http://tzg-test-img.oss-cn-hangzhou.aliyuncs.com/Front-end-h5/product01.jpg'
      }
    ]
  }

  handleClick(item) {
    // 友盟埋点
    cnzzTrackEvent('商品列表页', '商品点击')

    Taro.navigateTo({
      url: `/pages/goods/index?no=${item.no}`
    })
  }

  render() {
    const { goodDatas, isLast } = this.props
    return (
      <View>
        <View className='goods-grid'>
          {goodDatas.map(item => (
            <View className='goods-grid-item' key={item} onClick={this.handleClick.bind(this, item)}>
              <View className='good-img'>
                <Image src={item.headFigure} mode='aspectFill' className='imgStyle' lazyLoad />
              </View>
              <View className='grid-txt-block'>
                <View className='grid-item-title'>
                  <Text className='item-title-txt'>{item.name}</Text>
                </View>
                <View className='grid-item-tag'>
                  {item.goodsLabel &&
                    item.goodsLabel.length > 0 &&
                    item.goodsLabel.map(
                      (label, labelInx) =>
                        labelInx < 2 && (
                          <Text className='item-tag-txt' key={labelInx}>
                            {label}
                          </Text>
                        )
                    )}
                </View>
                <View className='grid-item-price'>
                  <View className='price'>¥ {item.minPrice}</View> {item.businessType === 0 ? `/${item.unit}` : ''}
                </View>
              </View>
            </View>
          ))}
        </View>

        {goodDatas.length === 0 && (
          <View className='goods-grid-no-data'>
            <Text>暂无数据</Text>
          </View>
        )}
        {!isLast && <AtActivityIndicator content='加载中...' mode='normal' />}
        {/* {!isLast &&
          <View className='home__loading'>
            <Text className='home__loading-txt'>正在加载中...</Text>
          </View>
        } */}
        {/* {!this.state.hasMore &&
          <View className='home__loading home__loading--not-more'>
            <Text className='home__loading-txt'>更多内容，敬请期待</Text>
          </View>
        } */}
      </View>
    )
  }
}
