import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { connect } from '@tarojs/redux'
import { setSessionItem } from '../../../utils/save-token'
import './index.scss'
import {
  payform_h5,
  payOrderMoney_signing,
  withoutCodePay,
  alipayLife_h5,
  appMiniPay,
  preAuthorization
} from '../../../components/payMoney/index'
import { serviecUrl } from '../../../config/index'
import warningIcon from '../../../images/orderlist/warningIcon.png'
import getChannel from '../../../utils/channel'

@connect(({ bill }) => ({
  ...bill
}))
export default class Test extends Taro.Component {
  constructor() {
    super(...arguments)
    this.state = {
      payChannel: 0,
      channel: '',
      showLate: false,
      payConfirmModal: false,
      isLate: false, // 是否存在逾期
      preBill: 0, // 首期待还款期数
      billState: 0, // 订单状态
      isAllowRepayment: true,
      delayBills: [],
      selectBill: {}, // 选择的待还账单
      billLength: 0,
      shouldPay: 0,
      balance: 0
    }
  }

  config = {
    navigationBarTitleText: '账期'
  }

  componentWillMount() {
    this.fetchBill()
  }

  componentDidMount() {}

  // 账期
  fetchBill() {
    let params = {
      orderNo: this.$router.params.orderNo
    }
    Taro.showLoading({
      title: 'loading'
    })
    this.props.dispatch({
      type: 'bill/getBill',
      payload: params,
      callback: (data) => {
        Taro.hideLoading()
        let featureBills = data.bills.filter((item) => {
          return (item.status * 1 != 0 )
        })
        let delayBills = featureBills.filter((item) => {
          return (item.delayTime * 1 != 0 )
        })
        let isLate = delayBills.length>0?true:false
        let shouldPay = 0
        if (isLate) {
          shouldPay = ( data.delayedAmount - 0 ).toFixed(2)
        } else {
          shouldPay = ( data.restAmount - 0 ).toFixed(2)
        }

        this.setState({
          preBill: featureBills.length != 0 ? featureBills[0].dividedNum : 0,
          featureBills: featureBills,
          delayBills: delayBills,
          isLate: isLate,
          showLate: isLate,
          billState: data.status,
          isAllowRepayment: data.isAllowRepayment,
          shouldPay: shouldPay,
          balance: data.restBalance,
          channel: getChannel(),
          billLength: data.bills.length
        })
      }
    })
  }
  
  // 手动还款按钮
  payBackSelf(item) {
    this.setState({
      payConfirmModal: true,
      selectBill: item
    })
  }

  // 用户确认还款
  confirmPay = () => {
    let bill = this.state.selectBill
    Taro.showToast({
      title: '开始支付',
      icon: 'loading',
      duration: 1000
    })
    this.createRepayment(bill)
  }

  createRepayment(bill) {
    let payType = ''
    let dividedNums = []
    let onepayUrl = ''
    switch (this.state.channel) {
      case 'APLIPAY_MINI_PROGRAM': // M站支付宝一次性支付
      payType = 'APPLET_ALIPAY'
      onepayUrl = serviecUrl + '/#/pages/order/payResult/index'
        break
    }
    if ( bill.dividedNum) {
      dividedNums = [bill.dividedNum]
    } else {
      if (this.state.isLate) {
        // 逾期状态下 还已逾期
        this.state.delayBills.map( (item, index) => {
          dividedNums.push(item.dividedNum)
        })
      } else {
        // 没有逾期 还剩余
        this.state.featureBills.map( (item, index) => {
          dividedNums.push(item.dividedNum)
        })
      }
    }

    // 手动还款
    this.props.dispatch({
      type: 'bill/createRepayment',
      payload: {
        orderNo: this.$router.params.orderNo,
        payType: payType,
        dividedNums: dividedNums,
        callBackUrl: onepayUrl
      },
      callback: (data) => {
        Taro.hideLoading()
        if (data.code == 200) {
          this.fetchBill()
          this.setState({
            payConfirmModal: false
          })
          Taro.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          setSessionItem('payBackSelf', true);
          this.payApi(data)
        }
      }
    })
  }

