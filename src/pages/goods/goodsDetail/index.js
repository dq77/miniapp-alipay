import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { CDNUrl } from '../../../config/index.js'
import './index.scss'
import propTypes from 'prop-types'

export default class GoodsDetail extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      current: 0,
      detailImgUploadStatus: false, // 图片加载状态
      parameterListlImgUploadStatus: false, // 图片加载状态
      afterSaleListImgUploadStatus: false // 图片加载状态
    }
  }
  static propTypes = {
    data: propTypes.object
  }
  static defaultProps = {
    list: [],
    data: () => { }
  }

  state = {}

  handleChange = () => { }

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  imgupload = state => {
    switch (state) {
      case 'detailImgUploadStatus':
        this.setState({
          detailImgUploadStatus: true
        })
        break
      case 'parameterListlImgUploadStatus':
        this.setState({
          parameterListlImgUploadStatus: true
        })
        break
      case 'afterSaleListImgUploadStatus':
        this.setState({
          afterSaleListImgUploadStatus: true
        })
        break
      default:
        break
    }
  }

  render() {
    const tabList = [{ title: '商品介绍' }, { title: '规格详情' }, { title: '售后说明' }]
    const { data } = this.props
    const { parameterList = [], detail = [], afterSaleList = [], businessType } = data
    return (
      <View className='goods-detail'>
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
          className={this.props.isfixed ? 'titleFixed' : ''}
        >
          <AtTabsPane current={this.state.current} index={0}>
            {/* <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >租赁概述</View> */}

            {/*
              添加商品介绍及售后说明固定图片（图片储存在OSS上走CDN，地址：https://assets.taozugong.com/common/images/）
              如果需要替换 直接更新图片不需要修改代码
              根据售卖类型区分显示不同类型businessType（0租赁、20售卖）
            */}
            <View className='detail-content'>
              {
                /*
                  添加春节放假通知(节后删除支持可配置)
                */
              }
              <Image src={CDNUrl + '/activity/springFestival/holiday_notice.jpg'} key='holiday_notice' mode='widthFix' />
              {businessType == 0 ? <Image src={CDNUrl + '/common/images/leasing_process.png'} mode='widthFix' key='leasing_process' /> : <Image src={CDNUrl + '/common/images/sales_process.png'} mode='widthFix' key='sales_process' />}
              <Image src={detail[0]} mode='widthFix' onLoad={() => this.imgupload('detailImgUploadStatus')} />
              {this.state.detailImgUploadStatus
                ? detail.length > 1 &&
                detail.map((item, index) => (index == 0 ? '' : <Image src={item} key={item} mode='widthFix' />))
                : null}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className='detail-content'>
              <Image
                src={parameterList[0]}
                mode='widthFix'
                onLoad={() => this.imgupload('parameterListlImgUploadStatus')}
              />
              {this.state.parameterListlImgUploadStatus
                ? parameterList.length > 1 &&
                parameterList
                  .map((item, index) => (index === 0 ? '' : <Image src={item} key={item} mode='widthFix' />))
                : null}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View className='detail-content'>
              {businessType == 0 ? <Image src={CDNUrl + '/common/images/lease_sale.png'} mode='widthFix' key='lease_sale' /> : <Image src={CDNUrl + '/common/images/after_sale.png'} mode='widthFix' key='after_sale' />}
              <Image
                src={afterSaleList[0]}
                mode='widthFix'
                onLoad={() => this.imgupload('afterSaleListImgUploadStatus')}
              />
              {this.state.afterSaleListImgUploadStatus
                ? afterSaleList.length > 1 &&
                afterSaleList
                  .map((item, index) => (index == 0 ? '' : <Image src={item} key={item} mode='widthFix' />))
                : null}
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
