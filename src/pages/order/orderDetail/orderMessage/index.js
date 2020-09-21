import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import copy from 'copy-to-clipboard'
import './index.scss'
import { cnzzTrackEvent } from '../../../../utils/cnzz'
import propTypes from 'prop-types'

export default class Test extends Taro.Component {
  propTypes = {
    mesData: propTypes.object
  }
  defaultProps = {
    mesData: {}
  }
  formartPayChannel(type) {
    switch (type) {
      case 'JD_H5':
        return '京东支付'
      case 'SERVICE_WINDOW_ALIPAY':
        return '支付宝支付'
      case 'ALIPAY_AGREEMENT':
        return '支付宝免密支付'
      case 'ALIPAY_ZM_FREE':
        return '支付宝芝麻信用免密支付'
      case 'APPLET_ALIPAY':
        return '支付宝支付'
      case 'HUA_BET':
        return '花呗支付'
      case 'APPLET_WX':
        return '微信小程序支付'
      case 'JD_PERIODIC':
        return '京东签约代扣'
      case 'ALIPAY_AUTH':
        return '支付宝预授权'
    }
  }

  copy = val => {
    cnzzTrackEvent('订单详情页', '复制订单编号')
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      Taro.setClipboardData({
        data: val,
        success() {
          Taro.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    } else {
      copy(val) //'我是要复制的内容
      Taro.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  }

  render() {
    const { mesData = {} } = this.props
    return (
      <View className='orderMessage'>
        <View className='cell'>
          <Text className='cell_left'>订单编号</Text>
          <Text className='cell_right'>
            {mesData.orderNo || ''}{' '}
            <Text className='copy' data-clipboard-text={mesData.orderNo} onClick={() => this.copy(mesData.orderNo)}>
              复制
            </Text>
          </Text>
        </View>
        <View className='cell'>
          <Text className='cell_left'>下单时间</Text>
          <Text className='cell_right'>{mesData.createTime}</Text>
        </View>
        {// 待支付 已取消 不显示
        mesData.status !== 10010 || mesData.status !== 10100 ? (
          <View className='cell'>
            <Text className='cell_left'>支付方式</Text>
            <Text className='cell_right'>{this.formartPayChannel(mesData.payChannel)}</Text>
          </View>
        ) : null}
        <View className='cell'>
          <Text className='cell_left'>备注</Text>
          <Text className='cell_right ov'>{mesData.buyerRemark || ''}</Text>
        </View>
      </View>
    )
  }
}
