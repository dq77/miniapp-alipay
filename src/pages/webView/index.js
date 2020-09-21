import Taro, { PureComponent } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { getCookie } from '../../utils/save-token'
import { hasUserState } from '../../utils/accredit'

class Index extends PureComponent {
  state = {
    url: ''
  }

  componentWillMount() {
    Taro.showLoading({ title: '加载中...' })
    this.webViewContext = my.createWebViewContext('web-view')

    this.setState({
      url: decodeURIComponent(this.$router.params.url)
    })
  }
  componentDidMount() {
    Taro.hideLoading()
  }

  onmessage = e => {
    if (e.detail.resPayliUrl) {
      my.ap.navigateToAlipayPage({
        // 例如跳转到共享单车页面，其 schema 格式为：
        // alipays://platformapi/startapp?appId=60000155&chInfo=ch_${appid}，${appid} 替换为自己的16位 appid，例如：
        path: e.detail.resPayliUrl,
        success: res => {
          // my.alert({content:'系统信息' + JSON.stringify(res)});
        },
        fail: error => {
          // my.alert({content:'系统信息' + JSON.stringify(error)});
        }
      })
    }
    let webviewCookie = {
      openid: getCookie('openid'),
      Token: getCookie('Token'),
      authCode: '12312312' // 小程序页面不没有 authcode 带到支付宝生活号后用假数据模拟占位
    }
    this.webViewContext.postMessage({ cookie: webviewCookie })
  }

  render() {
    let URL = ''
    if (this.state.url.includes('activity_return_cash')) {
      URL = this.state.url + '?pageSource=alipay'
    } else {
      URL = this.state.url
    }

    return (
      <View>
        <WebView id='web-view' src={URL} onMessage={this.onmessage} />
      </View>
    )
  }
}
export default Index
