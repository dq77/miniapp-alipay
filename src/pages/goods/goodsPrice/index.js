import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class GoodsPrice extends Component {
  static defaultProps = {
    list: []
  }

  state = {}

  handleChange = () => {}

  render() {
    const { minprice, unit, goodsLabel = [], officialPrice, businessType } = this.props

    return (
      <View className='item-price'>
        <View className='item-price-labels'>
          {!!goodsLabel &&
            goodsLabel.map(item => (
              <Text key={item} className='label-item'>
                {' '}
                {item}{' '}
              </Text>
            ))}
        </View>
        <View className='item-price-value'>
          <Text className='price-symbol'>¥</Text>
          <Text>{minprice}</Text>
          {businessType === 0 ? <Text className='price-unit'>/{unit === 'MONTH' ? '月' : '天'}</Text> : ''}
          <Text style='font-size:12px;padding-left:5px;'>起</Text>

          <Text className='official-price'>官网售价 ¥{officialPrice}</Text>
          {/* <Text style='font-size:12px;margin-left:20Px; padding:2px 4px; background-color:#00A4FF;color:#fff;'>{businessType === 0 ?'租':'售'}</Text> */}
          {/* <Text style='font-size:14px;margin-left:8Px; color:#333'>¥100</Text> */}
        </View>
      </View>
    )
  }
}
