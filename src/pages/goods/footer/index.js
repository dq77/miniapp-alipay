import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import jump from '@utils/jump'
import classNames from 'classnames'
import { ysfConfig, ysfGoods } from '@utils/kefu'
import { ButtonItem } from '../../../components/button/index'
import homeIcon from '../../../images/goods/home.png'
import serviceIcon from '../../../images/goods/customerService.png'
import { cnzzTrackEvent } from '../../../utils/cnzz'
import getChannel from '../../../utils/channel'
import { getCookie } from '../../../utils/save-token'
import './index.scss'

const NAV_LIST = [
  {
    key: 'home',
    title: '主页',
    img: homeIcon,
    url: '/pages/home/index'
  },
  {
    key: 'service',
    title: '客服',
    img: serviceIcon
  }
]
// {
//   key: 'cart',
//   img: cartIcon,
//   url: '/pages/cart/cart'
// }

export default class Footer extends Component {
  static defaultProps = {
    onAdd: () => {},
    onOK: () => {}
  }

  handleNav = item => {
    if (item.key === 'service') {
      //  友盟埋点
      cnzzTrackEvent('商品详情页', '客服联系')
      ysfGoods(ysf, this.props.goods)
    } else {
      //  友盟埋点
      cnzzTrackEvent('商品详情页', '回到主页')
      if (getChannel() === 'WeChat' || getChannel() === 'APLIPAY_MINI_PROGRAM') {
        jump({ url: item.url, method: 'switchTab' })
      } else {
        jump({ url: item.url })
      }
    }
  }

  contactCustomerService() {
    ysfConfig(ysf)
  }

  handleBuy = () => {
    Taro.showToast({
      title: '开发中',
      icon: 'none'
    })
  }
  // taro  组件事件传参只能在使用匿名箭头函数，或使用类作用域下的确切引用(this.handleXX || this.props.handleXX)，或使用 bind
  goodok = () => {
    this.props.isStock && this.props.onOK()
  }

  render() {
    const { status, isStock, businessType } = this.props
    const openid = getCookie('openid')
    return (
      <View className='item-footer'>
        {!status && (
          <View className='pos'>
            <contact-button
              tnt-inst-id='MBNCBMCN'
              scene='SCE00005174'
              alipay-card-no={openid}
              size='40'
              icon='https://assets.taozugong.com/alipay/images/customer-service.png'
            />
          </View>
        )}
        {!status &&
          NAV_LIST.map(item => (
            <View key={item.key} className='item-footer__nav' onClick={this.handleNav.bind(this, item)}>
              <Image className='item-footer__nav-img' mode='widthFix' src={item.img} />
              <Text className='item-footer__nav-txt'>{item.title}</Text>
            </View>
          ))}
        {!status ? (
          <View className='item-footer__buy' onClick={this.props.onAdd}>
            <Text className='item-footer__buy-txt'>{businessType === 0 ? '立即租赁' : '立即购买'}</Text>
          </View>
        ) : (
          <View className={classNames('item-footer__buy', !isStock && 'item-footer__disabled')} onClick={this.goodok}>
            {isStock ? (
              businessType === 0 ? (
                <Text className='item-footer__buy-txt'>立即租赁</Text>
              ) : (
                <Text className='item-footer__buy-txt'>立即购买</Text>
              )
            ) : (
              <Text className='item-footer__buy-txt'>补货中</Text>
            )}

            {/* //根据商品售卖类型显示不同的文案 */}
          </View>
        )}

        {/* <ButtonItem
          type='primary'
          text='加入购物车'
          onClick={this.props.onAdd}
          compStyle={{
            width: Taro.pxTransform(235),
            height: Taro.pxTransform(100)
          }}
        /> */}
      </View>
    )
  }
}
