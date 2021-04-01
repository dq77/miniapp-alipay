import Taro from '@tarojs/taro'
import { hasUserState, GetRequest, getParams } from '../utils/accredit'
// eslint-disable-next-line import/prefer-default-export
export function pageJump(item) {
  if (process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'alipay') {
    if (
      item.content.includes('activity_return_cash') ||
      item.content.includes('summer') ||
      item.content.includes('tanabata') ||
      item.content.includes('needAuth')
    ) {
      hasUserState().then(
        flag => {
          if (flag) {
            extendedJump(item.content)
          }
        },
        () => {
          Taro.showToast({ title: '授权成功', duration: 1000 }).then(() => {
            extendedJump(item.content)
          })
        }
      )
    } else {
      extendedJump(item.content)
    }
    return
  }
  Taro.navigateTo({
    url: `${item.content}`
  })
}

// 小程序拓展跳转
export function extendedJump(urlString) {
  let urlStr = urlString.replace(/(^\s*)|(\s*$)/g, '')
  if (urlStr.split('=')[0] === 'miniAppcase') {
    // 小程序跳转订单返现 miniAppcase 作为前缀
    Taro.navigateTo({
      url: `/pages/webView/index?url=${urlStr.split('=')[1]}`
    })
  } else if (urlStr.split('=')[0] === 'miniAppActivity') {
    // 小程序跳转活动页 miniAppActive 作为前缀
    // 获取miniAppActivity标志后面的url
    let url = encodeURIComponent(urlStr.substr(urlStr.indexOf('miniAppActicity=') + 'miniAppActivity='.length + 1))
    // let url = urlStr.split('=')[2]
    //   ? `/pages/webView/index?url=${urlStr.split('=')[1] + '=' + urlStr.split('=')[2]}`
    //   : `/pages/webView/index?url=${urlStr.split('=')[1]}`
    Taro.navigateTo({
      url: `/pages/webView/index?url=${url}`
    })
  } else if (urlStr.split('=')[0] === 'targetAPPID') {
    // 跳转第三方小程序后台填写格式 targetAPPID='支付宝小程序APPID', targetAPPID=2018060860318923
    my.navigateToMiniProgram({
      appId: urlStr.split('=')[1],
      extraData: {
        name: '淘租公'
      },
      success: res => {
        console.log(JSON.stringify(res))
      },
      fail: res => {
        console.log(JSON.stringify(res))
      }
    })
  } else if (urlStr.split('=')[0] === 'targetAlipayPage') {
    // 跳转支付宝官方业务或运营活动页面,填写格式 targetAlipayPage='要跳转的支付宝业务页面'
    // targetAlipayPage=https://zm.zmxy.com.cn/p/f/fd-jvwj2t69/pages/home/index.html?chInfo=xcx&__webview_options__=canPullDown%3DNO
    var targetAlipayPageUrl = urlStr.substr(urlStr.indexOf('=') + 1)
    my.ap.navigateToAlipayPage({
      // 例如跳转到共享单车页面，其 schema 格式为：
      // alipays://platformapi/startapp?appId=60000155&chInfo=ch_${appid}，${appid} 替换为自己的16位 appid，例如：
      // path:'alipays://platformapi/startapp?appId=60000155&chInfo=ch_2017072607907880'
      path: targetAlipayPageUrl,
      success: res => {
        console.log({ content: '系统信息' + JSON.stringify(res) })
      },
      fail: error => {
        console.log({ content: '系统信息' + JSON.stringify(error) })
      }
    })
  } else if (urlStr.split('=')[0] === 'targetAlipayCollection') {
    //跳转到收藏有礼小程序
    var targetAlipayCollectionUrl = urlStr.substr(urlStr.indexOf('=') + 1)
    my.navigateToMiniProgram({
      appId: '2018122562686742',
      path: targetAlipayCollectionUrl
    })
  } else if (urlStr.startsWith('targetAlipayMember')) {  //urlStr.split('=')[0] === 'targetAlipayMember'
    //跳转到会员有礼小程序  管理后台需要跳转的地址 targetAlipayMember?templateId=MM20190825000002063762&appId=2018122762703259
    // templateId 为活动模版id  appId 为跳转的小程序id 而非自己小程序的id，自己小程序id是不变的
    // var targetAlipayMemberUrl = urlStr.substr(urlStr.indexOf('=') + 1)
    if(getParams(urlStr, 'appId') == '' || getParams(urlStr, 'templateId') == ''){
      return false;
    }
    my.navigateToMiniProgram({
      appId: getParams(urlStr, 'appId'),
      extraData: {

        //活动进行汇总的模板ID，可以在会员有礼活动列表中查看
        templateId: getParams(urlStr, 'templateId'),
        //对应模板配置的小程序AppID
        appId: '2018032002414150'
      },
      success: res => {
        console.log(JSON.stringify(res))
      },
      fail: res => {
        console.log(JSON.stringify(res))
      }
    })
  } else {
    Taro.navigateTo({
      url: `${urlStr}`
    })
  }
}
