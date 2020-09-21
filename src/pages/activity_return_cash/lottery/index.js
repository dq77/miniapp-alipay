import Taro from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import propTypes from 'prop-types'
import { View, Text, Image } from '@tarojs/components'
import luckyWheel from '../../../images/return_cash/luckyWheel.png'
import pointer from '../../../images/return_cash/point.png'
import goldCoin from '../../../images/return_cash/goldCoin.png'
import getChannel from '../../../utils/channel'
import { hasUserState } from '../../../utils/accredit'
import { cnzzTrackEvent } from '../../../utils/cnzz'
import './index.scss'
@connect(({ activity_return_cash }) => ({
  ...activity_return_cash
}))
export default class Lotter extends Taro.Component {
  constructor(props) {
    super(props)
    this.state = {
      click_flag: true,
      start_rotating_degree: 0, // 初始转动角度
      rotate_angle: 0, // 将要转动的角度
      rotate_angle_pointer: 0, // 指针转动的角度
      type: 1, // 1指针转  0转盘转
      rotate_transition: 'transform 4s ease-in-out', //初始化选中的过度属性控制
      rotate_transition_pointer: 'transform 4s ease-in-out' //初始化指针过度属性控制
    }
  }
  static propTypes = {
    prizeList: propTypes.Array
  }
  static defaultProps = {
    rotate_angle: false,
    prizeList: []
  }
  getPrize() {
    if (hasUserState()) {
      cnzzTrackEvent('返现页面', '点击抽奖')
      this.props.dispatch({
        type: 'activity_return_cash/getPrize',
        payload: {
          channel: getChannel(),
          payBackId: this.props.prizeList && this.props.prizeList.length > 0 ? this.props.prizeList[0].payBackId : ''
        },
        callback: res => {
          this.rotate_handle(res)
        }
      })
    }
  }
  rotate_handle(res) {
    let prizeList = this.props.prizeList

    var index = -1 // 指定的中奖额度
    for (let i = prizeList.length - 1; i > -1; i--) {
      if (res.backPercent == prizeList[i].backPercent) {
        index = i
        break
      }
    }
    if (!this.state.click_flag) return
    var during_time = 4 // 默认为1s
    var rand_circle = 8 // 附加多转几圈，2-3
    this.click_flag = false // 旋转结束前，不允许再次触发
    // 计算指针转动的角度 转动指针
    var rotate_angle = this.state.start_rotating_degree + rand_circle * 360 + index * 60
    this.setState({
      rotate_angle_pointer: `rotate(${rotate_angle}deg)`
    })
    var that = this
    // 旋转结束后，允许再次触发
    setTimeout(function() {
      that.click_flag = true
      // 指针转动后
      that.props.dispatch({
        type: 'activity_return_cash/save',
        payload: {
          backPercent: res.backPercent,
          payBackId: res.id
        }
      })
      that.game_over()
    }, during_time * 1000 + 1000)
  }
  render() {
    return (
      <View className='lottery-container'>
        <Image className='lucky-img' src={luckyWheel} />
        <View className='lucky-text'>
          <Text>先抽奖 再租赁 100%中奖率</Text>
        </View>
        <View className='wheel-main'>
          <View className='wheel-pointer-box'>
            <View
              className='wheel-pointer'
              onClick={this.getPrize.bind(this)}
              style={{ transform: this.state.rotate_angle_pointer, transition: 'transform 4s ease-in-out' }}
            >
              <View className='start'>
                <Text>
                  开始
                  <br />
                  抽奖
                </Text>
              </View>
              <Image src={pointer} className='point-img' />
            </View>
          </View>
          <View
            className='wheel-bg'
            style={{ transform: this.state.rotate_angle, transition: this.state.rotate_transition }}
          >
            <View className='prize-list'>
              {this.props.prizeList.map(item => (
                <View className='prize-item' key={item}>
                  <View className='prize-type'>
                    <Text>返现</Text>
                  </View>
                  <View className='prize-count'>
                    <Text>{item.backPercent}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Image className='gold-cion' src={goldCoin} mode='scaleToFill' />
      </View>
    )
  }
}
