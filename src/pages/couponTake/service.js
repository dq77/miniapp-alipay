import Request from '../../utils/request';

/**
 * 根据券码查询优惠券
 */
export const getCouponInfo = data => Request({
  url: `/user_coupon/redeem_codes/${data.redeemCode}`,
  method: 'GET'
})

/**
 * 根据券码获取优惠券
 */
export const redeemCode = data => Request({
  url: `/user_coupon/redeem_codes/${data.redeemCode}/convert`,
  method: 'POST',
  data
})


