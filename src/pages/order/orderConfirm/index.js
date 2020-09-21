import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Block, Image } from '@tarojs/components'
import { AtModal, AtCurtain, AtCard, AtCheckbox } from 'taro-ui'
import { connect } from '@tarojs/redux'
import TopAddressInfo from './AddressInfo' // 地址信息
import GoodsInfo from '../../../components/GoodsInfo' // 商品信息
import Coupons from './couponsSelect' // 优惠券
import CaseBack from './cashBack' // 订单返现
import PayType from './PayType' // 选择支付方式 租期展示
import Peraonas from './Personas' // 身份证 备注
import PaymentDetail from './PaymentDetail' // 授权说明
import {
  payform_h5,
  payOrderMoney_signing,
  withoutCodePay,
  alipayLife_h5,
  preAuthorization,
  appMiniPay,
  appMiniAuthPay
} from '../../../components/payMoney/index'
import * as addressApi from '../../address/address/service'
import { get as getGlobalData } from '../../../global_data'
import { checkID } from '../../../utils/RegExp'
import { cnzzTrackEvent } from '../../../utils/cnzz'
import { urlSplit } from '../../../utils/utils'
import { serviecUrl } from '../../../config/index'
import getChannel from '../../../utils/channel'
import { setSessionItem, getSessionItem, getCookie, delCookie } from '../../../utils/save-token'
import Popup from '../../../components/popup/index'
import check from '../../../images/address/check.png'
import checked from '../../../images/address/checked.png'
import Sku from './Sku/index'
import './index.scss'

@connect(({ orderConfirm, goods, user, ...addressList }) => ({
  ...orderConfirm,
  ...goods,
  ...user,
  ...addressList
}))
export default class Test extends Taro.Component {
  config = {
    navigationBarTitleText: '确认订单'
  }
  constructor() {
    super(...arguments)
    this.state = {
      checkedAddress: {}, // 选择的地址
      useBalance: true, // 是否用余额
      Modal: false,
      skuShow: false, // sku 弹窗
      isTopay: false,
      scrollTop: 0,
      showPaydetail: false,
      isShowFooter: true, // HACK IOS 遮挡问题

      callbackOrderNo: '', // 签约回调
      GoodsInfoData: [], // 商品信息数据
      rentInfo: {}, // 租赁到期 续租买断价格信息
      idCard: '', // 身份证号
      buyerMessage: '', // 买家备注
      couponId: '', // 优惠券ID
      discountType: '', // 优惠方式
      discountMoney: '', // 分期均摊总金额
      couponMoney: 0, // 优惠金额
      payType: '', // 支付方式 1 一次性 2 分期
      goodType: true, // 商品类型  true租赁    false售卖
      payChannel: '', //  支付方式 0:京东H5一次性支付 1:支付宝一次性支付 2:微信一次性支付 10:京东代扣 12:支付宝预授权
      checkedagree: [], // 同意协议
      goodskuStageVOList: [] // 续租状态下用户可选的租期
    }
    this.changeAddress = false
  }


  componentWillMount() {
    this.initPage(0)
    
  }
  initPage(num) {
    let isBuyOut = this.$router.params.buyout
    let isRelet = this.$router.params.relet
    let { orderNo, callback } = this.$router.params
    // 确定是签约回调
    if (callback) {
      Taro.showToast({
        title: '签约成功',
        icon: 'success',
        duration: 1000
      }).then(() => {
        setTimeout(() => {
          this.setState({
            isTopay: true,
            callbackOrderNo: orderNo
          })
        }, 1000)
      })
    }
    if (isBuyOut) {
      // 买断订单
      this.buyoutInitData()
    } else if (isRelet) {
      // 续租订单
      this.reletInitData(num)
    } else {
      this.initData(num) // 初始化数据
    }
  }

  componentWillReceiveProps() {}

  componentDidMount() {
    this.addresInfo() // 查询地址信息
  }

  componentDidShow() {
    this.getMoney()
    if (this.changeAddress) {
      this.initPage(1)
    } else {
      this.changeAddress = true
    }
  }
  // 获取用户余额
  getMoney() {
    this.props.dispatch({
      type: 'orderConfirm/getMoney',
      payload: {}
    })
  }

