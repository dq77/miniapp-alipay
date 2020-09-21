import Request from "../../../utils/request";

// 获取优惠券列表
export const couponList = data =>
  Request({
    url: `/user_coupon/coupon_list`,
    method: "POST",
    data: data.list
  });

// 领取优惠券
export const getCoupon = data =>
  Request({
    url: `/user_coupon/collect_coupons/${data.couponId}`,
    method: "GET"
  });
