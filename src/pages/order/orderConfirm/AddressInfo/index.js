import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import { cnzzTrackEvent } from '../../../../utils/cnzz'
import './index.scss'

export default class AddressInfo extends Taro.Component {
  static propTypes = {
    hasAddress: PropTypes.bool
  }

  static defaultProps = {
    hasAddress: false
  }

  // 前往地址列表
  navToads(id) {
    // 友盟埋点
    cnzzTrackEvent('订单确认页', '前往地址列表')
    Taro.navigateTo({
      url: `/pages/address/address/index?source=order&addressId=${id}`
    })
  }

  // 前往添加地址
  navToaddAds() {
    // 友盟埋点
    cnzzTrackEvent('订单确认页', '添加地址')
    Taro.navigateTo({
      url: `/pages/address/addAddress/index?isAdd=${true}`
    })
  }

  componentDidMount() {}

  render() {
    const { hasAddress, topAddresInfo } = this.props
    return (
      <View className='AddressInfo'>
        {hasAddress ? (
          <View onClick={() => this.navToads(topAddresInfo.id)}>
            <View className='onerow'>
              <View className='at-icon at-icon-map-pin vgin' />
              <Text className='address'>
                {topAddresInfo.province}
                {topAddresInfo.city}
                {topAddresInfo.area}
                {topAddresInfo.detail}
              </Text>
              <View className='at-icon at-icon-chevron-right posRight' />
            </View>
            <View>
              <Text className='addressname'>{topAddresInfo.receiveName}</Text>
              <Text>{topAddresInfo.mobile}</Text>
            </View>
          </View>
        ) : (
          <View className='noAddress' onClick={this.navToaddAds}>
            <Text>点击添加地址</Text>
            <View className='at-icon at-icon-chevron-right posRight' />
          </View>
        )}
      </View>
    )
  }
}
