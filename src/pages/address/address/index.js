import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtButton, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from '@tarojs/redux'
import CheckedIMG from '../../../images/address/checked.png'
import CheckIMG from '../../../images/address/check.png'
import { cnzzTrackEvent } from '../../../utils/cnzz'

import './index.scss'

@connect(({ addressList, orderConfirm }) => ({
  ...addressList,
  ...orderConfirm
}))
export default class Addresslist extends Taro.Component {
  config = {
    navigationBarTitleText: '收货地址'
  }

  constructor() {
    super(...arguments)
    this.state = {
      deModal: false, // 删除地址弹窗
      addressCheckId: '', // 选择的地址
      addressData: [], // 地址列表数据
      isOrder: false, // 是否是冲订单确认页过来
      deleteId: '' // 删除地址的 id
    }
  }

  componentWillMount() {
    // 两个入口 订单确认页 和  地址管理
    if (this.$router.params.source === 'order') {
      this.setState({
        isOrder: true
      })
    }
  }

  componentDidMount() {}

  componentDidShow() {
    Taro.showLoading({
      title: 'loading'
    })
    setTimeout(() => {
      Taro.hideLoading()
      this.fetchAddressList()
    }, 500)
  }

  fetchAddressList() {
    let addressId = this.$router.params.addressId
    this.props.dispatch({
      type: 'addressList/fetchAddressList',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          this.setState({
            addressData: res.data || [],
            addressCheckId: addressId || this.filtersCheck(res.data)
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }

  filtersCheck(data) {
    let checkid
    data.map(item => {
      if (item.isDefault) {
        checkid = item.id
      }
    })
    return checkid
  }

  // 选择地址
  selectAddress = (event, id) => {
    this.setState({
      addressCheckId: id
    })

    if (this.state.isOrder) {
      let obj = {}
      this.state.addressData.map(item => {
        if (item.id === id) {
          obj = item
        }
      })
      this.props.dispatch({
        type: 'addressList/save',
        payload: {
          checkedAddress: obj
        }
      })
      Taro.navigateBack({ delta: 1 })
    }
  }

  // 前往地址
  navToeditAddress(event, id) {
    let isEditChecked = false
    if (id) {
      if (id == this.state.addressCheckId && this.state.isOrder) {
        isEditChecked = true
      }
      Taro.navigateTo({
        url: `/pages/address/addAddress/index?id=${id}&isEditChecked=${isEditChecked}`
      })
      return
    }
    Taro.navigateTo({
      url: '/pages/address/addAddress/index'
    })
  }

  // 删除地址
  deleteAddress(id) {
    // 友盟埋点
    cnzzTrackEvent('地址管理', '删除地址')
    let params = {
      id
    }
    this.props.dispatch({
      type: 'addressList/deleteAddress',
      payload: params,
      callback: res => {
        if (res.code === 200) {
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
          if (id == this.state.addressCheckId && this.state.isOrder) {
            this.detalAddresslist()
          } else {
            this.fetchAddressList()
          }
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }

  detalAddresslist = () => {
    this.props.dispatch({
      type: 'addressList/fetchAddressList',
      payload: {},
      callback: res => {
        if (res.code === 200) {
          this.setState(
            {
              addressData: res.data || []
            },
            () => {
              if (res.data.length > 0) {
                this.setState({
                  addressCheckId: res.data[0].id
                })
                this.props.dispatch({
                  type: 'addressList/save',
                  payload: { checkedAddress: res.data[0] }
                })
              } else {
                this.props.dispatch({
                  type: 'addressList/save',
                  payload: { checkedAddress: {} }
                })
                this.props.dispatch({
                  type: 'orderConfirm/save',
                  payload: { hasAddress: false }
                })
              }
            }
          )
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }

  //
  handleCancel = event => {
    event.stopPropagation()
    this.setState({
      deModal: false
    })
  }

  //
  handleConfirm = (event, id) => {
    event.stopPropagation()
    this.setState({
      deModal: false
    })
    this.deleteAddress(id)
  }

  //
  handleClose = event => {}

  // 确认删除
  confirmDelete = (event, id) => {
    event.stopPropagation()
    this.setState({ deModal: true, deleteId: id })
  }

  render() {
    const { addressCheckId, addressData, isOrder, deModal } = this.state
    return (
      <View className='addressList'>
        <View className='address_list'>
          {addressData.map(item => {
            return (
              <View className='address_list_option' key={item.id}>
                {isOrder ? (
                  <View className='checkImg' onClick={event => this.selectAddress(event, item.id)}>
                    <Image
                      mode='aspectFit'
                      src={addressCheckId == item.id ? CheckedIMG : CheckIMG}
                      className='imgStyle'
                    />
                  </View>
                ) : null}

                <View className='address_info' onClick={event => this.selectAddress(event, item.id)}>
                  <View className='addressDetail'>
                    {item.isDefault ? <Text className='address_default'>默认</Text> : null}
                    {item.province || '--'}
                    {item.city || '--'}
                    {item.area || '--'}
                    {item.detail || '--'}
                  </View>
                  <View>
                    <Text>{item.receiveName || '暂无信息'}</Text>
                    <Text style={{ marginLeft: 20 }}>{item.mobile || '--'}</Text>
                  </View>
                </View>
                <View className='at-icon at-icon-edit' onClick={event => this.navToeditAddress(event, item.id)} />
                <View
                  className='at-icon at-icon-trash'
                  onClick={event => this.confirmDelete(event, item.id)}
                  style={{ marginLeft: 15 }}
                />
              </View>
            )
          })}
        </View>
        <AtButton type='primary' className='btn' onClick={event => this.navToeditAddress(event)}>
          新增收货地址
        </AtButton>
        <AtModal isOpened={deModal} onClose={this.handleClose}>
          <AtModalContent>确认删除地址</AtModalContent>
          <AtModalAction>
            <Button onClick={event => this.handleCancel(event)}>取消</Button>
            <Button onClick={event => this.handleConfirm(event, this.state.deleteId)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
