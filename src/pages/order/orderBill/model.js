import * as billApi from './service';

export default {
  namespace: 'bill',
  state: {
    billData:{}
  },
  effects:{
    * getBill({payload,callback}, { call, put }){
      const {code, data} = yield call(billApi.getBill, {...payload});
      if(code === 200){
        yield put({
          type: 'save',
          payload: {
            billData: data
          }
        })
        callback && callback(data);
      }
    },

    * createRepayment({payload,callback}, { call, put }){
      const res = yield call(billApi.repayment, {...payload});
      callback && callback(res);
    }
  },
  reducers: {
    save(state, { payload }) {
      
      return { ...state, ...payload };
    },
  },
};