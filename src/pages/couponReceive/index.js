import Taro, { PureComponent } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtDivider, AtButton } from 'taro-ui'
import { View, Text, Image } from '@tarojs/components'
import GoodGrid from '../../components/GoodGrid/index'
import getChannel from '../../utils/channel'
import Coupon from '../../pages/goods/goodsAbout/couposnOption/index'
import noCoupon from '../../images/common/coupon/no-coupon.png'
import { hasUserState } from '../../utils/accredit'

import './index.scss'

@connect(({ home, goods }) => ({
  ...home,
  ...goods
}))
class CouponReceive extends PureComponent {
  config = {
    navigationBarTitleText: '优惠券'
  }

  state = {
    couponData: [
      {
        couponDes: '极米Z6投影仪专享，满200减100',
        couponMoney: 100,
        couponName: '极米Z6专享优惠',
        couponNum: 5000,
        couponStatus: 0,
        couponTime: null,
        couponTimeUnit: null,
        couponType: 31,
        deadline: '2019/09/01',
        discountType: 1,
        goodsList: ['190118102105748928'],
        goodsType: 11,
        id: 32,
        limitNum: 1,
        payType: 3,
        rate: 0,
        releaseEndTime: '23:59:59',
        releaseStartTime: '00:00:00',
        releaseType: 1,
        sendNum: 0,
        spendMoney: 200,
        userType: 21,
        validEndTime: '2019/08/31',
        validStartTime: '2019/08/01'
      },
      {
        couponDes: '满69元减30元',
        couponMoney: 30,
        couponName: '新人全场通用优惠',
        couponNum: 5000,
        couponStatus: 0,
        couponTime: null,
        couponTimeUnit: null,
        couponType: 31,
        deadline: '2019/09/01',
        discountType: 1,
        goodsList: null,
        goodsType: 10,
        id: 30,
        limitNum: 1,
        payType: 3,
        rate: 0,
        releaseEndTime: '23:59:59',
        releaseStartTime: '00:00:00',
        releaseType: 1,
        sendNum: 0,
        spendMoney: 69,
        userType: 21,
        validEndTime: '2019/08/31',
        validStartTime: '2019/08/01'
      },
      {
        couponDes: '无门槛使用',
        couponMoney: 16,
        couponName: '新人全场通用优惠',
        couponNum: 5000,
        couponStatus: 0,
        couponTime: null,
        couponTimeUnit: null,
        couponType: 31,
        deadline: '2019-09-01 00:00:00',
        discountType: 1,
        goodsList: null,
        goodsType: 10,
        id: 28,
        limitNum: 1,
        payType: 3,
        rate: 0,
        releaseEndTime: '23:59:59',
        releaseStartTime: '00:00:00',
        releaseType: 1,
        sendNum: 0,
        spendMoney: 16,
        userType: 21,
        validEndTime: '2019/08/31',
        validStartTime: '2019/08/01'
      }
    ]
  }

  componentDidMount() {
    // 获取是个商品列表
    this.props.dispatch({
      type: 'home/getGoodslistByChannel',
      payload: {
        page: 1,
        pageSize: 10,
        channel: getChannel(),
        channelCategoryId: 0
      }
    })
  }

  navToIndex() {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  onReceiveCoupons = val => {
    // 领取优惠券
    hasUserState().then(
      flag => {
        if (flag) {
          let params = {
            userCouponId: val
          }
          this.props.dispatch({
            type: 'goods/receiveCoupons',
            payload: params,
            callback: res => {
              if (res.code === 200) {
                Taro.showToast({
                  title: '领取成功',
                  icon: 'success',
                  duration: 1000
                })
                this.couponDataProcessing(val)
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

  couponDataProcessing = id => {
    const newArr = this.state.couponData.map(element => {
      if (element.id === id * 1) {
        element.useStatus = 41
      }
      return element
    })
    this.setState({
      couponData: newArr
    })
  }

  render() {
    const { goodsList } = this.props
    const { couponData } = this.state
    return (
      <View className='couponReceive'>
        <View className='coupons'>
          <AtDivider content='优惠券' />
          {couponData.length !== 0 ? (
            <View>
              {couponData.map(item => (
                <Coupon data={item} key={item.id} onReceiveCoupons={this.onReceiveCoupons} isShowName />
              ))}
            </View>
          ) : (
            <View className='no_coupon_wrap'>
              <Image src={noCoupon} className='noCoupons' mode='widthFix' />
              <Text>还没有券哦</Text>
            </View>
          )}
        </View>
        <View className='moer'>
          <AtDivider content='爆款推荐' />
          <View scrollY className='goods__wrap'>
            <GoodGrid goodDatas={goodsList.slice(0, 10)} isLast />
          </View>
        </View>
        <View className='btn'>
          <AtButton size='small' onClick={this.navToIndex} type='primary'>
            查看更多 <View className='at-icon at-icon-chevron-right vgn' />
          </AtButton>
        </View>
      </View>
    )
  }
}
export default CouponReceive
