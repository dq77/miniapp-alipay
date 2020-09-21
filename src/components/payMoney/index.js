/**
 * orderNo          父订单的编号
 * payType          支付类型 JD_H5:京东H5一次性支付 SERVICE_WINDOW_ALIPAY:支付宝一次性支付 WXPAY:微信一次性支付 JD_PERIODIC:京东代扣 ALIPAY_AUTH:支付宝预授权
 * userId           用户id
 * totalAmount      订单总金额/分
 * downpayAmount    首付金额/分
 * mobile           手机号
 */
import Taro from '@tarojs/taro'
import { signingPay } from '../../pages/order/payResult/service'

// 京东代扣签约
export function payOrderMoney_signing(url) {
  window.location.href = url
}

// 免密支付
export function withoutCodePay(orderNo) {
  return new Promise(resolve => {
    signingPay(orderNo)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

// 京东支付
export function payform_h5(URL, PARAMS) {
  var temp = document.createElement('form')
  temp.action = URL
  temp.method = 'post'
  temp.style.display = 'none'
  for (var x in PARAMS) {
    var opt = document.createElement('input')
    opt.name = x
    opt.value = PARAMS[x] // alert(opt.name)
    temp.appendChild(opt)
  }
  document.body.appendChild(temp)
  temp.submit()
  return temp
}

/**
 * 支付宝支付
 */

export function alipayLife_h5(data) {
  document.body.insertAdjacentHTML('beforeend', data)
  document.forms[0].submit()
  document.forms[0].remove()
}

//  支付宝预授权支付
export function preAuthorization(orderStr, orderNo) {
  return new Promise((resolve, reject) => {
    ap.tradePay(
      {
        orderStr
      },
      res => {
        // 9000 是成功code
        if (res.resultCode == 9000) {
          resolve()
        } else {
          reject()
        }
      }
    )
  })
}

//  支付宝小程序支付
export function appMiniPay(tradeNO) {
  return new Promise((resolve, reject) => {
    my.tradePay({
      tradeNO,
      complete: res => {
        // 9000 是成功code
        if (res.resultCode == 9000) {
          resolve()
        } else {
          reject(res.resultCode)
        }
      }
    })
  })
}

//  支付宝小程序预授权支付
export function appMiniAuthPay(orderStr) {
  return new Promise((resolve, reject) => {
    my.tradePay({
      orderStr,
      complete: res => {
        // 9000 是成功code
        if (res.resultCode == 9000) {
          resolve()
        } else {
          // reject(res.resultCode)
        }
      }
    })
  })
}
