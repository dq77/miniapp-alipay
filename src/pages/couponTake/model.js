import * as couponTakeApi from './service'

export default {
  namespace: 'coupontake',
  state: {},
  effects: {

    // 根据券码查询优惠券
    *getCouponInfo({ payload, callback }, { call, put }) {
      const response = yield call(couponTakeApi.getCouponInfo, payload)
      callback && callback(response)
    },

    // 根据券码领取优惠券
    *redeemCodes({ payload, callback }, { call, put }) {
      const response = yield call(couponTakeApi.redeemCode, payload)
      callback && callback(response)
    },
    
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
