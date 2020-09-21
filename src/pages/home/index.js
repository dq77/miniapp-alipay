import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {
  AtSearchBar,
  AtGrid,
  // AtNoticebar,
  AtTabs,
  AtTabsPane,
  // AtToast,
  AtCurtain
} from 'taro-ui'
// import { throttle, debounce } from 'throttle-debounce'
import { getWindowHeight } from '@utils/style'
import getChannel from '@utils/channel.js'
import classNames from 'classnames'
import MySwiper from '../../components/MySwiper'
import Selection from './selection/index'
import TxtTitle from './txtTitle/index'
// import Brand from './brand/index'
import GoodGrid from '../../components/GoodGrid/index'
import { cnzzTrackEvent } from '../../utils/cnzz'
import { setSessionItem, getSessionItem } from '../../utils/save-token'
import { pageJump } from '../../utils/resourceAllocation'
import shouhouwuyou from '../../images/homeSign/shouhouwuyou.png'
import xinyongmianya from '../../images/homeSign/xinyongmianya.jpg'
import yinsianquan from '../../images/homeSign/yisianquan.jpg'
import zhengpinguohang from '../../images/homeSign/zhengpinguohang.jpg'
import { get as getGlobalData } from '../../global_data'
import './index.scss'

@connect(({ home }) => ({
  ...home
}))
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: '',
      current: 0,
      scrollTop: 0,
      isFixed: false,
      signList: [
        {
          image: zhengpinguohang,
          value: '正品国行'
        },
        {
          image: yinsianquan,
          value: '隐私安全'
        },
        {
          image: xinyongmianya,
          value: '信用免押'
        },
        {
          image: shouhouwuyou,
          value: '售后无忧'
        }
      ]
    }
  }
  config = {
    navigationBarTitleText: getChannel() === 'JDBT' ? '淘租公-京东小白' : '淘租公-租出新生活',
    enablePullDownRefresh: true
  }

  componentDidShow() {}

  onChange(value) {
    this.setState({
      value: value
    })
  }

  onActionClick() {
    // 友盟埋点
    cnzzTrackEvent('首页', '商品搜索')

    Taro.navigateTo({
      url: `/pages/searchResult/index?keyWords=${this.state.value}`
    })
  }

  handleClick(value) {
    const { categoryList } = this.props
    const { current, scrollTop } = this.state

    if (current === value) return
    this.setState(
      {
        scrollTop: scrollTop,
        current: value
      },
      () => {}
    )
    this.props.dispatch({
      type: 'home/getGoodslistByChannel',
      payload: {
        page: 1,
        channel: getChannel(),
        channelCategoryId: categoryList[value].id
      }
    })
  }

  // 下拉刷新
  onRestData = () => {
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      // this.onPullDownRefresh()
      return
    }
    //
    Taro.showToast({
      title: '正在刷新中',
      icon: 'loading'
    }).then(() => {
      this.initPage()
    })
  }

  onPullDownRefresh = () => {
    Taro.showToast({
      title: '刷新中',
      icon: 'loading'
    }).then(() => {
      this.initPage()
      Taro.stopPullDownRefresh()
    })
  }

  onReachBottom() {}

  loadMoreGoodsData = () => {
    let { isLast, page } = this.props
    const current = this.state.current
    if (isLast) {
      return
    } else {
      page += 1
      const payload = {
        page,
        channel: getChannel(),
        channelCategoryId: this.props.categoryList[current].id
      }
      this.props.dispatch({
        type: 'home/getGoodslistByChannelLoadMore',
        payload
      })
    }
  }

  showTextToast = item => {
    Taro.showToast({
      title: `${item.txt}`
    })
  }

  initPage = () => {
    // const showPopup = sessionStorage.getItem('showPopup')
    const showPopup = getSessionItem('showPopup')
    // 获取首页弹窗数据
    if (!showPopup) {
      this.props.dispatch({
        type: 'home/getPopup',
        payload: {
          channel: getChannel()
        }
      })
    }

    // 获取banner图片
    this.props.dispatch({
      type: 'home/getBanner',
      payload: {
        channel: getChannel(),
        // channel:'ALIPAY_LIFE',      // 测试默认生活号数据、需要修改为getChannel()
        count: '5'
      },
      callback: () => {
        //
      }
    })

    // 导航入口列表
    this.props.dispatch({
      type: 'home/getNavList',
      payload: {
        channel: getChannel()
      },
      callback: data => {}
    })

    // 获取brand
    this.props.dispatch({
      type: 'home/getBrand',
      payload: {
        page: 1,
        pageSize: 3
      }
    })

    // 获取精选速递
    // getSelection
    this.props.dispatch({
      type: 'home/getSelection',
      payload: {
        channel: getChannel()
      }
    })

    // 获取分类菜单
    this.props.dispatch({
      type: 'home/getCategoryByChannel',
      payload: {
        channel: getChannel()
      },
      callback: data => {
        this.props.dispatch({
          type: 'home/getGoodslistByChannel',
          payload: {
            page: 1,
            pageSize: 10,
            channel: getChannel(),
            channelCategoryId: data[this.state.current].id
          }
        })
      }
    })
  }

  navIconClick = (item, index) => {
    // 友盟埋点
    cnzzTrackEvent('首页', `${item.name}`)

    // 0 是内部页面 10 是外部链接
    if (item.type === 0) {
      Taro.navigateTo({
        url: `${item.webRoutePath}?${item.parameter}&pagetitle=${item.name}`
      })
    } else if (item.type === 10) {
      if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
        // Taro.navigateTo({
        //   url: `/pages/webView/index?url=${item.webRoutePath}`
        // })
        let obj = {
          content: item.webRoutePath
        }
        pageJump(obj)
        return
      }
      window.location.href = `${item.webRoutePath}`
    }
  }
  // 关闭首页弹窗
  closePopup() {
    this.props.dispatch({
      type: 'home/save',
      payload: {
        showPopup: false
      }
    })
    // sessionStorage.setItem('showPopup', true)
    setSessionItem('showPopup', true)
  }
  // 点击弹窗
  clickPopup(val) {
    // sessionStorage.setItem('showPopup', true)
    setSessionItem('showPopup', true)

    if (val.activeUrl && !val.spuNo) {
      let obj = {
        content: val.activeUrl
      }
      pageJump(obj)
      // Taro.navigateTo({
      //   url: `${val.activeUrl}`
      // })
    } else if (!val.activeUrl && val.spuNo) {
      Taro.navigateTo({
        url: `/pages/goods/index?no=${val.spuNo}`
      })
    }
    this.props.dispatch({
      type: 'home/save',
      payload: {
        showPopup: true
      }
    })
  }
  componentDidMount = () => {
    this.initPage()
    if (process.env.TARO_ENV === 'h5') {
    }
  }

  pageOnScroll = e => {
    if (e.detail.scrollTop > 549 && !this.state.isFixed) {
      this.setState({
        isFixed: true
      })
    } else if (e.detail.scrollTop < 549 && this.state.isFixed) {
      this.setState({
        isFixed: false
      })
    }
  }

  isFixed = () => {
    const { scrollTop } = this.state

    if (scrollTop > 549) {
      return true
    } else {
      return false
    }
  }

  render() {
    // const height = getWindowHeight()
    const {
      banner,
      navList,
      // brand,
      selections,
      categoryList,
      goodsList,
      isLast,
      showPopup,
      popupData
    } = this.props
    const { scrollTop, isFixed } = this.state
    return (
      <View className='home-page'>
        <ScrollView
          scrollY
          className='item__wrap'
          upperThreshold='100'
          onScroll={this.pageOnScroll}
          onScrollToUpper={this.onRestData}
          onScrollToLower={this.loadMoreGoodsData}
        >
          {/** 小程序关注生活号 */
          getGlobalData('Channel') === 'APLIPAY_MINI_PROGRAM' && <lifestyle publicId='2017091208699638' />}
          <View className='home-page-top'>
            <AtSearchBar
              actionName='搜索'
              className='home-page_search'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onConfirm={this.onActionClick.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
            <MySwiper bannerList={banner} home />
            <View className='home-page-sign'>
              {/* <AtGrid mode='rect' hasBorder={false} columnNum={this.state.signList.length} data={this.state.signList}/> */}
              {
                this.state.signList.map((item,index) => (
                  <View className='sign-item' key={index}>
                    <Image className='taro-img' src={item.image} />
                    <Text>{item.value}</Text>
                  </View>
                ))
              }
            </View>

            <AtGrid hasBorder={false} columnNum={navList.length} data={navList} onClick={this.navIconClick} />

            {/* <AtNoticebar icon='volume-plus'>
            你的订单即将到期，续租更优惠！
          </AtNoticebar> */}

            {/* 精选速递 */}
            {selections.length > 0 && <TxtTitle title='精选速递' />}
            <Selection selectionList={selections} onShowTxt={this.showTextToast} />

            {/* 发现品牌 */}
            {/* <TxtTitle  title='发现品牌' />
          <Brand brandList={brand} /> */}
          </View>
          <View className='space-between-20' />

          {/* 分类列表 */}
          <AtTabs
            scroll
            // animated={false}
            animated={false}
            swipeable={false}
            current={this.state.current}
            tabList={categoryList}
            onClick={this.handleClick.bind(this)}
            className={classNames('home-at-tabs', {
              'home-at-tabs-fixed': isFixed
            })}
          >
            {categoryList.map((item, index) => (
              <AtTabsPane current={this.state.current} index={index} key={item.no}>
                <View className={this.isFixed() ? 'goods-grid-margin' : ''}>
                  {/*<View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >{item.title}的内容</View> */}
                  <GoodGrid goodDatas={goodsList} isLast={isLast} />
                  {!!isLast && goodsList.length > 0 && <View className='bottom-text'>我也是有底线的</View>}
                </View>
              </AtTabsPane>
            ))}
          </AtTabs>
        </ScrollView>
        <AtCurtain isOpened={showPopup} onClose={this.closePopup.bind(this)}>
          <Image
            mode='aspectFit'
            src={popupData.imgUrl}
            onClick={this.clickPopup.bind(this, popupData)}
          />
        </AtCurtain>
      </View>
    )
  }
}

export default Index
