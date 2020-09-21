import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import PropTypes from 'prop-types'
import { cnzzTrackEvent } from '../../utils/cnzz'
import './index.scss'

export default class GoodsList extends Component {
  static propTypes = {
    goodListDatas: PropTypes.array
  }

  static defaultProps = {
    goodListDatas: []
  }

  handleClick(item) {
    // 友盟埋点
    cnzzTrackEvent('分类列表页', '商品点击')

    Taro.navigateTo({
      url: `/pages/goods/index?no=${item.no}`
    })
  }

  render() {
    const { goodListDatas } = this.props
    return (
      <View className='goods-list'>
        {goodListDatas.map(item => (
          <View className='goods-list-item' key={item} onClick={this.handleClick.bind(this, item)}>
            <View className='good-img'>
              <Image src={item.headFigure} mode='widthFix' lazyLoad />
            </View>
            <View className='list-txt-block'>
              <View className='list-item-title'>
                <Text className='item-title-txt'>{item.name}</Text>
              </View>
              <View className='list-item-brief'>
                <Text className='item-brief-txt'>{item.brief}</Text>
              </View>

              <View className='list-item-tag'>
                {item.goodsLabel &&
                  item.goodsLabel.map((itemlabel, indexlabel) => (
                    <Text className='item-tag-txt' key={indexlabel}>
                      {itemlabel}
                    </Text>
                  ))}
              </View>
              <View className='list-item-price'>
                <View className='price'>¥ {item.minPrice}</View> {item.businessType === 0 ? `/${item.unit}` : ''}
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
