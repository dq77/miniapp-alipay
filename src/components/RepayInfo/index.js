import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import './index.scss'

export default class RepayInfo extends Taro.Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () {}
  render () {
    const { show } = this.props
    return (
      <AtModal
        className='repayModal'
        isOpened={show}
        onClose={this.props.onHideRepayInfo}
      >
        <AtModalContent>
          <View className='modal-content'>
            <View className='infoTitle'>订单返现说明</View>
            <View className='infoItem'>
              <View className='itemNumber'>1</View>
              <View className='itemCont'>一次性支付订单：订单支付成功7天后，将返现金额结算至账户余额。</View>
            </View>
            <View className='infoItem'>
              <View className='itemNumber'>2</View>
              <View className='itemCont'>分期支付订单：订单支付成功7天后，将首付的应返现金额结算至账户余额；后续每期支付完成后，将本期应返现金额结算至账户余额。</View>
            </View>
            {/* <View className='infoItem'>
              <View className='itemNumber'>3</View>
              <View className='itemCont'>余额结算时间：每天上午9:00-10:00</View>
            </View> */}
            <Button className='repayInfoBtn' onClick={this.props.onHideRepayInfo}>
              我知道了
            </Button>
          </View>
        </AtModalContent>
      </AtModal>
    )
  }
}