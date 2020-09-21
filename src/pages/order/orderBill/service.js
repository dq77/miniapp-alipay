import Request from '../../../utils/request';


// 订单金额计算
export const getBill = data => Request({
  url: `/client/order/${data.orderNo}/bill`,
  method: 'GET',
  data,
})

// 手动还款
export const repayment = data => Request({
  url: `/order/${data.orderNo}/repayment`,
  method: 'POST',
  data,
})