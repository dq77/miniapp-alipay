export default {
  namespace: 'couponreceive',
  state: {},
  effects: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
