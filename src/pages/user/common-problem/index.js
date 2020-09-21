// 常见问题
import Taro, { Component } from '@tarojs/taro'
import { AtAccordion } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { get as getGlobalData } from '../../../global_data'
import './index.scss'

@connect(({ user }) => ({
  ...user
}))
export default class CommonProblem extends Component {
  config = {
    navigationBarTitleText: '常见问题'
  }
  state = {
    list: [
      {
        id: 1,
        title: '1.关于租赁(到期归还、续租、买断等)',
        open: false,
        answer: [
          '* 租期计算：自您收到货第二天开始计租期，并且租期按自然月进行计算，如3月4日开始，一个月租期则截止到4月3日。',
          '* 归还：到期后会有客服联系您进行归还，您也可主动联系客服预约物流归还商品；如您需要提前归还将会产生违约金，请联系客服确认退货事宜。',
          '* 续租：如果您在租赁期内或者租赁到期时想要续租商品，您可在订单详情页自行续租下单。',
          '* 买断：买断费用=到期买断价+订单未支付租金，具体以买断支付页面展示金额为准。若无法自行发起买断操作，请联系客服了解买断价格等事宜，解释将会在订单详情页开放买断入口，您自行下单购买即可。'
        ]
      },
      {
        id: 2,
        title: '2.关于押金',
        open: false,
        answer: [
          '* 押金：租赁商品物权归属淘租公，防止用户恶意损害商品，需要先收取押金作为担保。',
          '* 信用免押：根据您的信用将会进行押金减免，最高可全部减免。',
          '* 押金解冻：订单完结时，剩余押金系统将会自动解冻/退回。'
        ]
      },
      {
        id: 3,
        title: '3.关于支付宝预授支付',
        open: false,
        answer: [
          '* 支付宝预授支付：支付宝预授权支持用户以支付宝余额，余额宝，绑定银行卡，花呗等渠道做预授，其中预授权时余额，余额宝做资金冻结；绑定银行卡扣款至支付宝内部账户做资金锁定；花呗锁定额度，不产生账期。',
          '* 分期代扣：在支付宝预授基础上，系统将在账期日从预授资金中扣除相应的每期应付款。',
          '* 预授解冻：在订单完结后，系统将自动解冻剩余预授资金/额度。'
        ]
      },
      {
        id: 4,
        title: '3.关于京东分期代扣',
        open: false,
        answer: [
          '* 签约：下单支付时需要您先签约免密代扣，同意淘租公进行分期款项的代扣。如果您已签约，在后期下单时可不用再签。',
          '* 分期代扣：在已签约的基础上，系统将在账期日自动扣除每期应付款。'
        ]
      },
      {
        id: 5,
        title: '4.关于退换货、维修等售后',
        open: false,
        answer: [
          '* 退换货：退换货申请请联系客服。因商品质量或错发漏发导致的退换货由淘租公承担运费，因您个人原因问题导致的退换货将由您承担退回运费，如果已经使用中将会收取一定的违约金',
          '* 维修保养：因非人为损坏造成的商品故障，寄回或者上门维修的所有费用由淘租公承担；因人为损坏产生的维修费用和物流费用需由您支付。一切商品使用期间产生的保养类服务费用（如更换滤网、滤芯等服务）由您承担。'
        ]
      },
      {
        id: 6,
        title: '5.关于逾期支付、逾期归还',
        open: false,
        answer: [
          '* 分期代扣时，因您账户余额不足等问题导致的，将会产生支付逾期费用，同时也会影响您的相关征信，当您产生逾期时请尽快咨询客服。',
          '* 到期归还时，因您的原因导致没有及时归还的，将会产生归还逾期费用，同时也会影响您的相关征信，当您产生逾期时请尽快咨询客服。'
        ]
      }
    ],
    newList:[]
  }

  componentDidMount = () => {
    let channel = getGlobalData('Channel')
    let newList = []
    if (channel === 'JDBT') {
      newList = this.state.list.filter(item => item.id !== 3)
    } else {
      newList = this.state.list.filter(item => item.id !== 4)
    }
    this.setState({
      newList: newList
    })
  }
  handleClick = index => {
    let newList = this.state.newList
    newList[index].open = !newList[index].open

    this.setState({
      newList: newList
    })
  }

  // 拨打电话
  callPhone = mobile => {
    Taro.makePhoneCall({
      phoneNumber: mobile
    })
  }

  render() {
    let channel = getGlobalData('Channel')
    return (
      <View className='common-problem'>
        {/* <BackHeader title='常见问题' /> */}
        {this.state.newList.map((item, index) => (
          <AtAccordion
            hasBorder={false}
            open={item.open}
            onClick={() => this.handleClick(index)}
            title={item.title}
            key={item.id}
            tarokey={item.id}
          >
            {item.answer.map(one => {
              return (
                <View className='answer' key={item}>
                  {one}
                </View>
              )
            })}
          </AtAccordion>
        ))}
        <View style='background:#f9f9fb;height:10px;' />
        {/* 联系我们 */}
        <View className='contact-us'>
          <Text className='contact-us-head'>联系我们</Text>
          <Text className='contact-us-options' onClick={() => this.callPhone('0571-85180735')}>
            拨打客服电话：<Text className='phone'>0571-85180735</Text>
          </Text>
          <Text
            className='contact-us-options phone'
            style={{ marginLeft: '26.9%' }}
            onClick={() => this.callPhone('0571-87676760')}
          >
            0571-87676760
          </Text>
          <Text className='contact-us-options'>客服服务时间：9:00-18:00</Text>
          {channel === 'JDBT' ? <Text className='contact-us-options'>官方微信：微信公众号搜索“淘租公服务”</Text> : null}
        </View>
      </View>
    )
  }
}
