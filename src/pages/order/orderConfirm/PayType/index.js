import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import RadioSelect from '../../../../components/RadioSelect'
import { get as getGlobalData } from '../../../../global_data'
import './index.scss'
import propTypes from 'prop-types'

export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      payTyepShow: false, // 选择支付方式
      leaseTimeShow: false, // 租期
      payData: [], //
      checkedPayType: '' //  支付方式 0:京东H5一次性支付 1:支付宝一次性支付 2:微信一次性支付 10:京东代扣 12:支付宝预授权
    }
  }
  propTypes = {
    GoodsInfoData: propTypes.object
  }
  defaultProps = {
    GoodsInfoData: {} // 商品默认值
  }
  componentWillMount() {
    this.channelType()
  }
  componentDidShow() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.payChannel !== this.state.payChannel) {
      this.setState({
        checkedPayType: this.props.payChannel
      })
    }
  }

  // 渠道支付处理
  channelType() {
    //  支付方式 0:京东H5一次性支付 1:支付宝一次性支付 2:微信一次性支付 10:京东代扣 12:支付宝预授权

    if (getGlobalData('Channel') === 'JDBT') {
      this.setState(
        {
          payData: [{ label: '京东签约代扣', value: '10' }, { label: '京东支付', value: '0' }],
          checkedPayType: this.props.payChannel
        },
        () => {
          // this.props.onSelectpayType(this.state.checkedPayType)
        }
      )
    } else if (getGlobalData('Channel') === 'ALIPAY_LIFE' || getGlobalData('Channel') === 'APLIPAY_MINI_PROGRAM') {
      this.setState(
        {
          payData: [{ label: '支付宝预授权', value: '12' }, { label: '支付宝支付', value: '1' }],
          checkedPayType: this.props.payChannel
        },
        () => {
          // this.props.onSelectpayType(this.state.checkedPayType)
        }
      )
    } else if (getGlobalData('Channel') === 'webapp') {
      this.setState(
        {
          payData: [{ label: '微信支付', value: '2' }],
          checkedPayType: this.props.payChannel
        },
        () => {
          this.props.onSelectpayType(this.state.checkedPayType)
        }
      )
    }
  }

  // 支付方式确认的回调
  handlePayOk = value => {
    this.setState(
      {
        checkedPayType: value
      },
      () => {
        this.onHandlePayClose()
        this.props.onSelectpayType(this.state.checkedPayType)
      }
    )
  }

  // 选择支付方式
  openPayType = () => {
    this.setState(
      {
        payTyepShow: true
      },
      () => {
        this.props.onFooterShow(false)
      }
    )
  }

  // 租期展示
  openLease = () => {
    this.setState(
      {
        leaseTimeShow: true
      },
      () => {
        this.props.onFooterShow(false)
      }
    )
  }

  // 支付方式关闭
  onHandlePayClose = () => {
    this.setState(
      {
        payTyepShow: false
      },
      () => {
        this.props.onFooterShow(true)
      }
    )
  }

  // 租期关闭
  onHandleLeaseClose = () => {
    this.setState(
      {
        leaseTimeShow: false
      },
      () => {
        this.props.onFooterShow(true)
      }
    )
  }

  // 处理选中支付方式的名字
  formartValue(value) {
    let list = {
      label: ''
    }
    this.state.payData.map(item => {
      if (item.value === value) {
        list = item
      }
    })
    return list.label
  }

  priceFormart(GoodsInfoData) {
    // 最后加上运费 freight
    if (GoodsInfoData.Buyout) {
      return (GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count).toFixed(2)
    } else {
      return (this.props.totalRent - this.props.couponMoney + this.props.freight).toFixed(2)
    }
  }

  render() {
    const { leaseData, couponMoney, GoodsInfoData = {}, firstPay, discountType, freight } = this.props
    return (
      <View className='paySelect'>
        <View className='payType'>
          <Text>支付方式</Text>
          <View
            className='payType_value'
          >
            <Text>{this.formartValue(this.state.checkedPayType)}</Text>
            <RadioSelect
              show={this.state.payTyepShow}
              title='选择支付方式'
              checkedValue={this.state.checkedPayType}
              radioData={this.state.payData}
              onHandleOk={this.handlePayOk}
              onHandleClose={this.onHandlePayClose}
              noOpertion
            />
          </View>
        </View>
        <View className='pay_price'>
          <Text>应付金额</Text>
          <Text>¥{this.priceFormart(GoodsInfoData)}</Text>
        </View>

        {(this.state.checkedPayType === '10' || this.state.checkedPayType === '12') &&
        GoodsInfoData.productInfo.unit === '月' ? (
          <View className='lease_detail'>
            <Text>分期详情</Text>
            <View className='lease_detail_right' onClick={this.openLease}>
              <View className='lease_detail_right_value'>
                {couponMoney || !!firstPay ? (
                  <Text className='lease_detail_right_value_text'>
                    首期:{freight?'(含运费)':''}¥
                    {leaseData.length > 0 && leaseData[0].payAmount.toFixed(2)}
                  </Text>
                ) : null}
                <Text className='lease_detail_right_value_text'>
                  {couponMoney || !!firstPay ? '剩余:' : null}¥{leaseData[1] ? leaseData[1].payAmount : 0}x
                  {couponMoney || !!firstPay ? leaseData.length - 1 : leaseData.length}期
                </Text>
              </View>
              <View className='at-icon at-icon-chevron-right vgn' />
            </View>
            <RadioSelect
              show={this.state.leaseTimeShow}
              title='分期每月还款金额'
              onHandleClose={this.onHandleLeaseClose}
              noOpertion={false}
            >
              {leaseData.map((item, index) => {
                return (
                  <View key={item.index} className='lease_list'>
                    <View>
                      <Text className='periods'>第{item.dividedNum}期</Text>
                      <Text>{item.expectedTime.substr(0, 11)}</Text>
                    </View>
                    <View className='firstlesate_price'>
                      <Text>¥ {item.payAmount.toFixed(2)}</Text>
                      {index === 0 && couponMoney && discountType * 1 === 1 ? (
                        <Text className='firstlesate_price_coupons'>已优惠 -¥{couponMoney}</Text>
                      ) : null}
                    </View>
                  </View>
                )
              })}
            </RadioSelect>
          </View>
        ) : null}
      </View>
    )
  }
}