  payApi(data) {
    
    switch (this.state.channel) {
      case 'APLIPAY_MINI_PROGRAM': // 支付宝小程序一次性支付
        if (data.code === 4) {
          // 支付宝小程序支付
          appMiniPay(data.data.tradeNo).then(
            () => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}`
              })
            },
            resCode => {
              if (resCode * 1 === 6001) {
                // 用户点击取消
                Taro.navigateTo({
                  url: `/pages/order/orderDetail/index?orderNo=${data.data.orderNo}`
                })
                return
              }
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}&payStatus=false`
              })
            }
          )
        }
        break
    }
  }

  //  扣款状态
  fortmartStatus(item) {
    let statusText = ''
    let status = item.status
    if (status * 1 === 0) {
      statusText = '已还款'
    } else if (status * 1 === 1 || status * 1 === 2) {
      if ( item.delayTime * 1 != 0 ) {
        statusText = '已逾期'
      } else {
        statusText = '待扣款'
      }
    } else if (status * 1 === 3) {
      statusText = '已关闭'
    }
    return statusText
  }

  // 余额可抵扣金额计算
  dikouFilter(sprice) {
    let shouldPay = sprice || (this.state.shouldPay - 0)
    let balance = this.state.balance - 0
    let price = 0
    if ( balance < shouldPay ) {
      price = (balance*1).toFixed(2)
    } else {
      price = (shouldPay*1).toFixed(2)
    }
    return ( price - 0 ).toFixed(2)
  }

  // 应付金额计算
  shouldPayFilter(shouldPay) {
    let balance = this.state.balance - 0
    let price = 0
    if ( balance < shouldPay ) {
      price = shouldPay - balance
    } else {
      price = 0
    }
    return ( price - 0 ).toFixed(2)
  }

  // 逾期提醒模态框
  closeLate = () => {
    this.setState({
      showLate: false
    })
  }

  // 关闭支付模态框
  cancelPay = () => {
    this.setState({
      payConfirmModal: false
    })
  }

  render() {
    const { billData } = this.props
    let { billLength, shouldPay, showLate, payConfirmModal, selectBill, isLate, preBill, balance, billState, isAllowRepayment } = this.state
    return (
      <View className='orderBill'>
        <View className='bill_price'>
          <View className='cell bline'>
            <Text className='cell_left'>应付金额：</Text>
            <Text>¥{billData.totalAmount || 0}</Text>
          </View>
          {getChannel() !== 'ALIPAY_LIFE' && getChannel() !== 'APLIPAY_MINI_PROGRAM' ? (
            <View className='cell bline'>
              <Text>押金：</Text>
              <Text>¥{billData.depositAmount || 0}</Text>
            </View>
          ) : null}
        </View>
        <View className='bill_time'>
          {billData.bills && Array.isArray(billData.bills) && billData.bills.length > 0 ? (
            billData &&
            billData.bills.map(item => {
              return (
                <View className='cell bline' key={item}>
                  <View className='cell_left'>
                    <Text>
                      {item.dividedNum || '--'}/{billLength}期 ¥{item.payAmount || '--'}
                    </Text>
                    {
                      item.balance > 0 && <Text>
                        余额抵扣：-¥{ item.balance }元
                      </Text>
                    }
                    <Text className='textcolor'>还款日：{item.expectedTime ? item.expectedTime.substr(0, 10) : null}</Text>
                  </View>
                  <View className={item.status === 0 ? 'cell_right' : 'cell_right blue'}>
                    { isAllowRepayment && item.status * 1 === 1 && item.dividedNum == preBill && !isLate ? (
                      <View className='pay_back_self' onClick={this.payBackSelf.bind(this, item)}>
                        <Text>提前还款</Text>
                      </View>
                    ) : (
                      <Text className={item.delayTime == 0 ? 'text' : 'text redColor'}>{this.fortmartStatus(item)}</Text>
                    ) }
                    {item.payTime ? (
                      <Text className='textcolor'>实际还款日:{item.payTime.substr(0, 10)}</Text>
                    ) : null}
                  </View>
                </View>
              )
            })
          ) : (
            <View>暂无账期</View>
          )}
        </View>
        { isAllowRepayment && billState != 0 ? (
          <View className='bottom-model'>
            <View className='price-info'>
              <View>{isLate? '逾期' : '待还'}总额：￥{shouldPay}</View>
              { balance > 0 ? (<View className='balance'>余额可抵扣：-￥ { this.dikouFilter() }</View>) : null }
            </View>
            <View className='price-btn'>
              <View className='pay-btn' onClick={this.payBackSelf.bind(this, {payAmount: shouldPay})}>立即还款</View>
            </View>
          </View>
        ) : null}
        <AtModal
          className='repayTipModal'
          isOpened={showLate && isAllowRepayment}
        >
          <AtModalContent>
            <View className='modal-content'>
              <View className='infoTitle'>
                <View className='warnImg'>
                  <Image src={warningIcon} mode='widthFix'></Image>
                </View>
                逾期提醒
              </View>
              <View className='infoItem'>
                您的还款已逾期，为了避免逾期对您的信用造成影响，请您尽快处理还款。
              </View>
              <View className='infoItem'>
                如有疑问请联系在线客服或联系淘租公电话：<Text className='phoneNum'>0571 8518 0735</Text>
              </View>
              <View className='confirm-btn' onClick={this.closeLate}>我知道了</View>
            </View>
          </AtModalContent>
        </AtModal>
        <AtModal
          className='confirmPayModal'
          isOpened={payConfirmModal}
        >
          <AtModalContent>
            <View className='modal-content'>
              <View className='infoTitle'>支付详情</View><View className='closeTip'><View onClick={this.cancelPay} className='at-icon at-icon-close'></View></View>
              <View className='infoItem'><View>应付金额</View><View>￥{selectBill.payAmount}</View></View>
              { balance > 0 ? (<View className='infoItem'><View>余额抵扣</View><View>-￥{this.dikouFilter(selectBill.payAmount)}</View></View>) : null }
              <View className='infoItem payAmount'><View>支付金额</View><View className='price'>￥{this.shouldPayFilter(selectBill.payAmount)}</View></View>
              
              <View className='confirm-btn' onClick={this.confirmPay}>立即支付</View>
            </View>
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}
