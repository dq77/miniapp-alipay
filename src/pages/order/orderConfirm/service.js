/*
 * @Description:
 * @Version: 1.0
 * @Author: Pengbin Zhang
 * @Date: 2020-03-26 14:56:37
 * @LastEditors: Pengbin Zhang
 * @LastEditTime: 2020-04-02 16:50:22
 */
import Request from "../../../utils/request";

// 获取优惠券详情
export const getCouponslist = data =>
  Request({
    url: `/user_coupon/my_coupons/${data.channel}/${data.status}`,
    method: "GET",
    data
  });

// 分期详情(续租)
export const getreletGoodBill = data =>
  Request({
    url: `/client/xuzu/order/${data.orderNo}/bill/amount`,
    method: "GET",
    data
  });

// 分期详情(正常订单)
// export const getBillAmout = data => Request({
//   url: `/client/order/bill/amount`,
//   method: 'GET',
//   data,
// })

// 分期详情(正常订单) 接口升级
export const getBillAmout = data =>
  Request({
    url: `/v1/client/order/bill/amount`,
    method: "GET",
    data
  });

// 获取押金 最优优惠卷  应付押金 （修改接口）
export const getConfirmData = data =>
  Request({
    url: `/user_orders/V3/confirm`,
    method: "POST",
    data
  });

// 获取买断信息
export const getRentInfo = data =>
  Request({
    url: `/user_orders/rent_info`,
    method: "POST",
    data
  });

// 获取该商品的返现列表
export const getRepays = data =>
  Request({
    url: `/user_orders/confirm`,
    method: "POST"
    // data,
  });

// 下单
export const createOrder = data =>
  Request({
    url: `/user_orders/create`,
    method: "POST",
    data
  });

// 买断订单
export const buyoutOrder = data =>
  Request({
    url: `/user_orders/buyout`,
    method: "POST",
    data
  });

// 续租订单
export const renewalOrder = data =>
  Request({
    url: `/user_orders/renewal`,
    method: "POST",
    data
  });

export const getMoney = data =>
  Request({
    url: `/select_balance`,
    method: "GET",
    data
  });
