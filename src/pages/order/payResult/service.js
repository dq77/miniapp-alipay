import Request from '../../../utils/request'

// 签约支付
export const signingPay = data =>
  Request({
    url: `/jdpay/downpay/order`,
    method: 'POST',
    data
  })

// 支付结果金额查询
export const getpayPrice = data =>
  Request({
    url: `/order/${data.orderNo}/first/amount`,
    method: 'GET',
    data
  })

// 获取买断信息
export const getRentInfo = data => Request({
  url: `/user_orders/rent_info`,
  method: 'POST',
  data,
})
