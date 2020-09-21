import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { AtCurtain, AtIcon } from 'taro-ui'
import './index.scss'
import propType from 'prop-types'
import { connect } from '@tarojs/redux'

@connect(({ activity_return_cash }) => ({
  ...activity_return_cash
}))
export default class return_rule extends Taro.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      flag: 'rule'
    }
  }
  static propType = {
    returnRule: propType.string
  }
  componentWillMount() {}
  onClose() {
    this.setState({
      isOpened: false
    })
  }
  // 点击打开活动规则弹窗
  myRule(flag) {
    this.setState({
      isOpened: true,
      flag: flag
    })
  }
  // 打开我的返现
  myMoney(flag) {
    this.setState({
      isOpened: true,
      flag: flag
    })
    this.props.onGetMyMoney()
  }
  render() {
    const { returnRule, myReturn } = this.props

    return (
      <View className='return-rule'>
        <View className='rule-btn-container'>
          <Text className='rule-btn' onClick={this.myRule.bind(this, 'rule')}>
            活动规则
            <AtIcon value='chevron-right' size='10' color='#fff' />
          </Text>
          <Text className='rule-btn' onClick={this.myMoney.bind(this, 'money')}>
            我的返现
            <AtIcon value='chevron-right' size='10' color='#fff' />
          </Text>
        </View>
        <View>
          <AtCurtain isOpened={this.state.isOpened} onClose={this.onClose.bind(this)}>
            <View className='rule-title'>
              {this.state.flag === 'rule' && <Text>活动规则</Text>}
              {this.state.flag === 'money' && <Text>我的返现</Text>}
            </View>
            {this.state.flag === 'rule' && (
              <View className='rule-content' dangerouslySetInnerHTML={{ __html: returnRule }} />
            )}
            {this.state.flag === 'money' && (
              <View className='rule-content'>
                {myReturn &&
                  myReturn.map(item => (
                    <View className='money-line'>
                      <Text>{item.gmtCreate}</Text>
                      <Text>{item.moneyYuan}元</Text>
                    </View>
                  ))}
              </View>
            )}
          </AtCurtain>
        </View>
      </View>
    )
  }
}
