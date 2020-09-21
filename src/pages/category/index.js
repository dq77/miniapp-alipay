import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from '@tarojs/redux'
import getChannel from '@utils/channel'
import { getWindowHeight } from '../../utils/style'
import Menu from './menu/index'
import Banner from './banner/index'
import GoodList from '../../components/GoodList/index'

import './index.scss'

@connect(({ category }) => ({
  ...category
}))
class Category extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      current: this.$router.params.current || 1,
      loaded: false,
      loading: false
    }
  }

  config = {
    navigationBarTitleText: '分类',
    enablePullDownRefresh: true
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'category/getmenu',
      payload: {
        channel: getChannel()
      },
      callback: data => {
        // this.setState({
        //   current: data[0].id
        // })
        this.setState(
          {
            current: this.$router.params.current || this.props.defaultCategory || data[0].id
          },
          () => {
            this.props.dispatch({
              type: 'category/getGoodsById',
              payload: {
                channel: getChannel(),
                channelCategoryId: this.$router.params.current || this.props.defaultCategory || data[0].id
              }
            })
          }
        )
      }
    })
  }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  handleMenu = id => {
    this.setState({ loading: true }, () => {
      this.props.dispatch({
        type: 'category/getGoodsById',
        payload: {
          page: 1,
          channel: getChannel(),
          channelCategoryId: id
        }
      })
      this.setState({ current: id, loading: false })
    })
  }

  onRestData = () => {
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      // this.onPullDownRefresh()
      return
    }
    Taro.showToast({
      title: '正在刷新中',
      icon: 'loading'
    }).then(() => {
      this.props.dispatch({
        type: 'category/getGoodsById',
        payload: {
          page: 1,
          channel: getChannel(),
          channelCategoryId: this.state.current
        }
      })
    })
  }

  onPullDownRefresh = () => {
    Taro.showToast({
      title: '正在刷新中',
      icon: 'loading'
    }).then(() => {
      Taro.stopPullDownRefresh()
      this.props.dispatch({
        type: 'category/getGoodsById',
        payload: {
          page: 1,
          channel: getChannel(),
          channelCategoryId: this.state.current
        }
      })
    })
  }

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
        channelCategoryId: current,
        loadMore: true
      }
      this.props.dispatch({
        type: 'category/getGoodsById',
        payload
      })
    }
  }

  viewGoods() {
    Taro.navigateTo({
      url: '/pages/goods/index'
    })
  }

  render() {
    const { current, loading } = this.state
    const { menuList, banner, goodsList, isLast } = this.props
    const height = getWindowHeight()

    return (
      <View className='category-page'>
        <ScrollView
          scrollY
          className='cate__menu'
          // style={{ height }}
        >
          <Menu current={current} menuList={menuList} onClick={this.handleMenu} />
        </ScrollView>
        {/* 通过切换元素实现重置 ScrollView 的 scrollTop */}
        {loading ? (
          <View />
        ) : (
          <ScrollView
            scrollY
            className='cate__list'
            upperThreshold='100'
            onScrollToUpper={this.onRestData}
            onScrollToLower={this.loadMoreGoodsData}
            // style={{ height }}
          >
            {goodsList.length > 0 && (
              <View className='cate__list-wrap'>
                {/* <Banner banner={banner} /> */}
                <GoodList goodListDatas={goodsList} onClick={this.viewGoods} />
              </View>
            )}
            {goodsList.length === 0 && (
              <View className='cate__list-wrap'>
                {' '}
                <Text>该类目暂无数据</Text>{' '}
              </View>
            )}

            {!!isLast && goodsList.length > 0 && <View className='bottom-text'>我也是有底线的</View>}
          </ScrollView>
        )}
      </View>
    )
  }
}

export default Category
