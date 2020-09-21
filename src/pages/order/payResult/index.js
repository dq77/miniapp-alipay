import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'
import LeaseEnd from '../../../components/leaseEnd'
import CheckedIMG from '../../../images/payresult/pay.png'
import FailImg from '../../../images/payresult/fail.png'
import { getSessionItem, delSessionItem } from '../../../utils/save-token'
import { cnzzTrackEvent } from '../../../utils/cnzz'
import './index.scss'

@connect(({ payResult }) => ({
  ...payResult
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      payStatus: (this.$router.params.payStatus && this.$router.params.payStatus) || false, // TRUE 支付成功  false // 支付失败
      payBackSelf: getSessionItem('payBackSelf') || false, // 手动还款标志
      rentInfo: {},
      payChannelList: [{ label: '支付宝预授权', value: 'ALIPAY_AUTH' }, { label: '支付宝支付', value: 'APPLET_ALIPAY' }]
    }
  }
  config = {
    navigationBarTitleText: '支付成功'
  }

  componentWillMount() {
    this.fetchInit()
  }

  componentDidMount() {
    this.getRentInfo()
  }
  componentWillUnmount () {
    delSessionItem('payBackSelf');
  } 

  fetchInit() {
    let params = {
      orderNo: this.$router.params.orderNo
    }
    this.props.dispatch({
      type: 'payResult/getpayPrice',
      payload: params
    })
  }

  // 获取租赁到期 买断续租价格信息
  getRentInfo = () => {
    let params = {
      orderNo: this.$router.params.orderNo
    }
    this.props.dispatch({
      type: 'payResult/getRentInfo',
      payload: params,
      callback: data => {
        if (data.code == 200 && data.data.length>0) {
          this.setState({
            rentInfo: data.data[0]
          })
        }
      }
    })
  }

  // 处理选中支付方式的名字
  filterPayChannel = (value) => {
    let list
    this.state.payChannelList.map(item => {
      if (item.value === value) {
        list = item
      }
    })
    return list.label
  }

  // 回到首页
  navTohome() {
    // 友盟埋点
    cnzzTrackEvent('支付结果页', '回到首页')
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  // 查看订单
  navTohOrderdetail() {
    // 友盟埋点
    cnzzTrackEvent('支付结果页', '查看订单')
    let orderNo = this.$router.params.orderNo
    Taro.navigateTo({
      url: `/pages/order/orderDetail/index?orderNo=${orderNo}`
    })
  }

  // 前往订单列表
  navToOrderlist() {
    // 友盟埋点
    cnzzTrackEvent('支付结果页', '完成按钮')
    Taro.navigateTo({
      url: '/pages/order/orderList/index'
    })
  }

  render() {
    const { payPrice } = this.props
    const { rentInfo, payBackSelf } = this.state

    return (
      <View className='payResult'>
        <View className='bgcf'>
          <View className='imgwrap'>
            <Image src={!this.state.payStatus ? CheckedIMG : FailImg} mode='widthFix' />
          </View>
          {}
          <View className='success_text'>{!this.state.payStatus ? '支付成功' : '支付失败'}</View>
          <View className='success_price'>
            <Text>支付金额：</Text>
            <Text className='success_price_money'>¥{payPrice}</Text>
          </View>
        </View>
        {/* 支付方式 */}
        {payBackSelf ? null : (
          <View className='w100'>
            { rentInfo.tradeType && rentInfo.tradeType != 'Buyout' &&
              <View className='payType'>
                <View className='title'>支付方式： {this.filterPayChannel(rentInfo.payChannel)}</View>
                <View className='item'>
                { rentInfo.tradeType == 'Sales' ? '总金额' : '应付金额'}
                  ： ￥{rentInfo.totalRent}</View>
                <View className='item'>
                  { rentInfo.tradeType == 'Sales' && rentInfo.period != 1 ? '分期数： '+rentInfo.period+'期' : ''}
                  { rentInfo.tradeType != 'Sales' && rentInfo.period ? '租期： '+rentInfo.period+
                  (rentInfo.unit == '月'? '个月': rentInfo.unit) : ''}
                </View>
                {rentInfo.deposit ?
                  <View className='item'>押金： ￥{rentInfo.deposit}</View>
                  : null
                }
              </View>
            }
            {/* 租期结束后可选择方案 */}
            { rentInfo.tradeType && ( rentInfo.tradeType == 'Lease' || rentInfo.tradeType == 'Renewal' ) &&
              <View className='leaseEnd'><LeaseEnd isOpen={true} rentInfo={rentInfo}></LeaseEnd></View>
            }
          </View>
        )}
        <View className='success_btn'>
          <AtButton onClick={this.navTohome}>回到首页</AtButton>
          <AtButton onClick={() => this.navTohOrderdetail()}>查看订单</AtButton>
        </View>
        <View className='success_ok'>
          <AtButton type='primary' onClick={this.navToOrderlist}>
            完成
          </AtButton>
        </View>
      </View>
    )
  }
}
