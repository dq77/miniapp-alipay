import Taro , { Component, hideToast } from '@tarojs/taro';
import { View, Text , Button, Image} from '@tarojs/components';
import './index.scss'
import { setSessionItem } from '../../../../utils/save-token';
export default class Sku extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state={
    payTypeList: [{ name: '一次性支付', value: '1' }, { name: '分期支付', value: '2' }], //支付方式
    skuItem: {}, // 选中的sku
    payWay: 1, // 支付方式
  }

  componentWillMount () {}
  componentDidMount () {
  } 
  componentWillReceiveProps (nextProps,nextContext) {
    let unit = this.props.defaultData.productInfo.unit === '月' ? 'MONTH' : 'DAY'
    let arr = this.props.skuData.filter(item => item.stageNumber === this.props.defaultData.productInfo.stageNumber && item.unit === unit)
    this.setState({
      payWay: this.props.payType,
      skuItem: {
        ...arr[0]
      }
    },() => {
      this.selectSku(this.props.payType, {...arr[0]})
    })
  }

  // 选择的租期
  selectStage = (item) => {
    if (item.unit === 'DAY') {
      this.setState({
        payWay: 1,
        skuItem: {...item}
      },() => {
        this.selectSku(this.state.payWay, item)
      })
    } else {
      this.setState({
        skuItem: {...item}
      }, () => {
        this.selectSku(this.state.payWay, item)
      })
    }
  }
  // 选择支付方式
  selectPay = (val) => {
    this.setState({
      payWay: val
    }, () => {
      this.selectSku(val, this.state.skuItem)
    })
  }

  // 每次选择的sku都传给父组件
  selectSku = (val, item) => {
    setSessionItem('skuInfo', JSON.stringify({payType: val, ...item}))
  }
  render() {
    const { skuData = [], defaultData = {}} = this.props
    return (
      <View className='sku-container'>
        <View className='good-header'>
          <Image className='good-img' src={ defaultData.productInfo ? defaultData.productInfo.cover : ''}/>
          <Text className='good-price'>租金：{this.state.skuItem.renewalStagePrice}元/{this.state.item.unit === 'DAY' ? '天' : '月'}</Text>
        </View>
        <View className='title'>
          {
            defaultData.productInfo && defaultData.productInfo.detail && <Text>商品规格：{defaultData.productInfo.detail}</Text>
          }
        </View>
        <View className='title'>
          <View className='category-title'>
            <Text>租期选择</Text>
          </View>
          <View>
            {
              skuData && skuData.length > 0 && skuData.map(item => (
                <Text className={`block ${item.stageNumber === this.state.skuItem.stageNumber ? 'hadSelect' : '' }`} onClick={this.selectStage.bind(this, item)} key={item.stageNumber}>{item.stageNumber}{item.unit === 'DAY' ? '天' : '月'}</Text>
              ))
            }
          </View>
        </View>
        <View className='title'>
          <View className='category-title'>
            <Text>支付方式</Text>
          </View>
          <View>
            {
              this.state.payTypeList.map(item => (
                this.state.skuItem.isStage === 0 ? item.value * 1 === 1 && <Text className={`block ${item.value * 1 === this.state.payWay * 1 ? 'hadSelect' : ''}`} onClick={this.selectPay.bind(this, item.value)}>{item.name}</Text> 
                : 
                <Text className={`block ${item.value * 1 === this.state.payWay * 1 ? 'hadSelect' : ''}`} onClick={this.selectPay.bind(this, item.value)}>{item.name}</Text>
              ))
            }
          </View>
        </View>
      </View>
    )
  }
}
