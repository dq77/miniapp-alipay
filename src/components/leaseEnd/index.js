import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtAccordion, AtCurtain, AtCard } from 'taro-ui'
import RadioSelect from '../../components/RadioSelect'
import './index.scss'

export default class LeaseEnd extends Taro.Component {
  static defaultProps = {
    isOpen: false,
    detailShow: false,
    rentInfo: {},
  }
  constructor (props) {
    super(props)
    this.state = {
      leaseAccordionShow: this.props.isOpen, // 租期结束方案说明
      detailShow: this.props.isOpen, // 展示详情 取消交互
      showBuyoutModal: false
    }
  }

  componentDidMount() {

  }

  leaseAccordionChange = () => {
    if (!this.state.detailShow) {
      this.setState({
        leaseAccordionShow: !this.state.leaseAccordionShow
      })
    }
  }
  showBuyoutInfo(){
    this.setState({
      showBuyoutModal: true
    })
  }
  // 关闭弹窗
  hideBuyoutInfo = () => {
    this.setState({
      showBuyoutModal: false
    })
  }

  render () {
    let { detailShow, leaseAccordionShow, showBuyoutModal } = this.state
    let { rentInfo } = this.props
    return (
      <View className='leaseEndPage'>
        <View className={detailShow?'leaseAccordion hideArrow':'leaseAccordion'}>
          <View className='leaseAccordionTitle' onClick={() => this.leaseAccordionChange()}>
            <Text>租期结束后可选择方案</Text>
            <View className='wayTip'>
              {!detailShow && 
                <Text className='tar'>
                  { rentInfo.canRenewal ? '续租' : '' }
                  { rentInfo.canRenewal && (rentInfo.canBuyout || rentInfo.needReturn) ? '/' : ''}
                  { rentInfo.canBuyout ? '买断' : '' }
                  { rentInfo.needReturn && rentInfo.canBuyout ? '/' : '' }
                  { rentInfo.needReturn ? '归还' : '' }
                </Text>
              }
              {!detailShow && !leaseAccordionShow && <View className='wayTipArrow at-icon at-icon-chevron-right' />}
              {!detailShow && leaseAccordionShow && <View className='wayTipArrow at-icon at-icon-chevron-up' />}
            </View>
          </View>
          <View className={leaseAccordionShow? 'leaseAccordionList' : 'hide'}>
            <View className='item'><View>续租(单价)</View>
              <View>
                { rentInfo.canRenewal ? (
                  <View>￥{rentInfo.renewalPrice}/{rentInfo.unit}起</View>
                ) : '该商品暂不支持续租'}
              </View>
            </View>
            <View className='item'><View>买断(单价)</View>
              <View>
                { rentInfo.canBuyout ? (
                  <View>
                    到期买断价：￥{rentInfo.buyoutPrice}
                    <View className='at-icon at-icon-help vgn' onClick={this.showBuyoutInfo.bind(this)} />
                  </View>
                ) : '该商品暂不支持买断'}
              </View>
            </View>
            <View className='item'><View>归还</View>
              <View>联系客服人员归还</View>
            </View>
          </View>
        </View>

        <AtCurtain isOpened={showBuyoutModal} onClose={this.hideBuyoutInfo}>
          <AtCard title='买断说明'>
            <View>1. 到期买断价：物品租赁到期后，买断时应付的金额。</View>
            <View>2. 若租赁未到期提前买断，实际买断支付金额=到期买断价+订单未支付租金。</View>
          </AtCard>
        </AtCurtain>
      </View>
    )
  }
}