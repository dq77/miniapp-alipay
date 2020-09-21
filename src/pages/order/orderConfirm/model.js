import * as orderConfirmApi from "./service";
import { formartUnit } from "../../../utils/utils";

export default {
  namespace: "orderConfirm",
  state: {
    myMoney: "", // 账户余额
    radioCouponsData: [],
    hasCoupons: false,
    leaseData: [], // 分期详情(分租赁和售卖)
    deposit: "", // 押金
    payDeposit: "", // 应付押金
    optimalCoupos: { id: "" }, // 最优
    totalRent: "", // 应付金额
    orderBackVo: {}, // 返现券Vo
    firstPay: "",
    periodAmount: "",
    totalDeposit: "",
    freeDeposit: "",
    hasAddress: false
  },
  effects: {
    // 获取正常订单分期详情
    *getBillAmout({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderConfirmApi.getBillAmout, {
        ...payload
      });
      callback && callback();
      if (code === 200) {
        yield put({
          type: "save",
          payload: {
            leaseData: data
          }
        });
      }
    },

    // 获取续租分期详情
    *getreletGoodBill({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderConfirmApi.getreletGoodBill, {
        ...payload
      });
      callback && callback();
      if (code === 200) {
        yield put({
          type: "save",
          payload: {
            leaseData: data
          }
        });
      }
    },

    // 获取押金 最优优惠卷  应付押金
    *getConfirmData({ payload, callback }, { call, put }) {
      // 优惠券单位格式化
      const { code, data } = yield call(orderConfirmApi.getConfirmData, {
        ...payload
      });
      if (code === 200) {
        callback && callback(data);
        let radioCouponsData = [];
        let repayList = [];
        data.couponList &&
          data.couponList.map(item => {
            if (!item.isCoupon) {
              radioCouponsData.push({
                ...item,
                // couponType: item.couponType,
                // payBackPercent: item.payBackPercent,
                couponName: item.couponName,
                couponMoney: item.couponMoney,
                label: `${item.couponName} ¥${item.couponMoney}`,
                value: item.id,
                discountType: item.discountType, //优惠方式
                validStartTime: item.validStartTime,
                desc: item.validStartTime
                  ? `使用有效期：${item.validStartTime}-${item.validEndTime}`
                  : `领取后${item.couponTime}${
                      Object.keys(item).length > 0 && item.couponTimeUnit
                        ? formartUnit(item.couponTimeUnit || "DAY")
                        : "天"
                    }后过期`
              });
            }
          });
        // newData.unshift({ couponMoney: 0, label: '不使用', value: -1 })
        yield put({
          type: "save",
          payload: {
            firstPay: data.firstPay, // 首付金额
            periodAmount: data.periodAmount,
            totalDeposit: data.totalDeposit, // 押金
            freight: data.freight || 0, // 运费
            freeDeposit: data.freeDeposit ? data.freeDeposit : undefined, // 京东减免押金
            totalRent: data.totalRent || 0, //
            payDeposit: data.deposit, // 应付押金
            optimalCoupos: data.couponList[0] || {}, // 最佳优惠券
            radioCouponsData: radioCouponsData, // 优惠券列表
            repayList: repayList, // 订单返现列表
            orderBackVo: data.orderBackVo || {}, // 返现券Vo
            hasCoupons: data.couponList.length > 0 ? true : false
          }
        });
      }
    },

    // 获取订单返现详情
    *getRepays({ payload, callback }, { call, put }) {
      // 优惠券单位格式化
      const { code, data } = yield call(orderConfirmApi.getRepays, {
        ...payload
      });
      if (code === 200) {
        callback && callback(data);
        yield put({
          type: "save",
          payload: {
            repayList: data.couponList
          }
        });
      }
    },

    // 获取买断信息
    *getRentInfo({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.getRentInfo, { ...payload });
      callback && callback(res);
    },

    // 下单
    *createOrder({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.createOrder, { ...payload });
      callback && callback(res);
    },

    // 买断
    *buyoutOrder({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.buyoutOrder, { ...payload });
      callback && callback(res);
    },

    // 续租
    *renewalOrder({ payload, callback }, { call, put }) {
      const res = yield call(orderConfirmApi.renewalOrder, { ...payload });
      callback && callback(res);
    },
    // 获取用户余额
    *getMoney({ payload, callback }, { call, put }) {
      const { code, data } = yield call(orderConfirmApi.getMoney, {
        ...payload
      });
      if (code === 200) {
        callback && callback(data);
        yield put({
          type: "save",
          payload: {
            myMoney: data.balance
          }
        });
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    resetOptimalCoupos(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
