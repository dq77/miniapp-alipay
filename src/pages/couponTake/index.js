import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtDivider, AtButton } from 'taro-ui'
import { View, Text, Image } from '@tarojs/components'
import GoodGrid from '../../components/GoodGrid/index'
import getChannel from '../../utils/channel'
import Coupon from '../../pages/goods/goodsAbout/couposnOption/index'
import noCoupon from '../../images/common/coupon/no-coupon.png'
import { hasUserState } from '../../utils/accredit'
import { get as getGlobalData } from '../../global_data' // 全局变量文件
import coupontakeTop from '../../images/coupontake/couponTake-bgi.png'
import couponItembg from '../../images/coupontake/couponTakeItem-bg.png'
import couponTakeBall1 from '../../images/coupontake/couponTakeBall1.png'
import couponTakeBall2 from '../../images/coupontake/couponTakeBall2.png'
import couponTakeBall3 from '../../images/coupontake/couponTakeBall3.png'
import couponMoneyIcon from '../../images/coupontake/couponMoneyIcon.png'

import './index.scss'

@connect(({ coupontake }) => ({
  ...coupontake
}))
class CouponTake extends Component {
  config = {
    navigationBarTitleText: '优惠领取'
  }

  state = {
    couponData: {}
  }

  componentDidShow() {
    this.getCouponInfo()
  }

  getCouponInfo() {
    let query = getGlobalData('query') || {}
    // charset='UTF-8'&entityNum=2627pcotWUl0m8xgHLpP4fcNK2zy1CU6cm9&signType=''&tag=''&userId='2088612154473896'&voucherId='2019102500073002897304Y27C6J'
    if ( !query.entityNum ) {
      my.openVoucherList();
      return
    }
    this.setState({
      redeemCode: query.entityNum
    })

    let params = {
      redeemCode: query.entityNum
    }
    this.props.dispatch({
      type: 'coupontake/getCouponInfo',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          let couponData = res.data
          couponData.limit = res.data.limit.split('\n')
          this.setState({
            couponData: couponData
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }


  // 跳转首页，并领取优惠券
  useIt = () => {
    hasUserState().then(
      flag => {
        if (flag) {
          let params = {
            redeemCode: this.state.redeemCode
          }
          Taro.showLoading({ title: '跳转中...' })
          this.props.dispatch({
            type: 'coupontake/redeemCodes',
            payload: params,
            callback: res => {
              Taro.hideLoading()
              if (res.code === 200) {
                this.navToIndex()
              } else {
                Taro.showToast({
                  title: res.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      },
      () => {
        Taro.showToast({ title: '授权成功' })
      }
    )
  }

  navToIndex() {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  render() {
    const { couponData } = this.state
    return (
      <View className={this.state.redeemCode ? 'couponTake' : ''}>
        {this.state.redeemCode ? (
        <View>
          <View style={`background-image: url(${coupontakeTop})`} className='top-image'></View>
          <View className='content'>
            <View style={`background-image: url(${couponItembg})`} className='coupon-card'>
              <View className='main-info'>
                <View><Image className='money-icon' src={couponMoneyIcon} mode='aspectFit'></Image></View>
                <View className='money-num'>{couponData.price}</View>
                <View className='line'></View>
                <View className='coupon-info'>
                  <View className='coupon-name'>{couponData.title}</View>
                  <View className='use-need'>{couponData.subTitle}</View>
                </View>
              </View>
              <View className='use-date'>{couponData.timeRangeMeg}</View>
            </View>
            <View className='center-info'>
              <View>打开淘租公app,畅享租赁新生活</View>
              <AtButton class='use-btn' size='small' onClick={this.useIt} type='primary'> 立即使用 </AtButton>
            </View>
            <View className='use-role'>
              使用规则
              { couponData.limit.map( (item)  => {
                return (
                  <View className='use-tip'>{item}</View>
                )
              }) }
            </View>
            <Image className='ball ball1' src={couponTakeBall1} mode='aspectFit'></Image>
            <Image className='ball ball2' src={couponTakeBall2} mode='aspectFit'></Image>
            <Image className='ball ball3' src={couponTakeBall3} mode='aspectFit'></Image>
          </View>
        </View>
        ) : null}
      </View>
    )
  }
}
export default CouponTake
