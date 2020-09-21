import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, AtAvatar } from 'taro-ui'
import OrderCard from './my-order/index'
import customer from '../../images/user/customer-services.png'
import setting from '../../images/user/setting.png'
import rightIcon from '../../images/user/right-icon.png'
import { get as getGlobalData } from '../../global_data'
import { hasUserState } from '../../utils/accredit'
import { ysfConfig } from '../../utils/kefu'
import { cnzzTrackEvent } from '../../utils/cnzz'
import { hasToken, getSessionItem, getCookie } from '../../utils/save-token'
import './index.scss'

@connect(({ user }) => ({
  ...user
}))
export default class User extends Component {
  config = {
    navigationBarTitleText: '我的'
  }
  state = {
    bindStatus: false
  }

  componentWillMount() {}

  componentDidMount = () => {}

  componentDidShow() {
    let userInfo = getSessionItem('userInfo') ? JSON.parse(getSessionItem('userInfo')) : ''
    // console.log('useeinfo', userInfo)
    if (userInfo && Object.keys(userInfo).length > 0) {
      this.fetchUserInfo()
      this.fetchOrderlistcornerMark()
    } else {
      if (hasToken('loginStatus')) {
        Taro.showLoading({ title: '数据请求中' })
        setTimeout(() => {
          Taro.hideLoading()
          if (hasToken('Token') && !this.state.bindStatus) {
            this.fetchUserInfo()
            this.fetchOrderlistcornerMark()
          }
        }, 1500)
      } else {
        if (hasToken('Token') && !this.state.bindStatus) {
          this.fetchUserInfo()
          this.fetchOrderlistcornerMark()
        }
        if (!hasToken('Token') && !hasToken('openid')) {
          this.setState({
            bindStatus: false
          })
          this.props.dispatch({
            type: 'user/save',
            payload: {
              cornerMark: []
            }
          })
        }
      }
    }
  }

  allFunction() {
    if (hasToken('Token') && !this.state.bindStatus) {
      this.fetchUserInfo()
      this.fetchOrderlistcornerMark()
    }
  }

  // 获取已绑定的用户 信息
  fetchUserInfo() {
    this.props.dispatch({
      type: 'user/fetchUserInfo',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          this.setState({
            bindStatus: true
          })
        } else {
          this.setState({
            bindStatus: false
          })
        }
      }
    })
  }

  // 获取订单角标数量
  fetchOrderlistcornerMark() {
    let params = {
      channel: getGlobalData('Channel') // 渠道
    }
    this.props.dispatch({
      type: 'user/getorederunpaid',
      payload: params
    })
  }

  // 绑定手机号
  login = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '手机号绑定')
    hasUserState().then(
      () => {
        console.log('我是我的页面')
      },
      () => {
        this.allFunction()
        Taro.showToast({ title: '授权成功' })
      }
    )
  }

  commonProblem = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '常见问题')
    Taro.navigateTo({
      url: '/pages/user/common-problem/index'
    })
  }
  feedback = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '意见反馈')

    hasUserState().then(
      flag => {
        if (flag) {
          Taro.navigateTo({
            url: '/pages/user/feedback/index'
          })
        }
      },
      () => {
        this.allFunction()
        Taro.showToast({ title: '授权成功' })
      }
    )
  }
  mycoupon = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '查看我的优惠券')

    hasUserState().then(
      flag => {
        if (flag) {
          Taro.navigateTo({
            url: '/pages/user/my-coupon/index'
          })
        }
      },
      () => {
        this.allFunction()
        Taro.showToast({ title: '授权成功' })
      }
    )
  }
  // 编辑个人资料
  editBaseInfo = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '资料编辑')
    Taro.navigateTo({
      url: '/pages/user/edit-baseinfo/index'
    }).then()
  }

  // 前往地址管理
  navToads = () => {
    // 友盟埋点
    cnzzTrackEvent('我的', '前往地址管理')
    hasUserState().then(
      flag => {
        if (flag) {
          Taro.navigateTo({
            url: `/pages/address/address/index`
          })
        }
      },
      () => {
        this.allFunction()
      }
    )
  }

  // 在线客服
  tzgService() {
    // 友盟埋点
    cnzzTrackEvent('我的', '联系客服')
    Taro.showToast({ title: '正在为你连接客服', icon: 'loading' })
    ysfConfig(ysf)
  }
  // 前往我的余额详情页
  toMyMoney() {}

  render() {
    const { bindStatus } = this.state
    const { userInfo } = this.props
    let fullPhone = userInfo.mobile + ''
    let frontPhoe = fullPhone.substring(0, 3)
    let behindPhone = fullPhone.substring(7, 11)
    let phone = !userInfo.mobile ? '' : frontPhoe + '****' + behindPhone
    const Channel = getGlobalData()
    const openid = getCookie('openid')
    return (
      <View className='user-page'>
        {/* 頭部登陸模塊 */}
        <View className='user-page-info'>
          <View className='user-page-head'>
            {Channel === 'app' ? (
              <View>
                <Image style='width: 30px;height: 30px;' src={setting} />
                <Image style='width: 30px;height: 30px;' src={customer} />
              </View>
            ) : null}
          </View>

          {bindStatus ? (
            <View className='at-row mine-info' onClick={this.editBaseInfo}>
              {!userInfo.userPic ? (
                <View className='at-col at-col-2'>
                  <AtAvatar className='user-photo' circle text='租' />
                </View>
              ) : (
                <View className='at-col at-col-2'>
                  <Image className='user-photo' src={userInfo.userPic} mode='aspectFill' />
                </View>
              )}

              <View className='at-col at-col-6'>
                <Text className='user-login'>{!userInfo.username ? '淘租公用户' : userInfo.username}</Text>
                <Text className='user-login-explain'>{phone || '---'}</Text>
              </View>
            </View>
          ) : (
            <View className='at-row mine-info' onClick={this.login}>
              <View className='at-col at-col-2'>
                <AtAvatar className='user-photo' circle text='租' />
              </View>
              <View className='at-col at-col-6'>
                <Text className='user-login'>登录</Text>
                <Text className='user-login-explain'>登录后可享受更多特权</Text>
              </View>
              <View className='at-col at-col__offset-2'>
                <Image className='right-icon' src={rightIcon} />
              </View>
            </View>
          )}
        </View>
        {/* 订单模块 */}
        <OrderCard onAllFunction={this.allFunction} />
        {/* 广告模块 */}
        {/* <View style='width:91.5%;margin:0 auto 6.5%;height:80px;'>
          <Image style='height:80px' src={test} />
        </View> */}
        {/* 底部用户服务福利模块 */}
        <AtList className='user-options' hasBorder={false}>
          <AtListItem
            title='我的余额'
            extraText={(bindStatus? (userInfo.balance || 0) : 0) + '元'}
            className='my-money'
            onClick={this.toMyMoney}
          />
          <AtListItem title='优惠券' arrow='right' onClick={this.mycoupon} />
          <AtListItem title='地址管理' arrow='right' onClick={this.navToads} />
          <AtListItem title='常见问题' arrow='right' onClick={this.commonProblem} />
          <AtListItem title='意见反馈' arrow='right' onClick={this.feedback} />
          {/* <AtListItem title='在线客服' arrow='right' /> */}
          <View className='contact_btn'>
            <contact-button
              tnt-inst-id='MBNCBMCN'
              scene='SCE00005174'
              alipay-card-no={openid}
              size='150rpx'
              icon='https://assets.taozugong.com/alipay/images/customer-service.png'
            />
          </View>
        </AtList>
      </View>
    )
  }
}
