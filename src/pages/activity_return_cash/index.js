import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import Lottery from './lottery'
import ReturnRule from './rule/index'
import GoodsGrid from '../../components/GoodGrid'
import getChannel from '../../utils/channel'
import { hasUserState } from '../../utils/accredit'
import { cnzzTrackEvent } from '../../utils/cnzz'
@connect(({ activity_return_cash }) => ({
  ...activity_return_cash
}))
export default class Activity_return_cash extends Component {
  config = {
    navigationBarTitleText: '订单返现'
  }
  static state = {
    activityOver: false // 返现活动是否已经结束的标志 true 是 false 否
  }
  componentDidShow = () => {
    setTimeout(() => {
      this.getShowPrize()
    }, 1000)
  }
  // 获取用户是否有返现券
  getShowPrize() {
    if (hasUserState()) {
      cnzzTrackEvent('返现首页', '获取用户返现额度')
      this.props.dispatch({
        type: 'activity_return_cash/hadPrize',
        payload: {
          channel: getChannel()
        },
        callback: data => {
          this.getList()
        }
      })
    }
  }
  // 获取奖品列表
  getList() {
    cnzzTrackEvent('返现首页', '获取返现额度列表')
    this.props.dispatch({
      type: 'activity_return_cash/getPizeList',
      payload: {
        channel: getChannel()
      },
      callback: (code, data) => {
        if (code === 20019) {
          this.setState({
            activityOver: true
          })
        } else {
          this.getGoodsList(data)
        }
      }
    })
  }
  // 获取商品列表
  getGoodsList(data) {
    if (this.props.isLast) return
    cnzzTrackEvent('返现首页', '加载商品列表')
    this.props.dispatch({
      type: 'activity_return_cash/getGoodsList',
      payload: {
        noList: data.goodsSns,
        page: this.props.page,
        pageSize: 6
      }
    })
  }
  // 获取更多商品
  loadMoreBrand() {
    cnzzTrackEvent('返现首页', '加载更多商品')
    if (this.props.isLast) return // 如果是最后一页，则不进行请求
    this.props.dispatch({
      type: 'activity_return_cash/getGoodsList',
      payload: {
        noList: this.props.goodsSns,
        page: this.props.page + 1,
        pageSize: 6
      }
    })
  }
  getMyMoney = () => {
    cnzzTrackEvent('返现首页', '获取我的返现记录')
    this.props.dispatch({
      type: 'activity_return_cash/getMyReturn',
      payload: {}
    })
  }
  render() {
    const { backPercent, payBackId, prizeList, rule, goodsList, isLast, myReturn } = this.props

    return (
      <View className='activity_return_cash-page'>
        {
          <ScrollView scrollY onScrollToLower={this.loadMoreBrand.bind(this)} className='scrollview'>
            {!this.state.activityOver && (
              <View>
                {/* 未中奖以及未授权状态 */}
                {!backPercent && !payBackId && prizeList.length > 0 && <Lottery prizeList={prizeList} />}

                {/* 已抽奖状态 */}
                {backPercent && payBackId && (
                  <View className='return-result'>
                    <View className='return-result-container'>
                      <View className='return-result-text'>
                        <Text className='text-title'>恭喜你抽中</Text>
                        <Text className='text-content'>{backPercent}%的返现额度</Text>
                      </View>
                    </View>
                  </View>
                )}
                {/* 我的返现，活动规则 */}
                <ReturnRule returnRule={rule} myReturn={myReturn} onGetMyMoney={this.getMyMoney} />
                <View className='line-container'>
                  <View className='line-container-line' />
                  <Text className='line-title'>活动商品</Text>
                  <View className='line-container-line' />
                </View>
                <View className='goods-list'>
                  <GoodsGrid goodDatas={goodsList} isLast={isLast} />
                </View>
              </View>
            )}
            {this.state.activityOver && (
              <View className='over-tip'>
                <Text>活动已经结束啦！下次再来吧！</Text>
              </View>
            )}
          </ScrollView>
        }
      </View>
    )
  }
}