  // 买断订单数据初始化
  buyoutInitData() {
    // let buyOutGoodsInfo = JSON.parse(sessionStorage.getItem('buyOutInfo'))
    let buyOutGoodsInfo = getSessionItem('buyOutInfo') ? JSON.parse(getSessionItem('buyOutInfo')) : ''
    if (buyOutGoodsInfo && Object.keys(buyOutGoodsInfo).length > 0) {
      this.setState({
        GoodsInfoData: {
          productInfo: {
            ...buyOutGoodsInfo.productInfo,
            showPrice: buyOutGoodsInfo.productInfo.buyOutPrice,
            goodType: false
          },
          Buyout: true,
          relet: false,
          originNo: this.$router.params.orderNo
        },
        payChannel: this.formartPayType(1),
        payType: 1,
        goodType: false
      })
    } else {
      Taro.showToast({
        title: '数据出错,正在为您返回',
        icon: 'none'
      }).then(() => {
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 1000)
      })
    }
  }

  // 续租订单数据初始化
  reletInitData(num) {
    // let reletGoodsInfo = JSON.parse(sessionStorage.getItem('reletInfo'))
    let reletGoodsInfo = getSessionItem('reletInfo') ? JSON.parse(getSessionItem('reletInfo')) : ''
    if (reletGoodsInfo && Object.keys(reletGoodsInfo).length > 0) {
      this.setState(
        {
          GoodsInfoData: {
            productInfo: {
              ...reletGoodsInfo.productInfo,
              showPrice: reletGoodsInfo.productInfo.renewalStagePrice,
              goodType: false
            },
            parentOrderNo: reletGoodsInfo.parentOrderNo, // 好
            Buyout: false,
            relet: true,
            originNo: this.$router.params.orderNo // 续租的原始订单号
          },
          payChannel: this.formartPayType(reletGoodsInfo.payType),
          payType: reletGoodsInfo.payType,
          goodType: reletGoodsInfo.businessType ? false : true, // true 租赁  false 售卖
        },
        () => {
          if (num) {
            this.fetchDoodsLease()
            this.fetchReletOrderDespoit()
            this.getRentInfo()
          }
        }
      )
    }
  }

  // 订单初始化数据 (售卖 租赁)
  initData = (num) => {
    let selectedGoodsInfo = this.props.selectedGoodsInfo

    // 如果穿过来的值不为{} 则存入缓存
    if (Object.keys(selectedGoodsInfo).length > 0 && selectedGoodsInfo.selectedStageObj.id) {
      // sessionStorage.setItem('selectedGoodsInfo', JSON.stringify(selectedGoodsInfo))
      setSessionItem('selectedGoodsInfo', JSON.stringify(selectedGoodsInfo))
    } else if (getSessionItem('selectedGoodsInfo')) {
      selectedGoodsInfo = JSON.parse(getSessionItem('selectedGoodsInfo'))
    } else {
      Taro.showToast({
        title: '商品数据错误,请重新选择商品',
        icon: 'loading'
      }).then(() => {
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 1500)
        return
      })
      return false
    }
    // businessType 0 代表是租赁商品 其数值是售卖商品
    // 售卖商品 无押金  无单位(unit) 无租期  有分期详情
    this.setState(
      {
        GoodsInfoData: {
          productInfo: {
            skuId: selectedGoodsInfo.selectedStageObj && selectedGoodsInfo.selectedStageObj.id,
            count: selectedGoodsInfo.cnt || '--',
            cover: selectedGoodsInfo.img || '--',
            name: selectedGoodsInfo.name || '--',
            detail: selectedGoodsInfo.skuDetailObj && selectedGoodsInfo.skuDetailObj.noidDetail,
            goodType: selectedGoodsInfo.businessType ? false : true,
            unit: this.unitForamrt(selectedGoodsInfo),
            stageNumber: this.stageNumberFormart(selectedGoodsInfo),
            showPrice: this.showPriceForamrt(selectedGoodsInfo)
          },
          alipayCode: selectedGoodsInfo.alipayCode,
          payTypeList: selectedGoodsInfo.payTypeList
        },
        payChannel: this.formartPayType(
          selectedGoodsInfo.selectedPayTypeObj && selectedGoodsInfo.selectedPayTypeObj.value
        ),
        payType: selectedGoodsInfo.selectedPayTypeObj && selectedGoodsInfo.selectedPayTypeObj.value,
        goodType: selectedGoodsInfo.businessType ? false : true // true 租赁  false 售卖
      },
      () => {
        if (num) {
          this.fetchOrderDespoit() // 获取押金 最优优惠卷  应付押金
          this.getRentInfo()
        }
      }
    )
  }

  // 获取租赁到期 买断续租价格信息
  getRentInfo = () => {
    let isRelet = this.$router.params.relet
    let selectedGoodsInfo = this.props.selectedGoodsInfo
    if ( isRelet ) {
      selectedGoodsInfo = getSessionItem('reletInfo') ? JSON.parse(getSessionItem('reletInfo')) : ''
    } else {
      if (Object.keys(selectedGoodsInfo).length == 0 || !selectedGoodsInfo.selectedStageObj.id) {
        selectedGoodsInfo = JSON.parse(sessionStorage.getItem('selectedGoodsInfo'))
      }
    }
    let params = {
      productInfo: [{
        // 售卖订单 没有单位 有分期数
        count: selectedGoodsInfo.cnt, // 商品数量(商品页传递)
      }],
    }
    if (isRelet) {
      // 续租订单
      params.payType = selectedGoodsInfo.payType
      params.originNo = this.$router.params.orderNo // 续租的原始订单号
      params.tradeType = 'Renewal'
      params.productInfo[0] = selectedGoodsInfo.productInfo
      params.productInfo[0].unit = selectedGoodsInfo.productInfo && selectedGoodsInfo.productInfo.unit === '月' ? 'MONTH' : 'DAY' // 租赁单位
    } else {
      params.payType = selectedGoodsInfo.selectedPayTypeObj && selectedGoodsInfo.selectedPayTypeObj.value
      params.productInfo[0].skuId = selectedGoodsInfo.selectedStageObj.id // skuID (商品页传递)
      params.productInfo[0].stageNumber = this.stageNumberFormart(selectedGoodsInfo) // 分期数
      params.productInfo[0].unit = this.unitForamrt(selectedGoodsInfo) === '月' ? 'MONTH' : 'DAY' // 租赁单位
    }
    this.props.dispatch({
      type: 'orderConfirm/getRentInfo',
      payload: params,
      callback: data => {
        if (data.code == 200 && data.data) {
          this.setState({
            rentInfo: data.data[0]
          })
        }
      }
    })
  }

  // 单位格式化
  unitForamrt(data) {
    if (data.businessType) {
      // 售卖
      if (data.selectedPayTypeObj.value * 1 === 1) {
        // 一次性支付
        return ''
      } else if (data.selectedPayTypeObj.value * 1 === 2) {
        // 分期付
        return data.selectedStageObj.stageValue.unit === 'MONTH' ? '月' : '天'
      }
    } else {
      // 租赁
      return data.selectedStageObj.stageValue.unit === 'MONTH' ? '月' : '天'
    }
  }

  // 期数格式化
  stageNumberFormart(data) {
    if (data.businessType) {
      // 售卖
      if (data.selectedPayTypeObj.value * 1 === 1) {
        // 一次性支付
        return ''
      } else if (data.selectedPayTypeObj.value * 1 === 2) {
        // 分期付
        return data.selectedStageObj.stageValue.stageNumber
      }
    } else {
      // 租赁
      return data.selectedStageObj.stageValue.stageNumber
    }
  }

  // 价格格式化
  showPriceForamrt(data) {
    if (data.businessType) {
      // 售卖
      return data.selectedStageObj.salePrice
    } else {
      // 租赁
      return data.selectedStageObj.stageValue.stagePrice
    }
  }

  leaseTimeformart(arr) {
    const newarr = arr.map(item => ({
      label: `${item.stageNumber}${item.unit === 'DAY' ? '' : '个'}${item.unit === 'DAY' ? '天' : '月'}`,
      value: String(item.stageNumber),
      desc: `${item.renewalStagePrice}/${item.unit === 'DAY' ? '天' : '月'}`,
      // disabled: this.state.payType === 2 && item.unit==='DAY' ? true : false,
      renewalStagePrice: item.renewalStagePrice,
      unit: item.unit === 'DAY' ? '天' : '月'
    }))
    return newarr
  }

  fetchDoodsLease = () => {
    this.props.dispatch({
      type: 'goods/getGoodsSkuDetailById',
      payload: {
        no: this.state.GoodsInfoData.productInfo.spuNo
      },
      callback: res => {
        this.setState({
          // goodskuStageVOList: this.leaseTimeformart(res[0].skuStageVOList) || []
          goodskuStageVOList: res.filter((item) => {
            return item.id == this.state.GoodsInfoData.productInfo.skuId
          })[0].skuStageVOList || []
        })
      }
    })
  }

  // 获取押金 最优优惠卷  应付押金(租赁 售卖)
  fetchOrderDespoit = () => {
    // const selectedGoodsInfo = JSON.parse(sessionStorage.getItem('selectedGoodsInfo'))
    const selectedGoodsInfo = getSessionItem('selectedGoodsInfo') ? JSON.parse(getSessionItem('selectedGoodsInfo')) : ''
    let params = {
      addressId: this.props.addressList.checkedAddress.id || this.state.checkedAddress.id || '',
      channel: getGlobalData('Channel'), // 渠道
      payType: selectedGoodsInfo.selectedPayTypeObj && selectedGoodsInfo.selectedPayTypeObj.value, // 支付方式
      productInfo: [
        {
          // 售卖订单 没有单位 有分期数
          count: selectedGoodsInfo.cnt, // 商品数量(商品页传递)
          skuId: selectedGoodsInfo.selectedStageObj.id, // skuID (商品页传递)
          stageNumber: this.stageNumberFormart(selectedGoodsInfo), // 分期数
          unit: this.unitForamrt(selectedGoodsInfo) === '月' ? 'MONTH' : 'DAY' // 租赁单位
        }
      ]
    }
    this.props.dispatch({
      type: 'orderConfirm/getConfirmData',
      payload: params,
      callback: data => {

        if (data.couponList && data.couponList.length > 0) {
          this.setState(
            {
              couponId: data.couponList[0].id,
              couponType: data.couponList[0].couponType,
              couponMoney: data.couponList[0].couponMoney || 0,
              discountType: data.couponList[0].discountType || '',
              discountMoney: data.couponList[0].discountMoney
            },
            () => {
              if (this.state.payType === '2' && this.state.GoodsInfoData.productInfo.unit !== '天') {
                this.fetchsellAndLease(data) // 获取分期详情
              }
            }
          )
        } else {
          if (this.state.payType === '2' && this.state.GoodsInfoData.productInfo.unit !== '天') {
            this.fetchsellAndLease(data) // 获取分期详情
          }
        }
      }
    })
  }

  // (续租订单) 获取押金 最优优惠卷  应付押金
  fetchReletOrderDespoit() {
    // let reletGoodsInfo = JSON.parse(sessionStorage.getItem('reletInfo'))
    let reletGoodsInfo = getSessionItem('reletInfo') ? JSON.parse(getSessionItem('reletInfo')) : ''
    let params = {
      addressId: this.props.addressList.checkedAddress.id || this.state.checkedAddress.id || '',
      channel: getGlobalData('Channel'), // 渠道
      payType: reletGoodsInfo.payType, // 支付方式
      productInfo: [
        {
          count: reletGoodsInfo.productInfo.count, // 商品数量(商品页传递)
          skuId: reletGoodsInfo.productInfo.skuId, // skuID (商品页传递)
          stageNumber: reletGoodsInfo.productInfo && reletGoodsInfo.productInfo.stageNumber, // 分期数
          unit: reletGoodsInfo.productInfo && reletGoodsInfo.productInfo.unit === '月' ? 'MONTH' : 'DAY' // 租赁单位
        }
      ],
      originNo: this.$router.params.orderNo,
      tradeType: 'Renewal'
    }
    this.props.dispatch({
      type: 'orderConfirm/getConfirmData',
      payload: params,
      callback: data => {

        if (data.couponList && data.couponList.length > 0) {
          this.setState(
            {
              couponId: data.couponList[0].id,
              couponType: data.couponList[0].couponType,
              couponMoney: data.couponList[0].couponMoney
            },
            () => {
              if (this.state.payType * 1 === 2 && this.state.GoodsInfoData.productInfo.unit !== '天') {
                this.fetchsellAndLease(data) // 获取分期详情
              }
            }
          )
        } else {
          if (this.state.payType * 1 === 2 && this.state.GoodsInfoData.productInfo.unit !== '天') {
            this.fetchsellAndLease(data) // 获取分期详情
          }
        }
      }
    })
  }

  // 处理地址模块
  // 处理地址模块
  addresInfo = () => {
    addressApi.fetchAddressList().then(res => {
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.props.dispatch({
            type: 'orderConfirm/save',
            payload: { hasAddress: true }
          })
          res.data.map(item => {
            if (item.isDefault){
              this.props.dispatch({
                type: 'addressList/save',
                payload: {
                  checkedAddress: item
                }
              })
              this.setState({
                checkedAddress: item
              },() => {
                this.initPage(1)
              })
            }
          })
        } else {
          this.props.dispatch({
            type: 'orderConfirm/save',
            payload: { hasAddress: false }
          })
          this.initPage(1)
        }
      } else {
        this.setState({
          Modal: true
        })
      }
    })
  }

  //  查询优惠券
  fetchAllCouponslist = () => {
    let params = {
      channel: getGlobalData('Channel'),
      status: '41'
    }
    this.props.dispatch({
      type: 'orderConfirm/getCouponslist',
      payload: params
    })
  }

  // 处理支付方式对应的支付渠道
  formartPayType(type) {
    const Channel = 'APLIPAY_MINI_PROGRAM' // 支付宝小程序写死
    if (Channel === 'JDBT' && type * 1 === 1) {
      return '0'
    } else if (Channel === 'JDBT' && type * 1 === 2) {
      return '10'
    } else if ((Channel === 'ALIPAY_LIFE' || Channel === 'APLIPAY_MINI_PROGRAM') && type * 1 === 1) {
      return '1'
    } else if ((Channel === 'ALIPAY_LIFE' || Channel === 'APLIPAY_MINI_PROGRAM') && type * 1 === 2) {
      return '12'
    } else if (Channel === 'weapp') {
      return '2'
    } else if (Channel === 'app') {
      return '0'
    }
  }

  // 取消
  handleCancel = () => {
    this.setState({
      Modal: false
    })
  }

  // 确定添加地址
  handleConfirm = () => {
    this.setState({
      Modal: false
    })
    Taro.navigateTo({
      url: `/pages/address/addAddress/index?isAdd=${true}`
    })
  }

  // 获取分期详情(售卖和租赁)
  fetchsellAndLease = data => {
    const { goodType, payType, GoodsInfoData, couponMoney, discountType, discountMoney } = this.state
    // const { firstPay } = this.props
    // 商品类型 true 租赁 false 售卖

    let freight = data.freight || 0
    if (!GoodsInfoData.relet) {
      
      let params = {
        totalAmount: goodType
          ? (
              GoodsInfoData.productInfo.showPrice *
              GoodsInfoData.productInfo.count *
              GoodsInfoData.productInfo.stageNumber + freight
            ).toFixed(2)
          : (GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count + freight).toFixed(2), // 总金额
        divideCount: GoodsInfoData.productInfo.stageNumber, // 分期数
        firstAmount: data.firstPay + freight, //首付金额
        discountAmount: couponMoney || 0, // 优惠金额
        discountType: discountType || 1, // 优惠方式
        freight: freight // 运费
      }

      // 修改业务逻辑后台可自定义售卖商品的分期价格  goodType false 为售卖 && payType
      if(!goodType && payType * 1 === 2){
        params.periodAmount =  data.periodAmount;   // 分期金额
        params.tradeType = 'SALES';   // 添加交易类型，售卖订单分期业务下
        params.firstAmount = data.firstPay;
      }

      this.props.dispatch({
        type: 'orderConfirm/getBillAmout',
        payload: params
      })
    } else if (GoodsInfoData.relet) {
      let params = {
        orderNo: GoodsInfoData.originNo, // 父订单号
        totalAmount: goodType
          ? (
              GoodsInfoData.productInfo.showPrice *
              GoodsInfoData.productInfo.count *
              GoodsInfoData.productInfo.stageNumber
            ).toFixed(2)
          : (GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count).toFixed(2), // 总金额
        divideCount: GoodsInfoData.productInfo.stageNumber, // 分期数
        firstAmount: data.firstPay, //首付金额
        discountAmount: couponMoney || 0, // 优惠金额
        discountType: discountType || 1, // 优惠方式
        discountMoney // 分期均摊金额
      }
      this.props.dispatch({
        type: 'orderConfirm/getreletGoodBill',
        payload: params
      })
    }
  }

  // 支付方式的选择回调
  onSelectpayType = value => {
    // this.setState({
    //   payChannel: value
    // })
  }

  // 前往用户协议
  navToagreement = () => {
    // 友盟埋点
    cnzzTrackEvent('订单确认页', '查看租赁协议')
    if (getGlobalData('Channel') === 'JDBT') {
      Taro.navigateTo({
        // 京东
        url: '/pages/userAgreement/jdbtAgreement/index'
      })
    } else if (getGlobalData('Channel') === 'weapp') {
      // 微信
    } else if (getGlobalData('Channel') === 'ALIPAY_LIFE' || getGlobalData('Channel') === 'APLIPAY_MINI_PROGRAM') {
      // 支付宝  支付宝小程序
      Taro.navigateTo({
        url: '/pages/userAgreement/alipayAgreement/index'
      })
    }
  }

  // 详情-展示
  showPaydetail = () => {
    this.setState({
      showPaydetail: true
    })
  }

  onShowPaydetailClose = () => {
    this.setState({
      showPaydetail: false
    })
  }

  // 选取的优惠卷金额
  onSelectCoupons = obj => {
    this.setState(
      {
        couponMoney: obj.couponMoney || 0,
        couponId: obj.couponId || '',
        couponType: obj.couponType || '',
        discountType: obj.discountType || '',
        discountMoney: obj.discountMoney || 0
      },
      () => {
        this.props.dispatch({
          type: 'orderConfirm/resetOptimalCoupos',
          payload: {
            optimalCoupos: {
              couponMoney: obj.couponMoney || 0,
              id: obj.couponId || '',
              couponType: obj.couponType || '',
              discountType: obj.discountType || '',
              discountMoney: obj.discountMoney || 0
            }
          }
        })
        if (this.state.payType * 1 === 2) {
          this.fetchsellAndLease({
            firstPay: this.props.firstPay,
            freight: this.props.freight,
            periodAmount: this.props.periodAmount
          })
        }
      }
    )
  }

  // 身份证
  onHandleIdcardChange = (idCard, remark) => {
    this.setState({
      idCard: idCard,
      buyerMessage: remark
    })
  }

  // 格式化支付渠道
  formartPayChannel = type => {
    const Type = type * 1
    const channel = 'APLIPAY_MINI_PROGRAM' // 小程序写死
    if (Type === 0 && channel === 'JDBT') {
      return 'JD_H5'
    } else if (Type === 10 && channel === 'JDBT') {
      return 'JD_PERIODIC'
    } else if (channel === 'ALIPAY_LIFE' && Type === 1) {
      return 'SERVICE_WINDOW_ALIPAY'
    } else if (channel === 'APLIPAY_MINI_PROGRAM' && Type === 1) {
      return 'APPLET_ALIPAY'
    } else if (Type === 12) {
      return 'ALIPAY_AUTH'
    } else if (Type === 2) {
      return 'WXPAY'
    }
  }

  // 获取用户信息
  fetchUserInfo() {
    return new Promise(resolve => {
      this.props.dispatch({
        type: 'user/fetchUserInfo',
        payload: {},
        callback: () => {
          resolve()
        }
      })
    })
  }

  // 创建订单
  createOrder() {
    // 友盟埋点
    cnzzTrackEvent('订单确认页', '点击支付')

    Taro.showLoading({ title: '开始创建订单' })
    const { buyerMessage, couponId, couponType, idCard, payChannel, payType, GoodsInfoData, useBalance } = this.state
    const {
      payDeposit, // 应付押金
      orderBackVo
    } = this.props
    let addressId = this.props.addressList.checkedAddress.id
    // const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    let siginUrl = ''
    if (getGlobalData('Channel') !== 'APLIPAY_MINI_PROGRAM' && getGlobalData('Channel') !== 'WeChat') {
      siginUrl = urlSplit(window.location.href) // 截取 url 问号前面字符
    }
    const userInfo = getSessionItem('userInfo') ? JSON.parse(getSessionItem('userInfo')) : ''
    let onepayUrl = ''
    if (getGlobalData('Channel') === 'JDBT') {
      onepayUrl = serviecUrl + '/pages/order/payResult/index'
    } else if (getGlobalData('Channel') === 'APLIPAY_MINI_PROGRAM') {
      onepayUrl = serviecUrl + '/#/pages/order/payResult/index'
    }
    return new Promise((resolve, reject) => {
      let params = {
        payBackId: couponType === 32 ? couponId : null,
        couponId: couponType === 31 ? couponId : null, // 优惠卷Id(选填)
        addressId: addressId || '', // 当前用户的地址ID
        bargainId: '', // 砍价活动ID(选填)
        buyerMessage: buyerMessage, // 备注(选填)
        channel: getGlobalData('Channel'), // 渠道
        deposit: payDeposit, // 押金
        firstPayAmount: payDeposit, // 应付押金
        idCard: (userInfo && userInfo.isPass == 2) || GoodsInfoData.Buyout || GoodsInfoData.relet ? undefined : idCard, // 身份证号(选填) 已实名认证不用填写
        originNo: GoodsInfoData.originNo, // (续租和买断的原始单号)
        payChannel: this.formartPayChannel(payChannel), // 支付渠道
        payType: payType, // 支付方式( 1一次性支付 2分期付)
        productInfo: [
          {
            ...GoodsInfoData.productInfo,
            unit: GoodsInfoData.productInfo.unit == '月' ? 'MONTH' : 'DAY'
          }
        ],
        tradeType: GoodsInfoData.relet ? 'Renewal' : GoodsInfoData.Buyout ? 'Buyout' : '', // 交易方式( Lease租用 Sales售卖  Renewal续租  Buyout买断 )
        callbackUrl: payType * 1 === 1 ? onepayUrl : siginUrl, // 签约回调地址 一次性支付传支付结果页的回调地址  分期支付传订单确认页
        alipayCode: GoodsInfoData.alipayCode, // 支付宝支付需要
        payTypeList: GoodsInfoData.payTypeList, // 支付宝支付需要
        useBalance: useBalance
      }
      // if (couponType == 32) {
      //   params.payBackId = couponId
      //   params.couponId = null
      // }
      // Taro.showModal({ content: params.payChannel })
      // return
      // 续租订单
      if (GoodsInfoData.relet) {
        this.props.dispatch({
          type: 'orderConfirm/renewalOrder',
          payload: params,
          callback: res => {
            Taro.hideLoading()
            if (
              res.code === 0 ||
              res.code === 4 ||
              res.code === 10 ||
              res.code === 20 ||
              res.code === 3 ||
              res.code === 12 ||
              res.code === 202
            ) {
              resolve(res)
            } else {
              Taro.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject()
            }
          }
        })
      } else if (GoodsInfoData.Buyout) {
        // 买断订单
        this.props.dispatch({
          type: 'orderConfirm/buyoutOrder',
          payload: params,
          callback: res => {
            Taro.hideLoading()
            if (
              res.code === 0 ||
              res.code === 4 ||
              res.code === 10 ||
              res.code === 20 ||
              res.code === 3 ||
              res.code === 12
            ) {
              resolve(res)
            } else {
              Taro.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject()
            }
          }
        })
      } else {
        this.props.dispatch({
          // 正常订单
          type: 'orderConfirm/createOrder',
          payload: params,
          callback: res => {
            Taro.hideLoading()
            if (
              res.code === 0 ||
              res.code === 4 ||
              res.code === 10 ||
              res.code === 20 ||
              res.code === 3 ||
              res.code === 12
            ) {
              resolve(res)
            } else {
              Taro.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject()
            }
          }
        })
      }
    })
  }

  // 下单支付 五步走战略
  payOrderPrice = () => {
    // 0 是否同意协议
    if (!this.state.checkedagree.length > 0) {
      Taro.showToast({
        title: '请先阅读并同意淘租公租赁协议',
        icon: 'none'
      })
      // 小程序兼容
      if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
        Taro.createSelectorQuery()
          .selectAll('.main')
          .boundingClientRect()
          .exec(rect => {
            this.setState({
              scrollTop: rect[0][0].bottom
            })
          })
      } else {
        this.main._rendered.dom.scrollTo(0, this.main._rendered.dom.scrollHeight)
      }
      return
    }
    const userInfo = getSessionItem('userInfo') ? JSON.parse(getSessionItem('userInfo')) : ''
    const buyout = this.state.GoodsInfoData.Buyout
    const relet = this.state.GoodsInfoData.relet
    // 1 判断是否有地址 -- 无的话则显示添加地址窗口
    if (!this.props.hasAddress && !buyout && !relet) {
      this.setState({ Modal: true })
      return
    }
    //  买断商品  续租商品  已实名认证均不用验证身份证
    // 2 是否有身份证是否合法
    if (userInfo && userInfo.isPass !== 2) {
      // 未实名认证
      if (buyout || relet) {
        // 续租买断不验证身份证
        // return true
      } else {
        if (this.state.idCard === '') {
          Taro.showToast({
            title: '请填写身份证信息',
            icon: 'none'
          })
          return
        } else if (!checkID(this.state.idCard)) {
          Taro.showToast({
            title: '身份证信息不正确',
            icon: 'none'
          })
          return
        }
      }
    } else if (!userInfo && this.state.idCard === '') {
      this.fetchUserInfo()
      return
    }

    // 3 创建订单
    this.createOrder().then(data => {
      Taro.showLoading({ title: '开始支付' })
      if (data.code === 202) {
        // 续租账期未完成 无需支付 直接弹出提示用户续租成功
        Taro.showToast({
          title: '已为您成功续租',
          icon: 'success',
          duration: 2000
        }).then(() => {
          setTimeout(() => {
            Taro.navigateTo({
              url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}`
            })
          }, 1000)
        })
        Taro.hideLoading()
      } else {
        Taro.hideLoading()
        this.payApi(data)
      }
    })
  }

  // 支付 api
  payApi = data => {
    // 支付方式 0:京东H5支付 1:支付宝支付 2:微信支付 10:京东代扣 12:支付宝预授权支付
    switch (this.state.payChannel * 1) {
      case 0: // 京东H5支付
        if (data.code === 0) {
          payform_h5('https://h5pay.jd.com/jdpay/saveOrder', data.data)
        }
        break
      case 1: // 支付宝支付
        if (data.code === 3 && data.data.body) {
          // 生活号支付
          alipayLife_h5(data.data.body)
        } else if (data.code === 4) {
          // 支付宝小程序支付
          appMiniPay(data.data.tradeNo).then(
            () => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}`
              })
            },
            resCode => {
              if (resCode * 1 === 6001) {
                // 用户点击取消
                Taro.navigateTo({
                  url: `/pages/order/orderDetail/index?orderNo=${data.data.orderNo}`
                })
                return
              }
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}&payStatus=false`
              })
            }
          )
        }
        break
      case 2: // 微信支付
        break
      case 10: // 京东代扣
        if (data.code === 10) {
          payOrderMoney_signing(data.data.requestUrl)
        } else if (data.code === 20) {
          Taro.hideLoading()
          setTimeout(() => {
            this.setState({
              isTopay: true,
              callbackOrderNo: data.data.orderNo
            })
          }, 1500)
        }
        break
      case 12: // 支付宝预授权支付
        if (data.code === 12 && getChannel() === 'ALIPAY_LIFE') {
          preAuthorization(data.data.orderStr).then(
            () => {
              Taro.showToast({ title: '预授权成功' }).then(() => {
                if (data.data.isContinue) {
                  Taro.showToast({
                    title: '已为您成功续租',
                    icon: 'success',
                    duration: 2000
                  }).then(() => {
                    setTimeout(() => {
                      Taro.navigateTo({
                        url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}`
                      })
                    }, 2000)
                  })
                  return
                }
                // 预授权成功
                this.WithoutCodePaypay(data.data.orderNo)
              })
            },
            () => {
              // 预授权失败
              Taro.showToast({ title: '预授权失败,稍后再试', icon: 'none' })
            }
          )
        } else if (data.code === 12 && getChannel() === 'APLIPAY_MINI_PROGRAM') {
          appMiniAuthPay(data.data.orderStr).then(
            () => {
              Taro.showToast({ title: '预授权成功', duration: 1000, icon: 'success' })
              if (data.data.isContinue) {
                Taro.showToast({
                  title: '已为您成功续租',
                  icon: 'success',
                  duration: 1000
                })
                Taro.navigateTo({
                  url: `/pages/order/payResult/index?orderNo=${data.data.orderNo}`
                })
                return
              }
              // 预授权成功
              this.WithoutCodePaypay(data.data.orderNo)
            },
            resCode => {
              if (resCode * 1 === 6001) {
                // 用户点击取消
                Taro.navigateTo({
                  url: `/pages/order/orderDetail/index?orderNo=${data.data.orderNo}`
                })
                return
              }
              // 预授权失败
              Taro.showToast({ title: '预授权失败,稍后再试', icon: 'fail' })
            }
          )
        }
        break
    }
  }

  // 代扣支付
  WithoutCodePaypay(orderNo) {
    Taro.showLoading({ title: '开始支付' })
    withoutCodePay({ orderNo: orderNo })
      .then(res => {
        Taro.hideLoading()
        if (res.code === 200) {
          if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
            Taro.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            })
            Taro.navigateTo({
              url: `/pages/order/payResult/index?orderNo=${orderNo}`
            })
            return
          }
          Taro.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${orderNo}`
              })
            }, 2000)
          })
        } else {
          if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
            Taro.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
            Taro.navigateTo({
              url: `/pages/order/payResult/index?orderNo=${orderNo}&payStatus=false`
            })
            return
          }
          Taro.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          }).then(() => {
            setTimeout(() => {
              Taro.navigateTo({
                url: `/pages/order/payResult/index?orderNo=${orderNo}&payStatus=false`
              })
            }, 2000)
          })
        }
      })
      .catch(err => {})
  }

  // 获取真实 dom
  refMain = node => (this.main = node)

  // 协议同意
  checkAgreement = value => {
    this.setState({
      checkedagree: value
    })
  }

  // hack IOS 底部遮挡问题
  footerShow = val => {
    if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
      // return
    }

    if (this.state.isShowFooter === val) {
      return
    }
    this.setState({
      isShowFooter: val
    })
  }

  // 展示sku弹窗
  isSkuShow = val => {
    if (this.state.goodskuStageVOList.length > 0) {
      this.setState({
        skuShow: val
      })
    } else {
      Taro.showToast('该商品暂无多规格')
    }
  }
  // 关闭sku弹窗
  toggleVisible = () => {
    this.setState({
      isShowFooter: true,
      skuShow: false
    })
  }

  // 选定租期规格， 确定后直接读取skuInfo 进行替换
  handSelect = () => {
    let skuData = JSON.parse(getSessionItem('skuInfo'))
    this.setState(
      {
        skuShow: false,
        isShowFooter: true,
        payType: skuData.payType,
        couponId: '', // 每次切换租期之后，将couponId 和payBackId 重置，避免将上次的值带入
      },
      () => {
        let sessionStorageInfo = JSON.parse(getSessionItem('reletInfo'))
        sessionStorageInfo.payType = skuData.payType
        sessionStorageInfo.productInfo.unit = skuData.unit === 'DAY' ? '天' : '月'
        sessionStorageInfo.productInfo.renewalStagePrice = skuData.renewalStagePrice
        sessionStorageInfo.productInfo.stageNumber = skuData.stageNumber
        sessionStorageInfo.payType = skuData.payType
        setSessionItem('reletInfo', JSON.stringify(sessionStorageInfo))
        this.reletInitData(1)
      }
    )
  }

  // 是否使用余额 默认使用余额，不用勾选
  // useBalance() {
  //   this.setState({
  //     useBalance: !this.state.useBalance
  //   })
  // }
  // 计算余额抵扣
  dikouPriceFilter(balance, payAmount, priceCount, couponMoney = 0) {
    balance = balance * 1
    let price = payAmount
    let freight = this.props.freight || 0
    if (this.state.GoodsInfoData.Buyout) {
      // 买断
      price = priceCount
      freight = 0
    }
    price = price * 1 - couponMoney * 1 + freight // 减去优惠券加上运费后的实付金额
    
    if (balance - price > 0 || balance - price === 0) {
      return (price*1 - 0.01).toFixed(2)
    } else if (balance - price < 0) {
      return (balance*1).toFixed(2)
    }
  }
  // 续租改变租期
  stageNumberChang = val => {
    // const resArr = this.state.goodskuStageVOList.filter(one => one.value === val)
    // // let sessionStorageInfo = JSON.parse(sessionStorage.getItem('reletInfo'))
    // let sessionStorageInfo = JSON.parse(getSessionItem('reletInfo'))
    // ;(sessionStorageInfo.productInfo.unit = resArr[0].unit),
    //   (sessionStorageInfo.productInfo.renewalStagePrice = resArr[0].renewalStagePrice)
    // sessionStorageInfo.productInfo.stageNumber = resArr[0].value
    // // sessionStorage.setItem('reletInfo', JSON.stringify(sessionStorageInfo))
    // setSessionItem('reletInfo', JSON.stringify(sessionStorageInfo))
    // this.reletInitData()
  }

  /**
   * 支付宝小程序支付: my.tradePay
   * 微信小程序支付: wx.requestPayment(一次性支付)
   */
   // 比较抵扣余额和应付金额
  /**
   * @param {*} balance  余额
   * @param {*} price    租金/售卖价格
   * @param {*} couponMoney  优惠券金额
   * @param {*} freight  运费
   *  订单金额-优惠金额 = 实付金额
   *  实付金额和返现余额进行抵扣 减去返现余额 最终才是真正的实付金额
   */
  priceFilter(balance, price, couponMoney = 0, freight = 0) {
    balance = balance * 1
    price = price * 1 - couponMoney * 1 + freight // 减去优惠券 加上运费后的实付金额
    if (!this.state.useBalance) {
      return price - couponMoney // 如果不使用余额，则不需要进行余额相减
    }
    if (balance - price > 0 || balance - price === 0) {
      return 0.01
    } else if (balance - price < 0) {
      return price - balance
    }
  }

  render() {
    const popupStyle =
      process.env.TARO_ENV === 'rn'
        ? { transform: [{ translateY: Taro.pxTransform(-100) }] }
        : { transform: `translateY(${Taro.pxTransform(-100)})` }

    const {
      radioCouponsData, // 优惠券列表
      hasCoupons, // 是否拥有优惠
      leaseData, // 分期详情
      userInfo, // 用户信息(判断用户是否实名认证)
      totalDeposit, // 押金
      freight, // 运费
      freeDeposit, // 京东减免押金
      payDeposit, // 应付押金
      optimalCoupos, // 最优优惠券
      totalRent, // 应付金额
      firstPay, // 首付金额
      orderBackVo, // 返现额度
      myMoney,
      hasAddress // 是否有地址
    } = this.props
    const {
      payType, // 支付方式 1 一次性 2 分期
      goodType,
      GoodsInfoData,
      rentInfo,
      showPaydetail, // 押金解释弹窗
      payChannel, // 用户支付方式( 非app 用户不可自由选择支付方式) 支付方式 0:京东H5一次性支付 1:支付宝一次性支付 2:微信一次性支付 10:京东代扣 12:支付宝预授权
      couponMoney, // 用户选中的优惠金额
      isShowFooter, // hacK IOS 遮挡问题
      scrollTop,
      discountType
    } = this.state

    const checkboxOption = [
      {
        value: 'agree',
        label: '我已阅读并同意'
      }
    ]
    const Channel = getGlobalData('Channel')
    let addressInfo = this.props.addressList.checkedAddress
    return (
      <View className='orderConfirm'>
        {/* 头部地址信息栏
          续租 买断时 不显示
      */}
        {!GoodsInfoData.relet && !GoodsInfoData.Buyout ? (
          <View className='top'>
            <TopAddressInfo hasAddress={hasAddress} topAddresInfo={addressInfo} />
          </View>
        ) : null}

        {/* 中部内容信息区 */}
        <ScrollView className='main' scrollY ref={this.refMain} scrollTop={scrollTop}>
          {/* 商品信息 --*/}
          <GoodsInfo
            showLease={goodType}
            detailBtn={false}
            goodData={GoodsInfoData}
            rentInfo={rentInfo}
            freight={freight}
            showUnit
            goodskuStageVOList={this.state.goodskuStageVOList}
            onFooterShow={this.footerShow}
            onIsShow={this.isSkuShow}
            onStageNumberChange={this.stageNumberChang}
          />
          {/*
          押金  -- 京东信用展示免押金  售卖商品不展示此模块  买断商品不显示押金
        */}
          {goodType &&
          !GoodsInfoData.Buyout && !!totalDeposit ? (
            <View className='deposit_wrap'>
              <View className='deposit'>
                <Text>押金</Text>
                <Text className='deposit_price'>
                  ¥{totalDeposit}
                  <View className='at-icon at-icon-help vgn' onClick={this.showPaydetail} />
                </Text>
              </View>
              {freeDeposit && Channel === 'JDBT' ? (
                <View className='deposit'>
                  <Text>小白信用免押</Text>
                  <Text className='deposit_price'>- ¥{freeDeposit}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* 优惠卷 买断商品不显示押金 */}
          <View className='my_coupons'>
            {!GoodsInfoData.Buyout ? (
              <Coupons
                hasCoupons={hasCoupons}
                radioCouponsData={radioCouponsData}
                onSelectCoupons={this.onSelectCoupons}
                optimalCoupos={optimalCoupos}
                onFooterShow={this.footerShow}
              />
            ) : null}
            {myMoney > 0 && (
              <View className='my-money'>
                <Text>
                  余额抵扣
                </Text>
                <Text>
                  {/* 分期时 leaseData[0].payAmount已默认减去优惠金额，所以传0; 一次性支付时，totalRent 是没有减去优惠金额，所以传coupoMoney */}
                  
                  {payType * 1 === 2 ? 
                    (leaseData.length > 0 ? this.dikouPriceFilter(myMoney, leaseData[0].payAmount - freight, GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count, 0): 0) :
                    this.dikouPriceFilter(myMoney, totalRent, GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count, couponMoney)
                  }元</Text>
              </View>
            )}
            {/* 订单返现 */}
            {GoodsInfoData.relet || GoodsInfoData.Buyout
              ? null
              : orderBackVo &&
                orderBackVo.backPercent && (
                  <CaseBack onFooterShow={this.footerShow} backPercent={orderBackVo.backPercent} isConfirm />
                )}
          </View>

          {/* 选择支付方式 租期展示 */}
          <PayType
            onSelectpayType={this.onSelectpayType}
            leaseData={leaseData}
            GoodsInfoData={GoodsInfoData}
            payChannel={payChannel}
            freight={freight}
            couponMoney={couponMoney}
            firstPay={firstPay}
            totalRent={totalRent}
            discountType={discountType}
            onFooterShow={this.footerShow}
          />

          {/* 身份证 备注 */}
          <Peraonas
            onHandleIdcardChange={this.onHandleIdcardChange}
            userInfo={userInfo}
            buyout={GoodsInfoData.Buyout}
            relet={GoodsInfoData.relet}
          />

          {/* 用户协议 */}
          <View className='agreement'>
            <AtCheckbox
              options={checkboxOption}
              selectedList={this.state.checkedagree}
              onChange={this.checkAgreement.bind(this)}
            />
            <Text className='agrement_a' onClick={this.navToagreement}>
              《淘租公租赁协议》
            </Text>
          </View>
        </ScrollView>

        {/* 底部 */}
        <View className={isShowFooter ? 'footer' : 'footer hiddden'}>
          {/* 授权说明 */}
          {payChannel === '10' || payChannel === '12' ? <PaymentDetail /> : null}

          <View className='payMoney'>
            {goodType && !GoodsInfoData.Buyout ? ( // 租赁商品 ---买断商品特殊处理
              payType * 1 === 2 ? ( // 分期
                <View className='payMoney_price'>
                  <View className='payMoney_price_row'>
                    <Text className='payMoney_price_label'>首付金额:</Text>
                    <Text className='payMoney_price_money'>
                      {(leaseData.length > 0 && this.priceFilter(myMoney, leaseData[0].payAmount, 0).toFixed(2))}
                    </Text>
                  </View>
                  {
                    !!payDeposit &&
                    <View className='payMoney_price_row'>
                      <Text className='payMoney_price_label'>应付押金:</Text>
                      <Text className='payMoney_price_money'>¥{payDeposit}</Text>
                    </View>
                  }
                </View>
              ) : (
                // 一次性
                <View className='payMoney_price'>
                  <View className='payMoney_price_row'>
                    <Text className='payMoney_price_label'>实付金额:</Text>
                    <Text className='payMoney_price_money'>
                      {this.priceFilter(myMoney, totalRent, couponMoney, freight).toFixed(2)}
                    </Text>
                  </View>
                  {
                    !!payDeposit &&
                    <View className='payMoney_price_row'>
                      <Text className='payMoney_price_label'>应付押金:</Text>
                      <Text className='payMoney_price_money'>¥{payDeposit}</Text>
                    </View>
                  }
                </View>
              )
            ) : // 售卖
            payType * 1 === 2 && !GoodsInfoData.Buyout ? ( // 分期
              <View className='payMoney_price'>
                <View className='payMoney_price_row'>
                  <Text className='payMoney_price_label'>首付金额:</Text>
                  <Text className='payMoney_price_money'>
                    {/* 分期首付金额已经减去了优惠券金额，所以couponMoney传 0 */}
                    {(leaseData.length > 0 && this.priceFilter(myMoney, leaseData[0].payAmount, 0).toFixed(2))}
                  </Text>
                </View>
              </View>
            ) : (
              // 一次性
              <View className='payMoney_price'>
                <View className='payMoney_price_row'>
                  <Text className='payMoney_price_label'>实付金额:</Text>
                  <Text className='payMoney_price_money'>
                    {GoodsInfoData.Buyout
                      ? this.priceFilter(myMoney, GoodsInfoData.productInfo.showPrice * GoodsInfoData.productInfo.count,0, freight).toFixed(2)
                    : this.priceFilter(myMoney, totalRent, couponMoney, freight).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
            {payChannel === '10' || payChannel === '12' ? (
              <View className='payMoney_btn' onClick={this.payOrderPrice}>
                <Text>{payChannel === '10' ? '下单并签约代扣' : '下单并预授支付'}</Text>
              </View>
            ) : (
              <View className='payMoney_btn' onClick={this.payOrderPrice}>
                <Text>下单并支付</Text>
              </View>
            )}
          </View>
        </View>

        {/* 地址提示弹窗 */}
        <AtModal
          isOpened={this.state.Modal}
          cancelText='取消'
          confirmText='确认'
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='您还没有地址,请点击添加!'
        />
        {/* 免密支付提示 */}
        <AtModal
          isOpened={this.state.isTopay}
          confirmText='确认支付'
          onConfirm={() => this.WithoutCodePaypay(this.state.callbackOrderNo)}
          closeOnClickOverlay={false}
          content='您已签约免密支付,是否立即支付'
        />

        {/* 押金解释 */}
        <AtCurtain isOpened={showPaydetail} onClose={this.onShowPaydetailClose}>
          <AtCard title='关于押金'>
            首期支付时将会扣除第一期分期金额及您的应付押金（免押除外），押金将在订单完结时自动退回。
          </AtCard>
        </AtCurtain>
        {/* 续租 */}
        <Popup visible={this.state.skuShow} onClose={this.toggleVisible} compStyle={popupStyle}>
          <Sku
            defaultData={this.state.GoodsInfoData}
            skuData={this.state.goodskuStageVOList}
            payType={this.state.payType}
          />
        </Popup>
        {this.state.skuShow && (
          <View className='sku-btn' onClick={this.handSelect}>
            <Text>确定</Text>
          </View>
        )}
      </View>
    )
  }
}
