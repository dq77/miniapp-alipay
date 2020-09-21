import * as tanabataApi from "./service";

export default {
  namespace: "doubleEleven",
  state: {
    couponList: []
  },

  effects: {
    
    // 获取所有优惠券
    *couponList({ payload, callback }, { call, put }) {
      const { code, data } = yield call(tanabataApi.couponList, { ...payload });
      if (code === 200) {
        yield put({
          type: "save",
          payload: {
            couponList: data
          }
        });
        callback && callback(data);
      }
    },

    //  领取优惠券
    *getCoupon({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(tanabataApi.getCoupon, {
        ...payload
      });
      callback && callback(code, data, msg);
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
