import cart from "../pages/cart/model";
import home from "../pages/home/model";
import user from "../pages/user/model";
import category from "../pages/category/model";
import goods from "../pages/goods/model";
import bill from "../pages/order/orderBill/model";
import address from "../pages/address/addAddress/model";
import addressList from "../pages/address/address/model";
import orderConfirm from "../pages/order/orderConfirm/model";
import orderDetail from "../pages/order/orderDetail/model";
import orderList from "../pages/order/orderList/model";
import logistics from "../pages/address/logistics/model";
import payresult from "../pages/order/payResult/model";
import searchResult from "../pages/searchResult/model";
import goodsList from "../pages/goodsList/model";
import brandList from "../pages/brandList/model";
import brandDetail from "../pages/brand_detail/model";
import activity from "../pages/activity/model";
import returnCash from "../pages/activity_return_cash/model";
import couponReceive from "../pages/couponReceive/model";
import couponTake from "../pages/coupontake/model";
import doubleEleven from "../pages/miniAppActive/doubleEleven/model";

export default [
  cart,
  home,
  user,
  category,
  goods,
  bill,
  address,
  addressList,
  orderConfirm, // 订单确认页
  orderDetail, // 订单详情页
  orderList, // 订单列表页
  logistics,
  payresult,
  searchResult, // 搜索结果
  goodsList, // 首页导航入口商品列表
  brandList, //品牌列表
  brandDetail, // 品牌详情
  activity,
  returnCash, // 订单返现抽奖活动
  couponReceive,
  couponTake, // 支付宝有礼优惠券‘去使用’按钮承接页
  doubleEleven
];
